import type { FileInfo } from '../types/storage';
import FileItem from './FileItem';

interface FileListProps {
  files: FileInfo[];
  layout: 'grid' | 'list';
  onEnterFolder: (folderName: string) => void;
  getFileUrl: (key: string) => string;
}

export default function FileList({ files, layout, onEnterFolder, getFileUrl }: FileListProps) {
  if (files.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="mx-auto h-16 w-16 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-neutral-800">空文件夹</h3>
        <p className="mt-2 text-neutral-600">该文件夹中没有任何文件或文件夹</p>
      </div>
    );
  }

  return (
    <div className={`mt-4 ${layout === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4' : 'space-y-1'}`}>
      {files.map((file) => (
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