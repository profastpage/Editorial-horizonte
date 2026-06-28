import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sin output: "standalone" — Vercel maneja el build por defecto.
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
