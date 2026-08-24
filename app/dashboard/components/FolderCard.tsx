'use client';

import { FiFolder, FiMoreVertical, FiTrash2, FiEdit2, FiStar } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';

export interface FolderData {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  isFavorite?: boolean;
}

interface FolderCardProps {
  folder: FolderData;
  onClick?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
}

export default function FolderCard({
  folder,
  onClick,
  onDelete,
  onToggleFavorite,
}: FolderCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState<'top' | 'bottom'>('bottom');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && e.target instanceof Node && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    // ~100px for folder menu height
    if (spaceBelow < 100) {
      setMenuPosition('top');
    } else {
      setMenuPosition('bottom');
    }
    setShowMenu(!showMenu);
  };

  return (
    <div
      onClick={() => onClick?.(folder.id)}
      className="group relative flex cursor-pointer items-center justify-between rounded-xl border border-zinc-200 bg-white p-3 shadow-sm transition-all duration-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100/80 text-zinc-600 transition-colors group-hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:text-zinc-400 dark:group-hover:bg-zinc-700/80">
          <FiFolder className="h-5 w-5" />
          {folder.isFavorite && (
            <div className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50">
              <FiStar className="h-2.5 w-2.5 fill-yellow-500 text-yellow-500" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium text-zinc-900 transition-colors dark:text-zinc-100">
            {folder.name}
          </h3>
          <p className="mt-0.5 text-[11px] font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
            {new Date(folder.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="relative flex flex-col items-end" ref={menuRef}>
        <button
          onClick={handleMenuClick}
          className="relative z-10 rounded-lg p-1.5 text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <FiMoreVertical className="h-4 w-4" />
        </button>
        {showMenu && (
          <div
            className={`absolute right-0 z-20 w-36 overflow-hidden rounded-xl border border-zinc-200/50 bg-white/80 p-1 shadow-lg backdrop-blur-md outline-none dark:border-zinc-800/50 dark:bg-zinc-900/80 ${
              menuPosition === 'top'
                ? 'bottom-full mb-1 origin-bottom-right'
                : 'top-full mt-1 origin-top-right'
            }`}
          >
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onToggleFavorite(folder.id, !folder.isFavorite);
                }}
                className="flex w-full items-center rounded-lg px-2.5 py-1.5 text-xs font-medium text-nowrap text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
              >
                <FiStar
                  className={`mr-2 h-3.5 w-3.5 ${folder.isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-400'}`}
                />
                {folder.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onDelete(folder.id);
                }}
                className="flex w-full items-center rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                <FiTrash2 className="mr-2 h-3.5 w-3.5" />
                Move to Trash
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
