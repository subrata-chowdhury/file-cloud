'use client';

import { useState, useEffect } from 'react';
import FileCard, { FileData } from '../components/FileCard';
import { FiLoader, FiUsers } from 'react-icons/fi';
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
    <div className="flex h-full flex-col p-6">
      <div className="mb-8 flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Shared with Me
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Files that others have shared with you.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <FiLoader className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      ) : files.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/50 p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20">
            <FiUsers className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-zinc-900 dark:text-white">No shared files</h2>
          <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
            When someone shares a file with you, it will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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

      <FileDetailsDrawer
        file={selectedFile}
        isOpen={!!selectedFile}
        onClose={() => setSelectedFile(null)}
        onDelete={() => {}} // Dummy, button will be hidden by readOnly
        onTogglePrivacy={() => {}}
        readOnly={true}
      />
    </div>
  );
}
