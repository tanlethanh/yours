import { Application } from 'express';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config()
class Locals {
	/**
	 * Makes env configs available for your app
	 * throughout the app's runtime
	 */
	public static config(): any {
		dotenv.config({ path: path.join(__dirname, '../../.env') });
		const nodeEnv = process.env.NODE_ENV || "development"
		const url = process.env.APP_URL || `http://localhost:${process.env.PORT}`;
		const port = process.env.PORT || 4040;
		const maxUploadLimit = process.env.APP_MAX_UPLOAD_LIMIT || '50mb';
		const maxParameterLimit = process.env.APP_MAX_PARAMETER_LIMIT || '50mb';

		const name = process.env.APP_NAME || 'NodeTS Dashboard';
		const keywords = process.env.APP_KEYWORDS || 'somethings';
		const year = (new Date()).getFullYear();
		const copyright = `Copyright ${year} ${name} | All Rights Reserved`;

		const isCORSEnabled = process.env.CORS_ENABLED || true;
		const jwtExpiresIn = process.env.JWT_EXPIRES_IN || 3;
		const apiPrefix = process.env.API_PREFIX || 'api';

		const logDays = process.env.LOG_DAYS || 10;
		
		const automateDuration = process.env.AUTOMATE_DURATION
		const automateDurationInSeconds = Number(process.env.AUTOMATE_DURATION_IN_SECONDS)
		const unlockPercent = Number(process.env.UNLOCK_PERCENT)

		return {
			apiPrefix,
			copyright,
			isCORSEnabled,
			jwtExpiresIn,
			keywords,
			logDays,
			maxUploadLimit,
			maxParameterLimit,
			name,
			port,
			url,
			nodeEnv,
			automateDuration,
			automateDurationInSeconds,
			unlockPercent
		};
	}

	/**
	 * Injects your config to the app's locals
	 */
	public static mountEnvConfig (_express: Application): Application {
		_express.locals.app = this.config();
		return _express;
	}
}

export default Locals;