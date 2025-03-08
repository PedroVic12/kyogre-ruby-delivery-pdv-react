export function TWButton({ label, onClick }: { label: string; onClick?: () => void }) {
    return (
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={onClick}
      >
        {label}
      </button>
    );
  }
  
  export function TWCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div className="p-4 shadow-md bg-white rounded-lg border border-gray-300">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        {children}
      </div>
    );
  }
  