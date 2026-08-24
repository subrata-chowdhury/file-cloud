'use client';

import { useState, useRef, useEffect } from 'react';
import {
  FiFile,
  FiImage,
  FiVideo,
  FiMoreVertical,
  FiGlobe,
  FiLock,
  FiTrash2,
  FiLink,
  FiExternalLink,
  FiLoader,
  FiCheck,
  FiX,
} from 'react-icons/fi';

interface FileCardProps {
  file: {
    id: string;
    name: string;
    url: string;
    size: number;
    mimeType: string;
    isPublic: boolean;
    createdAt: string;
  };
  onDelete: (id: string) => Promise<void> | void;
  onTogglePrivacy: (id: string, isPublic: boolean) => void;
  onRename?: (id: string, name: string) => Promise<void> | void;
}

export default function FileCard({ file, onDelete, onTogglePrivacy, onRename }: FileCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(file.name);
  const [isSavingName, setIsSavingName] = useState(false);
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

  const isImage = file.mimeType.startsWith('image/');
  const isVideo = file.mimeType.startsWith('video/');

  const getThumbnailUrl = (url: string) => {
    if (!url.includes('/upload/')) return url;
    return url.replace('/upload/', '/upload/w_200,h_200,c_fill,q_auto,f_auto/');
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
    await onDelete(file.id);
  };

  const handleSaveName = async () => {
    if (!editName.trim() || editName === file.name || !onRename) {
      setIsEditing(false);
      return;
    }
    setIsSavingName(true);
    await onRename(file.id, editName.trim());
    setIsSavingName(false);
    setIsEditing(false);
  };

  return (
    <div
      className={`group relative overflow-visible rounded-xl border border-zinc-200 bg-white shadow-sm transition-all duration-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 ${isDeleting ? 'pointer-events-none opacity-50' : ''}`}
    >
      <div
        className={`flex items-start gap-3 p-3 ${!isEditing ? 'cursor-pointer' : ''}`}
        onClick={() => {
          if (!isEditing) window.open(file.url, '_blank');
        }}
      >
        <div className="flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-zinc-100/80 transition-colors group-hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:group-hover:bg-zinc-700/80">
            {isImage ? (
              <img
                src={getThumbnailUrl(file.url)}
                alt={file.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : isVideo ? (
              <FiVideo className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
            ) : (
              <FiFile className="h-5 w-5 text-zinc-400 transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-300" />
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1 pt-0.5 pr-5">
          {isEditing ? (
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                autoFocus
                disabled={isSavingName}
                className="w-full rounded-md border border-zinc-300 bg-white px-2 py-0.5 text-sm font-medium text-zinc-900 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
              />
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={handleSaveName}
                  disabled={isSavingName}
                  title="Save name"
                  className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-800 text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  {isSavingName ? (
                    <FiLoader className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <FiCheck className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setEditName(file.name);
                    setIsEditing(false);
                  }}
                  disabled={isSavingName}
                  title="Cancel editing"
                  className="flex h-6 w-6 items-center justify-center rounded-md bg-zinc-100 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-700 disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
                >
                  <FiX className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <p
              className="truncate text-sm font-medium text-zinc-900 transition-colors dark:text-zinc-100"
              title={file.name}
            >
              {file.name}
            </p>
          )}
          <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
            <span>{formatSize(file.size)}</span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span
              className={`flex items-center rounded py-0.5 pr-1.5 pl-1 text-[10px] font-semibold tracking-widest uppercase ${
                file.isPublic
                  ? 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300'
                  : 'border border-zinc-200 bg-transparent text-zinc-500 dark:border-zinc-800/80 dark:text-zinc-400'
              }`}
            >
              {file.isPublic ? (
                <FiGlobe className="mr-1 h-3 w-3" />
              ) : (
                <FiLock className="mr-1 h-3 w-3" />
              )}
              {file.isPublic ? 'Public' : 'Private'}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute top-2 right-2" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="rounded-lg p-1.5 text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        >
          <FiMoreVertical className="h-4 w-4" />
        </button>

        {showMenu && (
          <div className="absolute right-0 z-20 mt-1 w-44 origin-top-right overflow-hidden rounded-xl border border-zinc-200/50 bg-white/80 p-1 shadow-lg backdrop-blur-md outline-none dark:border-zinc-800/50 dark:bg-zinc-900/80">
            <div className="flex flex-col gap-0.5" role="menu">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
              >
                <FiExternalLink className="mr-2 h-3.5 w-3.5 text-zinc-400" /> Open File
              </a>
              <button
                onClick={() => {
                  onTogglePrivacy(file.id, !file.isPublic);
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
              {file.isPublic && (
                <button
                  onClick={handleCopyLink}
                  className="flex w-full items-center rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
                >
                  <FiLink className="mr-2 h-3.5 w-3.5 text-zinc-400" />
                  {copyFeedback ? 'Copied!' : 'Copy Share Link'}
                </button>
              )}
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="flex w-full items-center rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
              >
                <FiFile className="mr-2 h-3.5 w-3.5 text-zinc-400" /> Rename
              </button>
              <div className="my-1 h-px w-full bg-zinc-100 dark:bg-zinc-800"></div>
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
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
