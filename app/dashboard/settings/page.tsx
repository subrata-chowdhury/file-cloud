'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FiLogOut,
  FiTrash2,
  FiAlertTriangle,
  FiUser,
  FiShield,
  FiCheckCircle,
} from 'react-icons/fi';
import ConfirmModal from '../components/ConfirmModal';

interface UserProfile {
  name: string;
  email: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [deleteProgress, setDeleteProgress] = useState(0);
  const [deleteTotal, setDeleteTotal] = useState(0);
  const [deleteMessage, setDeleteMessage] = useState('');

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          setProfile(await res.json());
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const processStream = async (res: Response, onSuccess: () => void) => {
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    if (!reader) throw new Error('No stream available');

    let streamDone = false;
    while (!streamDone) {
      const { value, done: readerDone } = await reader.read();
      streamDone = readerDone;
      if (value) {
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.trim().startsWith('data: ')) {
            try {
              const data = JSON.parse(line.trim().slice(6));
              if (data.progress !== undefined) setDeleteProgress(data.progress);
              if (data.total !== undefined) setDeleteTotal(data.total);
              if (data.message !== undefined) setDeleteMessage(data.message);

              if (data.done) {
                if (data.error) {
                  setMessage({ type: 'error', text: data.error });
                } else {
                  onSuccess();
                }
              }
            } catch (e) {
              console.error('Failed to parse SSE line:', line, e);
            }
          }
        }
      }
    }
  };

  const resetDeleteState = () => {
    setDeleteProgress(0);
    setDeleteTotal(0);
    setDeleteMessage('');
  };

  const handleDeleteData = async () => {
    setIsDeleting(true);
    resetDeleteState();
    try {
      const res = await fetch('/api/user/data', { method: 'DELETE' });
      if (res.ok && res.headers.get('content-type')?.includes('text/event-stream')) {
        await processStream(res, () => {
          setMessage({
            type: 'success',
            text: 'All files and folders have been securely deleted.',
          });
          setIsDataModalOpen(false);
        });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to delete data.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred while deleting data.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    resetDeleteState();
    try {
      const res = await fetch('/api/user', { method: 'DELETE' });
      if (res.ok && res.headers.get('content-type')?.includes('text/event-stream')) {
        await processStream(res, () => {
          router.push('/login');
        });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to delete account.' });
        setIsDeleting(false);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred while deleting account.' });
      setIsDeleting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase()
      : 'U';
  };

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-zinc-900 dark:border-zinc-800 dark:border-t-zinc-100"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Settings
        </h1>
      </div>

      {message && (
        <div
          className={`mb-6 flex items-center gap-3 rounded-xl p-4 text-sm font-medium ${message.type === 'error' ? 'border border-red-100 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400' : 'border border-green-100 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400'}`}
        >
          {message.type === 'error' ? (
            <FiAlertTriangle className="h-5 w-5" />
          ) : (
            <FiCheckCircle className="h-5 w-5" />
          )}
          {message.text}
        </div>
      )}

      <div className="space-y-5">
        {/* Account Overview */}
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          {/* Decorative background */}
          <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-zinc-100/80 blur-2xl dark:bg-zinc-800/80"></div>
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-zinc-100/80 blur-2xl dark:bg-zinc-800/80"></div>

          <div className="relative z-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-xl font-bold text-white shadow-md dark:bg-white dark:text-zinc-900">
                {getInitials(profile.name)}
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                  {profile.name}
                </h2>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {profile.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-bold text-zinc-700 shadow-sm transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-600 focus:ring-2 focus:ring-red-500/20 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-red-900/50 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            >
              <FiLogOut className="h-4 w-4" />
              Log Out
            </button>
          </div>
        </div>

        {/* Profile Links */}
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-100 bg-zinc-50/50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-800/50">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Account Preferences
            </h3>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            <Link
              href="/dashboard/profile"
              className="group flex items-center justify-between p-5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 transition-colors group-hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:group-hover:bg-zinc-700">
                  <FiUser className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 transition-colors dark:text-white">
                    Personal Information
                  </h4>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    Update your name and profile details.
                  </p>
                </div>
              </div>
              <span className="-translate-x-2 text-xs font-bold text-zinc-900 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 dark:text-white">
                Edit &rarr;
              </span>
            </Link>
            <Link
              href="/dashboard/profile"
              className="group flex items-center justify-between p-5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-900 transition-colors group-hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:group-hover:bg-zinc-700">
                  <FiShield className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 transition-colors dark:text-white">
                    Security & Password
                  </h4>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    Change your password and secure your account.
                  </p>
                </div>
              </div>
              <span className="-translate-x-2 text-xs font-bold text-zinc-900 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 dark:text-white">
                Update &rarr;
              </span>
            </Link>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="group relative overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm dark:border-red-900/30 dark:bg-zinc-900">
          {/* Subtle red background glow on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-50/30 to-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-red-900/10 dark:to-zinc-900"></div>

          <div className="relative z-10 border-b border-red-100 bg-red-50/50 px-5 py-3 dark:border-red-900/30 dark:bg-red-900/5">
            <h3 className="flex items-center gap-2 text-base font-bold text-red-600 dark:text-red-500">
              <FiAlertTriangle className="h-4 w-4" />
              Danger Zone
            </h3>
          </div>
          <div className="relative z-10 divide-y divide-red-50 dark:divide-red-900/20">
            <div className="flex flex-col items-start justify-between gap-4 p-5 transition-colors hover:bg-red-50/20 sm:flex-row sm:items-center dark:hover:bg-red-900/10">
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Delete All Data</h4>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  Permanently delete all your files, folders, and storage data. This action is
                  irreversible. Your account will remain active.
                </p>
              </div>
              <button
                onClick={() => setIsDataModalOpen(true)}
                className="shrink-0 rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-600 shadow-sm transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus:ring-2 focus:ring-red-500/20 focus:outline-none dark:border-red-900/30 dark:bg-zinc-800 dark:text-red-500 dark:hover:border-red-800 dark:hover:bg-red-900/20 dark:hover:text-red-400"
              >
                Delete All Data
              </button>
            </div>
            <div className="flex flex-col items-start justify-between gap-4 p-5 transition-colors hover:bg-red-50/20 sm:flex-row sm:items-center dark:hover:bg-red-900/10">
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Delete Account</h4>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  Permanently delete your entire account along with all its data. You will
                  immediately be logged out.
                </p>
              </div>
              <button
                onClick={() => setIsAccountModalOpen(true)}
                className="shrink-0 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md hover:shadow-red-500/20 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={isDataModalOpen}
        title="Delete All Data"
        description="Are you absolutely sure? This will instantly wipe all your files, folders, and storage assets from our servers. You cannot undo this."
        confirmText="DELETE"
        onConfirm={handleDeleteData}
        onClose={() => setIsDataModalOpen(false)}
        loading={isDeleting}
        progress={deleteProgress}
        total={deleteTotal}
        progressMessage={deleteMessage}
      />

      <ConfirmModal
        isOpen={isAccountModalOpen}
        title="Delete Account"
        description="Are you absolutely sure? This will delete your user account and all associated data permanently. You will be logged out and cannot recover your files."
        confirmText="DELETE"
        onConfirm={handleDeleteAccount}
        onClose={() => setIsAccountModalOpen(false)}
        loading={isDeleting}
        progress={deleteProgress}
        total={deleteTotal}
        progressMessage={deleteMessage}
      />
    </div>
  );
}
