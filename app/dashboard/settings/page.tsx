'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { useUser } from '../context/UserContext';

import AccountOverview from './components/AccountOverview';
import ProfileLinks from './components/ProfileLinks';
import DangerZone from './components/DangerZone';

export default function SettingsPage() {
  const router = useRouter();
  const { user: profile } = useUser();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [deleteProgress, setDeleteProgress] = useState(0);
  const [deleteTotal, setDeleteTotal] = useState(0);
  const [deleteMessage, setDeleteMessage] = useState('');

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

  if (!profile) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 h-8 w-32 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800"></div>

        <div className="space-y-6">
          {/* Account Overview Skeleton */}
          <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 shrink-0 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                <div className="space-y-3">
                  <div className="h-5 w-40 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800"></div>
                  <div className="h-4 w-48 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800"></div>
                </div>
              </div>
              <div className="h-10 w-28 shrink-0 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800"></div>
            </div>
          </div>

          {/* Profile Links Skeleton */}
          <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                  <div className="h-3 w-56 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                </div>
              </div>
            </div>
            <div className="border-t border-zinc-100 p-6 dark:border-zinc-800">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 shrink-0 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                  <div className="h-3 w-56 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone Skeleton */}
          <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
            <div className="p-6 pb-2">
              <div className="h-5 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
            </div>
            <div className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                <div className="h-3 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
              </div>
              <div className="h-9 w-32 shrink-0 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800"></div>
            </div>
            <div className="flex flex-col items-start justify-between gap-4 border-t border-zinc-100 p-6 sm:flex-row sm:items-center dark:border-zinc-800/80">
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                <div className="h-3 w-3/4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
              </div>
              <div className="h-9 w-32 shrink-0 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
          Settings
        </h1>
      </div>

      {message && (
        <div
          className={`mb-8 flex items-center gap-3 rounded-xl p-4 text-sm font-medium shadow-sm transition-all ${
            message.type === 'error'
              ? 'border border-red-200 bg-red-50 text-red-700 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400'
              : 'border border-green-200 bg-green-50 text-green-700 dark:border-green-900/30 dark:bg-green-900/10 dark:text-green-400'
          }`}
        >
          {message.type === 'error' ? (
            <FiAlertTriangle className="h-5 w-5 shrink-0" />
          ) : (
            <FiCheckCircle className="h-5 w-5 shrink-0" />
          )}
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        <AccountOverview />
        <ProfileLinks />
        <DangerZone
          onDeleteData={() => setIsDataModalOpen(true)}
          onDeleteAccount={() => setIsAccountModalOpen(true)}
        />
      </div>

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
