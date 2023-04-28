import { Application } from 'express';
import expressStatusMonitor from 'express-status-monitor';

import { config } from './config';
import { log } from './Log';

class StatusMonitor {
	public static mount(_express: Application) {
		log.info("Booting the 'StatusMonitor' middleware...");

		const api: string = config().apiPrefix;

		// Define your status monitor config
		const monitorOptions: object = {
			title: config().name,
			path: '/status-monitor',
			spans: [
				{
					interval: 1, // Every second
					retention: 60, // Keep 60 data-points in memory
				},
				{
					interval: 5,
					retention: 60,
				},
				{
					interval: 15,
					retention: 60,
				},
			],
			chartVisibility: {
				mem: true,
				rps: true,
				cpu: true,
				load: true,
				statusCodes: true,
				responseTime: true,
			},
			healthChecks: [
				{
					protocol: 'http',
					host: 'localhost',
					path: '/',
					port: '4040',
				},
				{
					protocol: 'http',
					host: 'localhost',
					path: `/${api}`,
					port: '4040',
				},
			],
		};

		// Loads the express status monitor middleware
		_express.use(expressStatusMonitor(monitorOptions));
	}
}

export { StatusMonitor };
