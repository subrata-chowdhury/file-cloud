import { FiFile, FiVideo } from 'react-icons/fi';
import CustomVideoPlayer from '../../../../components/ui/CustomVideoPlayer';

interface FileDrawerPreviewProps {
  name: string;
  url: string;
  mimeType: string;
}

export default function FileDrawerPreview({ name, url, mimeType }: FileDrawerPreviewProps) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const videoExtensions = ['.mp4', '.webm', '.mkv', '.avi', '.mov', '.wmv', '.flv'];

  const lowerName = name.toLowerCase();
  const isImage =
    mimeType.startsWith('image/') || imageExtensions.some((ext) => lowerName.endsWith(ext));
  const isVideo =
    mimeType.startsWith('video/') || videoExtensions.some((ext) => lowerName.endsWith(ext));

  const getThumbnailUrl = (url: string) => {
    if (!url.includes('/upload/')) return url;
    return url.replace('/upload/', '/upload/w_800,c_limit,q_auto,f_auto/');
  };

  return (
    <div
      className={`mb-6 flex w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-950 ${isVideo ? 'min-h-[200px]' : 'aspect-square'}`}
    >
      {isImage ? (
        <img src={getThumbnailUrl(url)} alt={name} className="h-full w-full object-contain" />
      ) : isVideo ? (
        <div className="w-full">
          <CustomVideoPlayer src={url} />
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
