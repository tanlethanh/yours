import { Types } from "mongoose";
import Log from "../helpers/Log";
import NotionProvider from "../providers/Notion";
import UserRepo from "../repositories/UserRepo";
import { Page, Sentence, User } from "../models";
import { IPage } from "../interfaces";
import {
    BlockObjectResponse,
    PageObjectResponse,
    PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export enum SyncResult {
    SYNC_SUCCESS = "SYNC_SUCCESS",
    SYNC_FAIL = "SYNC_FAIL",
}

class NotionProcessingService {
    // constructor() {}

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
        pages.forEach((page) => {
            const pageImage = pageImages.find((pageImage) => {
                return pageImage.root_id === page.id;
            });

            if (!pageImages) {
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
        page: PageObjectResponse
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
            title: page.properties.title,
            url: page.properties.url,
            sentences: [],
        });

        // Create all sentence for current image
        const sentenceImages = await Promise.all(
            sentenceList.map(async (sentence) => {
                const sentenceImage = await this.createSentenceWithQuestionCore(
                    sentence
                );

                // Ref id
                sentenceImage.page = newPageImage._id;
                return sentenceImage;
            })
        );

        newPageImage.sentences = sentenceImages.map((ele) => ele._id);

        // Store all of them
        await Promise.all([newPageImage, ...sentenceImages]);
    }

    /**
     * 
     * */ 
    async createSentenceWithQuestionCore(sentence: PartialBlockObjectResponse) {
        return new Sentence();
    }
}

export default new NotionProcessingService();
