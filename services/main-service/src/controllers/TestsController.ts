import { UserError } from '@yours/backend';
import { PracticeQuestion, PracticeTest } from '@yours/backend/models';
import { IUser, TestGenerationStrategies } from '@yours/interfaces';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';

import NotionProcessingService from '../services/NotionProcessingService';
import TestGenerationService from '../services/TestGenerationService';
import TestService from '../services/TestService';

enum Action {
	UPDATE_ANSWER = 'UPDATE-ANSWER',
	UPDATE_SOMETHING = 'UPDATE-SOMETHING',
}

class TestsController {
	public static async getTestById(
		req: Request & { user: IUser },
		res: Response,
	) {
		let testId;
		try {
			testId = new Types.ObjectId(req.params.testId);
		} catch (error) {
			throw new UserError('Invalid testId');
		}
		const withQuestions = req.query['with-questions'] == 'true';

		let test = undefined;
		if (withQuestions) {
			test = await PracticeTest.findById(testId).populate('questions');
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
	) {
		let testId;
		try {
			testId = new Types.ObjectId(req.params.testId);
		} catch (error) {
			throw new UserError('Invalid testId');
		}

		const test = await PracticeTest.findOneAndDelete({
			_id: testId,
		});

		if (!test) {
			throw new UserError('Cannot delete, not found this test');
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
	) {
		if (!req.user) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Need user infor to get test',
			});
		}

		const userId = req.user._id;
		await NotionProcessingService.syncDataByUserId(userId as never);

		let { strategy } = req.query;

		if (!strategy) {
			strategy = TestGenerationStrategies.DEFAULT;
		}

		// Check valid strategy
		if (
			Object.values(TestGenerationStrategies).indexOf(
				strategy as TestGenerationStrategies,
			) == -1
		) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: `Strategy is invalid, require: ${Object.values(
					TestGenerationStrategies,
				)}`,
			});
		}

		// Get test from service
		const test = await TestGenerationService.generateTest(
			req.user,
			strategy as TestGenerationStrategies,
		);

		return res.status(StatusCodes.OK).json({
			test: test,
			strategy: strategy,
		});
	}

	public static async getQuestionById(
		req: Request & { user: IUser },
		res: Response,
	) {
		try {
			const questionId = new Types.ObjectId(
				req.params.questionId as string,
			);
			return res.status(StatusCodes.OK).json({
				question: await PracticeQuestion.findById(questionId),
			});
		} catch (error) {
			throw new UserError('Invalid questionID');
		}
	}

	public static async updateQuestion(
		req: Request & { user: IUser },
		res: Response,
	) {
		const { questionId } = req.params;

		const action = (
			(req.query.action as string) || ''
		).toUpperCase() as Action;

		if (Object.values(Action).indexOf(action) == -1) {
			throw new UserError(
				`Invalid action: [${action}], require: ${Object.values(
					Action,
				)}`,
			);
		}

		let result;

		switch (action) {
			case Action.UPDATE_ANSWER: {
				const userAnswer = req.body.userAnswer;
				if (userAnswer == 'undefined') {
					throw new UserError(
						`Require userAnswer in body with ${action}`,
					);
				}
				result = await TestService.updateUserAnswer(
					questionId,
					userAnswer,
				);
			}
		}

		return res.status(StatusCodes.ACCEPTED).json({
			result,
		});
	}
}

export default TestsController;
