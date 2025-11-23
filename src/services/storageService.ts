import type { StorageConfig, FileInfo, StorageService } from '../types/storage';
import type OSS from 'ali-oss';

// 动态导入浏览器兼容的SDK
let OSSModule: typeof import('ali-oss') | null = null;
// 跟踪 SDK 是否正在加载
let sdkLoadingPromise: Promise<void> | null = null;

// 阿里云 OSS 服务实现
export class OssStorageService implements StorageService {
  private oss: OSS | null = null;
  private config: StorageConfig;
  // 跟踪当前实例的初始化Promise
  private initializationPromise: Promise<void> | null = null;

  constructor(config: StorageConfig) {
    this.config = config;

    // 如果 SDK 还没有开始加载，则开始加载
    if (!sdkLoadingPromise) {
      sdkLoadingPromise = import('ali-oss').then((module) => {
        OSSModule = module.default || module;
      }).catch((error) => {
        console.error('Failed to load OSS SDK:', error);
        // 重置加载状态，以便下次可以重新尝试
        sdkLoadingPromise = null;
        throw error;
      });
    }

    // 为当前实例创建初始化Promise
    this.initializationPromise = sdkLoadingPromise.then(() => {
      // 只有在有 AK/SK 的情况下才初始化认证客户端
      if (config.accessKey && config.secretKey) {
        if (OSSModule) {
          this.oss = new OSSModule({
            endpoint: "oss-cn-hangzhou.aliyuncs.com",
            region: "oss-" + config.region,
            accessKeyId: config.accessKey,
            accessKeySecret: config.secretKey,
            bucket: config.bucket,
            secure: true, // 强制使用 HTTPS
          });
          console.log('OSS client created successfully:', !!this.oss);
        } else {
          console.error('OSSModule not loaded');
        }
      } else {
        console.log('Missing AK/SK for private bucket, accessType:', config.accessType);
      }
    });
  }

  // 等待 SDK 加载和实例初始化完成
  private async waitForInitialization(): Promise<void> {
    if (this.initializationPromise) {
      await this.initializationPromise;
    }
  }

