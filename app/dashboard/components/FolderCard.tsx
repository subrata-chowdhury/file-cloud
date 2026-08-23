'use client';

import { FiFolder, FiMoreVertical, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';

interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
}

interface FolderCardProps {
  folder: Folder;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
  // onRename: (id: string, name: string) => void;
}

export default function FolderCard({ folder, onClick, onDelete }: FolderCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        e.target instanceof Node &&
        !menuRef.current.contains(e.target)
      ) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  return (
    <div
      onClick={() => onClick(folder.id)}
      className="group relative flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
          <FiFolder className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
            {folder.name}
          </h3>
          <p className="text-xs text-gray-500">{new Date(folder.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="rounded-full p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
        >
          <FiMoreVertical className="h-4 w-4" />
        </button>
        {showMenu && (
          <div className="absolute top-full right-0 z-10 mt-1 w-36 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
            {/* <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                // trigger rename
              }}
              className="flex w-full items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FiEdit2 className="mr-2 h-4 w-4 text-gray-400" />
              Rename
            </button> */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(false);
                onDelete(folder.id);
              }}
              className="flex w-full items-center px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <FiTrash2 className="mr-2 h-4 w-4 text-red-500" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
