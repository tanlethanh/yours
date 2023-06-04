/* eslint-disable @typescript-eslint/no-unused-vars */
import { SSTConfig } from 'sst';
import { Bucket, NextjsSite } from 'sst/constructs';

export default {
	config(_input) {
		return {
			name: 'web',
			region: 'us-east-1',
		};
	},
	stacks(app) {
		app.stack(function Site({ stack }) {
			const site = new NextjsSite(stack as never, 'site');

			stack.addOutputs({
				SiteUrl: site.url,
			});
		});
	},
} satisfies SSTConfig;
