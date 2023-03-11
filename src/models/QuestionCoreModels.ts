import {
    IQuestionCore,
    IDuplexQuestionCore,
    IFillWordQuestionCore,
    QuestionType,
    IWords,
    Language,
} from "../interfaces";
import { model, Schema } from "mongoose";
import { ZeroDefault } from "../utils";

const questionCoreSchema = new Schema<IQuestionCore>(
    {
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
            default: ZeroDefault,
        },
        number_of_wrong: {
            type: Number,
            required: true,
            default: ZeroDefault,
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
