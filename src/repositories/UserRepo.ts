import { Types } from "mongoose";
import { IUser } from "../interfaces/IData.js";
import { User } from "../models/index.js";

class UserRepo {
    // Hello UserRepo

    async saveNotionDataForUser(userId: Types.ObjectId, notionData: Object) {
        return await User.findByIdAndUpdate(userId, {
            $set: {
                notion_data: notionData,
            },
        });
    }

    async getAllPageImagesOfUser(userId: Types.ObjectId) {
        const user = await User.findById(userId, {
            pages: 1,
        }).populate('pages')

        if (!user?.pages) {
            return [];
        }

        return user?.pages;
    }

    async getAccessTokenOfUser(userId: Types.ObjectId) {
        const user = await User.findById(userId, {
            notion_data: {
                access_token: 1,
            },
        });
        
        return user?.notion_data.access_token;
    }

}

export default new UserRepo();
