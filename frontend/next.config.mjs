/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8000/api/:path*',
                has: [
                    {
                        type: 'header',
                        key: 'x-rewrite-me',
                        value: '(?!auth).*'
                    }
                ]
            },
        ]
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'chainexposed.com',
            },
            {
                protocol: 'https',
                hostname: 'secure.gravatar.com',
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'scontent-ams4-1.xx.fbcdn.net',
            },
            {
                protocol: 'https',
                hostname: 'pbs.twimg.com'
            },
            {
                protocol: 'https',
                hostname: 'woocharts.com'
            },
            {
                protocol: 'https',
                hostname: 'assets.bitbo.io'
            },
        ],
    },
};

export default nextConfig;