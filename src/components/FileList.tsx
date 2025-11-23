import type { FileInfo } from '../types/storage';
import FileItem from './FileItem';

interface FileListProps {
  files: FileInfo[];
  layout: 'grid' | 'list';
  onEnterFolder: (folderName: string) => void;
  getFileUrl: (key: string) => string;
}

export default function FileList({ files, layout, onEnterFolder, getFileUrl }: FileListProps) {
  // 显示所有文件和文件夹
  const displayFiles = files;

  if (displayFiles.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">空文件夹</h3>
        <p className="mt-1 text-sm text-gray-500">该文件夹中没有任何文件或文件夹</p>
      </div>
    );
  }

  return (
    <div className={layout === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4' : 'space-y-3'}>
      {displayFiles.map((file) => (
        <FileItem
          key={file.key}
          file={file}
          layout={layout}
          onEnterFolder={onEnterFolder}
          getFileUrl={getFileUrl}
        />
      ))}
    </div>
  );
}