/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    measure: false,
  },
  env: {
    api: 'localhost:4000',
  },
}

module.exports = nextConfig
