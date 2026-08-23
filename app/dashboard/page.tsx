'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import EmptyState from './components/EmptyState';
import UploadManager from './components/UploadManager';
import FileCard from './components/FileCard';
import CustomSelect from './components/CustomSelect';
import Pagination from './components/Pagination';
import FolderCard from './components/FolderCard';
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

  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

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

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
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
        setFiles(data.files);
        setPagination(data.pagination);
      } else {
        if (res.status === 401) router.push('/login');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, type, privacy, currentFolderId, router]);

  useEffect(() => {
    fetchFolders();
    fetchFiles();
  }, [fetchFolders, fetchFiles]);

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
    setPagination((p) => ({ ...p, page: 1 }));
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
    setPagination((p) => ({ ...p, page: 1 }));
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/files/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFiles(files.filter((f) => f.id !== id));
        fetchFiles();
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
        if (privacy !== 'all') {
          fetchFiles();
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
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Upload Section */}
        <section>
          <UploadManager
            folderId={currentFolderId}
            onUploadComplete={() => {
              setPagination((p) => ({ ...p, page: 1 }));
              fetchFiles();
            }}
          />
        </section>

        {/* Files & Folders List Section */}
        <section>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display flex items-center gap-3 text-xl font-semibold text-gray-900">
              Your Files
            </h2>

            {/* Actions & Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsNewFolderModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                <FiFolderPlus className="h-4 w-4" />
                New Folder
              </button>

              <div className="hidden h-6 w-px bg-gray-200 sm:block"></div>

              <div className="flex gap-2">
                {(type !== 'all' || privacy !== 'all') && (
                  <button
                    onClick={() => {
                      setType('all');
                      setPrivacy('all');
                      setPagination((p) => ({ ...p, page: 1 }));
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900 focus:ring-2 focus:ring-gray-500/20 focus:outline-none"
                    title="Reset Filters"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                )}
                <CustomSelect
                  value={type}
                  onChange={(v) => {
                    setType(v);
                    setPagination((p) => ({ ...p, page: 1 }));
                  }}
                  options={typeOptions}
                  icon={<FiFilter />}
                />
                <CustomSelect
                  value={privacy}
                  onChange={(v) => {
                    setPrivacy(v);
                    setPagination((p) => ({ ...p, page: 1 }));
                  }}
                  options={privacyOptions}
                />
              </div>
            </div>
          </div>

          {/* Breadcrumbs */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <button
              onClick={() => handleNavigateBreadcrumb(-1)}
              className={`flex items-center gap-1 transition-colors hover:text-blue-600 ${currentFolderId === null ? 'font-semibold text-gray-900' : ''}`}
            >
              <FiHome className="h-4 w-4" />
              <span>Root</span>
            </button>
            {breadcrumbs.map((crumb, idx) => (
              <div key={crumb.id} className="flex items-center gap-2">
                <FiChevronRight className="h-4 w-4 text-gray-400" />
                <button
                  onClick={() => handleNavigateBreadcrumb(idx)}
                  className={`transition-colors hover:text-blue-600 ${idx === breadcrumbs.length - 1 ? 'font-semibold text-gray-900' : ''}`}
                >
                  {crumb.name}
                </button>
              </div>
            ))}
          </nav>

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
            <div className="flex flex-col items-center justify-center space-y-4 py-32">
              <FiLoader className="h-8 w-8 animate-spin text-blue-600" />
              <p className="animate-pulse text-sm font-medium text-gray-500">
                Loading your storage...
              </p>
            </div>
          ) : files.length === 0 && folders.length === 0 ? (
            <EmptyState
              hasFilters={type !== 'all' || privacy !== 'all'}
              onNewFolder={() => setIsNewFolderModalOpen(true)}
              onResetFilters={() => {
                setType('all');
                setPrivacy('all');
                setPagination((p) => ({ ...p, page: 1 }));
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
                  />
                ))}
              </div>
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => setPagination((p) => ({ ...p, page }))}
                />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Create New Folder</h3>
              <button
                onClick={() => setIsNewFolderModalOpen(false)}
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateFolder}>
              <div className="mb-6">
                <label
                  htmlFor="folderName"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Folder Name
                </label>
                <input
                  type="text"
                  id="folderName"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  placeholder="e.g. Work Documents"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewFolderModalOpen(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newFolderName.trim()}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
