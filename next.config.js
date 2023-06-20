/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    api: 'http://localhost:4000',
    refreshURLs: "/git", // comma-seperated
  },
}

module.exports = nextConfig
