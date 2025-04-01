import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import TableController from '../controllers/TableController';
import FloatActionButton from '../../../src/components/ui/FloatActionButton';
import { BottomNavigationAction } from '@mui/material';
import BottomNavigationBar, { navigationItems } from '../../../src/components/ui/BottomNavigationBar';

const GarcomMesas = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState(TableController.getInstance().getTables());

  useEffect(() => {
    const interval = setInterval(() => {
      setTables(TableController.getInstance().getTables());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCallWaiter = (tableId: number) => {
    toast.success(`Garçom chamado para a Mesa ${tableId}`, {
      icon: '🔔',
      duration: 3000,
      position: 'top-center',
    });
  };

  const getTableColor = (status: string): string => {
    switch (status) {
      case 'occupied':
        return 'bg-red-600';
      case 'closing':
        return 'bg-orange-600';
      default:
        return 'bg-green-600';
    }
  };


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-sky-900 p-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-white" />
            <h1 className="text-xl font-semibold text-white">Mapa de Mesas</h1>
          </div>

          {/* Legenda de Status */}
          <div className="flex items-center gap-4 text-white text-sm">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-green-600 rounded-sm" />
              <span>Livre</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-600 rounded-sm" />
              <span>Ocupada</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-orange-600 rounded-sm" />
              <span>Fechando conta</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`relative ${getTableColor(table.status)} rounded-lg p-4 text-white flex flex-col justify-between`}
            >
              {/* Header da mesa */}
              <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                <h2 className="text-lg font-semibold">{table.name}</h2>
                <button
                  onClick={() => handleCallWaiter(table.id)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                  title="Chamar Garçom"
                >
                  <Bell className="h-5 w-5" />
                </button>
              </div>

              {/* Número de clientes */}
              {table.customers && (
                <div className="flex items-center gap-1 text-sm mt-auto">
                  <Users className="h-6 w-6" />
                  <span>{table.customers}</span>
                </div>
              )}

              {/* Botão Ver/Abrir Mesa */}
              <button
                onClick={() => navigate(`/cardapio/${table.id}`)}
                className="mt-3 w-full bg-white/20 hover:bg-white/30 py-2 rounded-md transition-colors"
              >
                {table.status === 'free' ? 'Abrir Mesa' : 'Ver Pedidos'}
              </button>

              <BottomNavigationBar navigationItems={[
                navigationItems[0],
                navigationItems[1],
                navigationItems[2],
                navigationItems[3],
              ]}></BottomNavigationBar>

            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GarcomMesas;
