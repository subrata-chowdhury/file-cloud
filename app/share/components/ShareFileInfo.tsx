import { FiFile, FiImage, FiVideo } from 'react-icons/fi';

interface ShareFileInfoProps {
  name: string;
  size: number;
  mimeType: string;
  ownerName?: string;
}

export default function ShareFileInfo({ name, size, mimeType, ownerName }: ShareFileInfoProps) {
  const isImage = mimeType.startsWith('image/');
  const isVideo = mimeType.startsWith('video/');

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="mb-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-800/80">
        {isImage ? (
          <FiImage className="h-8 w-8 text-zinc-500 dark:text-zinc-400" />
        ) : isVideo ? (
          <FiVideo className="h-8 w-8 text-zinc-500 dark:text-zinc-400" />
        ) : (
          <FiFile className="h-8 w-8 text-zinc-500 dark:text-zinc-400" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="break-all text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          <span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-zinc-800/80">{formatSize(size)}</span>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span>Shared by {ownerName || 'a user'}</span>
        </div>
      </div>
    </div>
  );
}
