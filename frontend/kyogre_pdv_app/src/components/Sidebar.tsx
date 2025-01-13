import { Home, LayoutDashboard, Book, Users, UserPlus, Coffee, HeadphonesIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Sidebar() {
  const menuItems = [
    { icon: Home, label: 'Home', href: '/dashboard' },
    { icon: LayoutDashboard, label: 'Produtos', href: '/dashboard/produtos' },
    { icon: Book, label: 'Cardápio Digital', href: '/cardapio' },
    { icon: Users, label: 'Clientes', href: '/dashboard/clientes' },
    { icon: Coffee, label: 'Pedidos', href: '/dashboard/pedidos' },
    { icon: UserPlus, label: 'Cadastro', href: '/dashboard/cadastro' },
    { icon: HeadphonesIcon, label: 'Atendimento', href: '/dashboard/atendimento' },
  ];

  return (
    <div className="h-screen w-64 bg-purple-700 text-white p-4 fixed left-0 top-0">
      <div className="flex items-center gap-2 mb-8 p-2">
        <Coffee className="h-8 w-8" />
        <h1 className="text-xl font-bold">Ruby Delivery PDV App v3</h1>
      </div>

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
    </div>
  );
}