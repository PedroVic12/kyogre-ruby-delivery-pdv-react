import { Link } from 'react-router-dom';
import { Home, LayoutDashboard, Book, Users, UserPlus, Coffee, HeadphonesIcon, Plus, Minus  } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const menuItems = [
    { icon: Home, label: 'Home', href: '/dashboard' },
    { icon: LayoutDashboard, label: 'Produtos', href: '/dashboard/produtos' },
    { icon: Book, label: 'Cardápio Digital', href: '/cardapio' },
    { icon: Users, label: 'Clientes', href: '/dashboard/clientes' },
    { icon: Coffee, label: 'Pedidos', href: '/dashboard/pedidos' },
    { icon: UserPlus, label: 'Cadastro', href: '/dashboard/cadastro' },
    { icon: HeadphonesIcon, label: 'Atendimento', href: '/dashboard/atendimento' },
    { icon: Users, label: 'App Garçom', href: '/dashboard/garcom' },
  ];

  return (
    <div className={`h-screen w-64 bg-purple-700 text-white p-4 fixed left-0 top-0 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center gap-2 mb-8 p-2">
        <Coffee className="h-8 w-8" />
        <h1 className="text-xl font-bold">Ruby Delivery PDV App v4</h1>
        <button onClick={toggleSidebar} className="ml-2 p-2 hover:bg-gray-100 rounded-full">
            <Plus className="h-5 w-5 text-black-600" />
          </button>
          <button onClick={toggleSidebar} className="ml-2 p-2 hover:bg-gray-100 rounded-full">
            <Minus className="h-5 w-5 text-black-600" />
          </button>
      </div>

      {isOpen && (
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-600 transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}