import { FiAlertTriangle } from 'react-icons/fi';

interface DangerZoneProps {
  onDeleteData: () => void;
  onDeleteAccount: () => void;
}

export default function DangerZone({ onDeleteData, onDeleteAccount }: DangerZoneProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm dark:border-red-900/30 dark:bg-zinc-950">
      {/* Subtle red background glow on hover */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-50/30 to-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-red-900/10 dark:to-zinc-950"></div>

      <div className="relative z-10 border-b border-red-100 bg-red-50/50 p-6 dark:border-red-900/30 dark:bg-red-900/5">
        <h3 className="flex items-center gap-2 text-base font-semibold tracking-tight text-red-600 dark:text-red-500">
          <FiAlertTriangle className="h-5 w-5" />
          Danger Zone
        </h3>
      </div>
      <div className="relative z-10 divide-y divide-red-50 dark:divide-red-900/20">
        <div className="flex flex-col items-start justify-between gap-5 p-6 transition-colors hover:bg-red-50/20 sm:flex-row sm:items-center dark:hover:bg-red-900/10">
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Delete All Data</h4>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              Permanently delete all your files, folders, and storage data. This action is
              irreversible.
            </p>
          </div>
          <button
            onClick={onDeleteData}
            className="shrink-0 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-medium text-red-600 shadow-sm transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus:ring-2 focus:ring-red-500/20 focus:outline-none dark:border-red-900/30 dark:bg-zinc-900 dark:text-red-500 dark:hover:border-red-800 dark:hover:bg-red-900/20 dark:hover:text-red-400"
          >
            Delete All Data
          </button>
        </div>
        <div className="flex flex-col items-start justify-between gap-5 p-6 transition-colors hover:bg-red-50/20 sm:flex-row sm:items-center dark:hover:bg-red-900/10">
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">Delete Account</h4>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
              Permanently delete your entire account along with all its data. You will immediately
              be logged out.
            </p>
          </div>
          <button
            onClick={onDeleteAccount}
            className="shrink-0 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md hover:shadow-red-500/20 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
