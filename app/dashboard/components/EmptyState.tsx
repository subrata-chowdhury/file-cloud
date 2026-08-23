import { FiUploadCloud, FiFilter, FiFolderPlus, FiXCircle } from 'react-icons/fi';

interface EmptyStateProps {
  hasFilters?: boolean;
  onNewFolder?: () => void;
  onResetFilters?: () => void;
}

export default function EmptyState({ hasFilters, onNewFolder, onResetFilters }: EmptyStateProps) {
  if (hasFilters) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 ring-8 ring-gray-50/50">
          <FiFilter className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="font-display mt-2 text-xl font-semibold text-gray-900">No matching files</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-500">
          We couldn't find any files matching your current filters. Try adjusting them to see your
          files.
        </p>
        {onResetFilters && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={onResetFilters}
              className="flex items-center gap-2 rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-gray-500/20 focus:outline-none"
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
    <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center shadow-sm">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 ring-8 ring-blue-50/50">
        <FiUploadCloud className="h-10 w-10 text-blue-600" />
      </div>
      <h3 className="font-display mt-2 text-xl font-semibold text-gray-900">
        This folder is empty
      </h3>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-500">
        Get started by uploading your first file. You can upload images, videos, documents, and more
        with no size limits!
      </p>
      {onNewFolder && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={onNewFolder}
            className="flex items-center gap-2 rounded-xl bg-blue-50 px-5 py-2.5 text-sm font-bold text-blue-700 transition-colors hover:bg-blue-100 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          >
            <FiFolderPlus className="h-5 w-5" />
            Create a Folder
          </button>
        </div>
      )}
    </div>
  );
}
