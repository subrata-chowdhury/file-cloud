'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiCloud,
  FiFolder,
  FiSettings,
  FiPieChart,
  FiLogOut,
  FiDatabase,
  FiFile,
} from 'react-icons/fi';

interface Stats {
  totalBytes: number;
  totalFiles: number;
  totalFolders: number;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [stats, setStats] = useState<Stats>({ totalBytes: 0, totalFiles: 0, totalFolders: 0 });
  const [loading, setLoading] = useState(true);
  const MAX_BYTES = 1 * 1024 * 1024 * 1024; // 1GB

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const percentageUsed = Math.min(100, (stats.totalBytes / MAX_BYTES) * 100);

  const navLinks = [
    { name: 'Your Files', href: '/dashboard', icon: FiFolder },
    { name: 'Settings', href: '/dashboard/settings', icon: FiSettings },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-100 bg-white shadow-sm">
      {/* Branding */}
      <div className="flex h-16 shrink-0 items-center px-6">
        <Link href="/" className="group flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition-transform group-hover:scale-105">
            <FiCloud className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-gray-900">
            FileCloud
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <link.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                }`}
              />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section: Stats & Logout */}
      <div className="mt-auto border-t border-gray-100 p-4">
        {/* Mini Stats Widget */}
        <div className="group relative overflow-hidden rounded-2xl border border-gray-100/50 bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm transition-all hover:shadow-md">
          {/* Subtle background decoration */}
          <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-blue-50/50 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-blue-100/50"></div>

          <div className="relative mb-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                <FiDatabase className="h-3.5 w-3.5 text-blue-500" />
                Storage
              </span>
              <span className="text-[10px] font-bold tracking-wider text-gray-500">
                {loading ? '...' : formatSize(stats.totalBytes)}{' '}
                <span className="font-medium text-gray-400">/ 1GB</span>
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100/80 shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  percentageUsed > 90
                    ? 'bg-gradient-to-r from-red-500 to-orange-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                    : percentageUsed > 75
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-[0_0_10px_rgba(250,204,21,0.4)]'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]'
                }`}
                style={{ width: `${loading ? 0 : percentageUsed}%` }}
              />
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-3 border-t border-gray-100/60 pt-3">
            <div className="flex items-center gap-2.5 rounded-xl bg-gray-50/80 p-2 transition-colors hover:bg-white hover:shadow-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <FiFile className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-bold tracking-wider text-gray-400 uppercase">Files</p>
                <p className="truncate text-sm font-bold text-gray-900">
                  {loading ? '-' : stats.totalFiles}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl bg-gray-50/80 p-2 transition-colors hover:bg-white hover:shadow-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <FiFolder className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-bold tracking-wider text-gray-400 uppercase">
                  Folders
                </p>
                <p className="truncate text-sm font-bold text-gray-900">
                  {loading ? '-' : stats.totalFolders}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
