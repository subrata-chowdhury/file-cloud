import { useState } from 'react';
import { FiFile, FiVideo, FiRefreshCcw, FiTrash2, FiLoader } from 'react-icons/fi';

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
}

export default function TrashFileCard({ file, onRestore, onHardDelete }: TrashFileCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const isImage = file.mimeType.startsWith('image/');
  const isVideo = file.mimeType.startsWith('video/');

  const getThumbnailUrl = (url: string) => {
    if (!url.includes('/upload/')) return url;
    return url.replace('/upload/', '/upload/w_200,h_200,c_fill,q_auto,f_auto/');
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    await onRestore(file.id);
  };

  const handleHardDelete = async () => {
    setIsDeleting(true);
    await onHardDelete(file.id);
  };

  return (
    <div
      className={`flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 ${
        isDeleting || isRestoring ? 'pointer-events-none opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
          {isImage ? (
            <img
              src={getThumbnailUrl(file.url)}
              alt={file.name}
              className="h-full w-full object-cover"
            />
          ) : isVideo ? (
            <FiVideo className="h-5 w-5 text-zinc-500" />
          ) : (
            <FiFile className="h-5 w-5 text-zinc-500" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {file.name}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {formatSize(file.size)} • Trashed {new Date(file.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={handleRestore}
          title="Restore"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        >
          {isRestoring ? (
            <FiLoader className="h-4 w-4 animate-spin" />
          ) : (
            <FiRefreshCcw className="h-4 w-4" />
          )}
        </button>
        <button
          onClick={handleHardDelete}
          title="Delete Permanently"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
        >
          {isDeleting ? (
            <FiLoader className="h-4 w-4 animate-spin" />
          ) : (
            <FiTrash2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
