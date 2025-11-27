# 部署到 Cloudflare Pages

本项目已经转换为静态站点，可以直接部署到 Cloudflare Pages。

## 构建输出说明

构建完成后，静态站点文件将生成在 `out/` 目录中，入口文件为 `out/index.html`。

## 部署步骤

1. **连接到 Cloudflare Pages**：
   - 登录 Cloudflare 控制台
   - 导航到 Pages 服务
   - 点击 "Create a project"

2. **配置构建设置**：
   - 选择您的 Git 仓库
   - 设置以下构建配置：
     - **Build command**: `npm run build`
     - **Build output directory**: `out`
     - **Root directory**: `/` (项目根目录)

3. **环境变量配置**（可选）：
   - 如果需要预设 OSS 配置，可以添加环境变量：
     - `NEXT_PUBLIC_OSS_BUCKET` - 存储桶名称
     - `NEXT_PUBLIC_OSS_REGION` - 区域
     - `NEXT_PUBLIC_OSS_ACCESS_KEY` - 访问密钥（注意安全性）
     - `NEXT_PUBLIC_OSS_SECRET_KEY` - 秘密密钥（注意安全性）

4. **部署**：
   - 点击 "Save and Deploy"
   - Cloudflare Pages 将自动构建并部署您的站点

## 重要说明

- 本项目现在是完全静态的，不依赖任何服务端功能
- OSS 访问凭证将存储在客户端，因此请确保使用适当的访问权限
- 对于私有存储桶，建议使用临时访问密钥并定期轮换
- 生成的静态站点大小约为 2.9MB，完全符合 Cloudflare Pages 的限制

## 本地测试

要本地测试构建结果，可以运行：

```bash
npm run build
npx serve out
```

然后访问 http://localhost:3000 查看站点。

入口文件为 `out/index.html`，Cloudflare Pages 会自动识别并使用该文件作为站点入口。