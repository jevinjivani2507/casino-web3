/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["res.cloudinary.com", "api.giphy.com", "metro.co.uk"],
  },
}

module.exports = nextConfig;