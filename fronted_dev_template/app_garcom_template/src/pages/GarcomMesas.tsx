import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import TableController from '../controllers/TableController';

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
      <header className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">Mapa de Mesas</h1>
          <Bell className="h-6 w-6 text-white" />
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`${getTableColor(table.status)} rounded-lg p-4 text-white`}
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-semibold">{table.name}</h2>
                <button
                  onClick={() => handleCallWaiter(table.id)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <Bell className="h-5 w-5" />
                </button>
              </div>
              
              {table.customers && (
                <div className="flex items-center gap-1 text-sm">
                  <Users className="h-4 w-4" />
                  <span>{table.customers}</span>
                </div>
              )}
              
              <button
                onClick={() => navigate(`/cardapio/${table.id}`)}
                className="mt-3 w-full bg-white/20 hover:bg-white/30 py-2 rounded-md transition-colors"
              >
                {table.status === 'free' ? 'Abrir Mesa' : 'Ver Pedidos'}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default GarcomMesas