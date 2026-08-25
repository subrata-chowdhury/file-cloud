import { FiFile, FiVideo } from 'react-icons/fi';

interface FileIconPreviewProps {
  name: string;
  url: string;
  mimeType: string;
  viewMode?: 'grid' | 'list';
}

export default function FileIconPreview({
  name,
  url,
  mimeType,
  viewMode = 'list',
}: FileIconPreviewProps) {
  const isImage = mimeType.startsWith('image/');
  const isVideo = mimeType.startsWith('video/');

  const getThumbnailUrl = (url: string) => {
    if (!url.includes('/upload/')) return url;
    return url.replace('/upload/', '/upload/w_200,h_200,c_fill,q_auto,f_auto/');
  };

  return (
    <div className={viewMode === 'grid' ? 'h-full w-full' : 'flex-shrink-0'}>
      <div
        className={`flex items-center justify-center overflow-hidden rounded-lg bg-zinc-100/80 transition-colors group-hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:group-hover:bg-zinc-700/80 ${viewMode === 'grid' ? 'h-full w-full' : 'h-10 w-10'}`}
      >
        {isImage ? (
          <img
            src={getThumbnailUrl(url)}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : isVideo ? (
          <FiVideo
            className={`${viewMode === 'grid' ? 'h-10 w-10' : 'h-5 w-5'} text-zinc-500 dark:text-zinc-400`}
          />
        ) : (
          <FiFile
            className={`${viewMode === 'grid' ? 'h-10 w-10' : 'h-5 w-5'} text-zinc-400 transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-300`}
          />
        )}
      </div>
    </div>
  );
}
