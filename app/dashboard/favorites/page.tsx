'use client';

import { useState, useEffect } from 'react';
import { FiStar } from 'react-icons/fi';
import FileCard, { FileData } from '../components/FileCard';
import FolderCard, { FolderData } from '../components/FolderCard';
import FileDetailsDrawer, { FileDetails } from '../components/FileDetailsDrawer';
import EmptyState from '../../../components/ui/EmptyState';

export default function FavoritesPage() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [folders, setFolders] = useState<FolderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileDetails | null>(null);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const [filesRes, foldersRes] = await Promise.all([
        fetch('/api/files?isFavorite=true&limit=100'),
        fetch('/api/folders?isFavorite=true'),
      ]);

      if (filesRes.ok && foldersRes.ok) {
        const filesData = await filesRes.json();
        const foldersData = await foldersRes.json();

        setFiles(filesData.files);
        setFolders(foldersData);
      }
    } catch (error) {
      console.error('Failed to fetch favorites', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleToggleFileFavorite = async (id: string, isFavorite: boolean) => {
    try {
      const res = await fetch(`/api/files/${id}/favorite`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite }),
      });
      if (res.ok) {
        // Remove it from the list since it's no longer a favorite
        if (!isFavorite) {
          setFiles(files.filter((f) => f.id !== id));
          if (selectedFile?.id === id) {
            setSelectedFile(null);
          }
        }
      }
    } catch (error) {
      console.error('Failed to toggle favorite status', error);
    }
  };

  const handleToggleFolderFavorite = async (id: string, isFavorite: boolean) => {
    try {
      const res = await fetch(`/api/folders/${id}/favorite`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite }),
      });
      if (res.ok) {
        if (!isFavorite) {
          setFolders(folders.filter((f) => f.id !== id));
        }
      }
    } catch (error) {
      console.error('Failed to toggle folder favorite status', error);
    }
  };

  const handleDeleteFile = async (id: string) => {
    try {
      const res = await fetch(`/api/files/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFiles(files.filter((f) => f.id !== id));
        if (selectedFile?.id === id) setSelectedFile(null);
      }
    } catch (error) {
      console.error('Failed to delete file', error);
    }
  };

  const handleDeleteFolder = async (id: string) => {
    try {
      const res = await fetch(`/api/folders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFolders(folders.filter((f) => f.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete folder', error);
    }
  };

  const handleTogglePrivacy = async (id: string, isPublic: boolean) => {
    try {
      const res = await fetch(`/api/files/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic }),
      });
      if (res.ok) {
        const updatedFile = await res.json();
        setFiles(files.map((f) => (f.id === id ? { ...f, isPublic: updatedFile.isPublic } : f)));
        if (selectedFile?.id === id) {
          setSelectedFile((prev) => (prev ? { ...prev, isPublic: updatedFile.isPublic } : null));
        }
      }
    } catch (error) {
      console.error('Failed to update privacy', error);
    }
  };

  const handleRename = async (id: string, newName: string) => {
    try {
      const res = await fetch(`/api/files/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (res.ok) {
        const updatedFile = await res.json();
        setFiles(files.map((f) => (f.id === id ? { ...f, name: updatedFile.name } : f)));
        if (selectedFile?.id === id) {
          setSelectedFile((prev) => (prev ? { ...prev, name: updatedFile.name } : null));
        }
      }
    } catch (error) {
      console.error('Failed to rename file', error);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="custom-scrollbar flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Favorites
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Quick access to your starred files and folders.
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
        ) : folders.length === 0 && files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
              <FiStar className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-white">
              No favorites yet
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Star files and folders to keep them here for quick access.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {folders.length > 0 && (
              <div>
                <h3 className="mb-4 text-sm font-semibold tracking-wide text-zinc-900 dark:text-white">
                  Folders
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {folders.map((folder) => (
                    <FolderCard key={folder.id} folder={folder} onDelete={handleDeleteFolder} />
                  ))}
                </div>
              </div>
            )}

            {files.length > 0 && (
              <div>
                <h3 className="mb-4 text-sm font-semibold tracking-wide text-zinc-900 dark:text-white">
                  Files
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {files.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      onDelete={handleDeleteFile}
                      onTogglePrivacy={handleTogglePrivacy}
                      onRename={handleRename}
                      onSelect={(f) => setSelectedFile(f as FileDetails)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <FileDetailsDrawer
        file={selectedFile}
        isOpen={!!selectedFile}
        onClose={() => setSelectedFile(null)}
        onDelete={handleDeleteFile}
        onTogglePrivacy={handleTogglePrivacy}
        onRename={handleRename}
      />
    </div>
  );
}
