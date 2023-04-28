import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { UserError } from './Error';
import { log } from './Log';

export class Handler {
	public static errorHandlerWrapper(controllerFunc: Function) {
		return async function (req: Request, res: Response, next: Function) {
			try {
				await controllerFunc(req, res, next);
			} catch (error: unknown) {
				if (
					!(error instanceof UserError) ||
					error.name === 'MongoError'
				)
					return next(error);

				return res.status(StatusCodes.BAD_REQUEST).json({
					message: error.message,
				});
			}
		};
	}

	/**
	 * Handles all the not found routes
	 */
	public static useNotFoundHandler(req: Request, res: Response) {
		return res.status(StatusCodes.NOT_FOUND).json({
			message: 'Not found: ' + req.baseUrl,
		});
	}

	/**
	 * Show undermaintenance page incase of errors
	 */
	public static errorHandler(err: Error, req: Request, res: Response) {
		log.error(`Server error - ${err.message}`);
		console.log('Server error');
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			message: 'Something went wrong with our server',
		});
	}
}
