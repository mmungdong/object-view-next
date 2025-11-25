import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 配置 Turbopack
  turbopack: {},
  // 其他配置选项
  reactStrictMode: true,
  // 图片优化在 Cloudflare Pages 上使用静态导出时需要配置
  images: {
    unoptimized: true,
  },
};

export default nextConfig;