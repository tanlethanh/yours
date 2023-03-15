/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/:slug*',
                destination: 'http://localhost:4040/:slug*',
            },
        ]
    },
}
