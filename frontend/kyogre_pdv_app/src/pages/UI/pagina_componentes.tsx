import React, { useState } from "react";
import Button from "@mui/material/Button";
import { Card as MUICardComponent, CardContent as MUICardContent, Typography as MUITypography } from "@mui/material";

// ==========================================================================
//                             COMPONENTES TAILWIND
// ==========================================================================

/**
 * Interface para as props do componente TWButton (Tailwind Button).
 */
interface TWButtonProps {
    label: string;
    onClick: () => void;
    className?: string; // Prop para classes CSS adicionais do Tailwind
}

/**
 * Componente reutilizável de Botão Tailwind.
 * Aceita um label, um handler de onClick e props de estilo opcionais.
 */
const TWButton: React.FC<TWButtonProps> = ({ label, onClick, className = "" }) => {
    return (
        <button
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${className}`}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

/**
 * Interface para as props do componente TWCard (Tailwind Card).
 */
interface TWCardProps {
    title?: string;
    children: React.ReactNode;
    className?: string; // Prop para classes CSS adicionais do Tailwind
}

/**
 * Componente reutilizável de Card Tailwind.
 * Aceita um título e renderiza os filhos dentro do card.
 */
const TWCard: React.FC<TWCardProps> = ({ title, children, className = "" }) => {
    return (
        <div className={`p-4 border rounded-lg shadow-md ${className}`}>
            {title && <h3 className="text-xl font-semibold mb-2">{title}</h3>}
            {children}
        </div>
    );
};

/**
 * Interface para as props do componente TWResponsiveText (Texto Responsivo Tailwind).
 */
interface TWResponsiveTextProps {
    children: React.ReactNode;
    className?: string; // Prop para classes CSS adicionais do Tailwind
}

/**
 * Componente reutilizável de Texto Responsivo Tailwind.
 * Tamanho do texto muda com base no tamanho da tela.
 */
const TWResponsiveText: React.FC<TWResponsiveTextProps> = ({ children, className = "" }) => {
    return (
        <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold ${className}`}>
            {children}
        </h1>
    );
};

/**
 * Interface para as props do componente TWResponsiveColorDiv (Div Responsiva com Cor Tailwind).
 */
interface TWResponsiveColorDivProps {
    children: React.ReactNode;
    className?: string; // Prop para classes CSS adicionais do Tailwind
}


/**
 * Componente reutilizável de Div Responsiva com Mudança de Cor Tailwind.
 * A cor de fundo muda com base no tamanho da tela.
 */
const TWResponsiveColorDiv: React.FC<TWResponsiveColorDivProps> = ({ children, className = "" }) => {
    return (
        <div className={`p-4 bg-blue-500 text-white text-lg sm:bg-red-500 md:bg-green-500 lg:bg-purple-500 ${className}`}>
            {children}
        </div>
    );
};

/**
 * Interface para as props do componente TWGridLayout (Grid Layout Tailwind).
 */
interface TWGridLayoutProps {
    children: React.ReactNode;
    columns?: string; // Define as colunas do grid (e.g., "md:grid-cols-2", "lg:grid-cols-3")
    className?: string; // Prop para classes CSS adicionais do Tailwind
}

/**
 * Componente reutilizável de Grid Layout Tailwind.
 * Permite criar layouts de grid responsivos.
 */
const TWGridLayout: React.FC<TWGridLayoutProps> = ({ children, columns = "md:grid-cols-2", className = "" }) => {
    return (
        <div className={`grid grid-cols-1 ${columns} gap-4 ${className}`}>
            {children}
        </div>
    );
};

/**
 * Interface para as props do componente TWContainer (Container Tailwind).
 */
interface TWContainerProps {
    children: React.ReactNode;
    bgColor?: string; // Cor de fundo do Container
    className?: string; // Prop para classes CSS adicionais do Tailwind
}

/**
 * Componente reutilizável de Container Tailwind.
 * Centraliza o conteúdo e oferece responsividade básica.
 */
