import { FiUser, FiSave } from 'react-icons/fi';
import { useState } from 'react';

interface PersonalInfoFormProps {
  initialName: string;
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
  const [name, setName] = useState(initialName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(name);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-50 bg-gray-50/50 px-8 py-5">
        <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <FiUser className="h-5 w-5 text-indigo-600" />
          Personal Details
        </h3>
        <p className="mt-1 text-sm text-gray-500">Update your identifying information.</p>
      </div>
      <div className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-bold text-gray-700">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-5 py-3 text-sm font-medium text-gray-900 transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:outline-none"
                required
                placeholder="Jane Doe"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-bold text-gray-700">Email Address</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full cursor-not-allowed rounded-2xl border border-gray-200 bg-gray-100/50 px-5 py-3 text-sm font-medium text-gray-400 opacity-70"
              />
              <p className="mt-2 text-xs font-medium text-gray-500">
                Your email address is used for login and cannot be changed.
              </p>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading || name === initialName}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-500/20 disabled:opacity-50 disabled:hover:shadow-none"
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
