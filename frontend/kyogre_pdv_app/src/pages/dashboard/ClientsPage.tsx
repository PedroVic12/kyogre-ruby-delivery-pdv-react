// src/pages/dashboard/ClientsPage.tsx
import Graficos from '../../components/ui/Graficos';

const mockData = {
  weekly: [
    { name: 'Segunda', orders: 12 },
    { name: 'Terça', orders: 19 },
    { name: 'Quarta', orders: 15 },
    { name: 'Quinta', orders: 22 },
    { name: 'Sexta', orders: 30 },
    { name: 'Sábado', orders: 25 },
    { name: 'Domingo', orders: 18 },
  ],
  monthly: [
    { name: 'Jan', orders: 150 },
    { name: 'Fev', orders: 180 },
    { name: 'Mar', orders: 210 },
  ],
};

export function ClientsPage() {
  return (
    <div className="ml-2 pt-8 p-2">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Análise de Clientes</h1>
      
      <Graficos 
        weeklyData={mockData.weekly} 
        monthlyData={mockData.monthly} 
      />
    </div>
  );
}