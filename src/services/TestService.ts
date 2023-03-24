import mongoose from "mongoose";
import { PracticeQuestion, PracticeTest } from "../models/TestModels.js";
import {
    IMultichoiceQuestion,
    IPracticeTest,
    PracticeQuestionType,
} from "../interfaces/IData.js";
import { UserError } from "../exception/Error.js";

class TestService {
    async updateUserAnswer(questionId: any, userAnswer: any) {
        questionId = new mongoose.Types.ObjectId(questionId);
        const question = await PracticeQuestion.findById(questionId);

        if (!question) {
            throw new UserError("Not found this question");
        }

        switch (question.type) {
            case PracticeQuestionType.MULTICHOICE: {
                if (
                    typeof userAnswer != "number" ||
                    userAnswer < 0 ||
                    userAnswer >= (question as any).answers?.length
                ) {
                    throw new UserError("Invalid userAnswer");
                }
            }
            case PracticeQuestionType.TRANSLATE:
                if (typeof userAnswer != "string") {
                    throw new UserError("Invalid userAnswer");
                }
            case PracticeQuestionType.FILLWORD:
                if (typeof userAnswer != "string") {
                    throw new UserError("Invalid userAnswer");
                }
        }

        return await question.updateOne({
            user_answer: userAnswer,
        });
    }
}

export default new TestService();
