/* eslint-disable @typescript-eslint/no-unused-vars */
import { SSTConfig } from 'sst';
import { NextjsSite } from 'sst/constructs';

export default {
	config(_input) {
		return {
			name: 'yours-web',
			region: 'ap-northeast-1',
		};
	},
	stacks(app) {
		app.stack(function Site({ stack }) {
			const site = new NextjsSite(stack as never, 'site', {
				path: 'apps/web',
			});

			stack.addOutputs({
				SiteUrl: site.url,
			});
		});
	},
} satisfies SSTConfig;
