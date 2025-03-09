import { useState, useEffect } from 'react';
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
      position: 'top-center', // Adjust the position as needed
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
      {/* Header - Responsive */}
      <header className="bg-gray-800 p-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-xl font-semibold text-white mb-2 sm:mb-0">Mapa de Mesas</h1>
          <Bell className="h-6 w-6 text-white" />
        </div>
      </header>

      {/* Main Content - Responsive */}
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`relative ${getTableColor(table.status)} rounded-lg p-4 text-white flex flex-col justify-between`} // p-4 and flex added here
            >
              {/* Table Header - Responsive */}
              <div className="flex flex-col sm:flex-row justify-between items-start mb-2 sm:mb-0"> {/*Reduced the margin from mb-12 to mb-2*/}
                <h2 className="text-lg font-semibold">{table.name}</h2>
                <button
                  onClick={() => handleCallWaiter(table.id)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <Bell className="h-5 w-5" />
                </button>
              </div>

              {/* Customers Count - Responsive */}
              {table.customers && (
                <div className="flex items-center gap-1 text-sm mt-auto"> {/*Added mt-auto here*/}
                  <Users className="h-6 w-6" />
                  <span>{table.customers}</span>
                </div>
              )}

              {/* Open/View Table Button - Responsive */}
              <button
                onClick={() => navigate(`/cardapio/${table.id}`)}
                className="mt-3 w-full bg-white/20 hover:bg-white/30 py-2 rounded-md transition-colors" // Removed absolute position
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

export default GarcomMesas;
