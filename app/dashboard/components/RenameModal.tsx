import { useState, useEffect } from 'react';
import { FiX, FiCheck, FiLoader, FiFile, FiVideo, FiFolder, FiImage } from 'react-icons/fi';

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName: string;
  onSave: (newName: string) => Promise<void>;
  itemType: 'file' | 'folder';
  mimeType?: string;
  thumbnailUrl?: string;
}

export default function RenameModal({
  isOpen,
  onClose,
  initialName,
  onSave,
  itemType,
  mimeType,
  thumbnailUrl,
}: RenameModalProps) {
  const [name, setName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
    }
  }, [isOpen, initialName]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim() || name === initialName) {
      onClose();
      return;
    }
    setIsSaving(true);
    await onSave(name.trim());
    setIsSaving(false);
    onClose();
  };

  if (!isOpen) return null;

  const isImage = mimeType?.startsWith('image/');
  const isVideo = mimeType?.startsWith('video/');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm dark:bg-black/60">
      <div className="w-full max-w-sm rounded-2xl border border-transparent bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/50">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 p-4 dark:border-zinc-800/60">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Rename</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Preview Section */}
          <div className="mb-6 flex items-center gap-4 rounded-xl border border-zinc-200/60 bg-zinc-50 p-4 dark:border-zinc-800/60 dark:bg-zinc-900/50">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-200/50 text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400">
              {itemType === 'folder' ? (
                <FiFolder className="h-6 w-6" />
              ) : isImage && thumbnailUrl ? (
                <img src={thumbnailUrl} alt="Preview" className="h-full w-full object-cover" />
              ) : isVideo ? (
                <FiVideo className="h-6 w-6" />
              ) : (
                <FiFile className="h-6 w-6" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {initialName}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {itemType === 'folder' ? 'Folder' : mimeType || 'File'}
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave}>
            <div className="mb-6">
              <label
                htmlFor="renameInput"
                className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                New Name
              </label>
              <input
                type="text"
                id="renameInput"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                disabled={isSaving}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-colors focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/20 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-zinc-600 dark:focus:ring-white/10"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 focus:ring-2 focus:ring-zinc-900/20 focus:outline-none disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 dark:focus:ring-white/20"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !name.trim() || name === initialName}
                className="flex min-w-[90px] items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-900/20 focus:outline-none disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 dark:focus:ring-white/20"
              >
                {isSaving ? <FiLoader className="h-4 w-4 animate-spin" /> : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
