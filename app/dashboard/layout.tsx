import DashboardNav from './components/DashboardNav';
import Sidebar from './components/Sidebar';
import { MobileMenuProvider } from './context/MobileMenuContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <MobileMenuProvider>
      <div className="flex min-h-screen bg-gray-50/50">
        <Sidebar />
        <div className="flex w-full flex-col transition-all lg:pl-64">
          <DashboardNav />
          <div className="flex-1 overflow-x-hidden">{children}</div>
        </div>
      </div>
    </MobileMenuProvider>
  );
}
