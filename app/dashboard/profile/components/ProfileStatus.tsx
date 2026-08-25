'use client';

import { useState, useEffect } from 'react';
import { FiHardDrive, FiFileText, FiFolder, FiEye, FiLoader } from 'react-icons/fi';

interface Stats {
  totalFiles: number;
  totalFolders: number;
  totalBytes: number;
  totalViews: number;
}

export default function ProfileStatus() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const statCards = [
    {
      label: 'Storage Used',
      value: stats ? formatSize(stats.totalBytes) : '-',
      icon: FiHardDrive,
    },
    {
      label: 'Total Files',
      value: stats ? formatNumber(stats.totalFiles) : '-',
      icon: FiFileText,
    },
    {
      label: 'Total Folders',
      value: stats ? formatNumber(stats.totalFolders) : '-',
      icon: FiFolder,
    },
    {
      label: 'File Views',
      value: stats ? formatNumber(stats.totalViews) : '-',
      icon: FiEye,
    },
  ];

  if (loading) {
    return (
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-950/50"
          >
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-zinc-100 dark:bg-zinc-900"></div>
            <div className="space-y-2">
              <div className="h-3 w-16 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900"></div>
              <div className="h-5 w-24 animate-pulse rounded bg-zinc-100 dark:bg-zinc-900"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-950"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-white">
            <stat.icon className="h-5 w-5 stroke-[1.5]" />
          </div>
          <div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{stat.label}</p>
            <p className="mt-0.5 text-lg font-semibold tracking-tight text-zinc-900 dark:text-white">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
