/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['bk-prod-external.bankkaro.com'],
  },
}

module.exports = nextConfig 