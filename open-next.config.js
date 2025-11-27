/** @type {import('open-next').Config} */
const openNextConfig = {
  // 1. 启用函数拆分以减小单个 handler 文件大小
  functionSplitting: {
    enabled: true,
    splitBy: 'route',
  },
  // 2. 压缩产物
  compression: {
    enabled: true,
    formats: ['gzip'],
  },
  // 3. 优化边缘函数
  edge: {
    external: [
      // 排除不必要的依赖
      'ali-oss', // 将在下一步中优化
    ],
  },
  // 4. 优化默认函数
  default: {
    // 启用最小化
    minify: true,
    // 排除开发依赖
    exclude: [
      'eslint',
      'typescript',
      '@types/*',
    ],
  },
};

module.exports = openNextConfig;