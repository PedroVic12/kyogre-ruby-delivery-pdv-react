import { Bell, Settings, User, Plus, Minus } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  return (
    <header className="h-16 bg-white shadow-sm fixed top-0 right-0 left-64 z-10">
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
          <button onClick={toggleSidebar} className="ml-2 p-2 hover:bg-black-100 rounded-full">
            <Plus className="h-5 w-5 text-black-600" />
          </button>
          <button onClick={toggleSidebar} className="ml-2 p-2 hover:bg-black-100 rounded-full">
            <Minus className="h-5 w-5 text-black-600" />
          </button>
        </div>

        <div className="flex items-center gap-4">
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
            <span className="text-sm font-medium text-gray-700">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}