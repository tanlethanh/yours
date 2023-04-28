import { config } from '@yours/backend';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Express } from 'express';

export const mountCommonMiddleWares = (app: Express) => {
	const options: cors.CorsOptions = {
		origin: '*',
		optionsSuccessStatus: 200, // Some legacy browsers choke on 204
	};

	app.use(cors(options));

	// Enables the request body parser
	app.use(
		bodyParser.json({
			limit: config().MAX_UPLOAD_LIMIT,
		}),
	);

	// Disable the x-powered-by header in response
	app.disable('x-powered-by');
};
