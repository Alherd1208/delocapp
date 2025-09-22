/** @type {import('next').NextConfig} */
const nextConfig = {
    // Removed 'output: export' to enable API routes for MongoDB integration
    // API routes require server-side rendering capabilities
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    images: {
        unoptimized: true
    }
}

module.exports = nextConfig
