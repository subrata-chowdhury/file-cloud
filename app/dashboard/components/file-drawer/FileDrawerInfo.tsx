import { useState, useEffect } from 'react';
import { FiEdit2, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import { FileDetails } from '../FileDetailsDrawer';

interface FileDrawerInfoProps {
  file: FileDetails;
  onRename?: (id: string, name: string) => Promise<void> | void;
  readOnly?: boolean;
}

export default function FileDrawerInfo({ file, onRename, readOnly = false }: FileDrawerInfoProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);

  useEffect(() => {
    if (file && !isEditingName) {
      setEditName(file.name);
    }
  }, [file, isEditingName]);

  const handleSaveName = async () => {
    if (!editName.trim() || editName === file.name || !onRename) {
      setIsEditingName(false);
      return;
    }
    setIsSavingName(true);
    await onRename(file.id, editName.trim());
    setIsSavingName(false);
    setIsEditingName(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <div className="mb-6">
        {isEditingName ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
              autoFocus
              disabled={isSavingName}
              className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
            />
            <div className="flex shrink-0 items-center gap-1">
              <button
                onClick={handleSaveName}
                disabled={isSavingName}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
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
                  setIsEditingName(false);
                }}
                disabled={isSavingName}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-700 disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="group flex items-start justify-between gap-4">
            <h3 className="break-words text-lg font-semibold text-zinc-900 dark:text-white">
              {file.name}
            </h3>
            {!readOnly && onRename && (
              <button
                onClick={() => setIsEditingName(true)}
                className="shrink-0 rounded-lg p-2 text-zinc-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              >
                <FiEdit2 className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {formatSize(file.size)} • {file.mimeType}
        </p>
      </div>

      <div className="mb-6 h-px w-full bg-zinc-100 dark:bg-zinc-800/60" />

      {/* Details List inserted below actions in the drawer, but placed here for component encapsulation if we want */}
    </>
  );
}
