import { FiFile } from 'react-icons/fi';
import CustomVideoPlayer from './CustomVideoPlayer';

interface ShareFilePreviewProps {
  name: string;
  url: string;
  mimeType: string;
}

export default function ShareFilePreview({ name, url, mimeType }: ShareFilePreviewProps) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const videoExtensions = ['.mp4', '.webm', '.mkv', '.avi', '.mov', '.wmv', '.flv'];

  const lowerName = name.toLowerCase();
  const isImage =
    mimeType.startsWith('image/') || imageExtensions.some((ext) => lowerName.endsWith(ext));
  const isVideo =
    mimeType.startsWith('video/') || videoExtensions.some((ext) => lowerName.endsWith(ext));

  return (
    <div
      className={`flex w-full items-center justify-center overflow-hidden rounded-3xl ${isVideo ? '' : 'min-h-[400px] border border-zinc-100/50 bg-zinc-50/50 dark:border-zinc-800/30 dark:bg-zinc-900/20'}`}
    >
      {isImage ? (
        <img src={url} alt={name} className="h-auto max-h-[80vh] w-full object-contain p-4" />
      ) : isVideo ? (
        <CustomVideoPlayer src={url} />
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-800">
            <FiFile className="h-10 w-10 text-zinc-400 dark:text-zinc-500" />
          </div>
          <h3 className="mb-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-white">
            No Preview Available
          </h3>
          <p className="max-w-xs text-sm font-medium text-zinc-500 dark:text-zinc-400">
            We can't display a preview for this file type. Please download the file to view its
            contents.
          </p>
        </div>
      )}
    </div>
  );
}
