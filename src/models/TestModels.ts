import { Schema, model } from "mongoose";
import {
    IFillWordQuestion,
    IMultichoiceQuestion,
    IPracticeQuestion,
    IPracticeTest,
    ITranslateQuestion,
    PracticeQuestionType,
    PracticeTestStatus,
} from "../interfaces/IData.js";

const PraticeTestSchema = new Schema<IPracticeTest>(
    {
        questions: {
            required: true,
            default: [],
            type: Array<IPracticeQuestion>,
            ref: "PracticeQuestion",
        },
        count_wrongs: {
            required: false,
            type: Number,
            default: 0,
        },
        submited_time: {
            required: false,
            type: Date,
        },
        status: {
            required: true,
            enum: Object.values(PracticeTestStatus),
            default: PracticeTestStatus.INIT,
        },
    },
    {
        timestamps: {
            createdAt: "created_time",
            updatedAt: "last_edited_time",
        },
    }
);

const PraticeQuestionShema = new Schema<IPracticeQuestion>(
    {
        question_number: Number,
        difficulty: {
            required: true,
            type: Number,
        },
        type: {
            required: true,
            type: String,
            enum: Object.values(PracticeQuestionType),
        },
    },
    {
        discriminatorKey: "type",
    }
);

const MultichoiceQuestionSchema = new Schema<IMultichoiceQuestion>({
    question_text: {
        required: true,
        type: String,
    },
    answers: {
        required: true,
        type: Array<String>,
    },
    solution_index: {
        required: true,
        type: Boolean,
    },
    user_answer: {
        required: false,
        type: Number,
    },
});

const TranslateQuestionSchema = new Schema<ITranslateQuestion>({
    question_text: {
        type: String,
        required: true,
    },
    solution: {
        type: String,
        required: true,
    },
    user_answer: {
        type: String,
        required: true,
    },
});

const FillWordQuestionSchema = new Schema<IFillWordQuestion>({
    list_words: {
        type: [String],
        required: true,
    },
    solution_index: {
        type: Number,
        required: true,
    },
    user_answer: {
        type: String,
        required: false,
    },
});

export const PracticeTest = model<IPracticeTest>(
    "PracticeTest",
    PraticeTestSchema
);

export const PracticeQuestion = model<IPracticeQuestion>(
    "PracticeQuestion",
    PraticeQuestionShema
);

export const MultichoiceQuestion = PracticeQuestion.discriminator(
    PracticeQuestionType.MULTICHOICE,
    MultichoiceQuestionSchema
);

export const TranslateQuestion = PracticeQuestion.discriminator(
    PracticeQuestionType.TRANSLATE,
    TranslateQuestionSchema
);

export const FillWordQuestion = PracticeQuestion.discriminator(
    PracticeQuestionType.FILLWORD,
    FillWordQuestionSchema
);
