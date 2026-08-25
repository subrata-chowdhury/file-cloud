import { FiFile, FiVideo, FiPlay } from 'react-icons/fi';

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
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const videoExtensions = ['.mp4', '.webm', '.mkv', '.avi', '.mov', '.wmv', '.flv'];

  const lowerName = name.toLowerCase();
  const isImage =
    mimeType.startsWith('image/') || imageExtensions.some((ext) => lowerName.endsWith(ext));
  const isVideo =
    mimeType.startsWith('video/') || videoExtensions.some((ext) => lowerName.endsWith(ext));

  const getThumbnailUrl = (url: string, asVideo: boolean = false) => {
    if (!url.includes('/upload/')) return url;
    let transformedUrl = url.replace('/upload/', '/upload/w_200,h_200,c_fill,q_auto,f_auto/');

    // Cloudinary generates video thumbnails when requested with an image extension (.jpg)
    if (asVideo) {
      const lastDotIndex = transformedUrl.lastIndexOf('.');
      if (lastDotIndex !== -1) {
        transformedUrl = transformedUrl.substring(0, lastDotIndex) + '.jpg';
      } else {
        transformedUrl += '.jpg';
      }
    }
    return transformedUrl;
  };

  return (
    <div className={viewMode === 'grid' ? 'h-full w-full' : 'flex-shrink-0'}>
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-lg bg-zinc-100/80 transition-colors group-hover:bg-zinc-200/80 dark:bg-zinc-800/80 dark:group-hover:bg-zinc-700/80 ${viewMode === 'grid' ? 'h-full w-full' : 'h-10 w-10'}`}
      >
        {isImage ? (
          <img
            src={getThumbnailUrl(url)}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : isVideo ? (
          <>
            <img
              src={getThumbnailUrl(url, true)}
              alt={name}
              className="h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <div className="flex items-center justify-center rounded-full bg-black/40 p-1.5 backdrop-blur-sm">
                <FiPlay className="ml-0.5 h-3 w-3 text-white" />
              </div>
            </div>
          </>
        ) : (
          <FiFile
            className={`${viewMode === 'grid' ? 'h-10 w-10' : 'h-5 w-5'} text-zinc-400 transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-300`}
          />
        )}
      </div>
    </div>
  );
}
