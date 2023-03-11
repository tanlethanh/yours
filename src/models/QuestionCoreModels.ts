import {
    IQuestionCore,
    IDuplexQuestionCore,
    IFillWordQuestionCore,
    QuestionType,
} from "../interfaces/IData";
import { Document, model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const questionCoreSchema = new Schema<IQuestionCore>(
    {
        id: {
            type: String,
            required: true,
            default: uuidv4,
        },
        sentence_id: {
            type: String,
            required: true,
        },
        dificulty: {
            type: Number,
            required: true,
        },
        number_of_usages: {
            type: Number,
            required: true,
            default: 0,
        },
        number_of_wrong: {
            type: Number,
            required: true,
            default: 0,
        },
        type: {
            type: String,
            enum: Object.values(QuestionType),
            required: true,
        },
    },
    {
        timestamps: {
            createdAt: "created_time",
            updatedAt: "last_updated_time",
        },
        discriminatorKey: "type",
    }
);

const duplexQuestionCoreSchema = new Schema<IDuplexQuestionCore>({});

const fillWordQuestionCoreSchema = new Schema<IFillWordQuestionCore>({});

const QuestionCore = model<IQuestionCore>("QuestionCore", questionCoreSchema);

QuestionCore.discriminator(QuestionType.CORE_DUPLEX, duplexQuestionCoreSchema);
QuestionCore.discriminator(QuestionType.CORE_FILL, fillWordQuestionCoreSchema);

export { QuestionCore };
