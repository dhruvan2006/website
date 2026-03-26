/** @type {import('next').NextConfig} */
const nextConfig = {
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
                hostname: '*.googleusercontent.com',
                pathname: '**',
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