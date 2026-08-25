import { FiFile, FiVideo } from 'react-icons/fi';
import CustomVideoPlayer from '../../../../components/ui/CustomVideoPlayer';

interface FileDrawerPreviewProps {
  name: string;
  url: string;
  mimeType: string;
}

export default function FileDrawerPreview({ name, url, mimeType }: FileDrawerPreviewProps) {
  const isImage = mimeType.startsWith('image/');
  const isVideo =
    mimeType.startsWith('video/') ||
    ['mkv', 'mp4', 'webm', 'avi', 'mov', 'wmv', 'flv'].includes(mimeType.toLowerCase());
  const isPdf = mimeType === 'application/pdf';

  const getThumbnailUrl = (url: string) => {
    if (!url.includes('/upload/')) return url;
    return url.replace('/upload/', '/upload/w_800,c_limit,q_auto,f_auto/');
  };

  return (
    <div
      className={`mb-6 flex w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-950 ${isVideo || isPdf ? 'min-h-[300px]' : 'aspect-square'}`}
    >
      {isImage ? (
        <img src={getThumbnailUrl(url)} alt={name} className="h-full w-full object-contain" />
      ) : isVideo ? (
        <div className="w-full">
          <CustomVideoPlayer src={url} />
        </div>
      ) : isPdf ? (
        <object data={url} type="application/pdf" className="h-[400px] w-full">
          <div className="flex flex-col items-center justify-center gap-3 p-8 text-center text-zinc-500">
            <FiFile className="h-10 w-10 text-zinc-400" />
            <p className="text-sm">Preview not supported in your browser.</p>
          </div>
        </object>
      ) : (
        <div className="flex flex-col items-center gap-3 text-zinc-400 dark:text-zinc-500">
          <FiFile className="h-16 w-16" />
          <span className="text-sm font-medium">Document</span>
        </div>
      )}
    </div>
  );
}
