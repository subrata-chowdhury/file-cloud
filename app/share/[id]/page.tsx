'use client';

import { useEffect, useState, use } from 'react';
import { FiFile, FiImage, FiVideo, FiDownload, FiCloud } from 'react-icons/fi';
import Link from 'next/link';

interface StoredFile {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  isPublic: boolean;
  createdAt: string;
  owner?: { name: string };
}

export default function SharePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [file, setFile] = useState<StoredFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const res = await fetch(`/api/share/${unwrappedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          setFile(data);
        } else {
          const data = await res.json();
          setError(data.error || 'Failed to load file');
        }
      } catch (err) {
        setError('An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchFile();
  }, [unwrappedParams.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiCloud className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-500">{error || 'File not found or is private.'}</p>
          <Link href="/" className="mt-6 inline-block text-blue-600 hover:underline">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const isImage = file.mimeType.startsWith('image/');
  const isVideo = file.mimeType.startsWith('video/');

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center">
              <FiCloud className="mr-2 h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">FileCloud</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-lg">
          <div className="p-8">
            <div className="mb-8 flex items-center space-x-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50">
                {isImage ? (
                  <FiImage className="h-8 w-8 text-blue-500" />
                ) : isVideo ? (
                  <FiVideo className="h-8 w-8 text-purple-500" />
                ) : (
                  <FiFile className="h-8 w-8 text-gray-500" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold break-all text-gray-900">{file.name}</h1>
                <p className="mt-1 flex items-center space-x-2 text-gray-500">
                  <span>{formatSize(file.size)}</span>
                  <span>•</span>
                  <span>Shared by {file.owner?.name || 'a user'}</span>
                </p>
              </div>
            </div>

            <div className="mb-8 flex min-h-[300px] items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
              {isImage ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="max-h-[500px] max-w-full object-contain"
                />
              ) : isVideo ? (
                <video src={file.url} controls className="max-h-[500px] max-w-full" />
              ) : (
                <div className="p-12 text-center text-gray-500">
                  <FiFile className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                  <p>Preview not available for this file type.</p>
                </div>
              )}
            </div>

            <div className="flex justify-center">
              <a
                href={file.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              >
                <FiDownload className="mr-2 h-5 w-5" /> Download File
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
