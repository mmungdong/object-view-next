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
  // 关闭生产环境 source map 以减小打包体积
  productionBrowserSourceMaps: false,
  // 配置输出为静态导出
  output: 'export',
};

export default nextConfig;