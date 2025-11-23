import { useState, useEffect } from 'react';
import type { FileInfo } from '../types/storage';
import { formatFileSize, formatDate } from '../utils/formatters';
import { isImageFile } from '../utils/fileUtils';

interface FilePreviewProps {
  file: FileInfo;
  fileUrl: string;
  onClose: () => void;
}

export default function FilePreview({ file, fileUrl, onClose }: FilePreviewProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // 根据文件类型加载内容
        if (file.isFolder) {
          setContent(null);
          return;
        }

        // 图片文件 - 保持与FileList一致的图片格式
        if (isImageFile(file.name)) {
          setContent('image');
          return;
        }

        const extension = file.name.split('.').pop()?.toLowerCase() || '';

        // 文本文件
        if (['txt', 'md', 'js', 'ts', 'jsx', 'tsx', 'css', 'html', 'json', 'xml'].includes(extension)) {
          try {
            const response = await fetch(fileUrl);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            setContent(text);
          } catch (error) {
            console.error('Failed to fetch text file:', error);
            setError('无法加载文件内容');
          }
          return;
        }

        // PDF 文件
        if (extension === 'pdf') {
          setContent('pdf');
          return;
        }

        // 其他文件类型
        setContent(null);
      } catch (err) {
        console.error('Failed to load file content:', err);
        setError('无法加载文件内容');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [file, fileUrl]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(fileUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-full flex flex-col">
        {/* 头部 */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-semibold truncate">{file.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 文件信息 */}
        <div className="p-4 border-b">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div>
              <span className="text-gray-500">大小:</span>
              <span className="ml-1">{formatFileSize(file.size)}</span>
            </div>
            <div>
              <span className="text-gray-500">修改时间:</span>
              <span className="ml-1">{formatDate(file.lastModified)}</span>
            </div>
            <div>
              <span className="text-gray-500">类型:</span>
              <span className="ml-1">{file.isFolder ? '文件夹' : file.name.split('.').pop()?.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-gray-500">路径:</span>
              <span className="ml-1 truncate">{file.key}</span>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-auto p-4">
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* 图片预览 */}
              {content === 'image' && (
                <div className="flex justify-center">
                  {imageLoading && (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  <div className="relative">
                    <img
                      src={fileUrl}
                      alt={file.name}
                      className={`max-w-full max-h-[70vh] object-contain ${imageLoading ? 'hidden' : ''}`}
                      onLoad={() => setImageLoading(false)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        setImageLoading(false);
                        setError('图片加载失败，请检查文件是否损坏或网络连接');
                      }}
                    />
                  </div>
                </div>
              )}

              {/* PDF 预览 */}
              {content === 'pdf' && (
                <div className="text-center">
                  <p className="mb-4">PDF 文件预览</p>
                  <iframe
                    src={fileUrl}
                    className="w-full h-[70vh]"
                    title={`PDF Preview: ${file.name}`}
                  />
                </div>
              )}

              {/* 文本内容预览 */}
              {content && content !== 'image' && content !== 'pdf' && (
                <div className="border rounded p-4 bg-gray-50">
                  <pre className="whitespace-pre-wrap break-words">{content}</pre>
                </div>
              )}

              {/* 不支持预览的文件 */}
              {!content && !file.isFolder && (
                <div className="text-center py-8">
                  <p className="mb-4">此文件类型不支持预览</p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleOpenInNewTab}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                    >
                      在新标签页中打开
                    </button>
                    <button
                      onClick={handleDownload}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
                    >
                      下载文件
                    </button>
                  </div>
                </div>
              )}

              {/* 文件夹 */}
              {file.isFolder && (
                <div className="text-center py-8">
                  <p>这是一个文件夹</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* 底部操作按钮 */}
        <div className="border-t p-4 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
          >
            关闭
          </button>
          {!file.isFolder && (
            <>
              <button
                onClick={handleOpenInNewTab}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
              >
                在新标签页中打开
              </button>
              <button
                onClick={handleDownload}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
              >
                下载
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}