  async listFiles(prefix: string): Promise<FileInfo[]> {
    // 等待 SDK 加载和实例初始化完成
    await this.waitForInitialization();

    // 对于公有读存储桶，使用匿名访问
    if (this.config.accessType === 'public') {
      try {
        // 阿里云OSS支持匿名访问
        // 但在浏览器环境中，我们仍然需要初始化SDK
        if (!OSSModule) {
          throw new Error('OSS SDK not loaded');
        }

        // 创建匿名客户端（不需要 AK/SK）
        // 使用 endpoint 方式创建匿名访问客户端
        const anonymousOss = new OSSModule({
          endpoint: `https://${this.config.bucket}.oss-${this.config.region}.aliyuncs.com`,
          bucket: this.config.bucket,
          // 不提供 accessKeyId 和 accessKeySecret 以启用匿名访问
        } as unknown as OSS.Options);

        console.log('Attempting to list files with public access', {
          region: this.config.region,
          bucket: this.config.bucket,
          prefix: prefix
        });

        console.log('Making listObjects request with params:', {
          prefix: prefix,
          delimiter: '/',
          'max-keys': 1000,
          bucket: this.config.bucket,
          region: this.config.region,
          endpoint: `https://${this.config.bucket}.oss-${this.config.region}.aliyuncs.com`
        });

        const result = await anonymousOss.list({
          prefix: prefix,
          delimiter: '/',
          'max-keys': 1000
        }, {});

        console.log('ListObjects response received:', {
          hasPrefixes: !!result.prefixes,
          hasObjects: !!result.objects,
          isTruncated: result.isTruncated,
          prefixesCount: result.prefixes?.length || 0,
          objectsCount: result.objects?.length || 0
        });

        const files: FileInfo[] = [];

        // 处理文件夹
        if (result.prefixes) {
          result.prefixes.forEach((item: string) => {
            files.push({
              key: item,
              name: item.substring(prefix.length, item.length - 1),
              size: 0,
              lastModified: new Date(),
              isFolder: true
            });
          });
        }

        // 处理文件
        if (result.objects) {
          result.objects.forEach((item: { name: string; size: number; lastModified: string }) => {
            // 跳过当前文件夹本身
            if (item.name === prefix) return;

            files.push({
              key: item.name,
              name: item.name.substring(prefix.length),
              size: item.size,
              lastModified: new Date(item.lastModified),
              isFolder: false
            });
          });
        }

        return files;
      } catch (error) {
        console.error('OSS public listFiles error - Full error details:', {
          error: error,
          errorType: typeof error,
          errorKeys: typeof error === 'object' && error !== null ? Object.keys(error) : 'N/A',
          errorMessage: error instanceof Error ? error.message : 'N/A',
          errorStack: error instanceof Error ? error.stack : 'N/A'
        });

        // 检查是否是CORS错误
        let isCorsError = false;
        if (error instanceof Error) {
          // 检查常见的CORS错误消息
          const corsErrorMessages = [
            'CORS',
            'cors',
            'Network Error',
            'network error',
            'has been blocked by CORS policy',
            '跨域',
            'Access to fetch at'
          ];

          if (corsErrorMessages.some(msg => error.message.includes(msg))) {
            isCorsError = true;
          }
        }

        // 检查是否是权限错误
        let isForbidden = false;
        let errorDetails = '';

        // 检查错误对象是否有 status 属性
        if (typeof error === 'object' && error !== null) {
          // 直接检查 status
          const errorObj = error as Record<string, unknown>;
          if ('status' in errorObj && typeof errorObj.status === 'number') {
            console.log('Error status found:', errorObj.status);
            if (errorObj.status === 403) {
              isForbidden = true;
            }
            errorDetails += `Status: ${errorObj.status}. `;
          }
          // 检查 res.status
          else if ('res' in errorObj && typeof errorObj.res === 'object' && errorObj.res !== null) {
            const resObj = errorObj.res as Record<string, unknown>;
            console.log('Response object found:', resObj);
            if ('status' in resObj && typeof resObj.status === 'number') {
              console.log('Response status found:', resObj.status);
              if (resObj.status === 403) {
                isForbidden = true;
              }
              errorDetails += `Response Status: ${resObj.status}. `;
            }
          }

          // 打印更多错误详情
          if ('message' in errorObj) {
            errorDetails += `Message: ${errorObj.message}. `;
          }
          if ('code' in errorObj) {
            errorDetails += `Code: ${errorObj.code}. `;
          }
          if ('name' in errorObj) {
            errorDetails += `Name: ${errorObj.name}. `;
          }
        }

        console.error('Error details:', errorDetails);

        // 如果是CORS错误，提供更友好的错误消息
        if (isCorsError) {
          const corsErrorMessage = '跨域请求被阻止。请确保在阿里云 OSS 控制台中为存储桶配置了正确的 CORS 规则，允许来自当前域名的请求。';
          throw new Error(corsErrorMessage);
        }

        if (isForbidden) {
          const detailedMessage = `公有读存储桶未授权列出文件操作。请在阿里云 OSS 控制台中为存储桶配置 RAM 策略，允许匿名用户执行 listObjects 操作，或使用私有存储桶配置 AK/SK。错误详情: ${errorDetails}`;
          throw new Error(detailedMessage);
        }
        throw error;
      }
    }

    // 对于私有存储桶，需要 AK/SK 验证
    // 等待 SDK 加载完成后，再次检查 this.oss 是否已初始化
    console.log('Checking OSS client for private access, oss exists:', !!this.oss, 'config:', this.config);
    if (!this.oss) {
      // 检查配置中是否提供了 AK/SK
      if (!this.config.accessKey || !this.config.secretKey) {
        throw new Error('OSS 私有存储桶需要 AccessKey 和 SecretKey');
      }
      // 如果 AK/SK 已提供但 this.oss 仍未初始化，可能是初始化过程中出现了问题
      throw new Error('OSS SDK 初始化失败，请检查 AccessKey 和 SecretKey 是否正确');
    }

    console.log('Attempting to list files with private access', {
      region: this.config.region,
      bucket: this.config.bucket,
      prefix: prefix
    });

    try {
      const result = await this.oss.listV2({
        prefix: prefix,
        delimiter: '/',
        'max-keys': 1000
      }, {});

      const files: FileInfo[] = [];

      // 处理文件夹
      if (result.prefixes) {
        result.prefixes.forEach((item: string) => {
          files.push({
            key: item,
            name: item.substring(prefix.length, item.length - 1),
            size: 0,
            lastModified: new Date(),
            isFolder: true
          });
        });
      }

      // 处理文件
      if (result.objects) {
        result.objects.forEach((item: { name: string; size: number; lastModified: string }) => {
          // 跳过当前文件夹本身
          if (item.name === prefix) return;

          files.push({
            key: item.name,
            name: item.name.substring(prefix.length),
            size: item.size,
            lastModified: new Date(item.lastModified),
            isFolder: false
          });
        });
      }

      return files;
    } catch (error) {
      console.error('OSS private listFiles error - Full error details:', {
        error: error,
        errorType: typeof error,
        errorKeys: typeof error === 'object' && error !== null ? Object.keys(error) : 'N/A',
        errorMessage: error instanceof Error ? error.message : 'N/A',
        errorStack: error instanceof Error ? error.stack : 'N/A'
      });

      // 检查是否是CORS错误
      let isCorsError = false;
      if (error instanceof Error) {
        // 检查常见的CORS错误消息
        const corsErrorMessages = [
          'CORS',
          'cors',
          'Network Error',
          'network error',
          'has been blocked by CORS policy',
          '跨域',
          'Access to fetch at'
        ];

        if (corsErrorMessages.some(msg => error.message.includes(msg))) {
          isCorsError = true;
        }
      }

      // 检查错误详情
      let errorDetails = '';
      if (typeof error === 'object' && error !== null) {
        const errorObj = error as Record<string, unknown>;
        if ('message' in errorObj) {
          errorDetails += `Message: ${errorObj.message}. `;
        }
        if ('code' in errorObj) {
          errorDetails += `Code: ${errorObj.code}. `;
        }
        if ('status' in errorObj && typeof errorObj.status === 'number') {
          errorDetails += `Status: ${errorObj.status}. `;
        }
        if ('res' in errorObj && typeof errorObj.res === 'object' && errorObj.res !== null) {
          const resObj = errorObj.res as Record<string, unknown>;
          if ('status' in resObj && typeof resObj.status === 'number') {
            errorDetails += `Response Status: ${resObj.status}. `;
          }
        }
      }

      console.error('Private bucket error details:', errorDetails);

      // 如果是CORS错误，提供更友好的错误消息
      if (isCorsError) {
        const corsErrorMessage = '跨域请求被阻止。请确保在阿里云 OSS 控制台中为存储桶配置了正确的 CORS 规则，允许来自当前域名的请求。';
        throw new Error(corsErrorMessage);
      }

      throw error;
    }
  }

  getFileUrl(key: string): string {
    // 对于私有存储桶，需要生成带签名的 URL
    if (this.config.accessType === 'private') {
      if (!this.oss) {
        throw new Error('OSS 私有存储桶需要 AccessKey 和 SecretKey');
      }

      // 生成签名 URL，有效期 1 小时
      return this.oss.signatureUrl(key, { expires: 3600 });
    }

    // 对于公有读存储桶，优先尝试生成签名URL（如果有AK/SK的话）
    // 这样可以处理那些即使是公有存储桶也需要临时签名的情况
    if (this.oss) {
      try {
        // 生成签名 URL，有效期 1 小时
        return this.oss.signatureUrl(key, { expires: 3600 });
      } catch (error) {
        console.warn('Failed to generate signed URL, falling back to public URL:', error);
      }
    }

    // 回退到公开访问 URL
    return `https://${this.config.bucket}.oss-${this.config.region}.aliyuncs.com/${key}`;
  }
}

// 工厂函数，根据配置创建对应的服务实例
export function createStorageService(config: StorageConfig): StorageService {
  // 只支持OSS类型
  return new OssStorageService(config);
}