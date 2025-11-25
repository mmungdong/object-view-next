import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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

  const storageService = useMemo(() => config ? createStorageService(config) : null, [config]);

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
  }, [storageService]);

  const getFileUrl = useCallback(async (key: string): Promise<string> => {
    if (!config || !storageService) {
      return '';
    }

    try {
      const url = await storageService.getFileUrl(key);
      return url;
    } catch (error) {
      console.error('Error generating URL for key:', key, 'Error:', error);
      return '';
    }
  }, [config, storageService]);

  // 使用 useRef 来存储防抖定时器，避免在每次渲染时重新创建
// 使用 refs 存储需要在回调中访问的值
const configRef = useRef(config);
const storageServiceRef = useRef(storageService);
const loadFilesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

// 更新 refs 当依赖项变化时
useEffect(() => {
  configRef.current = config;
  storageServiceRef.current = storageService;
}, [config, storageService]);

// 使用 useCallback 创建稳定的 loadFiles 函数
const loadFiles = useCallback(async (prefix: string) => {
  const currentConfig = configRef.current;
  const currentStorageService = storageServiceRef.current;

  if (!currentConfig) return;

  // 清除之前的防抖定时器
  if (loadFilesTimeoutRef.current) {
    clearTimeout(loadFilesTimeoutRef.current);
  }

  // 设置新的防抖定时器
  loadFilesTimeoutRef.current = setTimeout(async () => {
    console.log('开始加载文件列表，路径:', prefix);
    setLoading(true);
    setError(null);

    try {
      if (!currentStorageService) {
        throw new Error('存储服务未初始化');
      }

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('请求超时，请检查网络连接或配置信息')), 30000);
      });

      const fileInfos = await Promise.race([
        currentStorageService.listFiles(prefix),
        timeoutPromise
      ]);

      console.log('文件列表加载成功，文件数量:', fileInfos.length);
      setFiles(fileInfos);
    } catch (err) {
      let errorMessage = '加载文件列表失败';
      if (err instanceof Error) {
        errorMessage = err.message;
      }

      console.error('加载文件列表失败:', errorMessage);
      setError(errorMessage);
      setFiles([]);
    } finally {
      console.log('设置加载状态为 false');
      setLoading(false);
    }
  }, 300); // 300ms防抖延迟
}, []);

  // 防抖重新加载函数，避免频繁点击导致的频闪
  const debouncedReload = useCallback(() => {
    const now = Date.now();
    const lastReload = (window as any)._lastReloadTime || 0;

    // 如果距离上次重新加载不足2秒，则忽略此次请求
    if (now - lastReload < 2000) {
      return;
    }

    (window as any)._lastReloadTime = now;
    loadFiles(currentPath);
  }, [currentPath, loadFiles]);

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
    let isMounted = true;

    const loadFilesAsync = async () => {
      try {
        // 直接调用带防抖的loadFiles函数
        await loadFiles(currentPath);
      } catch (error) {
        console.error('Error in useEffect:', error);
        if (isMounted) {
          setError('页面加载出错，请刷新页面重试');
        }
      }
    };

    loadFilesAsync();

    // 清理函数，标记组件已卸载
    return () => {
      isMounted = false;
      // 清除防抖定时器
      if (loadFilesTimeoutRef.current) {
        clearTimeout(loadFilesTimeoutRef.current);
      }
    };
  }, [currentPath]); // 移除了 loadFiles 依赖项

  // 当配置发生变化时，重置路径并重新加载
  useEffect(() => {
    if (config) {
      // 重置当前路径到根目录
      setCurrentPath('');
      setBreadcrumbs([{ name: '根目录', path: '' }]);
    }
  }, [config]);

  // 组件挂载时或配置变化时，如果已有配置则触发文件加载
  useEffect(() => {
    if (config && storageServiceReady) {
      // 使用防抖的loadFiles函数加载根目录文件
      loadFiles('');
    }
  }, [config, storageServiceReady]); // 移除了 loadFiles 依赖项以避免频繁触发

  if (!config) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">请先配置存储信息</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <Breadcrumb
            items={breadcrumbs}
            onNavigate={navigateToPath}
            onGoBack={goBack}
            canGoBack={breadcrumbs.length > 1}
          />
        </div>
        <button
          onClick={toggleLayout}
          className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground px-3 py-1.5 rounded-lg transition-colors text-sm font-medium w-full sm:w-auto justify-center"
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
        <div className="notification notification-error px-4 py-3 rounded-lg mb-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium">错误</p>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={debouncedReload}
                className="mt-3 btn btn-danger px-3 py-1.5 rounded text-sm"
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