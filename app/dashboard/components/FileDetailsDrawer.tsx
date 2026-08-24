import { useEffect } from 'react';
import FileDrawerHeader from './file-drawer/FileDrawerHeader';
import FileDrawerPreview from './file-drawer/FileDrawerPreview';
import FileDrawerInfo from './file-drawer/FileDrawerInfo';
import FileDrawerActions from './file-drawer/FileDrawerActions';

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
  onRename?: (id: string, name: string) => Promise<void> | void;
  readOnly?: boolean;
}

export default function FileDetailsDrawer({
  file,
  isOpen,
  onClose,
  onDelete,
  onTogglePrivacy,
  onRename,
  readOnly = false,
}: FileDetailsDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Small workaround: if a modal is open inside this drawer, we might not want to close.
      // But typically, the subcomponent modal will stop propagation.
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!file) return null;

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-zinc-900/20 backdrop-blur-sm transition-opacity duration-300 dark:bg-black/40 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 z-50 flex h-full w-full flex-col bg-white shadow-2xl transition-transform duration-300 sm:max-w-sm dark:bg-zinc-900 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <FileDrawerHeader onClose={onClose} />

        <div className="custom-scrollbar flex-1 overflow-y-auto p-4">
          <FileDrawerPreview name={file.name} url={file.url} mimeType={file.mimeType} />

          <FileDrawerInfo file={file} onRename={onRename} readOnly={readOnly} />

          <FileDrawerActions
            file={file}
            onDelete={onDelete}
            onTogglePrivacy={onTogglePrivacy}
            onClose={onClose}
            readOnly={readOnly}
          />

          <div className="mt-6 border-t border-zinc-100 pt-4 dark:border-zinc-800/60">
            <h4 className="mb-3 text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
              Details
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Type</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {file.mimeType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Size</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {formatSize(file.size)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Uploaded</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {new Date(file.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
