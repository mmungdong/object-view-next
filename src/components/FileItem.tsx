import { useState } from 'react';
import type { FileInfo } from '../types/storage';
import { formatFileSize, formatDate } from '../utils/formatters';
import { isImageFile } from '../utils/fileUtils';
import FilePreview from './FilePreview';
import { Folder, FileText, Image } from 'lucide-react';

interface FileItemProps {
  file: FileInfo;
  layout: 'grid' | 'list';
  onEnterFolder: (folderName: string) => void;
  getFileUrl: (key: string) => string;
}

export default function FileItem({ file, layout, onEnterFolder, getFileUrl }: FileItemProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isImage = !file.isFolder && isImageFile(file.name);

  // 调试信息：打印图片URL
  if (isImage) {
    const imageUrl = getFileUrl(file.key);
    console.log('Image file detected:', file.name, 'Key:', file.key, 'Generated URL:', imageUrl);
  }

  const handleFileClick = () => {
    if (file.isFolder) {
      onEnterFolder(file.name);
    } else {
      // 显示文件预览
      setShowPreview(true);
    }
  };

  if (layout === 'list') {
    return (
      <>
        <div
          onClick={handleFileClick}
          className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors hover:bg-secondary/50 ${
            file.isFolder ? 'hover:border-primary' : 'hover:border-accent'
          } border-border bg-card`}
        >
          <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center mr-4">
            {file.isFolder ? (
              <Folder className="w-6 h-6 text-primary" />
            ) : isImage ? (
              <div className="w-10 h-10 flex items-center justify-center rounded overflow-hidden">
                <img
                  src={getFileUrl(file.key)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    // If image fails to load, hide the image and show fallback icon
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    // The fallback icon is already in the DOM, we just need to show it
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<Image class="w-6 h-6 text-accent" />`;
                    }
                  }}
                />
              </div>
            ) : (
              <FileText className="w-6 h-6 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {file.isFolder ? '文件夹' : formatFileSize(file.size)}
            </p>
          </div>

          <div className="text-xs text-muted-foreground ml-2">
            {formatDate(file.lastModified)}
          </div>
        </div>

        {showPreview && (
          <FilePreview
            file={file}
            fileUrl={getFileUrl(file.key)}
            onClose={() => setShowPreview(false)}
          />
        )}
      </>
    );
  }

  // Grid layout
  return (
    <>
      <div
        onClick={handleFileClick}
        className={`flex flex-col rounded-xl border cursor-pointer transition-all duration-300 hover:shadow-lg overflow-hidden ${
          file.isFolder
            ? 'border-border hover:border-primary'
            : 'border-border hover:border-accent'
        } bg-card`}
      >
        <div className="flex items-center justify-center h-32 p-3 bg-muted/30">
          {file.isFolder ? (
            <div className="flex flex-col items-center justify-center text-primary">
              <Folder className="w-12 h-12 mb-2" />
              <span className="text-xs font-medium">文件夹</span>
            </div>
          ) : isImage ? (
            <div className="w-full h-full flex items-center justify-center rounded-lg overflow-hidden relative group">
              {!imageError ? (
                <>
                  <img
                    src={getFileUrl(file.key)}
                    alt={file.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={() => setImageError(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Image className="w-10 h-10 mb-2" />
                  <span className="text-xs">图片加载失败</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <FileText className="w-12 h-12 mb-2" />
              <span className="text-xs font-medium">文件</span>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-border">
          <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{file.isFolder ? '文件夹' : formatFileSize(file.size)}</span>
            <span>{formatDate(file.lastModified)}</span>
          </div>
        </div>
      </div>

      {showPreview && (
        <FilePreview
          file={file}
          fileUrl={getFileUrl(file.key)}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}