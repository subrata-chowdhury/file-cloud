'use client';

import { FiLogOut, FiSettings, FiCreditCard, FiHelpCircle, FiUser } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface User {
  name: string;
  email: string;
}

export default function UserProfileDropdown() {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        event.target instanceof Node &&
        !profileRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          setUser(await res.json());
        }
      } catch (err) {}
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="relative" ref={profileRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-sm font-medium text-white shadow-sm transition-transform hover:scale-105 dark:bg-white dark:text-zinc-900"
      >
        {user ? getInitials(user.name) : '...'}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-xl backdrop-blur-xl transition-all dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-4 border-b border-zinc-100 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-800/50">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-lg font-bold text-white shadow-sm dark:bg-white dark:text-zinc-900">
              {user ? getInitials(user.name) : '...'}
            </div>
            <div className="flex min-w-0 flex-col">
              <p className="truncate text-sm font-bold text-zinc-900 dark:text-white">
                {user ? user.name : 'Loading...'}
              </p>
              <p className="truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {user ? user.email : ''}
              </p>
            </div>
          </div>

          <div className="p-2">
            <Link
              href="/dashboard/profile"
              className="flex w-full items-center rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              <FiUser className="mr-3 h-4 w-4 text-zinc-400" />
              Your Profile
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex w-full items-center rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              <FiSettings className="mr-3 h-4 w-4 text-zinc-400" />
              Settings
            </Link>
          </div>

          <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800"></div>

          <div className="p-2">
            <button className="flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white">
              <div className="flex items-center">
                <FiHelpCircle className="mr-3 h-4 w-4 text-zinc-400" />
                Help & Support
              </div>
            </button>
            <button
              onClick={handleLogout}
              className="mt-1 flex w-full items-center rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-500/10"
            >
              <FiLogOut className="mr-3 h-4 w-4 text-red-500" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
