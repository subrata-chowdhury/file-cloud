'use client';

import { usePathname } from 'next/navigation';
import GlobalSearch from './GlobalSearch';
import NotificationDropdown from './NotificationDropdown';
import UserProfileDropdown from './UserProfileDropdown';
import { useMobileMenu } from '../context/MobileMenuContext';
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
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white/80 px-4 shadow-sm backdrop-blur-md sm:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 lg:hidden"
        >
          <FiMenu className="h-5 w-5" />
        </button>
        <h1 className="font-display hidden text-xl font-semibold text-gray-900 sm:block">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <GlobalSearch />
        <NotificationDropdown />
        <div className="hidden h-8 w-px bg-gray-200 sm:block"></div>
        <UserProfileDropdown />
      </div>
    </header>
  );
}
