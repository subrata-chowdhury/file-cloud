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
}

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText,
  onConfirm,
  onClose,
  loading = false,
}: ConfirmModalProps) {
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl lg:max-w-lg">
        <div className="flex items-center justify-between border-b border-gray-100 bg-red-50/50 px-6 py-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-red-600">
            <FiAlertTriangle className="h-5 w-5" />
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="mb-4 text-sm font-medium text-gray-700">{description}</p>
          <p className="mb-2 text-sm text-gray-600">
            Please type <span className="font-bold text-red-600">{confirmText}</span> to confirm.
          </p>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
            placeholder={confirmText}
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={input !== confirmText || loading}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
