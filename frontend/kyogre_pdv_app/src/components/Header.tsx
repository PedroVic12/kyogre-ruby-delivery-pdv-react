// Header.jsx
import { Bell, Settings, User, Menu } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export function Header({ toggleSidebar, isSidebarOpen }: HeaderProps) {
  return (
    <header className={`h-16 bg-white shadow-sm fixed top-0 right-0 left-0 z-20 transition-all duration-300 ${
      isSidebarOpen ? 'md:left-64' : 'left-0'
    }`}>
      <div className="h-full flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar} 
            className="p-2 hover:bg-gray-100 rounded-full flex items-center justify-center"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Bell className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-purple-600" />
            </div>
            <span className="hidden md:inline text-sm font-medium text-gray-700">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}