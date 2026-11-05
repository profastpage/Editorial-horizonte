import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Vercel: no standalone, clean default output */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  devIndicators: false,
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
};

export default nextConfig;