import { useState, useEffect } from 'react';
import type { FileInfo } from '../types/storage';
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

  // 添加ESC键关闭预览功能
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] flex flex-col rounded-lg shadow-xl overflow-hidden">
        {/* 头部 - 简化设计 */}
        <div className="flex justify-between items-center border-b border-neutral-200 p-4">
          <h2 className="text-lg font-semibold text-neutral-800 truncate">{file.name}</h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
          {loading && (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-neutral-600 mt-2">加载中...</span>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center h-64 text-center p-4">
              <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-neutral-800">加载失败</h3>
              <p className="mt-2 text-neutral-600 max-w-md">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-full shadow-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
              >
                重试
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* 图片预览 - 简化设计，居中显示 */}
              {content === 'image' && (
                <div className="flex flex-col items-center p-4 w-full">
                  {imageLoading && (
                    <div className="flex flex-col items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                      <span className="ml-3 text-neutral-600 mt-2">图片加载中...</span>
                    </div>
                  )}
                  <div className="relative rounded-xl overflow-hidden bg-white/30 backdrop-blur-sm border border-white/50 w-full flex justify-center items-center shadow-lg">
                    <img
                      src={fileUrl}
                      alt={file.name}
                      className={`max-w-full max-h-[60vh] object-contain transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                      onLoad={() => setImageLoading(false)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        setImageLoading(false);
                        setError('图片加载失败，请检查文件是否损坏或网络连接');
                      }}
                    />
                  </div>
                  <div className="mt-6 w-full flex justify-center">
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      下载图片
                    </button>
                  </div>
                </div>
              )}

              {/* PDF 预览 */}
              {content === 'pdf' && (
                <div className="flex flex-col items-center w-full">
                  <div className="mb-4 text-neutral-600 font-medium">PDF 文件预览</div>
                  <div className="w-full border border-neutral-200 rounded-xl overflow-hidden shadow-lg">
                    <iframe
                      src={fileUrl}
                      className="w-full h-[70vh]"
                      title={`PDF Preview: ${file.name}`}
                    />
                  </div>
                  <div className="mt-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      下载 PDF
                    </button>
                  </div>
                </div>
              )}

              {/* 文本内容预览 */}
              {content && content !== 'image' && content !== 'pdf' && (
                <div className="flex flex-col w-full">
                  <div className="border border-neutral-200 rounded-xl p-6 bg-white/30 backdrop-blur-sm mb-6 shadow-lg">
                    <pre className="whitespace-pre-wrap break-words text-neutral-800 font-mono text-sm">{content}</pre>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 justify-center">
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      下载文件
                    </button>
                  </div>
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
                  <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-full shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
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
                  <div className="mt-6">
                    <button
                      onClick={onClose}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium rounded-full shadow-lg hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 transform hover:scale-105"
                    >
                      关闭
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}