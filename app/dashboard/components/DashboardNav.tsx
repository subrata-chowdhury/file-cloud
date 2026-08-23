import { FiCloud, FiLogOut } from 'react-icons/fi';
import Link from 'next/link';

export default function DashboardNav({ onLogout }: { onLogout: () => void }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            <Link href="/" className="group flex items-center">
              <FiCloud className="mr-2 h-8 w-8 text-blue-600 transition-transform group-hover:scale-105" />
              <span className="font-display text-xl font-bold tracking-tight text-gray-900">
                FileCloud
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            <button
              onClick={onLogout}
              className="flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <FiLogOut className="mr-2 h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
