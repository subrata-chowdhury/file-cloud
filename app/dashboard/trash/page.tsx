'use client';

import { useEffect, useState, useCallback } from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import TrashFileCard, { TrashedFile } from './components/TrashFileCard';
import TrashFolderCard, { TrashedFolder } from './components/TrashFolderCard';

export default function TrashPage() {
  const [files, setFiles] = useState<TrashedFile[]>([]);
  const [folders, setFolders] = useState<TrashedFolder[]>([]);
  const [loading, setLoading] = useState(true);

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
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Trash Bin</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Items in trash can be restored or permanently deleted.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 w-full animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800/50"
            ></div>
          ))}
        </div>
      ) : files.length === 0 && folders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 py-24 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <FiCheckCircle className="h-8 w-8 text-zinc-400 dark:text-zinc-500" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-white">Trash is empty</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">No deleted items found.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {folders.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-zinc-100">
                Folders
              </h2>
              <div className="flex flex-col gap-3">
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
              <div className="flex flex-col gap-3">
                {files.map((file) => (
                  <TrashFileCard
                    key={file.id}
                    file={file}
                    onRestore={handleRestoreFile}
                    onHardDelete={handleHardDeleteFile}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
