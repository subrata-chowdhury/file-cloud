import Link from 'next/link';
import { FiUser, FiShield } from 'react-icons/fi';

export default function ProfileLinks() {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
      <div className="p-6 pb-2">
        <h3 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white">
          Account Preferences
        </h3>
      </div>
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-5 p-6 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
            <FiUser className="h-5 w-5 stroke-[1.5]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Personal Information
            </h4>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              Update your name and profile details.
            </p>
          </div>
        </Link>
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-5 p-6 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
            <FiShield className="h-5 w-5 stroke-[1.5]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
              Security & Password
            </h4>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              Change your password and secure your account.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
