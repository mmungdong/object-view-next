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
  // 优化服务器组件外部包
  experimental: {
    serverComponentsExternalPackages: [
      // 将 ali-oss 标记为外部包以避免将其打包进 handler
      'ali-oss',
    ],
  },
};

export default nextConfig;