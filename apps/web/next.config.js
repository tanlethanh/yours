/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: false,
    transpilePackages: ['@sipo/configs', '@sipo/utils'],
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
        appDir: true
    }
};
