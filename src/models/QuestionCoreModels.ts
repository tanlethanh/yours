import {
    IQuestionCore,
    IDuplexQuestionCore,
    IFillWordQuestionCore,
    QuestionType,
    IWords,
    Language,
} from "../interfaces/IData";
import { model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

const questionCoreSchema = new Schema<IQuestionCore>(
    {
        id: {
            type: String,
            required: true,
            default: uuidv4,
        },
        sentence: {
            type: Schema.Types.ObjectId,
            ref: "Sentence",
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
    },
    {
        timestamps: {
            createdAt: "created_time",
            updatedAt: "last_updated_time",
        },
        discriminatorKey: "type",
    }
);

const WordsSchema = new Schema<IWords>({
    text: {
        type: String,
        default: "None text",
        required: true,
    },
    language: {
        type: String,
        enum: Object.values(Language),
        required: true,
    },
});

const duplexQuestionCoreSchema = new Schema<IDuplexQuestionCore>({
    first: WordsSchema,
    second: WordsSchema,
});

const fillWordQuestionCoreSchema = new Schema<IFillWordQuestionCore>({
    list_words: [WordsSchema],
    fill_field_indexes: [Number],
    language: {
        type: String,
        enum: Object.values(Language),
        required: true,
    },
});

const QuestionCore = model<IQuestionCore>("QuestionCore", questionCoreSchema);

QuestionCore.discriminator(QuestionType.CORE_DUPLEX, duplexQuestionCoreSchema);
QuestionCore.discriminator(QuestionType.CORE_FILL, fillWordQuestionCoreSchema);

export { QuestionCore };
