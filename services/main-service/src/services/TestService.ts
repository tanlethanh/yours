import mongoose from "mongoose";
import { PracticeQuestion } from "../models/TestModels.js";
import { PracticeQuestionType, PickedType } from "../interfaces/IData.js";
import { Sentence } from "../models/NotionImageModels.js";
import { isEqualPureString } from "@yourenglish/utils";
import { UserError } from "@yourenglish/backend/helpers";

class TestService {
    async updateUserAnswer(questionId: any, userAnswer: any) {
        questionId = new mongoose.Types.ObjectId(questionId);
        const question = await PracticeQuestion.findById(questionId);

        if (!question) {
            throw new UserError("Not found this question");
        }

        switch (question.type) {
            case PracticeQuestionType.MULTICHOICE:
                if (
                    typeof userAnswer != "number" ||
                    userAnswer < 0 ||
                    userAnswer >= (question as any).answers?.length
                ) {
                    throw new UserError("Invalid userAnswer");
                }
                break;

            case PracticeQuestionType.TRANSLATE:
                if (typeof userAnswer != "string") {
                    console.log("Here");
                    throw new UserError("Invalid userAnswer");
                }
                break;

            case PracticeQuestionType.FILLWORD:
                if (typeof userAnswer != "string") {
                    console.log("hehehe");
                    throw new UserError("Invalid userAnswer");
                }
                break;
        }

        const updatedQuestion = await PracticeQuestion.findByIdAndUpdate(
            question._id,
            {
                user_answer: userAnswer,
            },
            {
                new: true,
            }
        );

        if (
            question.picked_type == PickedType.DEFAULT ||
            !(question as any).user_answer
        ) {
            let countWrong = 1;
            if (question.type == PracticeQuestionType.TRANSLATE) {
                if (
                    isEqualPureString(
                        (question as any).solution,
                        String(userAnswer)
                    )
                ) {
                    countWrong = 0;
                }
            } else if (question.type == PracticeQuestionType.FILLWORD) {
                if (
                    isEqualPureString(
                        (question as any).list_words[
                            (question as any).solution_index
                        ],
                        userAnswer as string
                    )
                ) {
                    countWrong = 0;
                }
            } else {
                if ((question as any).solution_index == userAnswer) {
                    countWrong = 0;
                }
            }

            await Sentence.updateOne(
                {
                    _id: question.sentence_id,
                },
                {
                    $inc: {
                        number_of_wrongs: countWrong,
                        number_of_usages: 1,
                    },
                }
            );
        }

        return updatedQuestion;
    }
}

export default new TestService();
