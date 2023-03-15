import { Types } from "mongoose";
import Log from "../helpers/Log.js";
import NotionProvider from "../providers/Notion.js";
import UserRepo from "../repositories/UserRepo.js";
import {
    DuplexQuestionCore,
    FillWordQuestionCore,
    Page,
    Sentence,
    User,
} from "../models/index.js";
import { Difficulty, IPage, Language } from "../interfaces/index.js";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints.js";

export enum SyncResult {
    SYNC_SUCCESS = "SYNC_SUCCESS",
    SYNC_FAIL = "SYNC_FAIL",
}

const SEPERATE_CHARS = [":", "→"];

class NotionProcessingService {
    async getAndSaveAccessTokenFromNotion(
        userId: Types.ObjectId,
        code: string
    ) {
        let notionData: any = null;
        try {
            notionData = await NotionProvider.getAccessTokenFromCode(code);
            Log.consoleLog(
                this.constructor.name,
                "Get Auth Token",
                JSON.stringify(notionData)
            );
        } catch (error) {
            Log.consoleLog(this.constructor.name, "Error", error as any);
        }

        if (!notionData) {
            return null;
        }
        const updateResult = UserRepo.saveNotionDataForUser(userId, notionData);
        return updateResult;
    }

    /**
     * This method is a service function for sync data of user
     * TODO: Get data and pass to children function
     * 
     * @userId Id of user from request body or anywhere
     * */ 
    async syncDataByUserId(userId: Types.ObjectId) {
        const accessToken = await UserRepo.getAccessTokenOfUser(userId);

        if (!accessToken) {
            throw new Error("Can not find access token of this user");
        }
        const pages = await NotionProvider.getAllSharedPagesOfUser(accessToken);
        const pageImages = await UserRepo.getAllPageImagesOfUser(userId);

        this.syncAllPagesOfUser(userId, accessToken, [], pages as any);

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
        pages: PageObjectResponse[]
    ): SyncResult {
        pages.forEach((page) => {
            const pageImage = pageImages.find((pageImage) => {
                return pageImage.root_id === page.id;
            });

            if (!pageImage) {
                // Add new image of page
                this.addNewPageImageForUser(userId, accessToken, page);
            } else if (
                (pageImage?.last_edited_time as Date) >=
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
                    pageImage as IPage
                );
            } else {
                // No need to sync
                return;
            }
        });

