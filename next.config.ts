import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverOptions: {
    hostname: '0.0.0.0',
    port: process.env.PORT || 3000
  },
  eslint: {
    // Warning: This allows build to succeed even with ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: Use cautiously - this ignores TypeScript errors
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
  env: {
    NODE_ENV: process.env.NODE_ENV || 'development'
  },

};

export default nextConfig;
