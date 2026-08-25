'use client';

import { useEffect, useState, use } from 'react';
import { FiDownload } from 'react-icons/fi';
import ShareNavbar from '../components/ShareNavbar';
import ShareError from '../components/ShareError';
import ShareFileInfo from '../components/ShareFileInfo';
import ShareFilePreview from '../components/ShareFilePreview';

interface StoredFile {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  isPublic: boolean;
  createdAt: string;
  views?: number;
  downloads?: number;
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
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-800 dark:border-t-white"></div>
      </div>
    );
  }

  if (error || !file) {
    return <ShareError error={error} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black">
      <ShareNavbar />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:flex-row lg:items-start lg:gap-16 lg:py-16">
        {/* Left Column: File Details and Actions */}
        <div className="flex w-full flex-col lg:sticky lg:top-32 lg:max-w-sm">
          <ShareFileInfo
            name={file.name}
            size={file.size}
            mimeType={file.mimeType}
            ownerName={file.owner?.name}
            views={file.views}
            downloads={file.downloads}
            createdAt={file.createdAt}
          />

          <div className="mt-8 flex flex-col gap-3">
            <a
              href={file.url}
              download
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                fetch(`/api/share/${unwrappedParams.id}/track-download`, { method: 'POST' }).catch(
                  console.error
                );
              }}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-zinc-900/20 transition-all hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-zinc-900/30 active:translate-y-0 dark:bg-white dark:text-zinc-900 dark:shadow-white/10 dark:hover:bg-zinc-100"
            >
              <FiDownload className="h-5 w-5 transition-transform group-hover:-translate-y-1" />
              Download File
            </a>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="mt-12 w-full flex-1 lg:mt-0">
          <ShareFilePreview name={file.name} url={file.url} mimeType={file.mimeType} />
        </div>
      </main>
    </div>
  );
}
