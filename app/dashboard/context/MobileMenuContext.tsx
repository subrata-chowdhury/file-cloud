'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

type MobileMenuContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const MobileMenuContext = createContext<MobileMenuContextType>({
  isOpen: false,
  setIsOpen: () => {},
});

export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close the menu when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <MobileMenuContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </MobileMenuContext.Provider>
  );
}

export function useMobileMenu() {
  return useContext(MobileMenuContext);
}
