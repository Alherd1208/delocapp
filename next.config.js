/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    distDir: 'dist',
    basePath: '/delocapp',
    assetPrefix: '/delocapp',
    images: {
        unoptimized: true
    }
}

module.exports = nextConfig
