/* eslint-disable @typescript-eslint/no-unused-vars */
import { SSTConfig } from 'sst';
import { Bucket, NextjsSite } from 'sst/constructs';

export default {
	config(_input) {
		return {
			name: 'yours-web',
			region: 'ap-northeast-1',
		};
	},
	stacks(app) {
		app.stack(function Site({ stack }) {
			const bucket = new Bucket(stack, 'public');

			const site = new NextjsSite(stack as never, 'site', {
				path: 'apps/web',
				bind: [bucket],
			});

			stack.addOutputs({
				SiteUrl: site.url,
			});
		});
	},
} satisfies SSTConfig;
