import Link from 'next/link';
import { FiCloud } from 'react-icons/fi';

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/20 bg-white/60 shadow-[0_4px_30px_rgba(0,0,0,0.02)] backdrop-blur-xl transition-all">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link
            href="/"
            className="-m-1.5 flex items-center space-x-2 p-1.5 text-blue-600 transition-transform hover:scale-105"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm">
              <FiCloud className="h-6 w-6" />
            </div>
            <span className="font-display text-xl font-extrabold tracking-tight text-gray-900">
              FileCloud
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-8">
          <Link
            href="/login"
            className="text-sm leading-6 font-bold text-gray-600 transition-colors hover:text-gray-900"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-gray-900 px-6 py-2.5 text-sm font-bold text-white shadow-sm ring-1 ring-gray-900/10 transition-all hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
          >
            Sign up
          </Link>
        </div>
      </nav>
    </header>
  );
}
