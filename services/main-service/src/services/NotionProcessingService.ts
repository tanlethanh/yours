/* eslint-disable @typescript-eslint/no-explicit-any */
import { log, notionProvider, UserError } from '@yours/backend';
import {
	DuplexQuestionCore,
	FillWordQuestionCore,
	Page,
	QuestionCore,
	Sentence,
	User,
} from '@yours/backend/models';
import { Difficulty, IPage, ISentence } from '@yours/interfaces';
import { Types } from 'mongoose';

export enum SyncResult {
	SYNC_SUCCESS = 'SYNC_SUCCESS',
	SYNC_FAIL = 'SYNC_FAIL',
}

const SEPERATE_CHARS = [':', '→'];

interface Synced {
	isSynced: boolean;
}

class NotionProcessingService {
	async getAndSaveAccessTokenFromNotion(
		userId: Types.ObjectId,
		code: string,
	) {
		let notionData = null;
		try {
			notionData = await notionProvider.getAccessTokenFromCode(code);
			log.consoleLog(
				this.constructor.name,
				'Get Auth Token',
				JSON.stringify(notionData),
			);
		} catch (error) {
			log.consoleLog(this.constructor.name, 'Error', error);
		}

		if (!notionData) {
			return null;
		}
		const updateResult = await User.findByIdAndUpdate(userId, {
			$set: {
				notion_data: notionData,
			},
		});
		return updateResult;
	}

	/**
	 * This method is a service function for sync data of user
	 * TODO: Get data and pass to children function
	 *
	 * @userId Id of user from request body or anywhere
	 * */
	async syncDataByUserId(userId: Types.ObjectId) {
		const user = await User.findById(userId, {
			notion_data: {
				access_token: 1,
			},
		});

		const accessToken = user?.notion_data.access_token;

		if (!accessToken) {
			throw new Error('Can not find access token of this user');
		}

		// Use custom method of this service to filter page data
		const pages = await this.getNotionPages(accessToken);
		const pageImages =
			(
				await User.findById(userId, {
					pages: 1,
				}).populate('pages')
			)?.pages || [];

		this.syncAllPagesOfUser(userId, accessToken, pageImages, pages);

		// Mark deleted Page
		const deletedPageImages = pageImages.filter((pageImg) => {
			return !(pageImg as unknown as Synced).isSynced;
		});

		deletedPageImages.forEach((page) => {
			page.updateOne({
				is_deleted: true,
			});
		});

		return pages;
	}

	/**
	 * This method is a service function for sync all pages of user
	 * If a page is deleted, we mark page image to deleted
	 * Else we will sync all sentences of this page
	 *
	 * @param userId
	 * @param accessToken access token of user
	 * @param pageImages page image data from database
	 * @param pages page data from notion response
	 * @returns
	 */
	syncAllPagesOfUser(
		userId: Types.ObjectId,
		accessToken: string,
		pageImages: IPage[],
		pages: any[],
	): SyncResult {
		pages.forEach((page) => {
			const pageImage = pageImages.find((pageImage) => {
				return pageImage.root_id === page.id;
			});

			if (!pageImage) {
				// Add new image of page
				this.addNewPageImageForUser(userId, accessToken, page);
			} else {
				if (
					(pageImage?.last_edited_time as Date) <=
					new Date(page?.last_edited_time)
				) {
					/*
                        Just sync data when having image of this page,
                        And the image have not updated after last update of page
                    */
					this.syncSinglePage(
						userId,
						accessToken,
						page,
						pageImage as IPage,
					);
				} else {
					// No need to sync
					return;
				}

				(pageImage as any).isSynced = true;
			}
		});

		return SyncResult.SYNC_SUCCESS;
	}

