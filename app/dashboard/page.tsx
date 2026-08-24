'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import EmptyState from './components/EmptyState';
import UploadManager, { UploadButton } from './components/UploadManager';
import FileCard from './components/FileCard';
import FolderCard from './components/FolderCard';
import FileDetailsDrawer from './components/FileDetailsDrawer';
import { FiLoader, FiFilter, FiFolderPlus, FiChevronRight, FiHome, FiX } from 'react-icons/fi';

interface StoredFile {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  isPublic: boolean;
  createdAt: string;
}

interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
}

export default function Dashboard() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: string; name: string }[]>([]);

  const [selectedFile, setSelectedFile] = useState<StoredFile | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const observerTarget = useRef<HTMLDivElement>(null);

  const [counts, setCounts] = useState<{
    type: Record<string, number>;
    privacy: Record<string, number>;
  } | null>(null);

  // Filters
  const [type, setType] = useState('all');
  const [privacy, setPrivacy] = useState('all');

  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const router = useRouter();

  const fetchFolders = useCallback(async () => {
    try {
      const url = currentFolderId ? `/api/folders?parentId=${currentFolderId}` : '/api/folders';
      const res = await fetch(url);
      if (res.ok) {
        setFolders(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  }, [currentFolderId]);

  const fetchFiles = useCallback(
    async (pageNum: number) => {
      const isLoadMore = pageNum > 1;
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: '12',
          type,
          privacy,
        });
        if (currentFolderId) {
          params.append('folderId', currentFolderId);
        }

        const res = await fetch(`/api/files?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setFiles((prev) => (isLoadMore ? [...prev, ...data.files] : data.files));
          setTotalPages(data.pagination.totalPages);
          setTotal(data.pagination.total);
        } else {
          if (res.status === 401) router.push('/login');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [type, privacy, currentFolderId, router]
  );

  const fetchCounts = useCallback(async () => {
    try {
      const url = currentFolderId
        ? `/api/files/counts?folderId=${currentFolderId}`
        : '/api/files/counts';
      const res = await fetch(url);
      if (res.ok) {
        setCounts(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  }, [currentFolderId]);

  // When filters or folder changes, reset page to 1
  useEffect(() => {
    setPage(1);
  }, [type, privacy, currentFolderId]);

  // Fetch files whenever page or dependencies (fetchFiles) change
  useEffect(() => {
    fetchFiles(page);
  }, [page, fetchFiles]);

  // Fetch folders and counts when their dependencies change
  useEffect(() => {
    fetchFolders();
    fetchCounts();
  }, [fetchFolders, fetchCounts]);

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages && !loading && !loadingMore) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [page, totalPages, loading, loadingMore]);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      const res = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFolderName, parentId: currentFolderId }),
      });
      if (res.ok) {
        setNewFolderName('');
        setIsNewFolderModalOpen(false);
        fetchFolders();
      }
    } catch (err) {
      console.error('Failed to create folder:', err);
    }
  };

  const handleDeleteFolder = async (id: string) => {
    try {
      const res = await fetch(`/api/folders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchFolders();
      }
    } catch (err) {
      console.error('Failed to delete folder:', err);
    }
  };

  const handleNavigateFolder = (folder: Folder) => {
    setCurrentFolderId(folder.id);
    setBreadcrumbs([...breadcrumbs, { id: folder.id, name: folder.name }]);
  };

  const handleNavigateBreadcrumb = (index: number) => {
    if (index === -1) {
      setCurrentFolderId(null);
      setBreadcrumbs([]);
    } else {
      const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
      setCurrentFolderId(newBreadcrumbs[newBreadcrumbs.length - 1].id);
      setBreadcrumbs(newBreadcrumbs);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/files/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.id !== id));
        fetchCounts();
        if (selectedFile?.id === id) {
          setSelectedFile(null);
        }
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleTogglePrivacy = async (id: string, isPublic: boolean) => {
    try {
      const res = await fetch(`/api/files/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic }),
      });
      if (res.ok) {
        const updated = await res.json();
        setFiles(files.map((f) => (f.id === id ? updated : f)));
        if (selectedFile?.id === id) {
          setSelectedFile(updated);
        }
        if (privacy !== 'all') {
          fetchFiles(page);
        }
      }
    } catch (err) {
      console.error('Privacy toggle failed:', err);
    }
  };

  const handleRename = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/files/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const updated = await res.json();
        setFiles(files.map((f) => (f.id === id ? updated : f)));
        if (selectedFile?.id === id) {
          setSelectedFile(updated);
        }
      }
    } catch (err) {
      console.error('Rename failed:', err);
    }
  };

  const typeOptions = [
    { value: 'all', label: 'All Files' },
    { value: 'image', label: 'Images' },
    { value: 'video', label: 'Videos' },
    { value: 'document', label: 'Documents' },
  ];

  const privacyOptions = [
    { value: 'all', label: 'Any Privacy' },
    { value: 'public', label: 'Public Only' },
    { value: 'private', label: 'Private Only' },
  ];

  return (
    <UploadManager
      folderId={currentFolderId}
      onUploadComplete={() => {
        if (page === 1) fetchFiles(1);
        else setPage(1);
        fetchCounts();
      }}
    >
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Files & Folders List Section */}
          <section>
            <div className="mb-6 flex flex-col gap-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm text-zinc-500">
                  <button
                    onClick={() => handleNavigateBreadcrumb(-1)}
                    className={`flex items-center gap-1 transition-colors hover:text-zinc-900 dark:hover:text-white ${currentFolderId === null ? 'font-semibold text-zinc-900 dark:text-white' : ''}`}
                  >
                    <FiHome className="h-4 w-4" />
                    <span>Root</span>
                  </button>
                  {breadcrumbs.map((crumb, idx) => (
                    <div key={crumb.id} className="flex items-center gap-2">
                      <FiChevronRight className="h-4 w-4 text-zinc-400" />
                      <button
                        onClick={() => handleNavigateBreadcrumb(idx)}
                        className={`transition-colors hover:text-zinc-900 dark:hover:text-white ${idx === breadcrumbs.length - 1 ? 'font-semibold text-zinc-900 dark:text-white' : ''}`}
                      >
                        {crumb.name}
                      </button>
                    </div>
                  ))}
                </nav>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <UploadButton />

                  <button
                    onClick={() => setIsNewFolderModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl border border-transparent bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:outline-none dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 dark:focus:ring-white dark:focus:ring-offset-zinc-900"
                  >
                    <FiFolderPlus className="h-4 w-4" />
                    New Folder
                  </button>
                </div>
              </div>

              {/* Badges / Filters */}
              <div className="flex flex-wrap items-center gap-4 border-b border-zinc-200/60 pb-4 dark:border-zinc-800/60">
                {/* Type Filter */}
                <div className="flex [scrollbar-width:none] items-center gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  <FiFilter className="mr-1 h-4 w-4 text-zinc-400" />
                  {typeOptions.map((opt) => {
                    const isSelected = type === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setType(opt.value)}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                          isSelected
                            ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm dark:border-white dark:bg-white dark:text-zinc-900'
                            : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {counts && (
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] leading-none ${
                              isSelected
                                ? 'bg-white/20 text-white dark:bg-black/20 dark:text-zinc-900'
                                : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                            }`}
                          >
                            {counts.type[opt.value] || 0}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="hidden h-5 w-px bg-zinc-200 sm:block dark:bg-zinc-800"></div>

                {/* Privacy Filter */}
                <div className="flex [scrollbar-width:none] items-center gap-1.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {privacyOptions.map((opt) => {
                    const isSelected = privacy === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setPrivacy(opt.value)}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                          isSelected
                            ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm dark:border-white dark:bg-white dark:text-zinc-900'
                            : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {counts && (
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] leading-none ${
                              isSelected
                                ? 'bg-white/20 text-white dark:bg-black/20 dark:text-zinc-900'
                                : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                            }`}
                          >
                            {counts.privacy[opt.value] || 0}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Folders Grid */}
            {folders.length > 0 && (
              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {folders.map((folder) => (
                  <FolderCard
                    key={folder.name}
                    folder={folder}
                    onClick={() => handleNavigateFolder(folder)}
                    onDelete={handleDeleteFolder}
                  />
                ))}
              </div>
            )}

            {/* Files Grid */}
            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
              <EmptyState
                hasFilters={type !== 'all' || privacy !== 'all'}
                onNewFolder={() => setIsNewFolderModalOpen(true)}
                onResetFilters={() => {
                  setType('all');
                  setPrivacy('all');
                }}
              />
            ) : files.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {files.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      onDelete={handleDelete}
                      onTogglePrivacy={handleTogglePrivacy}
                      onRename={handleRename}
                      onSelect={(f) => setSelectedFile(f)}
                    />
                  ))}
                </div>

                {/* Infinite Scroll Observer Target & Loader */}
                <div
                  ref={observerTarget}
                  className="mt-8 flex w-full flex-col items-center justify-center py-6"
                >
                  {loadingMore ? (
                    <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                      <FiLoader className="h-4 w-4 animate-spin" />
                      Loading more...
                    </div>
                  ) : page >= totalPages ? (
                    <div className="text-sm text-zinc-400 dark:text-zinc-600">
                      You've reached the end.
                    </div>
                  ) : null}
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-gray-500">
                {type !== 'all' || privacy !== 'all'
                  ? 'No files matching your filters.'
                  : 'No files in this folder yet.'}
              </div>
            )}
          </section>
        </div>

        {/* New Folder Modal */}
        {isNewFolderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm dark:bg-black/60">
            <div className="w-full max-w-md rounded-2xl border border-transparent bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/50">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Create New Folder
                </h3>
                <button
                  onClick={() => setIsNewFolderModalOpen(false)}
                  className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleCreateFolder}>
                <div className="mb-6">
                  <label
                    htmlFor="folderName"
                    className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Folder Name
                  </label>
                  <input
                    type="text"
                    id="folderName"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 transition-colors focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/20 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-white dark:focus:border-zinc-600 dark:focus:ring-white/10"
                    placeholder="e.g. Work Documents"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsNewFolderModalOpen(false)}
                    className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 focus:ring-2 focus:ring-zinc-900/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 dark:focus:ring-white/20"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newFolderName.trim()}
                    className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-900/20 focus:outline-none disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 dark:focus:ring-white/20"
                  >
                    Create Folder
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <FileDetailsDrawer
        file={selectedFile}
        isOpen={!!selectedFile}
        onClose={() => setSelectedFile(null)}
        onDelete={handleDelete}
        onTogglePrivacy={handleTogglePrivacy}
        onRename={handleRename}
      />
    </UploadManager>
  );
}
