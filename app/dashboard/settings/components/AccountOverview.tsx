import { FiLogOut } from 'react-icons/fi';
import { useUser } from '../../context/UserContext';
import { useRouter } from 'next/navigation';

export default function AccountOverview() {
  const { user: profile } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const getInitials = (name: string | null) => {
    return name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase()
      : 'U';
  };

  if (!profile) return null;

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
      <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-900 text-xl font-medium text-white shadow-sm dark:bg-white dark:text-zinc-900">
            {getInitials(profile.name)}
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
              {profile.name}
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{profile.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 focus:ring-2 focus:ring-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <FiLogOut className="h-4 w-4" />
          Log Out
        </button>
      </div>
    </div>
  );
}
