
interface CardProps {
  title: string;
  value: string | number;
  className?: string;
}

export function Card({ title, value, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <p className="text-3xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}