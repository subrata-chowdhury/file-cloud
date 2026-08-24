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
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
      <ShareNavbar />

      <main className="flex flex-1 items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="p-6 sm:p-10">
            <ShareFileInfo 
              name={file.name} 
              size={file.size} 
              mimeType={file.mimeType} 
              ownerName={file.owner?.name} 
            />

            <ShareFilePreview 
              name={file.name} 
              url={file.url} 
              mimeType={file.mimeType} 
            />

            <div className="flex justify-end">
              <a
                href={file.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-4 text-sm font-medium text-white transition-all hover:bg-zinc-800 sm:w-auto dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
              >
                <FiDownload className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" /> 
                Download File
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
