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
      className={`group relative overflow-visible rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-lg ${isDeleting ? 'pointer-events-none opacity-50' : ''}`}
    >
      <div
        className={`flex items-start space-x-4 p-5 ${!isEditing ? 'cursor-pointer' : ''}`}
        onClick={() => {
          if (!isEditing) window.open(file.url, '_blank');
        }}
      >
        <div className="mt-1 flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 transition-colors group-hover:bg-blue-50">
            {isImage ? (
              <FiImage className="h-6 w-6 text-blue-500" />
            ) : isVideo ? (
              <FiVideo className="h-6 w-6 text-purple-500" />
            ) : (
              <FiFile className="h-6 w-6 text-gray-400 transition-colors group-hover:text-blue-500" />
            )}
          </div>
        </div>

        <div className="min-w-0 flex-1 pr-6">
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                autoFocus
                disabled={isSavingName}
                className="w-full rounded border border-blue-500 px-2 py-1 text-sm font-semibold text-gray-900 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <div className="flex shrink-0 items-center space-x-1">
                <button
                  onClick={handleSaveName}
                  disabled={isSavingName}
                  title="Save name"
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100 disabled:opacity-50"
                >
                  {isSavingName ? (
                    <FiLoader className="h-4 w-4 animate-spin" />
                  ) : (
                    <FiCheck className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setEditName(file.name);
                    setIsEditing(false);
                  }}
                  disabled={isSavingName}
                  title="Cancel editing"
                  className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <p
              className="truncate text-sm font-semibold text-gray-900 transition-colors group-hover:text-blue-600"
              title={file.name}
            >
              {file.name}
            </p>
          )}
          <div className="mt-1.5 flex items-center space-x-2 text-xs font-medium text-gray-500">
            <span>{formatSize(file.size)}</span>
            <span className="text-gray-300">•</span>
            <span
              className={`flex items-center rounded-full px-1.5 py-0.5 ${file.isPublic ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-600'}`}
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

      <div className="absolute top-4 right-4" ref={menuRef}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="rounded-lg p-1.5 text-gray-400 opacity-0 transition-colors group-hover:opacity-100 hover:bg-gray-100 hover:text-gray-700 focus:opacity-100"
        >
          <FiMoreVertical size={18} />
        </button>

        {showMenu && (
          <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
            <div className="py-1" role="menu">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FiExternalLink className="mr-2 h-4 w-4" /> Open File
              </a>
              <button
                onClick={() => {
                  onTogglePrivacy(file.id, !file.isPublic);
                  setShowMenu(false);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {file.isPublic ? (
                  <FiLock className="mr-2 h-4 w-4" />
                ) : (
                  <FiGlobe className="mr-2 h-4 w-4" />
                )}
                Make {file.isPublic ? 'Private' : 'Public'}
              </button>
              {file.isPublic && (
                <button
                  onClick={handleCopyLink}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FiLink className="mr-2 h-4 w-4" />
                  {copyFeedback ? 'Copied!' : 'Copy Share Link'}
                </button>
              )}
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FiFile className="mr-2 h-4 w-4" /> Rename
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {isDeleting ? (
                  <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FiTrash2 className="mr-2 h-4 w-4" />
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
