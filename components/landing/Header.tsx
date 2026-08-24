import Link from 'next/link';
import { FiCloud } from 'react-icons/fi';

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/40 bg-white/50 shadow-sm backdrop-blur-2xl transition-all dark:border-zinc-800/40 dark:bg-zinc-950/50">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link
            href="/"
            className="-m-1.5 flex items-center space-x-2 p-1.5 transition-transform hover:scale-105"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-sm ring-1 ring-zinc-900/10 dark:bg-white dark:text-zinc-900 dark:ring-white/10">
              <FiCloud className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              FileCloud
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-8">
          <Link
            href="/login"
            className="text-sm font-semibold text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-zinc-900/10 transition-all hover:bg-zinc-800 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:outline-white"
          >
            Sign up
          </Link>
        </div>
      </nav>
    </header>
  );
}
