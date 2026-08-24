import { FiX } from 'react-icons/fi';

interface FileDrawerHeaderProps {
  onClose: () => void;
}

export default function FileDrawerHeader({ onClose }: FileDrawerHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800/60">
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-white">File Details</h2>
      <button
        onClick={onClose}
        className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
      >
        <FiX className="h-5 w-5" />
      </button>
    </div>
  );
}
