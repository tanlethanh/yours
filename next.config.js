/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/api/:slug*',
                destination: 'http://localhost:4040/:slug*',
            },
        ]
    },
}
