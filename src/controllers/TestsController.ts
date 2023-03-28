import { Request, Response } from "express";
import { IUser } from "../interfaces/IData.js";
import { StatusCodes } from "http-status-codes";
import TestGenerationService from "../services/TestGenerationService.js";
import { TestGenerationStrategies } from "../interfaces/IData.js";
import TestService from "../services/TestService.js";
import { UserError } from "../exception/Error.js";
import { PracticeQuestion, PracticeTest } from "../models/TestModels.js";
import { Types } from "mongoose";
import NotionProcessingService from "../services/NotionProcessingService.js";

enum Action {
    UPDATE_ANSWER = "UPDATE-ANSWER",
    UPDATE_SOMETHING = "UPDATE-SOMETHING",
}

class TestsController {
    public static async getTestById(
        req: Request & { user: IUser },
        res: Response,
        next: Function
    ) {
        let testId
        try {
            testId = new Types.ObjectId(req.params.testId)
        }
        catch (error) {
            throw new UserError("Invalid testId")
        }
        const withQuestions = req.query["with-questions"] == "true";

        let test = undefined;
        if (withQuestions) {
            test = await PracticeTest.findById(testId).populate("questions");
        } else {
            test = await PracticeTest.findById(testId);
        }

        return res.status(StatusCodes.OK).json({
            test: test,
        });
    }

    public static async deleteTestById(
        req: Request & { user: IUser },
        res: Response,
        next: Function
    ) {
        let testId
        try {
            testId = new Types.ObjectId(req.params.testId)
        }
        catch (error) {
            throw new UserError("Invalid testId")
        }

        const test = await PracticeTest.findOneAndDelete({
            _id: testId,
        });

        if (!test) {
            throw new UserError("Cannot delete, not found this test");
        }

        await PracticeQuestion.deleteMany({
            _id: {
                $in: test.questions,
            },
        });

        return res.status(StatusCodes.ACCEPTED).json({
            test: test,
        });
    }

    public static async getNewTest(
        req: Request & { user: IUser },
        res: Response,
        next: Function
    ) {
        if (!req.user) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Need user infor to get test",
            });
        }

        let userId = req.user._id;
        let result = null;
        result = await NotionProcessingService.syncDataByUserId(userId as any);

        let { strategy } = req.query;

        if (!strategy) {
            strategy = TestGenerationStrategies.DEFAULT;
        }

        // Check valid strategy
        if (
            Object.values(TestGenerationStrategies).indexOf(
                strategy as TestGenerationStrategies
            ) == -1
        ) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: `Strategy is invalid, require: ${Object.values(
                    TestGenerationStrategies
                )}`,
            });
        }

        // Get test from service
        const test = await TestGenerationService.generateTest(
            req.user,
            strategy as any
        );

        // console.log(test);

        return res.status(StatusCodes.OK).json({
            test: test,
            strategy: strategy,
        });
    }

    public static async getQuestionById(
        req: Request & { user: IUser },
        res: Response,
        next: Function
    ) {
        try {
            const questionId = new Types.ObjectId(
                req.params.questionId as string
            );
            return res.status(StatusCodes.OK).json({
                question: await PracticeQuestion.findById(questionId),
            });
        } catch (error) {
            throw new UserError("Invalid questionID");
        }
    }

    public static async updateQuestion(
        req: Request & { user: IUser },
        res: Response,
        next: Function
    ) {
        const { questionId } = req.params;

        const action = (
            (req.query.action as String) || ""
        ).toUpperCase() as Action;

        if (Object.values(Action).indexOf(action) == -1) {
            throw new UserError(
                `Invalid action: [${action}], require: ${Object.values(Action)}`
            );
        }

        let result;

        switch (action) {
            case Action.UPDATE_ANSWER: {
                const userAnswer = req.body.userAnswer;
                if (!userAnswer) {
                    throw new UserError(
                        `Require userAnswer in body with ${action}`
                    );
                }
                result = await TestService.updateUserAnswer(
                    questionId,
                    userAnswer
                );
            }
        }

        return res.status(StatusCodes.ACCEPTED).json({
            result,
        });
    }
}

export default TestsController;
