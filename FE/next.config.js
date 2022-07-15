/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    customKey: 'my-value',
    apiUrl: "http://nartsoftware.com/api"
  },
}

module.exports = nextConfig
