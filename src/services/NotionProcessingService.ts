import { Types } from "mongoose";
import Log from "../helpers/Log";
import NotionProvider from "../providers/Notion";
import UserRepo from "../repositories/UserRepo";
import { DuplexQuestionCore, Page, Sentence, User } from "../models";
import { IPage } from "../interfaces";
import {
    BlockObjectResponse,
    PageObjectResponse,
    PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { franc } from "franc";
import { isGeneratorFunction } from "util/types";

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

    async syncDataByUserId(userId: Types.ObjectId) {
        const accessToken = await UserRepo.getAccessTokenOfUser(userId);

        if (!accessToken) {
            throw new Error("Can not find access token of this user");
        }
        const pages = await NotionProvider.getAllSharedPagesOfUser(accessToken);
        const pageImages = await UserRepo.getAllPageImagesOfUser(userId);

        this.syncAllPagesOfUser(userId, accessToken, pageImages, pages as any);

        return pages;
    }

    syncAllPagesOfUser(
        userId: Types.ObjectId,
        accessToken: string,
        pageImages: IPage[],
        pages: PageObjectResponse[]
    ): SyncResult {
        console.log("pages", pages);
        console.log("page images ", pageImages);
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
        console.log("Add new page image");
        // Just use bulleted_list_item to handle
        const sentenceList = (
            await NotionProvider.getPageChildren(accessToken, page.id)
        ).filter((block) => {
            return (block as any).type === "bulleted_list_item";
        });

        console.log("sentenceList", sentenceList);

        // Create image for this page
        const newPageImage = new Page({
            root_id: page.id,
            title: page.properties.title.title[0].plain_text,
            url: page.url,
            sentences: [],
        });

        console.log("page image", newPageImage);

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
        // (newPageImage.sentences as any) = sentenceImages;

        console.log("sentences image", newPageImage.sentences);

        // Store all of them
        await Promise.all(
            [newPageImage, ...sentenceImages].map(async (ele) => ele?.save())
        );

        try {
        } catch {
            return null;
        }
    }

    /**
     *
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

        console.log("senteceImage ", senteceImage);

        try {
            this.generateQuestionCore(sentence, senteceImage._id as any);
        } catch (error) {
            return null;
        }

        console.log("senteceImage ", senteceImage);

        return senteceImage;
    }

    async generateQuestionCore(sentence: any, sentenceImageId: Types.ObjectId) {
        let count_seperate = 0;
        const plant_text = (sentence.bulleted_list_item.rich_text as []).reduce(
            (prev: any, cur: any) => {
                return prev + cur.plain_text;
            },
            ""
        );

        const seperated_chars = plant_text.match(
            new RegExp(SEPERATE_CHARS.join("|"), "g")
        );

        console.log("sepeared_chars ", seperated_chars);

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
                                return "|\\b" + str.trim() + "|\\b";
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

        // Generate duplexQuestionCore
        this.createDuplexQuestionCore(
            sentenceImageId,
            left.replace("|\\b", "").replace("\\b|", ""),
            right.replace("|\\b", "").replace("\\b|", "")
        );

        // Generate fillWordQuestionCore
    }

    createDuplexQuestionCore(
        sentenceImageId: Types.ObjectId,
        left: string,
        right: string
    ) {
        console.log(`Left string: ${left}`);
        console.log(`Right string ${right}`);

        // const questionCore = new DuplexQuestionCore({
        //     sentence: sentenceImageId,
        // });
    }
}

export default new NotionProcessingService();
