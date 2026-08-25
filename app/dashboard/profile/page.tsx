'use client';

import { useState } from 'react';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import ProfileBanner from './components/ProfileBanner';
import ProfileStatus from './components/ProfileStatus';
import PersonalInfoForm from './components/PersonalInfoForm';
import SecurityForm from './components/SecurityForm';
import { useUser } from '../context/UserContext';

export default function ProfilePage() {
  const { user: profile, refreshUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveProfile = async (name: string) => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully' });
        await refreshUser();
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Password updated successfully' });
        return true;
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Failed to update password' });
        return false;
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Profile Banner Skeleton */}
        <div className="mb-10 flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
          <div className="h-20 w-20 shrink-0 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
          <div className="flex flex-col items-center space-y-3 sm:items-start">
            <div className="h-8 w-48 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800"></div>
            <div className="h-4 w-32 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800"></div>
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-950/50"
            >
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
              <div className="space-y-2">
                <div className="h-3 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
                <div className="h-5 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Forms Skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-2xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <ProfileBanner name={profile.name} email={profile.email} />

      {message && (
        <div
          className={`mb-10 flex items-center gap-3 rounded-xl p-4 text-sm font-medium shadow-sm transition-all ${
            message.type === 'error'
              ? 'border border-red-200 bg-red-50 text-red-700 dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400'
              : 'border border-green-200 bg-green-50 text-green-700 dark:border-green-900/30 dark:bg-green-900/10 dark:text-green-400'
          }`}
        >
          {message.type === 'error' ? (
            <FiAlertCircle className="h-5 w-5 shrink-0" />
          ) : (
            <FiCheckCircle className="h-5 w-5 shrink-0" />
          )}
          {message.text}
        </div>
      )}

      <ProfileStatus />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <PersonalInfoForm
            initialName={profile.name}
            email={profile.email}
            onSave={handleSaveProfile}
            loading={loading}
          />
        </div>
        <div className="space-y-6">
          <SecurityForm onSave={handleUpdatePassword} loading={loading} />
        </div>
      </div>
    </div>
  );
}
