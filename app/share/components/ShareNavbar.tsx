import Link from 'next/link';
import { FiCloud } from 'react-icons/fi';

export default function ShareNavbar() {
  return (
    <nav className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-white">
              <FiCloud className="h-5 w-5 text-white dark:text-zinc-900" />
            </div>
            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
              FileCloud
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
