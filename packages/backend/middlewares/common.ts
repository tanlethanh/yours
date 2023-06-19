import bodyParser from 'body-parser';
import cors from 'cors';
import { Express } from 'express';
import morgan from 'morgan';

import { config } from '../helpers/config';

export function mountCommonMiddleWares(app: Express) {
	app.use(morgan('tiny'));

	const options: cors.CorsOptions = {
		origin: '*',
		optionsSuccessStatus: 200, // Some legacy browsers choke on 204
	};

	app.use(cors(options));

	app.use(
		bodyParser.json({
			limit: config().MAX_UPLOAD_LIMIT,
		}),
	);

	app.disable('x-powered-by');
}
