import { FiFile } from 'react-icons/fi';

interface ShareFilePreviewProps {
  name: string;
  url: string;
  mimeType: string;
}

export default function ShareFilePreview({ name, url, mimeType }: ShareFilePreviewProps) {
  const isImage = mimeType.startsWith('image/');
  const isVideo = mimeType.startsWith('video/');

  return (
    <div className="mb-10 flex min-h-[400px] w-full items-center justify-center overflow-hidden rounded-2xl border border-zinc-200/60 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-950/50">
      {isImage ? (
        <img
          src={url}
          alt={name}
          className="max-h-[600px] w-full object-contain"
        />
      ) : isVideo ? (
        <video src={url} controls className="max-h-[600px] w-full" />
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <FiFile className="mb-6 h-16 w-16 text-zinc-300 dark:text-zinc-700" />
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Preview not available for this file type.
          </p>
        </div>
      )}
    </div>
  );
}
