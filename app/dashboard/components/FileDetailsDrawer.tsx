import { useState, useEffect } from 'react';
import {
  FiFile,
  FiImage,
  FiVideo,
  FiX,
  FiExternalLink,
  FiLink,
  FiEdit2,
  FiGlobe,
  FiLock,
  FiTrash2,
  FiLoader,
  FiCheck,
} from 'react-icons/fi';

export interface FileDetails {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  isPublic: boolean;
  createdAt: string;
}

interface FileDetailsDrawerProps {
  file: FileDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => Promise<void> | void;
  onTogglePrivacy: (id: string, isPublic: boolean) => void;
  onRename: (id: string, name: string) => Promise<void> | void;
}

export default function FileDetailsDrawer({
  file,
  isOpen,
  onClose,
  onDelete,
  onTogglePrivacy,
  onRename,
}: FileDetailsDrawerProps) {
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);

  // Sync edit name when file changes
  useEffect(() => {
    if (file) {
      setEditName(file.name);
    }
  }, [file]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!file) return null;

  const isImage = file.mimeType.startsWith('image/');
  const isVideo = file.mimeType.startsWith('video/');

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getThumbnailUrl = (url: string) => {
    if (!url.includes('/upload/')) return url;
    return url.replace('/upload/', '/upload/w_600,h_400,c_fit,q_auto,f_auto/');
  };

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

  const handleSaveName = async () => {
    if (!editName.trim() || editName === file.name) {
      setIsEditing(false);
      return;
    }
    setIsSavingName(true);
    await onRename(file.id, editName.trim());
    setIsSavingName(false);
    setIsEditing(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-zinc-900/20 backdrop-blur-sm transition-opacity duration-300 dark:bg-black/40 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-[400px] dark:bg-zinc-950 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 p-4 dark:border-zinc-800/60">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">File Details</h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto">
          {/* Preview Area */}
          <div className="flex h-56 w-full items-center justify-center border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800/60 dark:bg-zinc-900/30">
            {isImage ? (
              <img
                src={getThumbnailUrl(file.url)}
                alt={file.name}
                className="h-full w-full object-contain p-2"
              />
            ) : isVideo ? (
              <div className="flex flex-col items-center gap-3 text-zinc-400">
                <FiVideo className="h-16 w-16" />
                <span className="text-sm font-medium">Video File</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-zinc-400">
                <FiFile className="h-16 w-16" />
                <span className="text-sm font-medium">Document</span>
              </div>
            )}
          </div>

          <div className="p-6">
            {/* Title & Edit */}
            <div className="mb-8">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                    autoFocus
                    disabled={isSavingName}
                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-base font-medium text-zinc-900 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
                  />
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={handleSaveName}
                      disabled={isSavingName}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
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
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="group flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold break-all text-zinc-900 dark:text-white">
                    {file.name}
                  </h3>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="shrink-0 rounded-lg p-1.5 text-zinc-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Properties */}
            <div className="mb-8 space-y-4">
              <h4 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                Information
              </h4>
              <div className="grid grid-cols-3 gap-y-4 text-sm">
                <div className="font-medium text-zinc-500 dark:text-zinc-400">Type</div>
                <div className="col-span-2 text-zinc-900 dark:text-zinc-100">{file.mimeType}</div>

                <div className="font-medium text-zinc-500 dark:text-zinc-400">Size</div>
                <div className="col-span-2 text-zinc-900 dark:text-zinc-100">
                  {formatSize(file.size)}
                </div>

                <div className="font-medium text-zinc-500 dark:text-zinc-400">Added</div>
                <div className="col-span-2 text-zinc-900 dark:text-zinc-100">
                  {new Date(file.createdAt).toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </div>

                <div className="font-medium text-zinc-500 dark:text-zinc-400">Privacy</div>
                <div className="col-span-2 flex items-center text-zinc-900 dark:text-zinc-100">
                  {file.isPublic ? (
                    <>
                      <FiGlobe className="mr-2 h-4 w-4 text-green-500" /> Public
                    </>
                  ) : (
                    <>
                      <FiLock className="mr-2 h-4 w-4 text-zinc-400" /> Private
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
                Actions
              </h4>
              <div className="flex flex-col gap-2">
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800/80"
                >
                  <FiExternalLink className="h-4 w-4 text-zinc-400" />
                  Open in New Tab
                </a>

                <button
                  onClick={() => onTogglePrivacy(file.id, !file.isPublic)}
                  className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800/80"
                >
                  {file.isPublic ? (
                    <FiLock className="h-4 w-4 text-zinc-400" />
                  ) : (
                    <FiGlobe className="h-4 w-4 text-zinc-400" />
                  )}
                  Make {file.isPublic ? 'Private' : 'Public'}
                </button>

                {file.isPublic && (
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800/80"
                  >
                    <FiLink className="h-4 w-4 text-zinc-400" />
                    {copyFeedback ? 'Link Copied!' : 'Copy Share Link'}
                  </button>
                )}

                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                >
                  {isDeleting ? (
                    <FiLoader className="h-4 w-4 animate-spin" />
                  ) : (
                    <FiTrash2 className="h-4 w-4" />
                  )}
                  Move to Trash
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
