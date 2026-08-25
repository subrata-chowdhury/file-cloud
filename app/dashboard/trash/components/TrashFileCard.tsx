import { useState } from 'react';
import { FiCornerUpLeft, FiTrash2, FiLoader } from 'react-icons/fi';
import FileIconPreview from '../../components/file-card/FileIconPreview';

export interface TrashedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  updatedAt: string;
}

interface TrashFileCardProps {
  file: TrashedFile;
  onRestore: (id: string) => Promise<void>;
  onHardDelete: (id: string) => Promise<void>;
  onSelect?: (file: TrashedFile) => void;
}

export default function TrashFileCard({
  file,
  onRestore,
  onHardDelete,
  onSelect,
}: TrashFileCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleRestore = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRestoring(true);
    await onRestore(file.id);
  };

  const handleHardDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    await onHardDelete(file.id);
  };

  return (
    <div
      onClick={() => onSelect?.(file)}
      className={`group relative cursor-pointer overflow-visible rounded-xl border border-zinc-200 bg-white shadow-sm transition-all duration-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 ${
        isDeleting || isRestoring ? 'pointer-events-none opacity-50' : ''
      }`}
    >
      <div className="flex items-start gap-3 p-3">
        <div className="relative">
          <FileIconPreview
            name={file.name}
            url={file.url}
            mimeType={file.mimeType}
            viewMode="list"
          />
        </div>

        <div className="flex w-full min-w-0 flex-1 items-start justify-between pt-0.5">
          <div className="min-w-0 flex-1 pr-2">
            <p
              className="truncate text-sm font-medium text-zinc-900 transition-colors dark:text-zinc-100"
              title={file.name}
            >
              {file.name}
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
              <span>{formatSize(file.size)}</span>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <span>
                Trashed{' '}
                {new Date(file.updatedAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          <div className="relative flex shrink-0 items-center gap-1">
            <button
              onClick={handleRestore}
              title="Restore"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              {isRestoring ? (
                <FiLoader className="h-4 w-4 animate-spin" />
              ) : (
                <FiCornerUpLeft className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={handleHardDelete}
              title="Delete Permanently"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-all hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            >
              {isDeleting ? (
                <FiLoader className="h-4 w-4 animate-spin" />
              ) : (
                <FiTrash2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
