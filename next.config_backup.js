/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  staticPageGenerationTimeout: 320,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
}
