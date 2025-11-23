export interface StorageConfig {
  id: string;
  name: string;
  type: 'oss'; // 只支持OSS类型
  accessType: 'private' | 'public'; // private 需要 AK/SK，public 公有读
  accessKey: string;
  secretKey: string;
  bucket: string;
  region: string;
}

export interface FileInfo {
  key: string;
  name: string;
  size: number;
  lastModified: Date;
  isFolder: boolean;
  url?: string;
}

export interface FolderInfo {
  name: string;
  path: string;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface StorageService {
  listFiles(prefix: string): Promise<FileInfo[]>;
  getFileUrl(key: string): string;
}