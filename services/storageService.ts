import type { StorageConfig, FileInfo, StorageService } from '../types/storage';
import OSS from 'ali-oss';

// 阿里云 OSS 服务实现（直接在客户端）
export class OssStorageService implements StorageService {
  private config: StorageConfig;
  private client: OSS | null = null;

  constructor(config: StorageConfig) {
    this.config = config;
    this.initializeClient();
  }

  private initializeClient() {
    try {
      // 只有在浏览器环境中才初始化客户端
      if (typeof window !== 'undefined') {
        this.client = new OSS({
          region: this.config.region,
          accessKeyId: this.config.accessKey,
          accessKeySecret: this.config.secretKey,
          bucket: this.config.bucket,
        });
      }
    } catch (error) {
      console.error('Failed to initialize OSS client:', error);
    }
  }

  async listFiles(prefix: string): Promise<FileInfo[]> {
    if (!this.client) {
      throw new Error('OSS client not initialized');
    }

    try {
      // 列出文件
      const result = await this.client.list({
        prefix,
        delimiter: '/',
        'max-keys': 1000
      }, {});

      const files: FileInfo[] = [];

      // 处理文件夹
      if (result.prefixes) {
        for (const prefix of result.prefixes) {
          if (prefix !== '/') {
            files.push({
              key: prefix,
              name: prefix.split('/').filter(p => p !== '').pop() || '',
              isFolder: true,
              size: 0,
              lastModified: new Date()
            });
          }
        }
      }

      // 处理文件
      if (result.objects) {
        for (const obj of result.objects) {
          // 跳过当前目录本身
          if (obj.name === prefix) continue;

          // 检查是否为文件夹（以 / 结尾）
          const isFolder = obj.name.endsWith('/');
          const name = isFolder
            ? obj.name.split('/').filter(p => p !== '').pop() || ''
            : obj.name.split('/').pop() || obj.name;

          files.push({
            key: obj.name,
            name: name,
            isFolder: isFolder,
            size: obj.size || 0,
            lastModified: obj.lastModified ? new Date(obj.lastModified) : new Date()
          });
        }
      }

      return files;
    } catch (error) {
      console.error('Error listing files:', error);
      throw new Error(`获取文件列表失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  async getFileUrl(key: string): Promise<string> {
    if (!this.client) {
      throw new Error('OSS client not initialized');
    }

    try {
      // 对于公有读存储桶，直接返回公开 URL
      if (this.config.accessType === 'public') {
        return `https://${this.config.bucket}.${this.config.region}.aliyuncs.com/${key}`;
      }

      // 对于私有存储桶，生成签名 URL
      const url = this.client.signatureUrl(key, { expires: 3600 }); // 1小时过期
      return url;
    } catch (error) {
      console.error('Error generating file URL:', error);
      return '';
    }
  }
}

// 工厂函数，根据配置创建对应的服务实例
export function createStorageService(config: StorageConfig): StorageService {
  return new OssStorageService(config);
}