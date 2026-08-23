'use client';

import { usePathname } from 'next/navigation';
import GlobalSearch from './GlobalSearch';
import NotificationDropdown from './NotificationDropdown';
import UserProfileDropdown from './UserProfileDropdown';

export default function DashboardNav() {
  const pathname = usePathname();

  // Simple title mapper
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Your Files';
    if (pathname.includes('/settings')) return 'Settings';
    return 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white/80 px-8 shadow-sm backdrop-blur-md">
      <div className="flex items-center">
        <h1 className="font-display text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-4">
        <GlobalSearch />
        <NotificationDropdown />
        <div className="h-8 w-px bg-gray-200"></div>
        <UserProfileDropdown />
      </div>
    </header>
  );
}
