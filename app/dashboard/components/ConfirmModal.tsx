import { useState } from 'react';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
  progress?: number;
  total?: number;
  progressMessage?: string;
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText,
  onConfirm,
  onClose,
  loading = false,
  progress = 0,
  total = 0,
  progressMessage = '',
}: ConfirmModalProps) {
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm dark:bg-black/60">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-transparent bg-white shadow-2xl lg:max-w-lg dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/50">
        <div className="flex items-center justify-between border-b border-zinc-100 bg-red-50/50 px-6 py-4 dark:border-zinc-800 dark:bg-red-900/10">
          <h3 className="flex items-center gap-2 text-lg font-bold text-red-600 dark:text-red-500">
            <FiAlertTriangle className="h-5 w-5" />
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="mb-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">{description}</p>

          {loading && total > 0 ? (
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-xs font-medium">
                <span className="text-zinc-500 dark:text-zinc-400">
                  {progressMessage || 'Processing...'}
                </span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  {progress} / {total}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-red-500 transition-all duration-300 ease-out"
                  style={{ width: `${Math.min(100, Math.max(0, (progress / total) * 100))}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
                Please type{' '}
                <span className="font-bold text-red-600 dark:text-red-500">{confirmText}</span> to
                confirm.
              </p>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-900 transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:focus:border-red-500/80 dark:focus:ring-red-900/50"
                placeholder={confirmText}
                autoFocus
                disabled={loading}
              />
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-zinc-100 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={input !== confirmText || loading}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-red-700 disabled:opacity-50 dark:bg-red-600/90 dark:hover:bg-red-600"
          >
            {loading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
