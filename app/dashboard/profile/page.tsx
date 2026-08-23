'use client';

import { useState, useEffect } from 'react';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import ProfileBanner from './components/ProfileBanner';
import ProfileStatus from './components/ProfileStatus';
import PersonalInfoForm from './components/PersonalInfoForm';
import SecurityForm from './components/SecurityForm';

interface UserProfile {
  name: string;
  email: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    }
    fetchUser();
  }, []);

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
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setProfile((prev) => (prev ? { ...prev, name } : null));
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
        setMessage({ type: 'success', text: 'Password updated successfully!' });
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-100 border-t-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <ProfileBanner name={profile.name} email={profile.email} />

      {message && (
        <div
          className={`mb-8 flex items-center gap-3 rounded-2xl p-4 text-sm font-semibold shadow-sm ${message.type === 'error' ? 'border border-red-100 bg-red-50 text-red-700' : 'border border-green-100 bg-green-50 text-green-700'}`}
        >
          {message.type === 'error' ? (
            <FiAlertCircle className="h-5 w-5" />
          ) : (
            <FiCheckCircle className="h-5 w-5" />
          )}
          {message.text}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <ProfileStatus />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <PersonalInfoForm
            initialName={profile.name}
            email={profile.email}
            onSave={handleSaveProfile}
            loading={loading}
          />
          <SecurityForm onSave={handleUpdatePassword} loading={loading} />
        </div>
      </div>
    </div>
  );
}
