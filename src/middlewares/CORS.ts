import cors from 'cors';
import { Application } from 'express';

import Log from '../helpers/Log';
import Locals from '../providers/Locals';

class CORS {
	public static mount(_express: Application) {
		Log.info('Booting the \'CORS\' middleware...');

		const options : cors.CorsOptions = {
			origin: Locals.config().url,
			optionsSuccessStatus: 200		// Some legacy browsers choke on 204
		};

		_express.use(cors(options));
	}
}

export default CORS;
