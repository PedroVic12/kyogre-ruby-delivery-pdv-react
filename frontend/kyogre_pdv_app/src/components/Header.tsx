// Header.tsx
import { Bell, Settings, User, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function Header({ toggleSidebar, isSidebarOpen }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className={`h-16 bg-purple-700 shadow-sm fixed top-0 right-0 left-0 z-20 transition-all duration-300 ${
      isSidebarOpen ? 'md:left-64' : 'left-0'
    }`}>
      <div className="h-full flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-gray900" />
          </button>
          <h2 className="text-xl font-semibold text-white">Ruby Delivery PDV</h2>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Bell className="h-5 w-5 text-white" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Settings className="h-5 w-5 text-white" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-purple-600" />
            </div>
            <span className="hidden md:inline text-sm font-medium text-white">{user?.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
