import { FiLock, FiShield } from 'react-icons/fi';
import { useState } from 'react';

interface SecurityFormProps {
  onSave: (current: string, newPass: string) => Promise<boolean>;
  loading: boolean;
}

export default function SecurityForm({ onSave, loading }: SecurityFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (newPassword !== confirmPassword) {
      setLocalError('New passwords do not match.');
      return;
    }

    const success = await onSave(currentPassword, newPassword);
    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-950">
      <div className="mb-6">
        <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
          Security Settings
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Manage your password and secure your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {localError && (
          <div className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-600 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400">
            {localError}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-xl border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors focus:border-zinc-900 focus:bg-white focus:ring-1 focus:ring-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:border-white dark:focus:bg-zinc-950 dark:focus:ring-white"
            required
            placeholder="••••••••"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors focus:border-zinc-900 focus:bg-white focus:ring-1 focus:ring-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:border-white dark:focus:bg-zinc-950 dark:focus:ring-white"
              required
              minLength={6}
              placeholder="Min 6 characters"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors focus:border-zinc-900 focus:bg-white focus:ring-1 focus:ring-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:border-white dark:focus:bg-zinc-950 dark:focus:ring-white"
              required
              minLength={6}
              placeholder="Repeat new password"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || !currentPassword || !newPassword || !confirmPassword}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 sm:w-auto dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            <FiShield className="h-4 w-4" />
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}
