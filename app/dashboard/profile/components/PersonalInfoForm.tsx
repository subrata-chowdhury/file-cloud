import { FiUser, FiSave } from 'react-icons/fi';
import { useState } from 'react';

interface PersonalInfoFormProps {
  initialName: string | null;
  email: string;
  onSave: (name: string) => Promise<void>;
  loading: boolean;
}

export default function PersonalInfoForm({
  initialName,
  email,
  onSave,
  loading,
}: PersonalInfoFormProps) {
  const [name, setName] = useState(initialName || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(name);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-100 bg-zinc-50/50 px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900/50">
        <h3 className="flex items-center gap-2 text-base font-semibold text-zinc-900 dark:text-white">
          <FiUser className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          Personal Details
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Update your identifying information.
        </p>
      </div>
      <div className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
                required
                placeholder="Jane Doe"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-500 opacity-70 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400"
              />
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                Your email address is used for login and cannot be changed.
              </p>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading || name === initialName}
              className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md disabled:opacity-50 disabled:hover:shadow-none dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <FiSave className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
