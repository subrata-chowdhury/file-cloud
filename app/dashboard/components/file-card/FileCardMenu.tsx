import { useState, useRef, useEffect } from 'react';
import {
  FiMoreVertical,
  FiGlobe,
  FiLock,
  FiTrash2,
  FiLink,
  FiExternalLink,
  FiLoader,
  FiEdit2,
  FiStar,
} from 'react-icons/fi';
import { FileData } from '../FileCard';

interface FileCardMenuProps {
  file: FileData;
  onDelete: () => Promise<void> | void;
  onTogglePrivacy: () => void;
  onRename?: () => void;
  onToggleFavorite?: () => void;
  readOnly?: boolean;
  className?: string;
}

export default function FileCardMenu({
  file,
  onDelete,
  onTogglePrivacy,
  onRename,
  onToggleFavorite,
  readOnly = false,
  className = 'relative flex flex-col items-end',
}: FileCardMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [menuPosition, setMenuPosition] = useState<'top' | 'bottom'>('bottom');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        event.target instanceof Node &&
        !menuRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    if (spaceBelow < 250) {
      setMenuPosition('top');
    } else {
      setMenuPosition('bottom');
    }
    setShowMenu(!showMenu);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/share/${file.id}`;
    navigator.clipboard.writeText(url);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
    setShowMenu(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setShowMenu(false);
    await onDelete();
    // Intentionally omitting setIsDeleting(false) since the component unmounts on deletion
  };

  return (
    <div className={className} ref={menuRef}>
      <button
        onClick={handleMenuClick}
        className="relative z-10 rounded-lg p-1.5 text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
      >
        <FiMoreVertical className="h-4 w-4" />
      </button>

      {showMenu && (
        <div
          className={`absolute right-0 z-20 min-w-44 overflow-hidden rounded-xl border border-zinc-200/50 bg-white/80 p-1 shadow-lg backdrop-blur-md outline-none dark:border-zinc-800/50 dark:bg-zinc-900/80 ${
            menuPosition === 'top'
              ? 'bottom-full mb-1 origin-bottom-right'
              : 'top-full mt-1 origin-top-right'
          }`}
        >
          <div className="flex flex-col gap-0.5" role="menu">
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
            >
              <FiExternalLink className="mr-2 h-3.5 w-3.5 text-zinc-400" /> Open File
            </a>
            {!readOnly && onToggleFavorite && (
              <button
                onClick={() => {
                  onToggleFavorite();
                  setShowMenu(false);
                }}
                className="flex w-full items-center rounded-lg px-2.5 py-1.5 text-xs font-medium text-nowrap text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
              >
                <FiStar
                  className={`mr-2 h-3.5 w-3.5 ${file.isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-400'}`}
                />
                {file.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            )}
            {!readOnly && (
              <button
                onClick={() => {
                  onTogglePrivacy();
                  setShowMenu(false);
                }}
                className="flex w-full items-center rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
              >
                {file.isPublic ? (
                  <FiLock className="mr-2 h-3.5 w-3.5 text-zinc-400" />
                ) : (
                  <FiGlobe className="mr-2 h-3.5 w-3.5 text-zinc-400" />
                )}
                Make {file.isPublic ? 'Private' : 'Public'}
              </button>
            )}
            {file.isPublic && (
              <button
                onClick={handleCopyLink}
                className="flex w-full items-center rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
              >
                <FiLink className="mr-2 h-3.5 w-3.5 text-zinc-400" />
                {copyFeedback ? 'Copied!' : 'Copy Share Link'}
              </button>
            )}
            {!readOnly && onRename && (
              <button
                onClick={() => {
                  onRename();
                  setShowMenu(false);
                }}
                className="flex w-full items-center rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
              >
                <FiEdit2 className="mr-2 h-3.5 w-3.5 text-zinc-400" /> Rename
              </button>
            )}
            {!readOnly && <div className="my-1 h-px w-full bg-zinc-100 dark:bg-zinc-800"></div>}
            {!readOnly && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex w-full items-center rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                {isDeleting ? (
                  <FiLoader className="mr-2 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <FiTrash2 className="mr-2 h-3.5 w-3.5" />
                )}
                {isDeleting ? 'Moving...' : 'Move to Trash'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
