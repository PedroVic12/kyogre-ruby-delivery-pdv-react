// Sidebar.jsx
import { Link } from 'react-router-dom';
import { Home,  Book, UserPlus, Coffee,  Menu, Calculator, Palette, NotebookPen } from 'lucide-react';
import { IconButton } from '@mui/material';
import rubyLogo from '../assets/ruby_logo.png'; // <--- IMPORT THE IMAGE HERE

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard/pedidos' },
    { icon: Coffee, label: 'Pedidos', href: '/dashboard' },
    { icon: Palette, label: 'Editar Cardapio', href: '/dashboard/cardapioManager' },

    

    // { icon: Users, label: 'Clientes', href: '/dashboard/clientes' },
    //{ icon: HeadphonesIcon, label: 'Atendimento', href: '/dashboard/atendimento' },
    { icon: NotebookPen, label: 'Cardápio Digital', href: '/cardapio' },
    { icon: Book, label: 'Splash Screen', href: '/splash' },
    { icon: Book, label: 'App Garçom', href: '/app_garcom' },
    //{ icon: Coffee, label: 'Cardapio PDV', href: '/cardapio/:mesa' },
    { icon: Calculator, label: 'Controle Estoque', href: '/controle_estoque_mui' }, //!controle_estoque
   // { icon: Book, label: 'Pagina Componentes', href: '/pagina_componentes' },
    { icon: UserPlus, label: 'Login', href: '/login' },

  ];

  return (
    <div
      className={`h-screen fixed left-0 top-0 z-25 bg-blue-900 text-white shadow-lg transition-all duration-300 ${isOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}
        style={{ zIndex: 30 }} // <----------------------- ADICIONANDO zIndex AQUI!

    >
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-4 mb-2">
          <IconButton onClick={toggleSidebar} sx={{ backgroundColor: 'white' }}>

            <img src={rubyLogo} alt="Logo" className="h-8 w-8" />

          </IconButton>
          <h2 className="text-4x2 font-bold">Ruby Delivery PDV App V9.8.4</h2>
        </div>
 
       
        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item, index) => (
            <div key={item.href}>
              <Link
                to={item.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-600 transition-colors"
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                
                <span className="truncate">{item.label}</span>
              </Link>
              {index !== menuItems.length  && <hr className="border-gray-400" />}
            </div>
            
          ))}
        
          </nav>

        <br />

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