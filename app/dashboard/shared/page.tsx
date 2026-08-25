'use client';

import { useState, useEffect } from 'react';
import FileCard, { FileData } from '../components/FileCard';
import { FiUsers } from 'react-icons/fi';
import FileDetailsDrawer from '../components/FileDetailsDrawer';

interface SharedFile extends FileData {
  ownerName: string | null;
  ownerEmail: string;
  sharedAt: string;
}

export default function SharedWithMePage() {
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<SharedFile | null>(null);

  useEffect(() => {
    fetchSharedFiles();
  }, []);

  const fetchSharedFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/shared-with-me');
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      }
    } catch (err) {
      console.error('Failed to fetch shared files:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFile = (file: FileData) => {
    setSelectedFile(file as SharedFile);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="custom-scrollbar flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Shared with Me
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Files that others have shared with you.
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
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <FiUsers className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-white">
              No shared files
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              When someone shares a file with you, it will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {files.map((file) => (
              <div key={file.id} className="group relative">
                <FileCard
                  file={file}
                  onSelect={() => handleSelectFile(file)}
                  onDelete={() => {}} // Dummy, button will be hidden by readOnly
                  onTogglePrivacy={() => {}} // Dummy, button will be hidden by readOnly
                  onRename={undefined} // Dummy, button will be hidden by readOnly
                  readOnly={true}
                />
                <div className="pointer-events-none absolute top-2 left-2 z-10 rounded bg-black/60 px-2 py-1 text-[10px] font-medium text-white opacity-100 shadow backdrop-blur-sm transition-opacity group-hover:opacity-100 sm:opacity-0">
                  Shared by {file.ownerName || file.ownerEmail}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FileDetailsDrawer
        file={selectedFile}
        isOpen={!!selectedFile}
        onClose={() => setSelectedFile(null)}
        onDelete={() => {}}
        onTogglePrivacy={() => {}}
        readOnly={true}
      />
    </div>
  );
}
