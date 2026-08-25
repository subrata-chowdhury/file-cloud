import { FiUser, FiCheck } from 'react-icons/fi';
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
    <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-950">
      <div className="mb-6">
        <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
          Personal Details
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Update your identifying information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors focus:border-zinc-900 focus:bg-white focus:ring-1 focus:ring-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-white dark:focus:border-white dark:focus:bg-zinc-950 dark:focus:ring-white"
              required
              placeholder="Jane Doe"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full cursor-not-allowed rounded-xl border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-500 opacity-60 dark:border-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-500"
            />
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
              Your email address is used for login and cannot be changed.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || name === initialName}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 sm:w-auto dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            <FiCheck className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
