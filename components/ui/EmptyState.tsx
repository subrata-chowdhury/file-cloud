import { FiUploadCloud, FiFilter, FiFolderPlus, FiXCircle } from 'react-icons/fi';
import { useUpload } from '../../app/dashboard/components/UploadManager';

interface EmptyStateProps {
  hasFilters?: boolean;
  onNewFolder?: () => void;
  onResetFilters?: () => void;
}

export default function EmptyState({ hasFilters, onNewFolder, onResetFilters }: EmptyStateProps) {
  const { openUploadDialog } = useUpload();

  if (hasFilters) {
    return (
      <div className="rounded-2xl border border-zinc-100 bg-white py-20 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-50 ring-8 ring-zinc-50/50 dark:bg-zinc-800 dark:ring-zinc-800/50">
          <FiFilter className="h-10 w-10 text-zinc-400" />
        </div>
        <h3 className="font-display mt-2 text-xl font-semibold text-zinc-900 dark:text-white">
          No matching files
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          We couldn't find any files matching your current filters. Try adjusting them to see your
          files.
        </p>
        {onResetFilters && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={onResetFilters}
              className="flex items-center gap-2 rounded-xl bg-zinc-100 px-5 py-2.5 text-sm font-bold text-zinc-700 transition-colors hover:bg-zinc-200 focus:ring-2 focus:ring-zinc-500/20 focus:outline-none dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:focus:ring-zinc-400/20"
            >
              <FiXCircle className="h-5 w-5" />
              Reset Filters
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white py-20 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 ring-8 ring-zinc-100/50 dark:bg-zinc-800 dark:ring-zinc-800/50">
        <FiUploadCloud className="h-10 w-10 text-zinc-900 dark:text-white" />
      </div>
      <h3 className="font-display mt-2 text-xl font-semibold text-zinc-900 dark:text-white">
        This folder is empty
      </h3>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
        Get started by uploading your first file. You can upload images, videos, documents, and more
        with no size limits!
      </p>

      <div className="mt-8 flex justify-center gap-3">
        <button
          onClick={openUploadDialog}
          className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-900/20 focus:outline-none dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 dark:focus:ring-white/20"
        >
          <FiUploadCloud className="h-5 w-5" />
          Upload Files
        </button>
        {onNewFolder && (
          <button
            onClick={onNewFolder}
            className="flex items-center gap-2 rounded-xl bg-zinc-100 px-5 py-2.5 text-sm font-bold text-zinc-900 transition-colors hover:bg-zinc-200 focus:ring-2 focus:ring-zinc-900/20 focus:outline-none dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 dark:focus:ring-white/20"
          >
            <FiFolderPlus className="h-5 w-5" />
            Create a Folder
          </button>
        )}
      </div>
    </div>
  );
}
