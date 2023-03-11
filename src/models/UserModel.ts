import { Schema, model } from "mongoose";
import { IUser } from "../interfaces";

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
            type: Object,
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
