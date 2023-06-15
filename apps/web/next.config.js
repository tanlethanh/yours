require('dotenv').config({ path: '../../.env' });

let API = 'http://localhost:4040';
if (process.env.NODE_ENV == 'production') API = process.env.MAIN_SERVICE_API;

/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: false,
	transpilePackages: ['@yours/configs', '@yours/utils'],
	async rewrites() {
		return [
			{
				source: '/api/:slug*',
				destination: `${API}/api/:slug*`,
			},
		];
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				port: '',
				pathname: '/**',
			},
		],
	},
	experimental: {
		appDir: true,
	},
};
