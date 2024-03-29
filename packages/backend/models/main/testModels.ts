import {
	IFillWordQuestion,
	IMultichoiceQuestion,
	IPracticeQuestion,
	IPracticeTest,
	ITranslateQuestion,
	PickedType,
	PracticeQuestionType,
	PracticeTestStatus,
	TestGenerationStrategies,
} from '@yours/interfaces';
import { model, Schema } from 'mongoose';

const PracticeTestSchema = new Schema<IPracticeTest>(
	{
		questions: [
			{
				type: Schema.Types.ObjectId,
				ref: 'PracticeQuestion',
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
		owner: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: {
			createdAt: 'created_time',
			updatedAt: 'last_edited_time',
		},
	},
);

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
			ref: 'Sentence',
		},
	},
	{
		discriminatorKey: 'type',
		strict: false,
	},
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
	hint: {
		type: String,
		required: false,
	},
	user_answer: {
		type: String,
		required: false,
	},
});

const PracticeTest = model<IPracticeTest>('PracticeTest', PracticeTestSchema);

const PracticeQuestion = model<IPracticeQuestion>(
	'PracticeQuestion',
	PraticeQuestionShema,
);

const MultichoiceQuestion = PracticeQuestion.discriminator(
	PracticeQuestionType.MULTICHOICE,
	MultichoiceQuestionSchema,
);

const TranslateQuestion = PracticeQuestion.discriminator(
	PracticeQuestionType.TRANSLATE,
	TranslateQuestionSchema,
);

const FillWordQuestion = PracticeQuestion.discriminator(
	PracticeQuestionType.FILLWORD,
	FillWordQuestionSchema,
);

// const questionChangeStream = PracticeQuestion.watch();

// questionChangeStream.on("change", async (change) => {
//     if (change.operationType == "update") {
//         const currentDoc = change.fullDocument;

//         if (currentDoc.picked_type == PickedType.DEFAULT) {
//             let countWrong = 0;
//             if (currentDoc.solution_index) {
//                 if (currentDoc.solution_index == currentDoc.user_answer) {
//                     countWrong = 1;
//                 }
//             } else if (currentDoc.solution) {
//                 if (
//                     isEqualPureString(
//                         currentDoc.solution,
//                         currentDoc.user_answer
//                     )
//                 ) {
//                     countWrong = 1;
//                 }
//             }

//             await Sentence.updateOne(
//                 {
//                     _id: currentDoc.sentence_id,
//                 },
//                 {
//                     $inc: {
//                         number_of_wrongs: countWrong,
//                         number_of_usages: 1,
//                     },
//                 }
//             );
//         }
//     }
// });

export {
	FillWordQuestion,
	MultichoiceQuestion,
	PracticeQuestion,
	PracticeTest,
	TranslateQuestion,
};
