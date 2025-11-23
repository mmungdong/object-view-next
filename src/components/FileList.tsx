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
      <div className="text-center py-12">
        <p className="text-gray-500">该目录为空</p>
      </div>
    );
  }

  return (
    <div className={layout === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4' : 'space-y-2'}>
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