import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import TableController, { Table } from '../controllers/TableController';
import { useAuth } from '../../../src/contexts/AuthContext';

import BottomNavigationBar, { navigationItems } from '../../../src/components/ui/BottomNavigationBar';

// Interface for the table object


// Interface for Auth context
interface User {
  id: string | number;
  // Add other user properties if needed
}

interface AuthContextType {
  token?: string;
  user?: User;
}

// Chave para armazenar os dados no localStorage
const LOCAL_STORAGE_TABLES_KEY = 'restaurant_tables_data';
const LOCAL_STORAGE_USER_KEY = 'restaurant_current_user';

const GarcomMesas = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth() as AuthContextType; // Typing the auth context
  const [tables, setTables] = useState<Table[]>(() => {
    // Inicializa com dados do localStorage ou do controlador
    const storedTables = localStorage.getItem(LOCAL_STORAGE_TABLES_KEY);
    return storedTables ? JSON.parse(storedTables) : TableController.getInstance().getTables();
  });

  // Verifica se houve mudança de usuário ao iniciar
  useEffect(() => {
    // Salva o usuário atual
    const storedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    
    // Se não há usuário armazenado ou o usuário mudou, resetamos os dados
    if (!storedUser || storedUser !== String(user?.id)) {
      resetAllTables();
      // Armazena o novo usuário
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, String(user?.id) || '');
    }
  }, [user]);

  // Sincroniza a cada segundo e salva no localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      // Obtém novas informações das mesas
      const updatedTables = TableController.getInstance().getTables();
      setTables(updatedTables);
      
      // Salva no localStorage para sincronização entre abas/componentes
      localStorage.setItem(LOCAL_STORAGE_TABLES_KEY, JSON.stringify(updatedTables));
    }, 1000);

    // Adiciona listener para mudanças no localStorage de outras abas/componentes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LOCAL_STORAGE_TABLES_KEY) {
        const updatedTables = JSON.parse(event.newValue || '[]') as Table[];
        setTables(updatedTables);
      }
    };

    // Registra o listener
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Função para resetar todas as mesas quando houver um novo login
  const resetAllTables = (): void => {
    const tableController = TableController.getInstance();
    const originalTables = tableController.getTables();
    
    // Reseta o status de todas as mesas para "livre"
    const resetTables = originalTables.map(table => ({
      ...table,
      status: 'livre' as const,
      customers: 0
    }));
    
    // Atualiza o controlador
    resetTables.forEach(table => {
      tableController.updateTableStatus(table.id, 'livre', 0);
    });
    
    // Atualiza o estado local
    setTables(resetTables);
    
    // Atualiza no localStorage
    localStorage.setItem(LOCAL_STORAGE_TABLES_KEY, JSON.stringify(resetTables));
    
    toast.success("Todas as mesas foram resetadas", {
      icon: '🔄',
      duration: 3000,
      position: 'top-center',
    });
  };

  const handleCallWaiter = (tableId: number): void => {
    // Adiciona ao localStorage para sincronizar entre componentes
    const notificationKey = `waiter_call_table_${tableId}`;
    localStorage.setItem(notificationKey, new Date().toISOString());
    
    toast.success(`Garçom chamado para a Mesa ${tableId}`, {
      icon: '🔔',
      duration: 3000,
      position: 'top-center',
    });
  };

  const getTableColor = (status: Table['status']): string => {
    switch (status) {
      case 'ocupada':
        return 'bg-red-600';
      case 'finalizando':
        return 'bg-orange-600';
      default:
        return 'bg-green-600';
    }
  };

  // Atualiza o status da mesa e sincroniza
  const handleTableAction = (tableId: number, status: Table['status']): void => {
    const tableController = TableController.getInstance();
    
    if (status === 'livre') {
      // Abrindo uma mesa que estava livre
      tableController.updateTableStatus(tableId, 'ocupada', 0);
    }
    
    // Atualiza as mesas localmente
    const updatedTables = tableController.getTables();
    setTables(updatedTables);
    
    // Salva no localStorage para sincronização
    localStorage.setItem(LOCAL_STORAGE_TABLES_KEY, JSON.stringify(updatedTables));
    
    // Navega para a página apropriada
    navigate(`/pdv/${tableId}`);
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
              {table.customers && table.customers > 0 && (
                <div className="flex items-center gap-1 text-sm mt-auto">
                  <Users className="h-6 w-6" />
                  <span>{table.customers}</span>
                </div>
              )}

              {/* Botão Ver/Abrir Mesa */}
              <button
                onClick={() => handleTableAction(table.id, table.status)}
                className="mt-3 w-full bg-white/20 hover:bg-white/30 py-2 rounded-md transition-colors"
              >
                {table.status === 'livre' ? 'Abrir Mesa' : 'Ver Pedidos'}
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigationBar navigationItems={[
        navigationItems[0],
        navigationItems[1], 
        navigationItems[2],
        navigationItems[3],
      ]} />
    </div>
  );
};

export default GarcomMesas;