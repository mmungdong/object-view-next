import { useState, useEffect, useCallback } from 'react';
import type { StorageConfig, FileInfo, BreadcrumbItem } from '../types/storage';
import { createStorageService } from '../services/storageService';
import FileList from './FileList';
import Breadcrumb from './Breadcrumb';

interface FileBrowserProps {
  config: StorageConfig | null;
}

export default function FileBrowser({ config }: FileBrowserProps) {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [currentPath, setCurrentPath] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ name: '根目录', path: '' }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [storageServiceReady, setStorageServiceReady] = useState(false);

  // 创建存储服务实例
  const storageService = config ? createStorageService(config) : null;

  // 检查 storageService 是否已经初始化完成
  useEffect(() => {
    if (storageService) {
      // 检查初始化状态
      const checkInitialization = async () => {
        try {
          // 等待初始化完成
          if ((storageService as any).waitForInitialization) {
            await (storageService as any).waitForInitialization();
          }
          setStorageServiceReady(true);
          console.log('Storage service initialized successfully');
        } catch (error) {
          console.error('Failed to initialize storage service:', error);
          setError('存储服务初始化失败');
        }
      };

      checkInitialization();
    } else {
      setStorageServiceReady(false);
    }
  }, [storageService, config]);

  // 获取文件 URL 的函数
  const getFileUrl = useCallback((key: string): string => {
    if (!config || !storageService) {
      return '';
    }

    // 检查 storageService 是否已经初始化完成
    // 对于私有存储桶，我们需要确保 OSS 客户端已经创建
    try {
      const url = storageService.getFileUrl(key);
      console.log('Generated URL for key:', key, 'URL:', url);
      return url;
    } catch (error) {
      console.error('Error generating URL for key:', key, 'Error:', error);
      // 如果获取 URL 失败，返回一个默认的占位 URL 或空字符串
      return '';
    }
  }, [config, storageService]);

  // 加载文件列表
  const loadFiles = useCallback(async (prefix: string) => {
    if (!config) return;

    setLoading(true);
    setError(null);

    try {
      console.log('Attempting to load files with config:', config);
      if (!storageService) {
        console.error('Storage service is not initialized');
        throw new Error('Storage service is not initialized');
      }
      console.log('Using existing storage service, calling listFiles with prefix:', prefix);

      // 添加超时机制，防止请求挂起
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('请求超时，请检查网络连接或配置信息')), 30000);
      });

      const fileInfos = await Promise.race([
        storageService.listFiles(prefix),
        timeoutPromise
      ]);

      console.log('Files loaded successfully, count:', fileInfos.length);
      setFiles(fileInfos);
    } catch (err) {
      console.error('Failed to load files:', err);
      console.error('Config used:', config);
      console.error('Prefix used:', prefix);

      // 提取详细的错误信息
      let errorMessage = '加载文件列表失败';
      if (err instanceof Error) {
        errorMessage = err.message;
        console.error('Error name:', err.name);
        console.error('Error stack:', err.stack);
      }

      // 如果是对象，尝试提取更多信息
      if (typeof err === 'object' && err !== null) {
        console.error('Error keys:', Object.keys(err));
        const errorObj = err as Record<string, unknown>;
        if ('response' in errorObj) {
          console.error('Response:', errorObj.response);
        }
        if ('request' in errorObj) {
          console.error('Request:', errorObj.request);
        }
      }

      setError(errorMessage);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [config]);

  // 进入文件夹
  const enterFolder = (folderName: string) => {
    // Ensure folderName doesn't already end with a slash
    const cleanFolderName = folderName.endsWith('/') ? folderName.slice(0, -1) : folderName;
    const newPath = currentPath + cleanFolderName + '/';
    setCurrentPath(newPath);

    // 更新面包屑
    const newBreadcrumb = {
      name: cleanFolderName,
      path: newPath
    };
    setBreadcrumbs([...breadcrumbs, newBreadcrumb]);
  };

  // 返回上级文件夹
  const goBack = () => {
    if (breadcrumbs.length <= 1) return;

    const newBreadcrumbs = breadcrumbs.slice(0, -1);
    setBreadcrumbs(newBreadcrumbs);
    setCurrentPath(newBreadcrumbs[newBreadcrumbs.length - 1].path);
  };

  // 导航到指定路径
  const navigateToPath = (path: string) => {
    setCurrentPath(path);

    // 更新面包屑
    const pathParts = path.split('/').filter(part => part !== '');
    const newBreadcrumbs: BreadcrumbItem[] = [{ name: '根目录', path: '' }];

    let accumulatedPath = '';
    pathParts.forEach(part => {
      accumulatedPath += part + '/';
      newBreadcrumbs.push({
        name: part,
        path: accumulatedPath
      });
    });

    setBreadcrumbs(newBreadcrumbs);
  };

  // 切换布局
  const toggleLayout = () => {
    setLayout(layout === 'grid' ? 'list' : 'grid');
  };

  // 当配置或路径改变时重新加载文件
  useEffect(() => {
    // Add error boundary to prevent blank page
    try {
      loadFiles(currentPath);
    } catch (error) {
      console.error('Error in useEffect:', error);
      setError('页面加载出错，请刷新页面重试');
    }
  }, [currentPath, loadFiles]);

  if (!config) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">请先配置存储信息</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb
          items={breadcrumbs}
          onNavigate={navigateToPath}
          onGoBack={goBack}
          canGoBack={breadcrumbs.length > 1}
        />
        <button
          onClick={toggleLayout}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded transition-colors"
        >
          {layout === 'grid' ? '列表视图' : '网格视图'}
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">加载中...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p>错误: {error}</p>
          <button
            onClick={() => loadFiles(currentPath)}
            className="mt-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
          >
            重新加载
          </button>
        </div>
      )}

      {!loading && !error && storageServiceReady && (
        <FileList
          files={files}
          layout={layout}
          onEnterFolder={enterFolder}
          getFileUrl={getFileUrl}
        />
      )}

      {!loading && !error && !storageServiceReady && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">初始化存储服务...</span>
        </div>
      )}
    </div>
  );
}