	/**
	 * This method get all children of current page
	 * Then map the block child to sentence image
	 * @param userId
	 * @param page Page object from Notion Provider
	 */
	async addNewPageImageForUser(
		userId: Types.ObjectId,
		accessToken: string,
		page: any,
	) {
		// Just use bulleted_list_item to handle
		const sentenceList = await this.getNotionSentences(
			accessToken,
			page.id,
		);

		// Create image for this page
		let title = 'Undefined';
		try {
			title =
				page.properties.Name?.title[0].plain_text ||
				page.properties.title?.title[0].plain_text ||
				title;
		} catch (error) {
			/* empty */
		}

		const newPageImage = new Page({
			root_id: page.id,
			title: title,
			url: page.url,
			sentences: [],
		});

		// Create all sentence for current image
		const sentenceImages = (
			await Promise.all(
				sentenceList.map(async (sentence: any) => {
					const sentenceImage =
						await this.createSentenceWithQuestionCore(
							sentence,
							newPageImage,
						);
					return sentenceImage;
				}),
			)
		).filter((st) => st);

		/**
		 * Important, if document has not saved yet,
		 * we can use updated function to update document
		 * */
		(newPageImage.sentences as any) = sentenceImages.map((ele) => ele?._id);

		// Store all of them
		await Promise.all(
			[newPageImage, ...sentenceImages].map(async (ele) => ele?.save()),
		);

		await User.updateOne(
			{ _id: userId },
			{
				$push: {
					pages: newPageImage._id,
				},
			},
		);
	}

	async syncSinglePage(
		userId: Types.ObjectId,
		accessToken: string,
		page: any,
		pageImage: IPage,
	) {
		const sentenceList = await this.getNotionSentences(
			accessToken,
			page.id,
		);

		const detailPageImages = await Page.findById(pageImage._id).populate(
			'sentences',
		);

		sentenceList.forEach(async (sentence: any) => {
			const senteceImage = (detailPageImages?.sentences as any).find(
				(ele: ISentence) => {
					return ele.root_id == sentence.id;
				},
			);

			if (!senteceImage) {
				const newSentenceImage =
					await this.createSentenceWithQuestionCore(
						sentence,
						detailPageImages as IPage,
					);

				await (newSentenceImage as ISentence)?.save();
			} else {
				senteceImage.is_deleted = true;

				if (
					senteceImage.last_edited_time <=
					new Date(sentence.last_edited_time)
				) {
					// Delete all old question core
					QuestionCore.deleteMany({
						$in: {
							_id: senteceImage.list_question_core,
						},
					});

					// Regenerate question cores
					try {
						await this.generateQuestionCore(sentence, senteceImage);
					} catch (error) {
						console.log(error);
					}
				} else {
					// No need to sync
					return;
				}
			}
		});

		console.log(detailPageImages);

		return SyncResult.SYNC_SUCCESS;
	}

	/**
	 * This method create sentence image
	 * And its question cores
	 * */
	async createSentenceWithQuestionCore(sentence: any, pageImage: IPage) {
		const plant_text = (sentence.bulleted_list_item.rich_text as []).reduce(
			(prev: any, cur: any) => {
				return prev + cur.plain_text;
			},
			'',
		);

		const senteceImage = new Sentence({
			root_id: sentence.id,
			plain_text: plant_text,
			page: pageImage._id,
		});

		try {
			await this.generateQuestionCore(sentence, senteceImage);
		} catch (error) {
			return null;
		}

		await pageImage.updateOne({
			$push: {
				sentences: senteceImage._id,
			},
		});

		return senteceImage;
	}

	/**
	 * This method generate question core from a sentence
	 */
	async generateQuestionCore(sentence: any, sentenceImage: ISentence) {
		const plant_text = (sentence.bulleted_list_item.rich_text as []).reduce(
			(prev: any, cur: any) => {
				return prev + cur.plain_text;
			},
			'',
		);

		const seperated_chars = plant_text.match(
			new RegExp(SEPERATE_CHARS.join('|'), 'g'),
		);

		// Invalid sentence to generate question
		if (seperated_chars.length !== 1) {
			throw new UserError(
				'The sentence must have only one seperated char',
			);
		}

		const modifiedText = (
			sentence.bulleted_list_item.rich_text as []
		).reduce((prev: any, cur: any) => {
			// Merge string

			if (cur.annotations.bold) {
				const listStr: string[] = cur.plain_text.split(
					seperated_chars[0],
				);

				/**
				 * Process the string, if the string is bold, surround it by |\b and \b|
				 * | and | use to seperate list string
				 * \b and \b use to which is bold
				 * Notice that the seperate char is in our text
				 * */
				return (
					prev.trim() +
					' ' +
					listStr
						.map((str) => {
							if (str.trim().length > 0) {
								return '|\\b' + str.trim() + '\\b|';
							} else {
								return '';
							}
						})
						.join(seperated_chars[0])
				);
			} else {
				return prev.trim() + ' ' + cur.plain_text.trim();
			}
		}, '');

		// We will use modifiedText to generate question
		const [left, right] = modifiedText.split(seperated_chars[0]);

		if (left.trim().length === 0 || right.trim().length === 0) {
			throw new UserError('Both two sides must have data');
		}

		// Create all duplex questions
		await this.createDuplexQuestionCore(sentenceImage, left, right);

		// Create fill word question
		await this.createFillWordQuestionCore(sentenceImage, left, right);
	}

