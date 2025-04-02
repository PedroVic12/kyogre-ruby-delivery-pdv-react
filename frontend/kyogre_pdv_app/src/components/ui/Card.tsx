interface CardProps {
  title: string;
  value: string | number;
  className?: string;
  color?: string; // Novo parâmetro para definir a cor do card
}

export function Card({ title, value, className = '', color = 'blue' }: CardProps) {
  return (
    <div
      className={`rounded-xl shadow-sm p-6 ${className}`}
      style={{ backgroundColor: color }} // Aplicar a cor do card
    >
      <h3 className="text-sm font-medium text-white-500 mb-2">{title}</h3>
      <p className="text-3xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}