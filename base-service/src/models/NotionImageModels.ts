import { Schema, Types, model } from "mongoose";
import { IPage, ISentence } from "../interfaces/index.js";
import { ZeroDefault } from "../utils/index.js";

const sentenceSchema = new Schema<ISentence>(
    {
        root_id: {
            type: String,
            required: true,
        },
        page: {
            type: Schema.Types.ObjectId,
            ref: "Page",
        },
        plain_text: {
            type: String,
            // required: true,
        },
        number_of_usages: {
            type: Number,
            default: ZeroDefault,
            required: true,
        },
        number_of_wrongs: {
            type: Number,
            default: ZeroDefault,
            required: true,
        },
        list_question_core: [
            {
                type: Schema.Types.ObjectId,
                ref: "QuestionCore",
            },
        ],
        is_deleted: {
            type: Boolean,
            default: false,
            require: true,
        },
    },
    {
        timestamps: {
            createdAt: "created_time",
            updatedAt: "last_edited_time",
        },
    }
);

const pageSchema = new Schema<IPage>(
    {
        root_id: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        number_of_usages: {
            type: Number,
            default: ZeroDefault,
            required: true,
        },
        sentences: [
            {
                type: Schema.Types.ObjectId,
                ref: "Sentence",
            },
        ],
        id_deleted: {
            type: Boolean,
            default: false,
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: "created_time",
            updatedAt: "last_edited_time",
        },
    }
);

const Sentence = model<ISentence>("Sentence", sentenceSchema);
const Page = model<IPage>("Page", pageSchema);

export { Page, Sentence };
