import { Schema, Types, model } from "mongoose";
import { IPage, ISentence } from "../interfaces";
import { ZeroDefault } from "../utils";

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
            required: true,
        },
        number_of_usages: {
            type: Number,
            default: ZeroDefault,
            required: true
        },
        number_of_wrongs: {
            type: Number,
            default: ZeroDefault,
            required: true
        },
        list_question_core: [
            {
                type: Schema.Types.ObjectId,
                ref: "QuestionCore",
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
            required: true
        },
        sentences: [sentenceSchema],
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
