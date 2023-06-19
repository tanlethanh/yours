import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { UserError } from './error';

export function controllerErrorHanlder(controllerFunc: Function) {
	return async function (req: Request, res: Response, next: Function) {
		try {
			await controllerFunc(req, res, next);
		} catch (error: unknown) {
			if (!(error instanceof UserError) || error.name === 'MongoError')
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
export function notFoundHandler(req: Request, res: Response) {
	return res.status(StatusCodes.NOT_FOUND).json({
		message: 'Not found: ' + req.baseUrl,
	});
}

/**
 * Show undermaintenance page incase of errors
 */
export function internalErrorHandler(
	_err: Error,
	_req: Request,
	res: Response,
) {
	console.log('Server error');
	res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
		message: 'Something went wrong with our server',
	});
}
