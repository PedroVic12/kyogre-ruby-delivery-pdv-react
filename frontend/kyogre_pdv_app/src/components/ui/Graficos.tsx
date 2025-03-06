// src/components/Graficos.tsx
import React from 'react';
import { BarChart, LineChart } from 'lucide-react';

interface GraficosProps {
  weeklyData: { name: string; orders: number }[];
  monthlyData: { name: string; orders: number }[];
}

const Graficos: React.FC<GraficosProps> = ({ weeklyData, monthlyData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Pedidos por Semana */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BarChart className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold">Pedidos por Semana</h2>
        </div>
        <div className="h-64 flex items-end justify-between gap-2">
          {weeklyData.map((day) => (
            <div key={day.name} className="flex flex-col items-center gap-2">
              <div 
                className="w-12 bg-purple-600 rounded-t-lg transition-all hover:bg-purple-700"
                style={{ height: `${(day.orders / 30) * 100}%` }} // Ajuste a altura com base no valor máximo
              />
              <span className="text-sm text-gray-600">{day.name}</span>
              <span className="text-sm font-medium">{day.orders}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico de Tendência Mensal */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <LineChart className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold">Tendência Mensal</h2>
        </div>
        <div className="h-64 flex items-end justify-between gap-2">
          {monthlyData.map((month) => (
            <div key={month.name} className="flex flex-col items-center gap-2">
              <div 
                className="w-16 bg-green-500 rounded-t-lg transition-all hover:bg-green-600"
                style={{ height: `${(month.orders / 210) * 100}%` }} // Ajuste a altura com base no valor máximo
              />
              <span className="text-sm text-gray-600">{month.name}</span>
              <span className="text-sm font-medium">{month.orders}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Graficos;