# Object View Next

这是一个基于 Next.js App Router 的阿里云 OSS 在线预览工具。

## 项目结构 

```
object-view-next/
├── app/                      # 核心路由目录（App Router 核心）
│   ├── layout.tsx            # 根布局（全局共享：导航栏、页脚、全局样式）
│   ├── page.tsx              # 首页（对应 / 路由）
│   ├── error.tsx             # 全局错误边界（捕获整个应用的错误）
│   ├── loading.tsx           # 全局加载状态（首页或全局通用加载）
│   ├── not-found.tsx         # 404 页面（全局未找到路由时触发）
│   └── globals.css           # 全局样式（必须在根布局导入）
├── components/               # 通用组件库
│   ├── ui/                   # 基础 UI 组件（ShadCN UI 组件）
│   └── *.tsx                 # 业务组件
├── lib/                      # 工具库
│   └── utils.ts              # 工具函数
├── services/                 # 服务层
│   └── storageService.ts     # 存储服务实现
├── types/                    # TypeScript 类型定义
│   └── storage.ts            # 存储相关类型定义
├── utils/                    # 工具函数
│   ├── formatters.ts         # 格式化工具函数
│   └── fileUtils.ts          # 文件工具函数
├── public/                   # 静态资源
└── next.config.ts            # Next.js 配置文件
```

## 功能特性

1. **存储桶配置管理**：支持配置阿里云 OSS 存储桶的 AccessKey、SecretKey、Bucket 名称和区域
2. **文件浏览**：支持浏览存储桶中的文件和文件夹
3. **文件预览**：支持图片、文本文件和 PDF 文件的在线预览
4. **多布局展示**：支持网格和列表两种布局方式
5. **响应式设计**：适配不同屏幕尺寸的设备

## 技术栈

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- ShadCN UI
- 阿里云 OSS SDK

## 安装和运行

```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

## 使用说明

1. 首次使用需要配置存储桶信息：
   - 存储类型：目前仅支持阿里云 OSS
   - 访问类型：私有（需要 AK/SK）或公有读
   - 存储桶名称和区域
   - 如果是私有存储桶，需要填写 AccessKey 和 SecretKey

2. 配置完成后即可浏览和预览存储桶中的文件

## 注意事项

1. 对于私有存储桶，需要确保 AccessKey 和 SecretKey 有相应的权限
2. 对于公有读存储桶，需要在阿里云 OSS 控制台配置相应的 CORS 规则
3. 图片预览支持常见的图片格式：JPG/PNG/GIF/WebP 等