import DashboardNav from './components/DashboardNav';
import Sidebar from './components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <Sidebar />
      <div className="flex w-full flex-col pl-64 transition-all">
        <DashboardNav />
        <div className="flex-1 overflow-x-hidden">{children}</div>
      </div>
    </div>
  );
}
