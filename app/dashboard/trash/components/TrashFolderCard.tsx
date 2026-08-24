import { useState } from 'react';
import { FiFolder, FiRefreshCcw, FiTrash2, FiLoader } from 'react-icons/fi';

export interface TrashedFolder {
  id: string;
  name: string;
  updatedAt: string;
}

interface TrashFolderCardProps {
  folder: TrashedFolder;
  onRestore: (id: string) => Promise<void>;
  onHardDelete: (id: string) => Promise<void>;
}

export default function TrashFolderCard({ folder, onRestore, onHardDelete }: TrashFolderCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async () => {
    setIsRestoring(true);
    await onRestore(folder.id);
  };

  const handleHardDelete = async () => {
    setIsDeleting(true);
    await onHardDelete(folder.id);
  };

  return (
    <div
      className={`flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 ${
        isDeleting || isRestoring ? 'pointer-events-none opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
          <FiFolder className="h-5 w-5 text-zinc-500" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {folder.name}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Folder • Trashed {new Date(folder.updatedAt).toLocaleDateString()}
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
