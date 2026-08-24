import Link from 'next/link';
import { FiCloud } from 'react-icons/fi';

interface ShareErrorProps {
  error?: string;
}

export default function ShareError({ error }: ShareErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-black">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <FiCloud className="mx-auto mb-5 h-12 w-12 text-zinc-300 dark:text-zinc-700" />
        <h2 className="mb-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Access Denied
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {error || 'File not found or is private.'}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
