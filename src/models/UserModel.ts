import { Schema, model } from "mongoose";
import { IUser, INotionData } from "../interfaces/index.js";

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
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        notion_data: {
            type: notionDataSchema,
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
