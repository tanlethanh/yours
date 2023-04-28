/** @type {import('next').NextConfig} */
module.exports = {
	reactStrictMode: false,
	transpilePackages: ['@yours/configs', '@yours/utils'],
	async rewrites() {
		return [
			{
				source: '/api/:slug*',
				destination: 'http://localhost:4040/api/:slug*',
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
