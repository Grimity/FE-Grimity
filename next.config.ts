import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

module.exports = {
  images: {
    domains: ["image.grimity.com", "d1qkekeyuugv87.cloudfront.net"],
  },
};

export default nextConfig;
