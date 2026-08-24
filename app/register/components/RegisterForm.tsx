'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiLoader, FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push('/dashboard');
      } else {
        const data = await res.json();
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8">
        <h1 className="font-display mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          Create an account
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Start managing your files securely today.
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FiUser className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              required
              className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-3 pl-10 text-gray-900 transition-colors focus:border-gray-900 focus:ring-gray-900 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-400 dark:focus:ring-gray-400"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FiMail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="email"
              required
              className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-3 pl-10 text-gray-900 transition-colors focus:border-gray-900 focus:ring-gray-900 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-400 dark:focus:ring-gray-400"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FiLock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-10 pl-10 text-gray-900 transition-colors focus:border-gray-900 focus:ring-gray-900 sm:text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-gray-400 dark:focus:ring-gray-400"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-900 focus:outline-none dark:hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-lg border border-transparent bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-md focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:outline-none disabled:opacity-70 disabled:hover:translate-y-0 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:focus:ring-white dark:focus:ring-offset-gray-900"
        >
          {loading ? (
            <>
              <FiLoader className="mr-2 -ml-1 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Sign up'
          )}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-gray-900 underline decoration-gray-300 underline-offset-4 transition-colors hover:text-gray-600 dark:text-white dark:decoration-gray-600 dark:hover:text-gray-300"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
