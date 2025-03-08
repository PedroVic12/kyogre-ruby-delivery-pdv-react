// Sidebar.jsx
import { Link } from 'react-router-dom';
import { Home, LayoutDashboard, Book, Users, UserPlus, Coffee, HeadphonesIcon, Menu } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const menuItems = [
    { icon: Home, label: 'Home', href: '/dashboard' },
    { icon: LayoutDashboard, label: 'Produtos Cardapio', href: '/dashboard/produtos' },
    { icon: Book, label: 'Cardápio Digital', href: '/cardapio' },
    { icon: Users, label: 'Clientes', href: '/dashboard/clientes' },
    { icon: Coffee, label: 'Pedidos', href: '/dashboard/pedidos' },
    { icon: Users, label: 'Kanban', href: '/dashboard/kanban' },
    { icon: UserPlus, label: 'Cadastro', href: '/login' },
    { icon: HeadphonesIcon, label: 'Atendimento', href: '/dashboard/atendimento' },
    { icon: Users, label: 'App Garçom', href: '/garcom' },
    { icon: Users, label: 'Controle Estoque', href: '/controle_estoque' },
    { icon: Users, label: 'Pagina Componentes', href: '/pagina_componentes' },
  ];

  return (
    <div
      className={`h-screen fixed left-0 top-0 z-30 bg-purple-700 text-white shadow-lg transition-all duration-300 ${isOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-4 mb-2">
          <Coffee className="h-8 w-8" />
          <h1 className="text-xl font-bold">Ruby Delivery PDV App v4</h1>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-600 transition-colors"
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-purple-600">
          <button
            onClick={toggleSidebar}
            className="w-full p-2 flex items-center justify-center bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
          >
            <Menu className="h-5 w-5" />
            <span className="ml-2">Fechar Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
}