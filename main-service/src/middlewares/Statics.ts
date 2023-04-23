import * as path from 'path';
import express, { Application } from 'express';

import Log from '../helpers/Log.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

class Statics {
	public static mount(_express: Application) {
		Log.info('Booting the \'Statics\' middleiware...');

		// Loads Options
		const options = { maxAge: 31557600000 };

		// Load Statics
		_express.use('/public', express.static(path.join(__dirname, '../../public'), options));

		// Load NPM Statics
		_express.use('/vendor', express.static(path.join(__dirname, '../../node_modules'), options));
	}
}

export default Statics;
