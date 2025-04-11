import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import TableController, { Table } from '../controllers/TableController';
import BottomNavigationBar, { navigationItems } from '../../../src/components/ui/BottomNavigationBar';

const GarcomMesas = () => {
  const navigate = useNavigate();
  const [tables, setTables] = useState<Table[]>([]);
  const tableController = TableController.getInstance();

  useEffect(() => {
    localStorage.clear();
    console.log('[DEBUG] Componente montado');
    console.log('[DEBUG] Inicializando TableController:', tableController);

    // Atualizar o estado local quando o estado das mesas mudar
    const interval = setInterval(() => {
      const currentTables = tableController.getTables();
      console.log('[DEBUG] Mesas carregadas do TableController:', currentTables);
      setTables(currentTables);
    }, 1000);

    return () => {
      console.log('[DEBUG] Componente desmontado');
      clearInterval(interval);
    };
  }, []);

  const handleCallWaiter = (tableId: number): void => {
    console.log(`[DEBUG] Chamando garçom para a mesa ${tableId}`);
    tableController.updateTableStatus(tableId, 'finalizando');
    toast.success(`Garçom chamado para a Mesa ${tableId}`, {
      icon: '🔔',
      duration: 3000,
      position: 'top-center',
    });
  };

  const handleTableAction = (tableId: number, status: Table['status']): void => {
    console.log(`[DEBUG] Ação na mesa ${tableId} com status ${status}`);
    if (status === 'livre') {
      tableController.updateTableStatus(tableId, 'ocupada', 0);
    }
    navigate(`/pdv/${tableId}`);
  };

  const handleCreateOrder = (tableId: number) => {
    toast.success(`Pedido criado para a Mesa ${tableId}`, {
      icon: '📝',
      duration: 3000,
      position: 'top-center',
    });
  };

  const getTableColor = (status: Table['status']): string => {
    console.log(`[DEBUG] Obtendo cor para o status ${status}`);
    switch (status) {
      case 'ocupada':
        return 'bg-red-600';
      case 'finalizando':
        return 'bg-orange-600';
      default:
        return 'bg-green-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-sky-900 p-4">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Bell className="h-10 w-10 text-white" />
            <h1 className="text-xl font-semibold text-white">Mapa de Mesas para Garçom</h1>
          </div>
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
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`relative ${getTableColor(table.status)} rounded-lg p-4 text-white flex flex-col justify-between`}
            >
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
              {table.customers && table.customers > 0 && (
                <div className="flex items-center gap-1 text-sm mt-auto">
                  <Users className="h-6 w-6" />
                  <span>{table.customers}</span>
                </div>
              )}
              <button
                onClick={() => handleTableAction(table.id, table.status)}
                className="mt-3 w-full bg-white/20 hover:bg-white/30 py-2 rounded-md transition-colors"
              >
                {table.status === 'livre' ? 'Abrir Mesa' : 'Ver Pedidos'}
              </button>
              <button
                onClick={() => handleCreateOrder(table.id)}
                className="mt-2 w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-md transition-colors"
              >
                Criar Pedido
              </button>
            </div>
          ))}
        </div>
      </main>
      <BottomNavigationBar 
        navigationItems={[
          navigationItems[0],
          navigationItems[1], 
          navigationItems[2],
          navigationItems[3],
        ]} 
      />
    </div>
  );
};

export default GarcomMesas;