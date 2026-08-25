import { FiFile, FiImage, FiVideo, FiEye, FiDownload, FiCalendar } from 'react-icons/fi';

interface ShareFileInfoProps {
  name: string;
  size: number;
  mimeType: string;
  ownerName?: string;
  views?: number;
  downloads?: number;
  createdAt?: string;
}

export default function ShareFileInfo({
  name,
  size,
  mimeType,
  ownerName,
  views,
  downloads,
  createdAt,
}: ShareFileInfoProps) {
  const isImage = mimeType.startsWith('image/');
  const isVideo = mimeType.startsWith('video/');

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatIndianNumber = (num: number) => {
    if (num < 1000) return num.toString();
    if (num < 100000) return (num / 1000).toFixed(num % 1000 !== 0 ? 1 : 0) + 'K';
    if (num < 10000000) return (num / 100000).toFixed(num % 100000 !== 0 ? 1 : 0) + 'L';
    return (num / 10000000).toFixed(num % 10000000 !== 0 ? 1 : 0) + 'Cr';
  };

  return (
    <div className="flex flex-col items-start gap-8">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-zinc-100 bg-zinc-50 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/50">
        {isImage ? (
          <FiImage className="h-10 w-10 text-zinc-400 dark:text-zinc-500" />
        ) : isVideo ? (
          <FiVideo className="h-10 w-10 text-zinc-400 dark:text-zinc-500" />
        ) : (
          <FiFile className="h-10 w-10 text-zinc-400 dark:text-zinc-500" />
        )}
      </div>

      <div className="flex w-full flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight break-words text-zinc-900 sm:text-4xl dark:text-white">
          {name}
        </h1>

        <div className="flex flex-col gap-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-900 dark:bg-zinc-800 dark:text-white">
              {formatSize(size)}
            </span>
            <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              {mimeType.split('/')[1] || mimeType}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-xs font-bold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {ownerName ? ownerName[0].toUpperCase() : 'U'}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                Shared By
              </span>
              <span className="text-zinc-900 dark:text-zinc-200">
                {ownerName || 'Unknown User'}
              </span>
            </div>
          </div>

          <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800/60"></div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            {createdAt && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Uploaded
                </span>
                <span className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                  <FiCalendar className="h-4 w-4" />
                  {new Date(createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            )}

            {views !== undefined && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Views
                </span>
                <span className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                  <FiEye className="h-4 w-4" />
                  {formatIndianNumber(views)}
                </span>
              </div>
            )}

            {downloads !== undefined && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                  Downloads
                </span>
                <span className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                  <FiDownload className="h-4 w-4" />
                  {formatIndianNumber(downloads)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
