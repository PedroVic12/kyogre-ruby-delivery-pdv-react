import React, { useState } from 'react';
import { 
  Menu, 
  Plus, 
  Minus, 
  Car, 
  Search 
} from 'lucide-react';

// Types
interface TableItem {
  id: number;
  name: string;
  status: 'free' | 'occupied' | 'closing';
}

interface MenuItem {
  id: number;
  name: string;
  price: number;
}

interface OrderItem extends MenuItem {
  quantity: number;
}

interface Database {
  tables: TableItem[];
  menu: {
    [category: string]: MenuItem[];
  };
}

// Database mock
export const DATABASE: Database = {
  tables: [
    { id: 1, name: 'Mesa 1', status: 'free' },
    { id: 2, name: 'Mesa 2', status: 'free' },
    { id: 3, name: 'Mesa 3', status: 'free' },
    { id: 4, name: 'Mesa 4', status: 'free' },
    { id: 5, name: 'Mesa 5', status: 'free' },
    { id: 6, name: 'Mesa 6', status: 'free' },
    { id: 7, name: 'Mesa 7', status: 'free' },
    { id: 8, name: 'Mesa 8', status: 'free' },
    { id: 9, name: 'Mesa 9', status: 'free' },
    { id: 30, name: 'Mesa 30', status: 'free' }
  ],
  menu: {
    'Hot roll (escolha 01 opção)': [
      { 
        id: 1, 
        name: '10-Hot roll de couve com cream cheese (vegetariano)',
        price: 0.00
      },
      { 
        id: 2, 
        name: '10-Hot roll de batata doce frita(vegetariano)',
        price: 0.00
      },
      { 
        id: 3, 
        name: '10-Hot rolls tradicional',
        price: 0.00
      }
    ],
    'Sushial (escolha 03 opção)': [
      {
        id: 4,
        name: '04-Hossomaki com cream cheese',
        price: 0.00
      },
      {
        id: 5,
        name: '04-niguiri de salmão flambado com cream cheese, furikake',
        price: 0.00
      },
      {
        id: 6,
        name: '04-uramaki de salmão cheese',
        price: 89.00
      }
    ]
  }
};

// Header Component
interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchTerm, setSearchTerm }) => (
  <div className="bg-gray-800 p-4">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Menu className="h-6 w-6" />
        <h1 className="text-xl font-semibold">Mapa de mesas</h1>
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar..."
          className="bg-gray-700 text-white pl-8 pr-2 py-1 rounded-md text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
    </div>
    <div className="flex gap-4 mt-2">
      <LegendItem color="bg-green-500" label="Livres" />
      <LegendItem color="bg-orange-500" label="Ocupadas" />
      <LegendItem color="bg-yellow-500" label="Fechando conta" />
    </div>
  </div>
);

// Legend Item Component
interface LegendItemProps {
  color: string;
  label: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ color, label }) => (
  <div className="flex items-center gap-1">
    <div className={`w-3 h-3 rounded-full ${color}`}></div>
    <span className="text-xs">{label}</span>
  </div>
);

// Table Grid Component
interface TableGridProps {
  tables: TableItem[];
  onTableClick: (tableId: number) => void;
}

