'use client';

import { useEffect, useState, useCallback } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import TrashFileCard, { TrashedFile } from './components/TrashFileCard';
import TrashFolderCard, { TrashedFolder } from './components/TrashFolderCard';
import FileDetailsDrawer from '../components/FileDetailsDrawer';

export default function TrashPage() {
  const [files, setFiles] = useState<TrashedFile[]>([]);
  const [folders, setFolders] = useState<TrashedFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<TrashedFile | null>(null);

  const fetchTrash = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trash');
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
        setFolders(data.folders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrash();
  }, [fetchTrash]);

  const handleRestoreFile = async (id: string) => {
    try {
      const res = await fetch(`/api/trash/file/${id}`, { method: 'PATCH' });
      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleHardDeleteFile = async (id: string) => {
    try {
      const res = await fetch(`/api/trash/file/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestoreFolder = async (id: string) => {
    try {
      const res = await fetch(`/api/trash/folder/${id}`, { method: 'PATCH' });
      if (res.ok) {
        setFolders((prev) => prev.filter((f) => f.id !== id));
        fetchTrash(); // To refresh if restoring a folder restored child files
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleHardDeleteFolder = async (id: string) => {
    try {
      const res = await fetch(`/api/trash/folder/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFolders((prev) => prev.filter((f) => f.id !== id));
        fetchTrash(); // To refresh if deleting a folder removed child files
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Trash Bin</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Items in trash can be restored or permanently deleted.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="relative flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                <div className="flex flex-1 flex-col gap-2 pt-1">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="flex gap-2">
                    <div className="h-3 w-16 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800/50" />
                    <div className="h-3 w-12 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800/50" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : files.length === 0 && folders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 py-24 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <FiCheckCircle className="h-8 w-8 text-zinc-400 dark:text-zinc-500" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-white">
              Trash is empty
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">No deleted items found.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {folders.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-zinc-100">
                  Folders
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {folders.map((folder) => (
                    <TrashFolderCard
                      key={folder.id}
                      folder={folder}
                      onRestore={handleRestoreFolder}
                      onHardDelete={handleHardDeleteFolder}
                    />
                  ))}
                </div>
              </div>
            )}

            {files.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-zinc-100">
                  Files
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {files.map((file) => (
                    <TrashFileCard
                      key={file.id}
                      file={file}
                      onRestore={handleRestoreFile}
                      onHardDelete={handleHardDeleteFile}
                      onSelect={(f) => setSelectedFile(f)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <FileDetailsDrawer
        file={
          selectedFile
            ? {
                ...selectedFile,
                isPublic: false,
                isFavorite: false,
                createdAt: selectedFile.updatedAt,
              }
            : null
        }
        isOpen={!!selectedFile}
        onClose={() => setSelectedFile(null)}
        onDelete={() => {}} // Not allowed in read-only
        onTogglePrivacy={() => {}} // Not allowed in read-only
        readOnly={true}
      />
    </>
  );
}
