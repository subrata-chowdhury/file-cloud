'use client';

import { usePathname } from 'next/navigation';
import GlobalSearch from './GlobalSearch';
import NotificationDropdown from './NotificationDropdown';
import UserProfileDropdown from './UserProfileDropdown';
import { useMobileMenu } from '../../context/MobileMenuContext';
import { FiMenu } from 'react-icons/fi';

export default function DashboardNav() {
  const pathname = usePathname();
  const { setIsOpen } = useMobileMenu();

  // Simple title mapper
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Your Files';
    if (pathname.includes('/settings')) return 'Settings';
    if (pathname.includes('/profile')) return 'Profile';
    return 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white px-4 shadow-sm sm:px-8 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-zinc-100 lg:hidden dark:hover:bg-zinc-800"
        >
          <FiMenu className="h-5 w-5" />
        </button>
        <h1 className="font-display hidden text-xl font-semibold text-zinc-900 sm:block dark:text-white">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <GlobalSearch />
        <NotificationDropdown />
        <div className="hidden h-8 w-px bg-zinc-200 sm:block dark:bg-zinc-800"></div>
        <UserProfileDropdown />
      </div>
    </header>
  );
}