        return SyncResult.SYNC_SUCCESS;
    }

    syncSinglePage(
        userId: Types.ObjectId,
        accessToken: string,
        page: any,
        pageImage: IPage
    ): SyncResult {
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
        page: any
    ) {
        // Just use bulleted_list_item to handle
        const sentenceList = (
            await NotionProvider.getPageChildren(accessToken, page.id)
        ).filter((block) => {
            return (block as any).type === "bulleted_list_item";
        });

        // Create image for this page
        const newPageImage = new Page({
            root_id: page.id,
            title: page.properties.title.title[0].plain_text,
            url: page.url,
            sentences: [],
        });

        // Create all sentence for current image
        let sentenceImages = await Promise.all(
            sentenceList.map(async (sentence) => {
                const sentenceImage = await this.createSentenceWithQuestionCore(
                    sentence
                );

                // Ref id
                if (sentenceImage) {
                    sentenceImage.page = newPageImage._id;
                }
                return sentenceImage;
            })
        );

        sentenceImages = sentenceImages.filter((ele) => ele != null);

        newPageImage.sentences = sentenceImages.map((ele: any) => ele._id);

        // Store all of them
        await Promise.all(
            [newPageImage, ...sentenceImages].map(async (ele) => ele?.save())
        );

        await User.updateOne(
            { _id: userId },
            {
                $push: {
                    pages: newPageImage._id,
                },
            }
        );
    }

    /**
     * This method create sentence image
     * And its question cores
     * */
    async createSentenceWithQuestionCore(sentence: any) {
        const plant_text = (sentence.bulleted_list_item.rich_text as []).reduce(
            (prev: any, cur: any) => {
                return prev + cur.plain_text;
            },
            ""
        );

        const senteceImage = new Sentence({
            root_id: sentence.id,
            plain_text: plant_text,
        });

        try {
            this.generateQuestionCore(sentence, senteceImage._id as any);
        } catch (error) {
            return null;
        }

        return senteceImage;
    }

    /**
     * This method generate question core from a sentence
     */
    async generateQuestionCore(sentence: any, sentenceImageId: Types.ObjectId) {
        const plant_text = (sentence.bulleted_list_item.rich_text as []).reduce(
            (prev: any, cur: any) => {
                return prev + cur.plain_text;
            },
            ""
        );

        const seperated_chars = plant_text.match(
            new RegExp(SEPERATE_CHARS.join("|"), "g")
        );

        // Invalid sentence to generate question
        if (seperated_chars.length !== 1) {
            throw Error("The sentence must have only one seperated char");
        }

        const modifiedText = (
            sentence.bulleted_list_item.rich_text as []
        ).reduce((prev: any, cur: any) => {
            // Merge string

            if (cur.annotations.bold) {
                const listStr: String[] = cur.plain_text.split(
                    seperated_chars[0]
                );

                /**
                 * Process the string, if the string is bold, surround it by |\b and \b|
                 * | and | use to seperate list string
                 * \b and \b use to which is bold
                 * Notice that the seperate char is in our text
                 * */
                return (
                    prev.trim() +
                    " " +
                    listStr
                        .map((str) => {
                            if (str.trim().length > 0) {
                                return "|\\b" + str.trim() + "\\b|";
                            } else {
                                return "";
                            }
                        })
                        .join(seperated_chars[0])
                );
            } else {
                return prev.trim() + " " + cur.plain_text.trim();
            }
        }, "");

        // We will use modifiedText to generate question
        let left, right;
        [left, right] = modifiedText.split(seperated_chars[0]);

        // Create all duplex questions
        await this.createDuplexQuestionCore(sentenceImageId, left, right);

        // Create fill word question
        await this.createFillWordQuestionCore(sentenceImageId, left);
    }

    /**
     * This method generate duplex question core
     * Include:
     * * Whole string question
     * * Marked string questions
     * */
    async createDuplexQuestionCore(
        sentenceImageId: Types.ObjectId,
        left: string,
        right: string
    ) {
        const boldRegExp = new RegExp("\\\\b.*\\\\b");

        // Handle list string
        const leftBoldWords = left
            .split("|")
            .filter((word) => {
                return boldRegExp.test(word);
            })
            .map((word) => word.replaceAll("\\b", "").trim());

        const rightBoldWords = right
            .split("|")
            .filter((word) => {
                return boldRegExp.test(word);
            })
            .map((word) => word.replaceAll("\\b", "").trim());

        // Generate document
        if (leftBoldWords.length === rightBoldWords.length) {
            leftBoldWords.forEach(async (word, index) => {
                await DuplexQuestionCore.create({
                    first: {
                        text: word,
                    },
                    second: {
                        text: rightBoldWords[index],
                    },
                    sentence: sentenceImageId,
                    dificulty: Difficulty.EASY,
                });
            });
        }

        await DuplexQuestionCore.create({
            first: {
                text: left.replace("|\\b", "").replaceAll("\\b|", "").trim(),
            },
            second: {
                text: right.replace("|\\b", "").replaceAll("\\b|", "").trim(),
            },
            dificulty: Difficulty.HARD,
        });
    }

    /**
     * This method generate fill word question core
     * From whole string and marked words
     */
    async createFillWordQuestionCore(
        sentenceImageId: Types.ObjectId,
        modifiedText: string
    ) {
        const listWords = modifiedText.split("|");

        const fillFieldIndexes: Array<Number> = [];

        const boldRegExp = new RegExp("\\\\b.*\\\\b");
        const newListWords = listWords.map((word, index) => {
            if (boldRegExp.test(word)) {
                fillFieldIndexes.push(index);
                // Remove \b chars
                return word.replaceAll("\\b", "").trim();
            }
            return word.trim();
        });

        await FillWordQuestionCore.create({
            sentence: sentenceImageId,
            list_words: newListWords,
            fill_field_indexes: fillFieldIndexes,
            dificulty: Difficulty.MEDIUM,
        });
    }
}

export default new NotionProcessingService();
