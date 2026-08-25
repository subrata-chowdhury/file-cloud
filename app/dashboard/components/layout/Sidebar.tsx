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
  FiX,
  FiTrash2,
  FiHome,
  FiStar,
  FiUsers,
} from 'react-icons/fi';
import { useMobileMenu } from '../../context/MobileMenuContext';

interface Stats {
  totalBytes: number;
  totalFiles: number;
  totalFolders: number;
}

const navLinks = [
  { name: 'My Files', href: '/dashboard', icon: FiHome },
  { name: 'Favorites', href: '/dashboard/favorites', icon: FiStar },
  { name: 'Shared with me', href: '/dashboard/shared', icon: FiUsers },
  { name: 'Settings', href: '/dashboard/settings', icon: FiSettings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useMobileMenu();
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

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 dark:border-zinc-800 dark:bg-zinc-950 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Branding */}
        <div className="flex h-16 shrink-0 items-center justify-between px-6 pt-2">
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-sm transition-transform group-hover:scale-105 dark:bg-zinc-100 dark:text-zinc-900">
              <FiCloud className="h-5 w-5" />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
              FileCloud
            </span>
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 lg:hidden dark:hover:bg-zinc-800"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex h-full flex-1 flex-col space-y-1.5 overflow-y-auto px-4 py-6 pb-0">
          <p className="mb-2 px-3 text-xs font-medium tracking-wider text-zinc-400 uppercase dark:text-zinc-500">
            Overview
          </p>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-zinc-100 text-zinc-900 shadow-sm ring-1 ring-zinc-200/50 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700/50'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200'
                }`}
              >
                <link.icon
                  className={`mr-3 h-4 w-4 flex-shrink-0 transition-colors ${
                    isActive
                      ? 'text-zinc-900 dark:text-white'
                      : 'text-zinc-400 group-hover:text-zinc-500 dark:group-hover:text-zinc-300'
                  }`}
                />
                {link.name}
              </Link>
            );
          })}
          <Link
            href={'/dashboard/trash'}
            className={`group mt-auto flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              pathname === '/dashboard/trash'
                ? 'bg-zinc-100 text-zinc-900 shadow-sm ring-1 ring-zinc-200/50 dark:bg-zinc-800 dark:text-white dark:ring-zinc-700/50'
                : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200'
            }`}
          >
            <FiTrash2
              className={`mr-3 h-4 w-4 flex-shrink-0 transition-colors ${
                pathname === '/dashboard/trash'
                  ? 'text-zinc-900 dark:text-white'
                  : 'text-zinc-400 group-hover:text-zinc-500 dark:group-hover:text-zinc-300'
              }`}
            />
            Trash Bin
          </Link>
        </nav>

        {/* Bottom Section: Stats */}
        <div className="mt-auto p-4 pb-6">
          <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            <div className="relative mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <FiDatabase className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
                  Storage
                </span>
                <span className="text-[10px] font-bold tracking-wider text-zinc-500 dark:text-zinc-400">
                  {loading ? '...' : formatSize(stats.totalBytes)}{' '}
                  <span className="font-medium text-zinc-400 dark:text-zinc-500">/ 1GB</span>
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    percentageUsed > 90
                      ? 'bg-red-500'
                      : percentageUsed > 75
                        ? 'bg-amber-500'
                        : 'bg-zinc-900 dark:bg-zinc-100'
                  }`}
                  style={{ width: `${loading ? 0 : percentageUsed}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800/60">
              <div className="flex items-center gap-2 rounded-xl bg-zinc-50 p-2 transition-colors hover:bg-zinc-100/50 dark:bg-zinc-800/30 dark:hover:bg-zinc-800/60">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-zinc-500 shadow-sm dark:bg-zinc-800 dark:text-zinc-400">
                  <FiFile className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">Files</p>
                  <p className="text-sm leading-none font-semibold text-zinc-900 dark:text-white">
                    {loading ? '-' : stats.totalFiles}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-zinc-50 p-2 transition-colors hover:bg-zinc-100/50 dark:bg-zinc-800/30 dark:hover:bg-zinc-800/60">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-zinc-500 shadow-sm dark:bg-zinc-800 dark:text-zinc-400">
                  <FiFolder className="h-3 w-3" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
                    Folders
                  </p>
                  <p className="text-sm leading-none font-semibold text-zinc-900 dark:text-white">
                    {loading ? '-' : stats.totalFolders}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
