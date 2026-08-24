import { FiShield } from 'react-icons/fi';

export default function ProfileStatus() {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <h3 className="mb-4 text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
        Account Status
      </h3>
      <div className="flex items-center gap-3 rounded-xl border border-green-200/50 bg-green-50/50 p-3 dark:border-green-900/30 dark:bg-green-900/10">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
        </span>
        <span className="text-sm font-medium text-green-700 dark:text-green-400">
          Active Member
        </span>
      </div>

      <div className="mt-6 border-t border-zinc-100 pt-6 dark:border-zinc-800">
        <h3 className="mb-4 text-xs font-semibold tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
          Security Check
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
            <FiShield className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-white">Protected</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Password enabled</p>
          </div>
        </div>
      </div>
    </div>
  );
}
