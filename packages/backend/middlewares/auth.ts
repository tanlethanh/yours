import { config, UserError } from '@yours/backend';
import { User } from '@yours/backend/models';
import { mongoDB } from '@yours/backend/providers';
import { IUser, UserRole } from '@yours/interfaces/IData';
import { Request, Response } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { StatusCodes } from 'http-status-codes';

export async function userFilter(req: Request, res: Response, next: Function) {
	try {
		let user;

		if (
			// For dev mode
			config().USE_DEFAULT_USER &&
			config().NODE_ENV == 'development'
		) {
			user = mongoDB.defaultUser;
		} else {
			// For production
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
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(req as any).user = user;

		return next();
	} catch (error) {
		if (!(error instanceof UserError)) next(error);
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
