/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false, // 🔴 THIS FIXES lab() ERROR
  },
};

module.exports = nextConfig;
