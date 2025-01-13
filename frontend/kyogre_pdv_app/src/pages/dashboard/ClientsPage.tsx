import { BarChart, LineChart,  } from 'lucide-react';

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
    <div className="ml-64 pt-16 p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Análise de Clientes</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold">Pedidos por Semana</h2>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {mockData.weekly.map((day) => (
              <div key={day.name} className="flex flex-col items-center gap-2">
                <div 
                  className="w-12 bg-purple-600 rounded-t-lg transition-all hover:bg-purple-700"
                  style={{ height: `${(day.orders / 30) * 100}%` }}
                />
                <span className="text-sm text-gray-600">{day.name}</span>
                <span className="text-sm font-medium">{day.orders}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <LineChart className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold">Tendência Mensal</h2>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {mockData.monthly.map((month) => (
              <div key={month.name} className="flex flex-col items-center gap-2">
                <div 
                  className="w-16 bg-green-500 rounded-t-lg transition-all hover:bg-green-600"
                  style={{ height: `${(month.orders / 210) * 100}%` }}
                />
                <span className="text-sm text-gray-600">{month.name}</span>
                <span className="text-sm font-medium">{month.orders}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}