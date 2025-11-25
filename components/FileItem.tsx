import { useState, useEffect, useMemo, useRef } from 'react';
import type { FileInfo } from '../types/storage';
import { formatFileSize } from '../utils/formatters';
import { isImageFile } from '../utils/fileUtils';
import FilePreview from './FilePreview';
import { Folder, FileText, Image } from 'lucide-react';

interface FileItemProps {
  file: FileInfo;
  layout: 'grid' | 'list';
  onEnterFolder: (folderName: string) => void;
  getFileUrl: (key: string) => Promise<string> | string;
}

// 创建一个全局的URL缓存Map
const urlCache = new Map<string, string>();
// 创建一个正在加载的Promise Map，避免重复请求
const loadingPromises = new Map<string, Promise<string>>();

export default function FileItem({ file, layout, onEnterFolder, getFileUrl }: FileItemProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [loadingUrl, setLoadingUrl] = useState(false);
  const isImage = useMemo(() => !file.isFolder && isImageFile(file.name), [file.isFolder, file.name]);
  const hasRequestedUrl = useRef(false);

  // 获取文件 URL
  useEffect(() => {
    const fetchFileUrl = async () => {
      // 只有当需要显示图片或在列表布局下才获取URL
      if (!file.isFolder && (isImage || layout === 'list')) {
        // 如果已经有URL，不需要重新获取
        if (fileUrl) return;

        // 检查是否有缓存的URL
        if (urlCache.has(file.key)) {
          setFileUrl(urlCache.get(file.key)!);
          return;
        }

        // 检查是否已经在加载中
        if (loadingPromises.has(file.key)) {
          try {
            const url = await loadingPromises.get(file.key)!;
            setFileUrl(url);
            return;
          } catch (error) {
            console.error('Failed to fetch file URL:', error);
            return;
          }
        }

        // 标记为已请求，避免重复请求
        if (hasRequestedUrl.current) return;
        hasRequestedUrl.current = true;

        setLoadingUrl(true);
        try {
          // 创建新的加载Promise并存储
          const loadPromise = Promise.resolve(getFileUrl(file.key));
          loadingPromises.set(file.key, loadPromise);

          const url = await loadPromise;
          // 缓存URL
          urlCache.set(file.key, url);
          setFileUrl(url);

          // 清除加载Promise
          loadingPromises.delete(file.key);
        } catch (error) {
          console.error('Failed to fetch file URL:', error);
          // 清除加载Promise
          loadingPromises.delete(file.key);
        } finally {
          setLoadingUrl(false);
        }
      }
    };

    fetchFileUrl();
  }, [file.isFolder, file.key, fileUrl, getFileUrl, isImage, layout]);

  const handleFileClick = () => {
    if (file.isFolder) {
      onEnterFolder(file.name);
    } else {
      setShowPreview(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFileClick();
    }
  };

  if (layout === 'list') {
    return (
      <>
        <div
          onClick={handleFileClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          className="flex items-center p-3 rounded-md border cursor-pointer transition-all hover:border-primary/30 hover:shadow-md border-neutral-200 bg-white"
        >
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center mr-3">
            {file.isFolder ? (
              <Folder className="w-6 h-6 text-primary" />
            ) : isImage ? (
              <div className="w-10 h-10 flex items-center justify-center rounded overflow-hidden">
                {loadingUrl ? (
                  <div className="loading-spinner w-4 h-4"></div>
                ) : fileUrl ? (
                  <img
                    src={fileUrl}
                    alt={file.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onLoad={() => {
                      // 图片加载成功后确保显示
                      setImageError(false);
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      setImageError(true);
                    }}
                  />
                ) : imageError ? (
                  <div className="flex flex-col items-center justify-center text-neutral-500">
                    <Image className="w-6 h-6 mb-1" />
                    <span className="text-xs">图片加载失败</span>
                  </div>
                ) : (
                  <FileText className="w-6 h-6 text-neutral-500" />
                )}
              </div>
            ) : (
              <FileText className="w-6 h-6 text-neutral-500" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-800 truncate">{file.name}</p>
            <p className="text-xs text-neutral-600">
              {file.isFolder ? '文件夹' : formatFileSize(file.size)}
            </p>
          </div>
        </div>

        {showPreview && fileUrl && (
          <FilePreview
            file={file}
            fileUrl={fileUrl}
            onClose={() => setShowPreview(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div
        onClick={handleFileClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        className="flex flex-col rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md overflow-hidden border-neutral-200 hover:border-primary/30 bg-white"
      >
        <div className="flex items-center justify-center h-28 p-2 bg-neutral-50">
          {file.isFolder ? (
            <div className="flex flex-col items-center justify-center text-primary">
              <Folder className="w-10 h-10 mb-1" />
              <span className="text-xs font-medium">文件夹</span>
            </div>
          ) : isImage ? (
            <div className="w-full h-full flex items-center justify-center rounded-lg overflow-hidden relative group">
              {loadingUrl ? (
                <div className="flex items-center justify-center w-full h-full">
                  <div className="loading-spinner w-6 h-6"></div>
                </div>
              ) : fileUrl ? (
                <>
                  <img
                    src={fileUrl}
                    alt={file.name}
                    className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${imageError ? 'hidden' : ''}`}
                    loading="lazy"
                    onLoad={() => {
                      // 图片加载成功后确保显示
                      setImageError(false);
                    }}
                    onError={() => setImageError(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </>
              ) : imageError ? (
                <div className="flex flex-col items-center justify-center text-neutral-500">
                  <Image className="w-8 h-8 mb-1" />
                  <span className="text-xs">图片加载失败</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-neutral-500">
                  <FileText className="w-8 h-8 mb-1" />
                  <span className="text-xs">无法加载图片</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-neutral-500">
              <FileText className="w-10 h-10 mb-1" />
              <span className="text-xs font-medium">文件</span>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-neutral-200">
          <p className="text-sm font-medium text-neutral-800 text-truncate-2">{file.name}</p>
          <div className="flex justify-between text-xs text-neutral-600 mt-1">
            <span>{file.isFolder ? '文件夹' : formatFileSize(file.size)}</span>
          </div>
        </div>
      </div>

      {showPreview && fileUrl && (
        <FilePreview
          file={file}
          fileUrl={fileUrl}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}