	/**
	 * This method generate duplex question core
	 * Include:
	 * * Whole string question
	 * * Marked string questions
	 * */
	async createDuplexQuestionCore(
		sentenceImage: ISentence,
		left: string,
		right: string,
	) {
		const boldRegExp = new RegExp('\\\\b.*\\\\b');

		// Handle list string
		const leftBoldWords = left
			.split('|')
			.filter((word) => {
				return boldRegExp.test(word);
			})
			.map((word) => word.replaceAll('\\b', '').trim());

		const rightBoldWords = right
			.split('|')
			.filter((word) => {
				return boldRegExp.test(word);
			})
			.map((word) => word.replaceAll('\\b', '').trim());

		const questionIds = [];

		// Generate document
		if (
			leftBoldWords.length === rightBoldWords.length &&
			leftBoldWords.length > 0
		) {
			leftBoldWords.forEach(async (word, index) => {
				const question = await DuplexQuestionCore.create({
					first: {
						text: word,
					},
					second: {
						text: rightBoldWords[index],
					},
					sentence: sentenceImage._id,
					dificulty: Difficulty.EASY,
				});

				questionIds.push(question._id);
			});
		}

		const question = await DuplexQuestionCore.create({
			first: {
				text: left.replaceAll('|\\b', '').replaceAll('\\b|', '').trim(),
			},
			second: {
				text: right
					.replaceAll('|\\b', '')
					.replaceAll('\\b|', '')
					.trim(),
			},
			sentence: sentenceImage._id,
			dificulty: Difficulty.HARD,
		});

		questionIds.push(question._id);

		// Push children to sentence image
		/**
		 * Some trouble here
		 * Does updateOne work with local document?
		 * */
		(sentenceImage.list_question_core as any) = questionIds;
		await sentenceImage.updateOne({
			list_question_core: questionIds,
		});
	}

	/**
	 * This method generate fill word question core
	 * From whole string and marked words
	 */
	async createFillWordQuestionCore(
		sentenceImage: ISentence,
		modifiedText: string,
		modifiedHint: string,
	) {
		const listWords = modifiedText.split('|');

		const fillFieldIndexes: Array<number> = [];

		const boldRegExp = new RegExp('\\\\b.*\\\\b');
		const newListWords = listWords.map((word, index) => {
			if (boldRegExp.test(word)) {
				fillFieldIndexes.push(index);
				// Remove \b chars
				return word.replaceAll('\\b', '').trim();
			}
			return word.trim();
		});

		// Dont have bold fields
		if (fillFieldIndexes.length === 0) {
			return;
		}

		const question = await FillWordQuestionCore.create({
			sentence: sentenceImage._id,
			list_words: newListWords,
			fill_field_indexes: fillFieldIndexes,
			dificulty: Difficulty.MEDIUM,
			hint: modifiedHint.replaceAll('|', '').replaceAll('\\b', ''),
		});

		// Push child to sentence image
		await sentenceImage.updateOne({
			$push: {
				list_question_core: question._id,
			},
		});
	}

	private async getNotionSentences(
		accessToken: string,
		pageId: string,
	): Promise<Array<Object>> {
		return (
			await notionProvider.getPageChildren(accessToken, pageId)
		).filter((block) => {
			return (block as any).type === 'bulleted_list_item';
		});
	}

	private async getNotionPages(accessToken: string): Promise<Array<Object>> {
		return (
			await notionProvider.getAllSharedPagesOfUser(accessToken)
		).filter((page) => {
			return (page as any).object === 'page';
		});
	}
}

export default new NotionProcessingService();
