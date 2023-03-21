import { Request, Response } from "express";
import { IUser } from "../interfaces/IData.js";
import { StatusCodes } from "http-status-codes";
import TestGenerationService from "../services/TestGenerationService.js";
import { TestGenerationStrategies } from "../interfaces/IData.js";

class TestsController {
    public static async getNewTest(
        req: Request & { user: IUser },
        res: Response
    ) {
        if (!req.user) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Need user infor to get test",
            });
        }

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

        try {
            // Get test from service
            const test = await TestGenerationService.generateTest(
                req.user,
                strategy as any
            );

            return res.status(StatusCodes.OK).json({
                test: test,
                strategy: strategy,
            });
        } catch (error: any) {
            // console.log(error);
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: error.message,
            });
        }
    }
}

export default TestsController;
