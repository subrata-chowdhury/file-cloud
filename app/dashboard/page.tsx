'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DashboardNav from './components/DashboardNav';
import EmptyState from './components/EmptyState';
import UploadManager from './components/UploadManager';
import FileCard from './components/FileCard';
import CustomSelect from './components/CustomSelect';
import Pagination from './components/Pagination';
import { FiLoader, FiSearch, FiFilter } from 'react-icons/fi';

interface StoredFile {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  isPublic: boolean;
  createdAt: string;
}

export default function Dashboard() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  // Filters
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState(''); // for the input field before pressing enter/debouncing
  const [type, setType] = useState('all');
  const [privacy, setPrivacy] = useState('all');

  const router = useRouter();

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: '6', // Adjust limit as needed
        search,
        type,
        privacy,
      });

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
  }, [pagination.page, search, type, privacy, router]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
      setPagination((p) => ({ ...p, page: 1 })); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
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
    <div className="min-h-screen bg-gray-50/50">
      <DashboardNav onLogout={handleLogout} />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Upload Section */}
          <div className="w-full shrink-0 lg:w-1/3">
            <div className="sticky top-24">
              <h2 className="font-display mb-6 text-xl font-semibold text-gray-900">
                Upload Files
              </h2>
              <UploadManager
                onUploadComplete={() => {
                  setPagination((p) => ({ ...p, page: 1 }));
                  fetchFiles();
                }}
              />
            </div>
          </div>

          {/* Files List Section */}
          <div className="w-full lg:w-2/3">
            <h2 className="font-display mb-6 flex items-center justify-between text-xl font-semibold text-gray-900">
              Your Files
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-500">
                {pagination.total} items
              </span>
            </h2>

            {/* Filters Bar */}
            <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row">
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search files..."
                  className="block w-full rounded-xl border border-gray-200 py-2.5 pr-3 pl-10 text-gray-900 transition-colors focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <div className="flex w-full gap-4 sm:w-auto">
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

            {loading ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-20">
                <FiLoader className="h-8 w-8 animate-spin text-blue-600" />
                <p className="animate-pulse text-sm font-medium text-gray-500">
                  Loading your storage...
                </p>
              </div>
            ) : files.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => setPagination((p) => ({ ...p, page }))}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
