import { Application, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import apiV1 from './api/v1';

export function mountRoute(app: Application) {
	console.log('Mount API route');

	app.get('/', (_req: Request, res: Response) => {
		return res.status(StatusCodes.OK).json({
			message: 'Hello world',
		});
	});

	mountRouteV1(app);
}

function mountRouteV1(app: Application) {
	app.use('/api/v1', apiV1);
}
