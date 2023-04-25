import {
    IQuestionCore,
    IDuplexQuestionCore,
    IFillWordQuestionCore,
    QuestionType,
    IWords,
    Language,
    Difficulty,
} from "../interfaces";
import { model, Schema } from "mongoose";
import { ZeroDefault } from "@sipo/utils";

const questionCoreSchema = new Schema<IQuestionCore>(
    {
        sentence: {
            type: Schema.Types.ObjectId,
            ref: "Sentence",
        },
        dificulty: {
            type: Number,
            // enum: Object.values(Difficulty),
            // required: true,
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
        default: Language.UNDEFINED,
    },
});

const duplexQuestionCoreSchema = new Schema<IDuplexQuestionCore>({
    first: WordsSchema,
    second: WordsSchema,
});

const fillWordQuestionCoreSchema = new Schema<IFillWordQuestionCore>({
    list_words: [String],
    fill_field_indexes: [Number],
    hint: {
        type: String,
        required: false,
    },
    language: {
        type: String,
        enum: Object.values(Language),
        required: true,
        default: Language.UNDEFINED,
    },
});

const QuestionCore = model<IQuestionCore>("QuestionCore", questionCoreSchema);

const DuplexQuestionCore = QuestionCore.discriminator<IDuplexQuestionCore>(
    QuestionType.CORE_DUPLEX,
    duplexQuestionCoreSchema
);
const FillWordQuestionCore = QuestionCore.discriminator<IFillWordQuestionCore>(
    QuestionType.CORE_FILL,
    fillWordQuestionCoreSchema
);

export { QuestionCore, DuplexQuestionCore, FillWordQuestionCore };
