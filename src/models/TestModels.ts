import { Schema, Types, model } from "mongoose";
import {
    IFillWordQuestion,
    IMultichoiceQuestion,
    IPracticeQuestion,
    IPracticeTest,
    ITranslateQuestion,
    PracticeQuestionType,
    PracticeTestStatus,
    TestGenerationStrategies,
    PickedType,
} from "../interfaces/IData.js";

const PracticeTestSchema = new Schema<IPracticeTest>(
    {
        questions: [
            {
                type: Schema.Types.ObjectId,
                ref: "PracticeQuestion",
            },
        ],
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
            type: String,
            enum: Object.values(PracticeTestStatus),
            default: PracticeTestStatus.INIT,
        },
        strategy: {
            type: String,
            enum: Object.values(TestGenerationStrategies),
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

// PracticeTestSchema.pre("deleteOne", async function (next) {
//     const test = this as any;
//     console.log(test);
//     console.log("Remove questions of test");
//     await PracticeQuestion.deleteMany({
//         _id: {
//             $in: test.questions,
//         },
//     });
//     next();
// });

const PraticeQuestionShema = new Schema<IPracticeQuestion>(
    {
        difficulty: {
            required: true,
            type: Number,
        },
        type: {
            required: true,
            type: String,
            enum: Object.values(PracticeQuestionType),
        },
        picked_type: {
            required: true,
            type: String,
            enum: Object.values(PickedType),
        },
        sentence_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Sentence",
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
        type: Number,
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
        required: false,
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
    PracticeTestSchema
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
