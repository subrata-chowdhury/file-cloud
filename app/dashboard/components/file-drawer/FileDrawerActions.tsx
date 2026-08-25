import { useState } from 'react';
import {
  FiExternalLink,
  FiUserPlus,
  FiGlobe,
  FiLock,
  FiLink,
  FiTrash2,
  FiLoader,
  FiStar,
} from 'react-icons/fi';
import ShareModal from '../ShareModal';
import { FileDetails } from '../FileDetailsDrawer';

interface FileDrawerActionsProps {
  file: FileDetails;
  onDelete: (id: string) => Promise<void> | void;
  onTogglePrivacy: (id: string, isPublic: boolean) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => Promise<void> | void;
  onClose: () => void;
  readOnly?: boolean;
}

export default function FileDrawerActions({
  file,
  onDelete,
  onTogglePrivacy,
  onToggleFavorite,
  onClose,
  readOnly = false,
}: FileDrawerActionsProps) {
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/share/${file.id}`;
    navigator.clipboard.writeText(url);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(file.id);
    setIsDeleting(false);
    onClose();
  };

  return (
    <>
      {/* Quick Actions */}
      <div className="mb-6 grid grid-cols-2 gap-3">
        <a
          href={`/share/${file.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 ${readOnly ? 'col-span-2' : ''}`}
        >
          <FiExternalLink className="h-4 w-4" />
          Open File
        </a>

        {!readOnly && (
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <FiUserPlus className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
            Share
          </button>
        )}
      </div>

      {!readOnly && (
        <div className="space-y-1">
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(file.id, !file.isFavorite)}
              className="group flex w-full items-center justify-between rounded-xl p-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <div className="flex items-center gap-3">
                <FiStar
                  className={`h-4 w-4 ${file.isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-400'}`}
                />
                <div className="flex flex-col items-start leading-tight">
                  <span>Favorites</span>
                  <span className="mt-0.5 text-xs font-normal text-zinc-500 dark:text-zinc-400">
                    Click to {file.isFavorite ? 'remove' : 'add'}
                  </span>
                </div>
              </div>
              <span
                className={`rounded px-2 py-0.5 text-xs font-semibold tracking-wider uppercase transition-colors ${
                  file.isFavorite
                    ? 'bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100 dark:bg-yellow-500/10 dark:text-yellow-500 dark:group-hover:bg-yellow-500/20'
                    : 'bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:bg-zinc-700'
                }`}
              >
                {file.isFavorite ? 'Starred' : 'None'}
              </span>
            </button>
          )}

          <button
            onClick={() => onTogglePrivacy(file.id, !file.isPublic)}
            className="group flex w-full items-center justify-between rounded-xl p-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <div className="flex items-center gap-3">
              {file.isPublic ? (
                <FiGlobe className="h-4 w-4 text-emerald-500" />
              ) : (
                <FiLock className="h-4 w-4 text-zinc-400" />
              )}
              <div className="flex flex-col items-start leading-tight">
                <span>Access</span>
                <span className="mt-0.5 text-xs font-normal text-zinc-500 dark:text-zinc-400">
                  Click to change
                </span>
              </div>
            </div>
            <span
              className={`rounded px-2 py-0.5 text-xs font-semibold tracking-wider uppercase transition-colors ${
                file.isPublic
                  ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:group-hover:bg-emerald-500/20'
                  : 'bg-zinc-100 text-zinc-500 group-hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:bg-zinc-700'
              }`}
            >
              {file.isPublic ? 'Public' : 'Private'}
            </span>
          </button>

          {file.isPublic && (
            <button
              onClick={handleCopyLink}
              className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
            >
              <FiLink className="h-4 w-4 text-zinc-400" />
              {copyFeedback ? 'Link copied to clipboard!' : 'Copy public link'}
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-500/10"
          >
            {isDeleting ? (
              <FiLoader className="h-4 w-4 animate-spin" />
            ) : (
              <FiTrash2 className="h-4 w-4" />
            )}
            {isDeleting ? 'Moving to trash...' : 'Move to Trash'}
          </button>
        </div>
      )}

      {file && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          fileId={file.id}
          fileName={file.name}
        />
      )}
    </>
  );
}
