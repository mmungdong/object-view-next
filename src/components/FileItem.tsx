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
                <img
                  src={getFileUrl(file.key)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.innerHTML = `<Image class="w-6 h-6 text-secondary" />`;
                    }
                  }}
                />
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

          <div className="text-xs text-neutral-600 ml-2">
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
              {!imageError ? (
                <>
                  <img
                    src={getFileUrl(file.key)}
                    alt={file.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={() => setImageError(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-neutral-500">
                  <Image className="w-8 h-8 mb-1" />
                  <span className="text-xs">图片加载失败</span>
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