import { FiFile, FiVideo } from 'react-icons/fi';

interface FileDrawerPreviewProps {
  name: string;
  url: string;
  mimeType: string;
}

export default function FileDrawerPreview({ name, url, mimeType }: FileDrawerPreviewProps) {
  const isImage = mimeType.startsWith('image/');
  const isVideo = mimeType.startsWith('video/');

  const getThumbnailUrl = (url: string) => {
    if (!url.includes('/upload/')) return url;
    return url.replace('/upload/', '/upload/w_800,c_limit,q_auto,f_auto/');
  };

  return (
    <div className="mb-6 flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-950">
      {isImage ? (
        <img
          src={getThumbnailUrl(url)}
          alt={name}
          className="h-full w-full object-contain"
        />
      ) : isVideo ? (
        <div className="flex flex-col items-center gap-3 text-zinc-400 dark:text-zinc-500">
          <FiVideo className="h-16 w-16" />
          <span className="text-sm font-medium">Video File</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-zinc-400 dark:text-zinc-500">
          <FiFile className="h-16 w-16" />
          <span className="text-sm font-medium">Document</span>
        </div>
      )}
    </div>
  );
}
