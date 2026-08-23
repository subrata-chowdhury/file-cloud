import { FiLock, FiSave } from 'react-icons/fi';
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
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-50 bg-gray-50/50 px-8 py-5">
        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <FiLock className="h-5 w-5 text-gray-900" />
          Password & Security
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Ensure your account is using a long, random password to stay secure.
        </p>
      </div>
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {localError && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">
              {localError}
            </div>
          )}
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-5 py-3 text-sm font-medium text-gray-900 transition-all focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/10 focus:outline-none"
              required
              placeholder="••••••••"
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-5 py-3 text-sm font-medium text-gray-900 transition-all focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/10 focus:outline-none"
                required
                minLength={6}
                placeholder="Min 6 characters"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-5 py-3 text-sm font-medium text-gray-900 transition-all focus:border-gray-900 focus:bg-white focus:ring-4 focus:ring-gray-900/10 focus:outline-none"
                required
                minLength={6}
                placeholder="Repeat new password"
              />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading || !currentPassword || !newPassword || !confirmPassword}
              className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md hover:shadow-gray-900/20 disabled:opacity-50 disabled:hover:shadow-none"
            >
              <FiSave className="h-4 w-4" />
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
