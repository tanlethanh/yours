import { IUser } from '@yours/interfaces';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import NotionProcessingService from '../services/NotionProcessingService';

class NotionController {
	// Hello world

	public static syncDataByUserId = async (
		req: Request & { user: IUser },
		res: Response,
		next: Function,
	) => {
		const userId = req.user._id;
		let result = null;
		result = await NotionProcessingService.syncDataByUserId(userId as any);

		if (!result) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Something wrong',
			});
		} else {
			return res.status(StatusCodes.ACCEPTED).json({
				data: result,
			});
		}
	};

	public static postAuthCode = async (
		req: Request & { user: IUser },
		res: Response,
		next: Function,
	) => {
		const { code } = req.query;

		if (!code) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Require code as a param',
			});
		}

		const userId = req.user.id;

		const result =
			await NotionProcessingService.getAndSaveAccessTokenFromNotion(
				userId,
				code as string,
			);

		if (!result) {
			return res.status(StatusCodes.BAD_REQUEST).json({
				message: 'Something wrong',
			});
		} else {
			return res.status(StatusCodes.ACCEPTED).json({
				data: result,
			});
		}
	};
}

export default NotionController;
