// next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["www.shutterstock.com"],
  },

  // THIS LINE FIXES THE LUCIDE-REACT ERROR FOREVER
  transpilePackages: ["lucide-react"],

  // Optional: Extra safety (not always needed, but harmless)
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

export default nextConfig;