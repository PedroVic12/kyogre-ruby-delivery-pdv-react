import React from 'react';
import { Home, LayoutDashboard, Book, Users, UserPlus, Coffee, HeadphonesIcon, Menu } from 'lucide-react';
import { Link } from './ui/Link';

export function Sidebar() {
  const menuItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Book, label: 'Cardápio', href: '/cardapio' },
    { icon: Users, label: 'Clientes', href: '/clientes' },
    { icon: Coffee, label: 'Pedidos', href: '/pedidos' },
    { icon: UserPlus, label: 'Cadastro', href: '/cadastro' },
    { icon: HeadphonesIcon, label: 'Atendimento', href: '/atendimento' },
  ];

  return (
    <div className="h-screen w-64 bg-purple-700 text-white p-4 fixed left-0 top-0">
      <div className="flex items-center gap-2 mb-8 p-2">
        <Coffee className="h-8 w-8" />
        <h1 className="text-xl font-bold">Ruby Delivery</h1>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
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