import React from "react";
import { Link } from "react-router-dom"; // Importe o Link do React Router

// Definição do tipo para os itens de navegação
interface NavigationItem {
    label: string;
    icon: React.ReactNode;
    url?: string; // Opcional, pois o botão central não tem URL
    isCentral: boolean;
    onClick?: () => void; // Opcional, pois nem todos os itens têm onClick
}

// Definição do array de itens de navegação
export const navigationItems: NavigationItem[] = [
    {
        label: "Dashboard",
        icon: <span style={{ fontSize: "20px", color: "white" }}>🏠</span>, // Ícone de casa
        url: "/",
        isCentral: false,
    },
    {
        label: "Cardapio PDV",
        icon: <span style={{ fontSize: "20px", color: "white" }}>💰</span>, // Ícone de carteira
        url: "/wallet",
        isCentral: false,
    },
    {
        label: "Iniciar novo pedido",
        icon: <span style={{ fontSize: "20px", color: "white" }}>➕</span>, // Ícone de adicionar
        isCentral: true,
        onClick: () => {
            // Lógica para criar um novo item
            alert("Criar novo item");
        },
    },
    {
        label: "Pedidos",
        icon: <span style={{ fontSize: "20px", color: "white" }}>⚙️</span>, // Ícone de configurações
        url: "/settings",
        isCentral: false,
    },
    {
        label: "Pedidos",
        icon: <span style={{ fontSize: "20px", color: "white" }}>⚙️</span>, // Ícone de configurações
        url: "/settings",
        isCentral: false,
    },
];

// Definição do tipo para as props do componente
interface BottomNavigationBarProps {
    navigationItems: NavigationItem[];
}

export default function BottomNavigationBar({ navigationItems }: BottomNavigationBarProps) {
    return (
        <>
            <div>
                <div className="fixed z-50 w-full h-16 max-w-lg -translate-x-1/2 bg-gray-900 border border-gray-800 rounded-full bottom-4 left-1/2">
                    <div className="grid h-full max-w-lg grid-cols-5 mx-auto bg-gray-900 rounded-full">
                        {navigationItems.map((item, index) => (
                            <React.Fragment key={index}>
                                {item.isCentral ? (
                                    // Botão central (pode ter lógica diferente)
                                    <div className="flex items-center justify-center">
                                        <button
                                            data-tooltip-target={`tooltip-${item.label.toLowerCase()}`}
                                            type="button"
                                            className="inline-flex items-center justify-center w-12 h-12 font-medium bg-blue-600 rounded-full hover:bg-blue-700 group focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800"
                                            onClick={item.onClick} // Adicione uma função onClick se necessário
                                        >
                                            {item.icon}
                                            <span className="sr-only">{item.label}</span>
                                        </button>
                                    </div>
                                ) : (
                                    // Botões de navegação padrão
                                    <Link
                                        to={item.url || "#"}
                                        data-tooltip-target={`tooltip-${item.label.toLowerCase()}`}
                                        className={`inline-flex flex-col items-center justify-center px-5 ${
                                            index === 0 ? 'rounded-s-full' : ''
                                        } ${index === navigationItems.length - 1 ? 'rounded-e-full' : ''} hover:bg-gray-800 group`}
                                    >
                                        {item.icon}
                                        <span className="sr-only text-white">{item.label}</span>
                                    </Link>
                                )}
                                <div
                                    id={`tooltip-${item.label.toLowerCase()}`}
                                    role="tooltip"
                                    className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
                                >
                                    {item.label}
                                    <div className="tooltip-arrow" data-popper-arrow></div>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}