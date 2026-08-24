'use client';

import { useState, useEffect } from 'react';
import { FiX, FiSearch, FiUserPlus, FiLoader, FiUserMinus } from 'react-icons/fi';

interface User {
  id: string;
  name: string | null;
  email: string;
}

interface SharedUser extends User {
  sharedAt: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileId: string;
  fileName: string;
}

export default function ShareModal({ isOpen, onClose, fileId, fileName }: ShareModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
  const [isLoadingShared, setIsLoadingShared] = useState(false);
  const [isProcessingId, setIsProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && fileId) {
      fetchSharedUsers();
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isOpen, fileId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        searchUsers(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchSharedUsers = async () => {
    setIsLoadingShared(true);
    try {
      const res = await fetch(`/api/files/${fileId}/share`);
      if (res.ok) {
        const data = await res.json();
        setSharedUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch shared users', err);
    } finally {
      setIsLoadingShared(false);
    }
  };

  const searchUsers = async (query: string) => {
    setIsSearching(true);
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (err) {
      console.error('Failed to search users', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleShare = async (user: User) => {
    setIsProcessingId(user.id);
    try {
      const res = await fetch(`/api/files/${fileId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      if (res.ok) {
        setSearchQuery('');
        setSearchResults([]);
        await fetchSharedUsers();
      }
    } catch (err) {
      console.error('Share failed', err);
    } finally {
      setIsProcessingId(null);
    }
  };

  const handleUnshare = async (userId: string) => {
    setIsProcessingId(userId);
    try {
      const res = await fetch(`/api/files/${fileId}/share?userId=${userId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchSharedUsers();
      }
    } catch (err) {
      console.error('Unshare failed', err);
    } finally {
      setIsProcessingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm dark:bg-black/60">
      <div className="w-full max-w-md rounded-2xl border border-transparent bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/50">
        <div className="flex items-center justify-between border-b border-zinc-100 p-4 dark:border-zinc-800/60">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Share "{fileName}"</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-6">
            <div className="relative flex items-center">
              <FiSearch className="absolute left-3 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pr-4 pl-9 text-sm text-zinc-900 outline-none transition-colors focus:border-zinc-400 focus:bg-white focus:ring-4 focus:ring-zinc-400/10 dark:border-zinc-800/60 dark:bg-zinc-900/50 dark:text-white dark:focus:border-zinc-600 dark:focus:bg-zinc-950"
              />
              {isSearching && (
                <div className="absolute right-3">
                  <FiLoader className="h-4 w-4 animate-spin text-zinc-400" />
                </div>
              )}
            </div>

            {searchResults.length > 0 && (
              <div className="absolute left-0 top-full mt-2 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900 z-10">
                <ul className="max-h-60 overflow-y-auto p-1">
                  {searchResults.map((u) => {
                    const isAlreadyShared = sharedUsers.some((su) => su.id === u.id);
                    return (
                      <li key={u.id}>
                        <button
                          onClick={() => !isAlreadyShared && handleShare(u)}
                          disabled={isAlreadyShared || isProcessingId === u.id}
                          className="flex w-full items-center justify-between rounded-lg p-2 text-left transition-colors hover:bg-zinc-50 disabled:opacity-50 dark:hover:bg-zinc-800/50"
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                              {u.name || 'Unnamed User'}
                            </span>
                            <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                              {u.email}
                            </span>
                          </div>
                          <div>
                            {isProcessingId === u.id ? (
                              <FiLoader className="h-4 w-4 animate-spin text-zinc-400" />
                            ) : isAlreadyShared ? (
                              <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                                Shared
                              </span>
                            ) : (
                              <FiUserPlus className="h-4 w-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100" />
                            )}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              People with access
            </h4>
            
            {isLoadingShared ? (
              <div className="flex items-center justify-center py-6">
                <FiLoader className="h-5 w-5 animate-spin text-zinc-400" />
              </div>
            ) : sharedUsers.length === 0 ? (
              <p className="py-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
                Not shared with anyone yet.
              </p>
            ) : (
              <ul className="max-h-60 space-y-1 overflow-y-auto">
                {sharedUsers.map((su) => (
                  <li
                    key={su.id}
                    className="flex items-center justify-between rounded-xl p-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                        {su.name ? su.name[0].toUpperCase() : su.email[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {su.name || 'Unnamed User'}
                        </p>
                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                          {su.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnshare(su.id)}
                      disabled={isProcessingId === su.id}
                      className="shrink-0 rounded-lg p-2 text-zinc-400 hover:bg-zinc-200 hover:text-red-600 disabled:opacity-50 dark:hover:bg-zinc-700 dark:hover:text-red-400"
                      title="Remove access"
                    >
                      {isProcessingId === su.id ? (
                        <FiLoader className="h-4 w-4 animate-spin" />
                      ) : (
                        <FiUserMinus className="h-4 w-4" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