const TableGrid: React.FC<TableGridProps> = ({ tables, onTableClick }) => {
  const getTableColor = (status: string): string => {
    switch (status) {
      case 'occupied':
        return 'bg-orange-600';
      case 'closing':
        return 'bg-yellow-600';
      default:
        return 'bg-green-600';
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {tables.map((table) => (
        <div key={table.id}>
          <div 
            onClick={() => onTableClick(table.id)}
            className={`${getTableColor(table.status)} rounded-lg p-3 text-center cursor-pointer active:opacity-70`}
          >
            <p className="text-white text-sm mb-0">{table.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Footer Component
const Footer: React.FC = () => (
  <div className="bg-gray-800 p-4">
    <button 
      className="w-full bg-blue-800 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2"
    >
      <Car className="h-5 w-5" />
      Gerar pedido delivery
    </button>
  </div>
);

// Menu Modal Component
interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  menu: Database['menu'];
  currentOrder: OrderItem[];
  updateItemQuantity: (item: MenuItem, increment: boolean) => void;
  calculateTotal: () => number;
  handleGenerateOrder: () => void;
}

const MenuModal: React.FC<MenuModalProps> = ({ 
  isOpen, 
  onClose, 
  menu, 
  currentOrder, 
  updateItemQuantity, 
  calculateTotal, 
  handleGenerateOrder 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 w-full max-w-md rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Editar Item e observação</h2>
          <button onClick={onClose} className="text-gray-400">
            &times;
          </button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {Object.entries(menu).map(([category, items]) => (
            <MenuCategory 
              key={category} 
              category={category} 
              items={items} 
              currentOrder={currentOrder} 
              updateItemQuantity={updateItemQuantity} 
            />
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-700">
          <button 
            className={`w-full py-2 px-4 rounded-md text-white ${
              currentOrder.length === 0 ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-500'
            }`}
            disabled={currentOrder.length === 0}
            onClick={handleGenerateOrder}
          >
            Avançar - R$ {calculateTotal().toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};

// Menu Category Component
interface MenuCategoryProps {
  category: string;
  items: MenuItem[];
  currentOrder: OrderItem[];
  updateItemQuantity: (item: MenuItem, increment: boolean) => void;
}

const MenuCategory: React.FC<MenuCategoryProps> = ({ 
  category, 
  items, 
  currentOrder, 
  updateItemQuantity 
}) => (
  <div>
    <div className="p-4 border-b border-gray-700">
      <h3 className="text-lg font-semibold capitalize">{category}</h3>
      <p className="text-xs text-gray-400">Obrigatório</p>
    </div>
    
    {items.map((item) => (
      <MenuItem 
        key={item.id} 
        item={item} 
        quantity={currentOrder.find(i => i.id === item.id)?.quantity || 0} 
        updateItemQuantity={updateItemQuantity} 
      />
    ))}
  </div>
);

// Menu Item Component
interface MenuItemProps {
  item: MenuItem;
  quantity: number;
  updateItemQuantity: (item: MenuItem, increment: boolean) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, quantity, updateItemQuantity }) => (
  <div className="p-4 flex justify-between items-center border-b border-gray-700">
    <div>
      <h4 className="font-medium">{item.name}</h4>
      <p className="text-sm text-gray-400">R$ {item.price.toFixed(2)}</p>
    </div>
    <div className="flex items-center gap-2">
      <button 
        className="p-1 text-gray-400 hover:text-white"
        onClick={() => updateItemQuantity(item, false)}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-6 text-center">
        {quantity}
      </span>
      <button 
        className="p-1 text-green-500 hover:text-green-400"
        onClick={() => updateItemQuantity(item, true)}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  </div>
);

// Main Component
const TabelasMesasPage: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [tables, setTables] = useState<TableItem[]>(DATABASE.tables);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleTableClick = (tableId: number): void => {
    setSelectedTable(tableId);
    setShowMenu(true);
  };

  const updateItemQuantity = (item: MenuItem, increment: boolean): void => {
    setCurrentOrder(currentOrder => {
      const existingItem = currentOrder.find(i => i.id === item.id);
      if (existingItem) {
        if (increment) {
          return currentOrder.map(i => 
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else if (existingItem.quantity > 0) {
          return currentOrder.map(i => 
            i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
          ).filter(i => i.quantity > 0);
        }
        return currentOrder;
      }
      return [...currentOrder, { ...item, quantity: 1 }];
    });
  };

  const calculateTotal = (): number => {
    return currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleGenerateOrder = (): void => {
    if (selectedTable) {
      setTables(tables.map(table => 
        table.id === selectedTable ? { ...table, status: 'occupied' } : table
      ));
      setShowMenu(false);
      setCurrentOrder([]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <div className="flex-1 overflow-auto p-4">
        <TableGrid tables={tables} onTableClick={handleTableClick} />
      </div>
      
      <Footer />
      
      <MenuModal 
        isOpen={showMenu} 
        onClose={() => setShowMenu(false)} 
        menu={DATABASE.menu} 
        currentOrder={currentOrder} 
        updateItemQuantity={updateItemQuantity} 
        calculateTotal={calculateTotal} 
        handleGenerateOrder={handleGenerateOrder} 
      />
    </div>
  );
};

export default TabelasMesasPage;