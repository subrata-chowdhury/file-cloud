import { FiUploadCloud } from 'react-icons/fi';

export default function EmptyState() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center shadow-sm">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 ring-8 ring-blue-50/50">
        <FiUploadCloud className="h-10 w-10 text-blue-600" />
      </div>
      <h3 className="font-display mt-2 text-xl font-semibold text-gray-900">No files yet</h3>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-500">
        Get started by uploading your first file. You can upload images, videos, documents, and more
        with no size limits!
      </p>
    </div>
  );
}
