import { Schema, model } from "mongoose";
import { IUser, INotionData, UserRole } from "../interfaces";

const notionDataSchema = new Schema<INotionData>({
    access_token: {
        type: String,
    },
    token_type: { type: String },
    bot_id: { type: String },
    workspace_name: { type: String },
    workspace_icon: { type: String },
    workspace_id: { type: String },
    owner: Object,
    duplicated_template_id: { type: String },
});

const userSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: false,
            unique: false,
        },
        password: {
            type: String,
            required: false,
        },
        notion_data: {
            type: notionDataSchema,
            required: false,
        },
        firebase_uid: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: Object.values(UserRole),
            required: true,
        },
        pages: [
            {
                type: Schema.Types.ObjectId,
                ref: "Page",
            },
        ],
    },
    {
        timestamps: {
            createdAt: "created_time",
            updatedAt: "last_edited_time",
        },
    }
);

const User = model<IUser>("User", userSchema);

export { User };
