import { useState } from "react";
import { TWButton, TWCard } from "../../public/widgets_tailwind";
import { MUIButton, MUICard } from "../../public/widgets_material_desing";

export default function PaginaComponentes() {
  const [clicks, setClicks] = useState(0);

  return (
    <div className="container mx-auto p-4 max-w-3xl flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Comparação Tailwind vs Material UI</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        {/* Tailwind */}
        <div className="p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-center">Tailwind</h2>
          <TWCard title="Card Tailwind">
            <p className="mb-2">Clique no botão abaixo:</p>
            <TWButton label={`Clicado ${clicks} vezes`} onClick={() => setClicks(clicks + 1)} />
          </TWCard>
        </div>

        {/* Material UI */}
        <div className="p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-center">Material UI</h2>
          <MUICard title="Card Material UI">
            <p className="mb-2">Clique no botão abaixo:</p>
            <MUIButton label={`Clicado ${clicks} vezes`} onClick={() => setClicks(clicks + 1)} />
          </MUICard>
        </div>
      </div>
    </div>
  );
}
