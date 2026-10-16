import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // رفع صور الأخبار من لوحة الإدارة (حتى 5MB)
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
  // Separate preview output from production builds running in the same checkout.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // A prepared output tree avoids concurrent mkdir failures in restricted Windows hosts.
  cleanDistDir: process.env.NEXT_PREPARED_OUTPUT !== "1",
};

export default nextConfig;
