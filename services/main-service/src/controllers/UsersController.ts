import { User } from '@yours/backend/models';
import { IUser } from '@yours/interfaces';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import UserService from '../services/UserService';

class UsersController {
	public static async isUserConnectToNotion(
		req: Request & { user: IUser },
		res: Response,
	) {
		const user = await User.findById(req.user._id, {
			notion_data: 1,
		});

		if (user?.notion_data?.access_token) {
			return res.status(StatusCodes.OK).json({
				is_connected: true,
			});
		} else {
			return res.status(StatusCodes.OK).json({
				is_connected: false,
			});
		}
	}

	public static async updateUser(
		req: Request & { user: IUser },
		res: Response,
	) {
		await UserService.updateUser(req.body);

		return res.status(StatusCodes.OK).json({
			message: 'success',
		});
	}
}

export default UsersController;
