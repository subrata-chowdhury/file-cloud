import { FiShield } from 'react-icons/fi';

export default function ProfileStatus() {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-xs font-bold tracking-wider text-gray-400 uppercase">
        Account Status
      </h3>
      <div className="flex items-center gap-3 rounded-2xl border border-green-100/50 bg-green-50/50 p-4">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
        </span>
        <span className="text-sm font-bold text-green-700">Active Member</span>
      </div>

      <div className="mt-6 border-t border-gray-100 pt-6">
        <h3 className="mb-4 text-xs font-bold tracking-wider text-gray-400 uppercase">
          Security Check
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <FiShield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Protected</p>
            <p className="text-xs font-medium text-gray-500">Password enabled</p>
          </div>
        </div>
      </div>
    </div>
  );
}
