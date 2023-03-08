import { Application } from 'express';

import CORS from './CORS';
import Http from './Http'
import Statics from './Statics';
import StatusMonitor from '../helpers/StatusMonitor';

import Locals from '../providers/Locals';

class MoutMiddlewares {
	public static mountMidlewares (_express: Application) {
		// Check if CORS is enabled
		if (Locals.config().isCORSEnabled) {
			// Mount CORS middleware
			CORS.mount(_express);
		}

		// Mount basic express apis middleware
		Http.mount(_express)

		// Mount statics middleware
		Statics.mount(_express);

		// Mount status monitor middlewar
		StatusMonitor.mount(_express);
	}
}

export default MoutMiddlewares;