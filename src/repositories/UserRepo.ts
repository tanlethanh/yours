import { Types } from "mongoose";
import { User } from "../models";

class UserRepo {
    getUserById(userId: String) {}

    async saveNotionDataForUser(userId: Types.ObjectId, notionData: Object) {
        return await User.findByIdAndUpdate(userId, {
            $set: {
                notion_data: notionData,
            },
        });
    }
}

export default new UserRepo();
