import type { StorageConfig, FileInfo, StorageService } from '../types/storage';

// 阿里云 OSS 服务实现（通过 API 路由）
export class OssStorageService implements StorageService {
  private config: StorageConfig;

  constructor(config: StorageConfig) {
    this.config = config;
  }

  async listFiles(prefix: string): Promise<FileInfo[]> {
    try {
      // 构建 API 查询参数
      const params = new URLSearchParams({
        bucket: this.config.bucket,
        region: this.config.region,
        accessType: this.config.accessType,
        prefix: prefix,
      });

      // 如果是私有存储桶，添加认证信息
      if (this.config.accessType === 'private') {
        params.append('accessKey', this.config.accessKey);
        params.append('secretKey', this.config.secretKey);
      }

      // 调用 API 路由
      const response = await fetch(`/api/oss?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.files || [];
    } catch (error) {
      console.error('Error listing files:', error);
      throw new Error(`获取文件列表失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  async getFileUrl(key: string): Promise<string> {
    try {
      // 对于公有读存储桶，直接返回公开 URL
      if (this.config.accessType === 'public') {
        return `https://${this.config.bucket}.${this.config.region}.aliyuncs.com/${key}`;
      }

      // 对于私有存储桶，通过 API 获取签名 URL
      const response = await fetch('/api/oss/signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bucket: this.config.bucket,
          region: this.config.region,
          accessType: this.config.accessType,
          accessKey: this.config.accessKey,
          secretKey: this.config.secretKey,
          key: key,
          expires: 3600 // 1小时过期
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to get signature URL:', errorData.error);
        return '';
      }

      const data = await response.json();
      return data.url || '';
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