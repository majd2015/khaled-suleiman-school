import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // رفع صور الأخبار من لوحة الإدارة (حتى 5MB)
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
};

export default nextConfig;
