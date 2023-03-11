import { Types } from "mongoose";
import Log from "../helpers/Log";
import NotionProvider from "../providers/Notion";
import UserRepo from "../repositories/UserRepo";

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

    syncAllPagesOfUser(userId: String): SyncResult {
        return SyncResult.SYNC_SUCCESS;
    }

    syncSinglePage(userId: String, pageId: String): SyncResult {
        return SyncResult.SYNC_SUCCESS;
    }
}

export default new NotionProcessingService();
