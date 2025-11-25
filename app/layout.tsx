import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import '../components/ui/button'; // 确保导入按钮组件的样式

// 使用 Inter 作为主要字体，它对中英文都有良好的支持
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// 使用 Geist Mono 作为等宽字体
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "阿里云 OSS 在线预览工具",
  description: "一个用于在线预览阿里云 OSS 存储桶中文件的工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased min-h-screen bg-neutral-50 text-neutral-800 font-sans`}
      >
        <div className="flex flex-col min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}