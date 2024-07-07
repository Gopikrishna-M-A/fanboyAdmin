/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  images: {
    domains: ['ecomm-project-bucket.s3.amazonaws.com'],
  },
};

module.exports = nextConfig;
