import { useState, useEffect, useCallback } from 'react';
import type { StorageConfig, FileInfo, BreadcrumbItem } from '../types/storage';
import { createStorageService } from '../services/storageService';
import FileList from './FileList';
import Breadcrumb from './Breadcrumb';
import { List, Grid3X3, AlertCircle } from 'lucide-react';

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

  const storageService = config ? createStorageService(config) : null;

  useEffect(() => {
    if (storageService) {
      const checkInitialization = async () => {
        try {
          if ((storageService as any).waitForInitialization) {
            await (storageService as any).waitForInitialization();
          }
          setStorageServiceReady(true);
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

  const getFileUrl = useCallback((key: string): string => {
    if (!config || !storageService) {
      return '';
    }

    try {
      const url = storageService.getFileUrl(key);
      return url;
    } catch (error) {
      console.error('Error generating URL for key:', key, 'Error:', error);
      return '';
    }
  }, [config, storageService]);

  const loadFiles = useCallback(async (prefix: string) => {
    if (!config) return;

    setLoading(true);
    setError(null);

    try {
      if (!storageService) {
        throw new Error('Storage service is not initialized');
      }

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('请求超时，请检查网络连接或配置信息')), 30000);
      });

      const fileInfos = await Promise.race([
        storageService.listFiles(prefix),
        timeoutPromise
      ]);

      setFiles(fileInfos);
    } catch (err) {
      let errorMessage = '加载文件列表失败';
      if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [config]);

  const enterFolder = (folderName: string) => {
    const cleanFolderName = folderName.endsWith('/') ? folderName.slice(0, -1) : folderName;
    const newPath = currentPath + cleanFolderName + '/';
    setCurrentPath(newPath);

    const newBreadcrumb = {
      name: cleanFolderName,
      path: newPath
    };
    setBreadcrumbs([...breadcrumbs, newBreadcrumb]);
  };

  const goBack = () => {
    if (breadcrumbs.length <= 1) return;

    const newBreadcrumbs = breadcrumbs.slice(0, -1);
    setBreadcrumbs(newBreadcrumbs);
    setCurrentPath(newBreadcrumbs[newBreadcrumbs.length - 1].path);
  };

  const navigateToPath = (path: string) => {
    setCurrentPath(path);

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

  const toggleLayout = () => {
    setLayout(layout === 'grid' ? 'list' : 'grid');
  };

  useEffect(() => {
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Breadcrumb
          items={breadcrumbs}
          onNavigate={navigateToPath}
          onGoBack={goBack}
          canGoBack={breadcrumbs.length > 1}
        />
        <button
          onClick={toggleLayout}
          className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
        >
          {layout === 'grid' ? (
            <>
              <List className="w-4 h-4" />
              列表视图
            </>
          ) : (
            <>
              <Grid3X3 className="w-4 h-4" />
              网格视图
            </>
          )}
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          <span className="ml-2 mt-3 text-muted-foreground">加载中...</span>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg mb-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium">错误</p>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={() => loadFiles(currentPath)}
                className="mt-3 bg-destructive hover:bg-destructive/90 text-destructive-foreground px-3 py-1.5 rounded text-sm transition-colors"
              >
                重新加载
              </button>
            </div>
          </div>
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
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          <span className="ml-2 mt-3 text-muted-foreground">初始化存储服务...</span>
        </div>
      )}
    </div>
  );
}