# Object View Next Project

This project is a modern React application built with Next.js App Router, TypeScript, Tailwind CSS, and ESLint. It includes an Alibaba Cloud OSS Object Storage Online Preview Tool.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: ShadCN UI
- **Code Quality**: ESLint

## Project Structure

```
object-view-next/
├── app/                      # 核心路由目录（App Router 核心）
│   ├── layout.tsx            # 根布局（全局共享：导航栏、页脚、全局样式）
│   ├── page.tsx              # 首页（对应 / 路由）
│   ├── error.tsx             # 全局错误边界（捕获整个应用的错误）
│   ├── loading.tsx           # 全局加载状态（首页或全局通用加载）
│   ├── not-found.tsx         # 404 页面（全局未找到路由时触发）
│   ├── globals.css           # 全局样式（必须在根布局导入）
├── components/               # 通用组件库（按功能分类）
│   ├── ui/                   # 基础 UI 组件（原子组件，可复用）
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Navbar.tsx
│   ├── layout/               # 布局组件（非路由布局，如页脚、侧边栏）
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   └── auth/                 # 业务组件：auth 相关
│       ├── LoginForm.tsx
│       └── RegisterForm.tsx
├── lib/                      # 工具库/配置/服务（通用逻辑）
│   ├── utils/                # 工具函数（格式化、验证等）
│   │   ├── formatDate.ts
│   │   └── validateForm.ts
│   ├── api/                  # API 客户端（前端请求封装）
│   │   ├── client.ts         # Axios/ fetch 实例配置
│   │   └── users.ts          # 用户相关请求函数
│   ├── db/                   # 数据库相关（如 Prisma 配置）
│   │   └── prisma.ts         # Prisma Client 实例
│   └── config/               # 全局配置（环境变量、常量等）
│       └── index.ts
├── hooks/                    # 自定义 React Hooks（复用状态逻辑）
│   ├── useAuth.ts            # 登录状态 Hook
│   ├── useForm.ts            # 表单处理 Hook
│   └── useFetch.ts           # 数据请求 Hook
├── types/                    # TypeScript 类型定义（全局共享接口）
│   ├── user.ts               # 用户相关类型
│   ├── blog.ts               # 博客相关类型
│   └── common.ts             # 通用类型（如响应格式）
├── public/                   # 静态资源（无需导入，直接通过 / 访问）
│   ├── favicon.ico
│   ├── images/               # 图片资源
│   │   └── logo.png
│   └── fonts/                # 字体资源
├── prisma/                   # （可选）ORM 配置（Prisma）
│   ├── schema.prisma         # 数据库模型定义
│   └── migrations/           # 数据库迁移文件
├── store/                    # （可选）状态管理（如 Zustand/Redux）
│   └── authStore.ts          # 登录状态全局管理
├── middleware.ts             # （可选）Next.js 中间件（路由守卫、重定向）
├── next.config.js            # Next.js 配置（如端口、插件、环境变量）
├── tailwind.config.js        # （可选）Tailwind CSS 配置
├── postcss.config.js         # （可选）PostCSS 配置（配合 Tailwind）
├── tsconfig.json             # TypeScript 配置
├── package.json
└── README.md

## Alibaba Cloud OSS Online Preview Tool

### Features

1. **Storage Bucket Configuration Management**
   - Configuration form with AccessKey, SecretKey, Bucket name, and Region
   - Support for both private and public read buckets
   - Local persistence of configuration information (localStorage)

2. **Folder Navigation**
   - Load and display bucket root directory and subfolder structure
   - Navigate into subfolders and return to parent folders
   - Breadcrumb navigation showing current path

3. **File Listing and Preview**
   - Display file information: name, size (formatted display), last modified time
   - Instant preview for photos: common formats (JPG/PNG/GIF/WebP) show thumbnails
   - Default icons + filename for non-image files (documents, videos, etc.)

4. **User Experience**
   - Loading state indicators during folder switching and file loading
   - Error handling for configuration errors, request failures, and permission issues
   - Layout switching between grid and list views

### Components

- `ConfigManager`: Handles storage configuration management
- `FileBrowser`: Main file browser interface
- `Breadcrumb`: Navigation breadcrumb component
- `FileList`: Displays files in grid or list layout
- `FileItem`: Individual file/folder item component

### Services

- `storageService.ts`: Storage service implementation for OSS with real API calls
- `formatters.ts`: Utility functions for formatting file sizes and dates

### Access Types

The tool supports two types of storage buckets:

1. **Private Buckets**: Require AccessKey and SecretKey for authentication
2. **Public Read Buckets**: Can be accessed without authentication credentials

### Real API Implementation

The storage service uses real APIs for Alibaba Cloud OSS:

- **Alibaba Cloud OSS Service**: Uses `ali-oss` for real API calls

The service implements the `StorageService` interface with:
- `listFiles(prefix: string)`: List files in a directory using real API calls
- `getFileUrl(key: string)`: Generate URL for file access using real API calls

## Setup Instructions

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

Build the project:
```bash
npm run build
```

Start the production server:
```bash
npm run start
```

Lint the code:
```bash
npm run lint
```

## Configuration Files

### Tailwind CSS

- `tailwind.config.js`: Main configuration file for Tailwind CSS with ShadCN UI color palette
- `postcss.config.js`: PostCSS configuration with Tailwind and Autoprefixer plugins

**Note**: This project uses Tailwind CSS v4, which requires `@tailwindcss/postcss` as a PostCSS plugin. The configuration is different from previous versions of Tailwind CSS.

### ESLint

- `eslint.config.js`: ESLint configuration with TypeScript and React support

### Next.js

- `next.config.ts`: Next.js build tool configuration

### ShadCN UI

ShadCN UI has been integrated into the project with the following structure:
- `components/ui/`: Directory for ShadCN UI components
- `lib/utils.ts`: Utility functions for styling with `cn` helper
- CSS variables in `app/globals.css` for consistent theming

## Scripts

- `dev`: Start development server
- `build`: Build for production
- `start`: Start production server
- `lint`: Run ESLint

## Cloudflare Pages Deployment

This project is configured exclusively for deployment to Cloudflare Pages as a static site. All Cloudflare Workers configurations have been removed to avoid redundancy and ensure a clean deployment process.

### Key Configuration for Cloudflare Pages

1. **Static Export**: The project uses `output: 'export'` in `next.config.ts` to generate static HTML files
2. **Client-side Only**: All functionality runs in the browser with no server-side dependencies
3. **Entrypoint**: Main entry file is `out/index.html` which is automatically recognized by Cloudflare Pages
4. **Size Optimized**: Static build is approximately 2.9MB, well within Cloudflare Pages limits
5. **No Server Functions**: Removed all API routes and server-side logic since Cloudflare Pages only serves static files

### Removed Cloudflare Workers Configurations

To ensure a clean deployment process and avoid confusion, the following Cloudflare Workers configurations have been removed:
- Removed `@opennextjs/cloudflare` dependency
- Removed `wrangler` dependency
- Removed `open-next.config.js` configuration file
- Removed Cloudflare Workers specific npm scripts (`preview`, `deploy`, `cf-typegen`)

### Deployment Instructions

1. **Build the project**:
   ```bash
   npm run build
   ```
   This generates static files in the `out/` directory.

2. **Deploy to Cloudflare Pages**:
   - Connect your Git repository to Cloudflare Pages
   - Set the build command to: `npm run build`
   - Set the build output directory to: `out`
   - Deploy!

### Important Notes

- The static site size is approximately 2.9MB, well within Cloudflare Pages limits
- OSS credentials are now handled client-side, so ensure proper access permissions
- For private buckets, consider using temporary access keys with limited permissions
- This project no longer supports Cloudflare Workers deployment to avoid redundancy

## Key Features

- TypeScript for type safety
- Tailwind CSS v4 for styling
- ShadCN UI for accessible and customizable components
- ESLint for code quality
- Next.js 15 App Router for modern React development
- Real API integration with Alibaba Cloud OSS

## Development Guidelines

To ensure code quality and successful deployment, always follow these guidelines:

### Code Quality Checks

Before committing any changes, always verify that:

1. **Build Success**: Ensure the project builds without errors
   ```bash
   npm run build
   ```

2. **TypeScript Validation**: Check for TypeScript errors
   ```bash
   npx tsc --noEmit
   ```

3. **ESLint Compliance**: Run linting to catch code style issues
   ```bash
   npm run lint
   ```

4. **No Runtime Errors**: Test the application in development mode
   ```bash
   npm run dev
   ```

### Cloudflare Pages Deployment

This project is specifically configured for deployment to **Cloudflare Pages** as a static site. Key deployment characteristics:

- **Static Export**: The project uses `output: 'export'` in `next.config.ts` to generate static HTML files
- **Client-side Only**: All functionality runs in the browser with no server-side dependencies
- **Entrypoint**: Main entry file is `out/index.html`
- **Size Optimized**: Static build is approximately 2.9MB, well within Cloudflare Pages limits
- **No Server Functions**: Removed all API routes since Cloudflare Pages only serves static files

### Deployment Verification

After making changes, always verify:

1. **Static Build Success**:
   ```bash
   npm run build
   ```

2. **Output Directory**: Confirm `out/` directory is generated with `index.html` as entrypoint

3. **No TypeScript Errors**:
   ```bash
   npx tsc --noEmit
   ```

4. **ESLint Compliance**:
   ```bash
   npm run lint
   ```

Following these guidelines ensures the project remains deployable to Cloudflare Pages and maintains high code quality standards.

## Author

Generated with [Claude Code](https://claude.com/claude-code)

Co-authored-by: Claude <noreply@anthropic.com>