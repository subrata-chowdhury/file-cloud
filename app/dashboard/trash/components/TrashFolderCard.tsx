import { useState } from 'react';
import { FiFolder, FiCornerUpLeft, FiTrash2, FiLoader } from 'react-icons/fi';

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

  const handleRestore = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRestoring(true);
    await onRestore(folder.id);
  };

  const handleHardDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);
    await onHardDelete(folder.id);
  };

  return (
    <div
      className={`group relative flex items-center rounded-xl border border-zinc-200 bg-white p-3 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 ${
        isDeleting || isRestoring ? 'pointer-events-none opacity-50' : ''
      }`}
    >
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100/80 text-zinc-600 transition-colors group-hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:text-zinc-400 dark:group-hover:bg-zinc-700/80">
        <FiFolder className="h-5 w-5" />
      </div>

      <div className="ml-3 flex w-full flex-1 items-start justify-between">
        <div className="min-w-0 flex-1 pr-2">
          <h3
            className="truncate text-sm font-medium text-zinc-900 transition-colors dark:text-zinc-100"
            title={folder.name}
          >
            {folder.name}
          </h3>
          <p className="mt-0.5 text-[11px] font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
            Folder • Trashed{' '}
            {new Date(folder.updatedAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
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
  );
}
