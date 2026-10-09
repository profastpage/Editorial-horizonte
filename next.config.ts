import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Vercel: no standalone, clean default output */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
};

export default nextConfig;