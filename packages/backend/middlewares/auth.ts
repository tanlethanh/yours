/* eslint-disable @typescript-eslint/no-explicit-any */
import { config, UserError } from '@yours/backend';
import { User } from '@yours/backend/models';
import * as mongoDB from '@yours/backend/providers/mongo';
import { IUser, UserRole } from '@yours/interfaces/IData';
import { Request, Response } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { StatusCodes } from 'http-status-codes';

export async function userFilter(req: Request, res: Response, next: Function) {
	try {
		let user;

		const authToken = req.headers.authorization || '';

		if (!new RegExp('Bearer .*').test(authToken)) {
			throw new UserError('Invalid auth token');
		}

		const idToken = authToken.split(' ')[1];

		const decodedToken = await getAuth().verifyIdToken(idToken);
		const uid = decodedToken.uid;

		user = await User.findOne({
			firebase_uid: uid,
		});

		if (!user) {
			const firebaseUser = await getAuth().getUser(uid);

			user = await User.create({
				email: firebaseUser.email,
				firebase_uid: uid,
				role: UserRole.USER,
			});
		}
		(req as any).user = user;

		return next();
	} catch (error) {
		if (config().USE_DEFAULT_USER && config().NODE_ENV == 'development') {
			return ((req as any).user = mongoDB.defaultUser);
		}
		if (!(error instanceof UserError)) return next(error);
		return res.status(StatusCodes.UNAUTHORIZED).json({
			message: (error as Error).message,
		});
	}
}

export async function adminFilter(
	req: Request & { user: IUser },
	res: Response,
	next: Function,
) {
	if (!req.user) {
		return res.status(StatusCodes.UNAUTHORIZED).json({
			message: 'Invalid user',
		});
	}

	if (req.user.role !== UserRole.ADMIN) {
		return res.status(StatusCodes.FORBIDDEN).json({
			message: 'This user is not admin',
		});
	}

	return next();
}
