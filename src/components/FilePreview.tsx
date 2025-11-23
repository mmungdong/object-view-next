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
          // 调试信息：打印图片URL
          console.log('Preview - Image file detected:', file.name, 'Key:', file.key, 'Generated URL:', fileUrl);
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
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* 头部 */}
        <div className="flex justify-between items-center border-b border-neutral-200 p-4">
          <h2 className="text-lg font-semibold text-neutral-800 truncate">{file.name}</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 文件信息 */}
        <div className="p-4 border-b border-neutral-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-neutral-600">大小:</span>
              <span className="ml-2 text-neutral-800">{formatFileSize(file.size)}</span>
            </div>
            <div>
              <span className="text-neutral-600">修改时间:</span>
              <span className="ml-2 text-neutral-800">{formatDate(file.lastModified)}</span>
            </div>
            <div>
              <span className="text-neutral-600">类型:</span>
              <span className="ml-2 text-neutral-800">{file.isFolder ? '文件夹' : file.name.split('.').pop()?.toUpperCase()}</span>
            </div>
            <div>
              <span className="text-neutral-600">路径:</span>
              <span className="ml-2 text-neutral-800 truncate">{file.key}</span>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-auto p-4">
          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="loading-spinner"></div>
              <span className="ml-3 text-neutral-600">加载中...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <svg className="mx-auto h-16 w-16 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-neutral-800">加载失败</h3>
              <p className="mt-2 text-neutral-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 btn-primary px-4 py-2"
              >
                重试
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* 图片预览 */}
              {content === 'image' && (
                <div className="flex justify-center">
                  {imageLoading && (
                    <div className="flex items-center justify-center h-64">
                      <div className="loading-spinner"></div>
                      <span className="ml-3 text-neutral-600">图片加载中...</span>
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
                  <p className="mb-4 text-neutral-600">PDF 文件预览</p>
                  <iframe
                    src={fileUrl}
                    className="w-full h-[70vh]"
                    title={`PDF Preview: ${file.name}`}
                  />
                </div>
              )}

              {/* 文本内容预览 */}
              {content && content !== 'image' && content !== 'pdf' && (
                <div className="border border-neutral-200 rounded p-4 bg-neutral-50">
                  <pre className="whitespace-pre-wrap break-words text-neutral-800">{content}</pre>
                </div>
              )}

              {/* 不支持预览的文件 */}
              {!content && !file.isFolder && (
                <div className="text-center py-12">
                  <svg className="mx-auto h-16 w-16 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-neutral-800">文件预览不可用</h3>
                  <p className="mt-2 text-neutral-600">此文件类型不支持预览</p>
                  <div className="mt-6 flex justify-center gap-3">
                    <button
                      onClick={handleOpenInNewTab}
                      className="btn-primary px-4 py-2"
                    >
                      在新标签页中打开
                    </button>
                    <button
                      onClick={handleDownload}
                      className="btn-secondary px-4 py-2"
                    >
                      下载文件
                    </button>
                  </div>
                </div>
              )}

              {/* 文件夹 */}
              {file.isFolder && (
                <div className="text-center py-12">
                  <svg className="mx-auto h-16 w-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-neutral-800">文件夹</h3>
                  <p className="mt-2 text-neutral-600">这是一个文件夹，无法直接预览</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* 底部操作按钮 */}
        <div className="border-t border-neutral-200 p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="btn-neutral px-4 py-2"
          >
            关闭
          </button>
          {!file.isFolder && (
            <>
              <button
                onClick={handleOpenInNewTab}
                className="btn-primary px-4 py-2"
              >
                在新标签页中打开
              </button>
              <button
                onClick={handleDownload}
                className="btn-secondary px-4 py-2"
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