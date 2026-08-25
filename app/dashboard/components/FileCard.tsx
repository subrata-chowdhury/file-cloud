'use client';

import { useState } from 'react';
import { FiGlobe, FiLock, FiStar } from 'react-icons/fi';
import RenameModal from './RenameModal';
import FileIconPreview from './file-card/FileIconPreview';
import FileCardMenu from './file-card/FileCardMenu';

export interface FileData {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  isPublic: boolean;
  isFavorite?: boolean;
  createdAt: string;
}

interface FileCardProps {
  file: FileData;
  onDelete: (id: string) => Promise<void> | void;
  onTogglePrivacy: (id: string, isPublic: boolean) => void;
  onRename?: (id: string, name: string) => Promise<void> | void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => Promise<void> | void;
  onSelect?: (file: FileData) => void;
  readOnly?: boolean;
  viewMode?: 'grid' | 'list';
}

export default function FileCard({
  file,
  onDelete,
  onTogglePrivacy,
  onRename,
  onToggleFavorite,
  onSelect,
  readOnly = false,
  viewMode = 'list',
}: FileCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(file.id);
  };

  const handleSaveRename = async (newName: string) => {
    if (onRename) {
      await onRename(file.id, newName);
    }
  };

  const getThumbnailUrl = (url: string) => {
    if (!url.includes('/upload/')) return url;
    return url.replace('/upload/', '/upload/w_200,h_200,c_fill,q_auto,f_auto/');
  };

  return (
    <>
      <div
        className={`group relative overflow-visible rounded-xl border border-zinc-200 bg-white shadow-sm transition-all duration-200 hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 ${isDeleting ? 'pointer-events-none opacity-50' : ''} ${viewMode === 'grid' ? 'flex flex-col' : ''}`}
      >
        <div
          className={`flex cursor-pointer ${viewMode === 'grid' ? 'flex-col gap-3 p-2' : 'items-start gap-3 p-3'}`}
          onClick={() => {
            if (onSelect) {
              onSelect(file);
            } else {
              window.open(file.url, '_blank');
            }
          }}
        >
          <div className={`relative ${viewMode === 'grid' ? 'aspect-square w-full' : ''}`}>
            <FileIconPreview
              name={file.name}
              url={file.url}
              mimeType={file.mimeType}
              viewMode={viewMode}
            />
            {file.isFavorite && (
              <div className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50">
                <FiStar className="h-2.5 w-2.5 fill-yellow-500 text-yellow-500" />
              </div>
            )}
          </div>

          <div
            className={`flex w-full items-start justify-between ${viewMode === 'grid' ? 'px-1 pb-1' : 'min-w-0 flex-1 pt-0.5'}`}
          >
            <div className="min-w-0 flex-1 pr-2">
              <p
                className="truncate text-sm font-medium text-zinc-900 transition-colors dark:text-zinc-100"
                title={file.name}
              >
                {file.name}
              </p>
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

            <div className="relative flex shrink-0" onClick={(e) => e.stopPropagation()}>
              <FileCardMenu
                file={file}
                onDelete={handleDelete}
                onTogglePrivacy={() => onTogglePrivacy(file.id, !file.isPublic)}
                onToggleFavorite={
                  onToggleFavorite ? () => onToggleFavorite(file.id, !file.isFavorite) : undefined
                }
                onRename={
                  onRename
                    ? () => {
                        setIsRenameModalOpen(true);
                      }
                    : undefined
                }
                readOnly={readOnly}
                className="relative flex flex-col items-end"
              />
            </div>
          </div>
        </div>
      </div>

      <RenameModal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        initialName={file.name}
        onSave={handleSaveRename}
        itemType="file"
        mimeType={file.mimeType}
        thumbnailUrl={getThumbnailUrl(file.url)}
      />
    </>
  );
}
