'use client';

import { FiSearch, FiFile, FiImage, FiVideo, FiLoader } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';

interface SearchResult {
  id: string;
  name: string;
  url: string;
  mimeType: string;
}

export default function GlobalSearch() {
  const [searchInput, setSearchInput] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchInput.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setIsOpen(true);

    const handler = setTimeout(async () => {
      try {
        const res = await fetch(`/api/files?search=${encodeURIComponent(searchInput)}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.files || []);
        }
      } catch (err) {
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchInput]);

  const getThumbnailUrl = (url: string) => {
    if (!url.includes('/upload/')) return url;
    return url.replace('/upload/', '/upload/w_100,h_100,c_fill,q_auto,f_auto/');
  };

  const getFileIcon = (file: SearchResult) => {
    if (file.mimeType.startsWith('image/')) {
      return (
        <img
          src={getThumbnailUrl(file.url)}
          alt={file.name}
          className="h-full w-full rounded-lg object-cover"
        />
      );
    }
    if (file.mimeType.startsWith('video/')) return <FiVideo className="h-4 w-4 text-purple-500" />;
    return <FiFile className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="group relative hidden md:block" ref={searchRef}>
      <FiSearch className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-blue-500" />
      <input
        type="text"
        placeholder="Search files..."
        value={searchInput}
        onFocus={() => {
          if (searchInput) setIsOpen(true);
        }}
        onChange={(e) => setSearchInput(e.target.value)}
        className="w-64 rounded-full border border-gray-200 bg-gray-50 py-2 pr-4 pl-9 text-sm text-gray-900 transition-all focus:w-80 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:outline-none"
      />

      {isOpen && searchInput.trim() !== '' && (
        <div className="absolute top-full mt-2 w-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl backdrop-blur-xl">
          <div className="p-2">
            {isSearching ? (
              <div className="flex items-center justify-center py-6 text-gray-400">
                <FiLoader className="h-5 w-5 animate-spin" />
              </div>
            ) : results.length > 0 ? (
              <div className="flex flex-col space-y-1">
                <div className="px-3 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Results
                </div>
                {results.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => {
                      window.open(file.url, '_blank');
                      setIsOpen(false);
                      setSearchInput('');
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-gray-50"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                      {getFileIcon(file)}
                    </div>
                    <span className="truncate text-sm font-medium text-gray-700">{file.name}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-gray-500">
                No files found for "{searchInput}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
