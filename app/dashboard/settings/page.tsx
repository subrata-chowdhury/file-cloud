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

  const handleDeleteData = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch('/api/user/data', { method: 'DELETE' });
      if (res.ok) {
        setMessage({ type: 'success', text: 'All files and folders have been securely deleted.' });
        setIsDataModalOpen(false);
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
    try {
      const res = await fetch('/api/user', { method: 'DELETE' });
      if (res.ok) {
        router.push('/login');
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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Settings</h1>
      </div>

      {message && (
        <div
          className={`mb-6 flex items-center gap-3 rounded-xl p-4 text-sm font-medium ${message.type === 'error' ? 'border border-red-100 bg-red-50 text-red-700' : 'border border-green-100 bg-green-50 text-green-700'}`}
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
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          {/* Decorative background */}
          <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-blue-50/80 blur-2xl"></div>
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-indigo-50/80 blur-2xl"></div>

          <div className="relative z-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-xl font-bold text-white shadow-md shadow-blue-500/20">
                {getInitials(profile.name)}
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-gray-900">{profile.name}</h2>
                <p className="text-sm font-medium text-gray-500">{profile.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-600 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
            >
              <FiLogOut className="h-4 w-4" />
              Log Out
            </button>
          </div>
        </div>

        {/* Profile Links */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-50 bg-gray-50/50 px-5 py-3">
            <h3 className="text-base font-bold text-gray-900">Account Preferences</h3>
          </div>
          <div className="divide-y divide-gray-50">
            <Link
              href="/dashboard/profile"
              className="group flex items-center justify-between p-5 transition-colors hover:bg-blue-50/30"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                  <FiUser className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 transition-colors group-hover:text-blue-700">
                    Personal Information
                  </h4>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Update your name and profile details.
                  </p>
                </div>
              </div>
              <span className="-translate-x-2 text-xs font-bold text-blue-600 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                Edit &rarr;
              </span>
            </Link>
            <Link
              href="/dashboard/profile"
              className="group flex items-center justify-between p-5 transition-colors hover:bg-indigo-50/30"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100">
                  <FiShield className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 transition-colors group-hover:text-indigo-700">
                    Security & Password
                  </h4>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Change your password and secure your account.
                  </p>
                </div>
              </div>
              <span className="-translate-x-2 text-xs font-bold text-indigo-600 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                Update &rarr;
              </span>
            </Link>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="group relative overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
          {/* Subtle red background glow on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-50/30 to-white opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

          <div className="relative z-10 border-b border-red-100 bg-red-50/50 px-5 py-3">
            <h3 className="flex items-center gap-2 text-base font-bold text-red-600">
              <FiAlertTriangle className="h-4 w-4" />
              Danger Zone
            </h3>
          </div>
          <div className="relative z-10 divide-y divide-red-50">
            <div className="flex flex-col items-start justify-between gap-4 p-5 transition-colors hover:bg-red-50/20 sm:flex-row sm:items-center">
              <div>
                <h4 className="text-sm font-bold text-gray-900">Delete All Data</h4>
                <p className="mt-0.5 text-xs text-gray-500">
                  Permanently delete all your files, folders, and storage data. This action is
                  irreversible. Your account will remain active.
                </p>
              </div>
              <button
                onClick={() => setIsDataModalOpen(true)}
                className="shrink-0 rounded-lg border border-red-200 bg-white px-4 py-2 text-xs font-bold text-red-600 shadow-sm transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus:ring-2 focus:ring-red-500/20 focus:outline-none"
              >
                Delete All Data
              </button>
            </div>
            <div className="flex flex-col items-start justify-between gap-4 p-5 transition-colors hover:bg-red-50/20 sm:flex-row sm:items-center">
              <div>
                <h4 className="text-sm font-bold text-gray-900">Delete Account</h4>
                <p className="mt-0.5 text-xs text-gray-500">
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
      />

      <ConfirmModal
        isOpen={isAccountModalOpen}
        title="Delete Account"
        description="Are you absolutely sure? This will delete your user account and all associated data permanently. You will be logged out and cannot recover your files."
        confirmText="DELETE"
        onConfirm={handleDeleteAccount}
        onClose={() => setIsAccountModalOpen(false)}
        loading={isDeleting}
      />
    </div>
  );
}
