import { useState } from 'react';
import type { FileInfo } from '../types/storage';
import { formatFileSize, formatDate } from '../utils/formatters';
import { isImageFile } from '../utils/fileUtils';
import FilePreview from './FilePreview';

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
      // 显示文件预览
      setShowPreview(true);
    }
  };

  if (layout === 'list') {
    return (
      <>
        <div
          onClick={handleFileClick}
          className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${
            file.isFolder ? 'hover:bg-blue-50' : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center mr-3">
            {file.isFolder ? (
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            ) : isImage ? (
              <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
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
                      parent.innerHTML = `
                        <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      `;
                    }
                  }}
                />
              </div>
            ) : (
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
            <p className="text-xs text-gray-500">
              {file.isFolder ? '文件夹' : formatFileSize(file.size)}
            </p>
          </div>

          <div className="text-xs text-gray-500 ml-2">
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
        className={`flex flex-col rounded-lg border cursor-pointer transition-all hover:shadow-md ${
          file.isFolder ? 'hover:border-blue-300' : 'hover:border-gray-300'
        }`}
      >
        <div className="flex items-center justify-center h-24 p-2">
          {file.isFolder ? (
            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          ) : isImage ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded overflow-hidden">
              {!imageError ? (
                <img
                  src={getFileUrl(file.key)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={() => setImageError(true)}
                />
              ) : (
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </div>
          ) : (
            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
        </div>

        <div className="p-3 border-t">
          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
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