const TWContainer: React.FC<TWContainerProps> = ({ children, bgColor = "bg-purple-500", className = "" }) => {
    return (
        <div className={`container mx-auto p-4 max-w-3xl flex flex-col items-center justify-center ${bgColor} ${className}`}>
            {children}
        </div>
    );
};


// ==========================================================================
//                         COMPONENTES MATERIAL UI
// ==========================================================================

/**
 * Interface para as props do componente MUIButton (Material UI Button).
 */
interface MUIButtonProps {
    label: string;
    onClick: () => void;
    className?: string; // Prop para classes CSS adicionais do Material UI
}

/**
 * Componente reutilizável de Botão Material UI.
 * Aceita um label, um handler de onClick e props de estilo opcionais.
 */
const MUIButton: React.FC<MUIButtonProps> = ({ label, onClick, className = "" }) => {
    return (
        <Button
            variant="contained"
            onClick={onClick}
            className={className}
        >
            {label}
        </Button>
    );
};

/**
 * Interface para as props do componente MUICard (Material UI Card).
 */
interface MUICardProps {
    title?: string;
    children: React.ReactNode;
    className?: string; // Prop para classes CSS adicionais do Material UI
}


/**
 * Componente reutilizável de Card Material UI.
 * Aceita um título e renderiza os filhos dentro do card.
 */
const MUICard: React.FC<MUICardProps> = ({ title, children, className = "" }) => {
    return (
        <MUICardComponent className={`shadow-md rounded-lg border p-4 ${className}`}>
            {title && <MUITypography variant="h6" component="h2" gutterBottom>{title}</MUITypography>}
            <MUICardContent>
                {children}
            </MUICardContent>
        </MUICardComponent>
    );
};


// ==========================================================================
//                     PÁGINA PRINCIPAL - PaginaComponentes
// ==========================================================================

/**
 * Componente principal da página PaginaComponentes.
 * Demonstra a comparação entre componentes Tailwind e Material UI.
 */
const PaginaComponentes: React.FC = () => {
    const [clicks, setClicks] = useState<number>(0);

    return (
        <div className="container mx-auto p-4 max-w-3xl flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Comparação Tailwind vs Material UI</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                {/* Seção Tailwind */}
                <div className="p-4 border rounded-lg shadow-md">
                    <TWResponsiveText>Texto Responsivo Tailwind</TWResponsiveText>
                    <div className="hidden sm:block">Isso só aparece no desktop</div>
                    <div className="block sm:hidden">Isso aparece apenas no mobile</div>

                    <h2 className="text-xl font-semibold mb-4 text-center">Componentes Tailwind</h2>
                    <TWCard title="Card Tailwind">
                        <p className="mb-2">Clique no botão abaixo:</p>
                        <TWButton label={`Clicado ${clicks} vezes`} onClick={() => setClicks(clicks + 1)} />
                    </TWCard>

                    <TWResponsiveColorDiv>
                        Esse fundo muda de cor em diferentes telas!
                    </TWResponsiveColorDiv>

                    <TWGridLayout columns="md:grid-cols-2 lg:grid-cols-3">
                        <div className="bg-gray-300 p-4">Item 1</div>
                        <div className="bg-gray-400 p-4">Item 2</div>
                        <div className="bg-gray-500 p-4">Item 3</div>
                    </TWGridLayout>

                    <TWContainer bgColor="bg-purple-500">
                        <p className="text-center text-gray-700">Conteúdo responsivo com Container Tailwind</p>
                    </TWContainer>
                </div>

                {/* Seção Material UI */}
                <div className="p-4 border rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-center">Componentes Material UI</h2>
                    <MUICard title="Card Material UI">
                        <p className="mb-2">Clique no botão abaixo:</p>
                        <MUIButton label={`Clicado ${clicks} vezes`} onClick={() => setClicks(clicks + 1)} />
                    </MUICard>
                    <Button className="bg-blue-500 hover:bg-blue-300 text-white font-bold py-2 px-4 rounded">
                        Botão Material UI com classes Tailwind 
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default PaginaComponentes;