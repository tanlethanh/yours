import * as cors from 'cors';
import express, { Application } from 'express';
import bodyParser from 'body-parser';
// import cookieParser from('cookie-parser');
// import * as flash from 'express-flash';
// import * as compress from 'compression';
// import * as expressValidator from 'express-validator';

import Log from '../helpers/Log.js';
import Locals from '../providers/Locals.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);


class Http {
	public static mount(_express: Application) {
		Log.info('Booting the \'HTTP\' middleware...');

		// _express.use(cookieParser(process.env.JWT_SECRET));

		// Enables the request body parser
		_express.use(bodyParser.json({
			limit: Locals.config().MAX_UPLOAD_LIMIT
		}));
		_express.use(bodyParser.urlencoded({
			limit: Locals.config().maxUploadLimit,
			parameterLimit: Locals.config().maxParameterLimit,
			extended: false
		}));

		_express.use('/modules/simple-notify', express.static(path.join(__dirname, '../../node_modules/simple-notify')));

		// Disable the x-powered-by header in response
		_express.disable('x-powered-by');
	}
}

export default Http;
