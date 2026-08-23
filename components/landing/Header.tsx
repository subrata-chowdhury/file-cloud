import Link from 'next/link';
import { FiCloud } from 'react-icons/fi';

export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link
            href="/"
            className="-m-1.5 flex items-center space-x-2 p-1.5 text-blue-600 transition-transform hover:scale-105"
          >
            <FiCloud className="h-8 w-8" />
            <span className="font-display text-xl font-bold tracking-tight text-gray-900">
              FileCloud
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-6">
          <Link
            href="/login"
            className="text-sm leading-6 font-semibold text-gray-700 transition-colors hover:text-gray-900"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Sign up
          </Link>
        </div>
      </nav>
    </header>
  );
}
