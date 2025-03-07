import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import "../../index.css"

// Definições de Interface (Typescript)
interface OrderItem {
    quantidade: number;
    nome: string;
    preco: number;
}

interface DataPedido {
    data: string;
    hora: string;
}

export interface Order {
    id: number;
    nome_cliente: string;
    telefone: string;
    endereco: string;
    complemento: string;
    forma_pagamento: string;
    status: string;
    total_pagar: number;
    data_pedido: DataPedido;
    carrinho: OrderItem[];
}

// Componente OrderCard (Cartão de Pedido)
interface OrderCardProps {
    order: Order;
    onAdvance?: (orderId: number, nextStatus: string) => void;
    buttonIcon?: React.ReactNode;
}

// No componente OrderCard, adicione o estado de expansão
function OrderCard({ order, onAdvance, buttonIcon }: OrderCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    function getNextStatus(status: string): string {
        switch (status) {
            case 'Em Processo': return 'Cozinha';
            case 'Cozinha': return 'Entrega';
            case 'Entrega': return 'Finalizado';
            default: return status;
        }
    }

    return (
        <div className="bg-gray-50 rounded-md p-4 shadow-sm border relative">
            {/* Cabeçalho do Card - Sempre visível */}
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div>
                    <h3 className="font-semibold text-lg">Pedido #{order.id}</h3>
                    <p className="text-gray-600">Cliente: {order.nome_cliente}</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-sm ${isExpanded ? 'rotate-180' : ''} transition-transform`}>
                        ▼
                    </span>
                </div>
            </div>

            {/* Conteúdo expandido */}
            {isExpanded && (
                <div className="mt-4 space-y-3">
                    <div className="space-y-2">
                        <p className="text-gray-700">Telefone: {order.telefone}</p>
                        <p className="text-gray-700">Endereço: {order.endereco}</p>
                        <p className="text-gray-700">Complemento: {order.complemento}</p>
                    </div>

                    <div className="mt-3">
                        <h4 className="font-semibold mb-2">Itens do pedido:</h4>
                        <ul className="space-y-2">
                            {order.carrinho.map((item, index) => (
                                <li key={index} className="flex justify-between bg-white p-2 rounded">
                                    <span>{item.quantidade}x {item.nome}</span>
                                    <span>R$ {item.preco.toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="pt-3 border-t">
                        <p className="text-gray-700">Forma de Pagamento: {order.forma_pagamento}</p>
                        <p className="font-semibold text-lg">Total: R$ {order.total_pagar.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">
                            Data: {order.data_pedido.data} às {order.data_pedido.hora}
                        </p>
                    </div>
                </div>
            )}

            {/* Status e Botão de Avançar */}
            <div className="mt-3 flex justify-between items-center">
                <span className="text-sm font-medium px-2 py-1 bg-gray-200 rounded">
                    {order.status}
                </span>

                {onAdvance && order.status !== 'Finalizado' && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // Evita que o clique propague para o toggle
                            onAdvance(order.id, getNextStatus(order.status));
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Avançar {buttonIcon}
                    </button>
                )}
            </div>
        </div>
    );
}

// Componente OrderColumn (Coluna de Pedidos por Status)
interface OrderColumnProps {
    title: string;
    orders: Order[];
    color: string;
    onAdvance?: (orderId: number, nextStatus: string) => void;
    buttonIcon?: React.ReactNode;
}

function OrderColumn({ title, orders, color, onAdvance, buttonIcon }: OrderColumnProps) {
    return (
        <div className={`w-72 p-4 rounded-md bg-gray-100 flex flex-col items-start border-t-4 ${color}`}>
            <h2 className="text-xl font-semibold mb-2">{title} - ({orders.length})</h2>
            <div className="w-full space-y-3">
                {orders.map((order) => (
                    <OrderCard key={order.id} order={order} onAdvance={onAdvance} buttonIcon={buttonIcon} />
                ))}
            </div>
        </div>
    );
}

// Componente NewOrderDialog (Dialogo de Novo Pedido)
interface NewOrderDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
}

function NewOrderDialog({ isOpen, onClose, onAccept }: NewOrderDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-md shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Novo Pedido Recebido!</h2>
                <p className="mb-4">Um novo pedido chegou. Deseja aceitá-lo e colocá-lo em preparo?</p>
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md">
                        Fechar
                    </button>
                    <button onClick={onAccept} className="px-4 py-2 bg-indigo-500 text-white hover:bg-indigo-600 rounded-md">
                        Aceitar Pedido
                    </button>
                </div>
            </div>
        </div>
    );
}


// Componente DashboardPage (Página Dashboard)
export function DashboardPedidosPage() {
    const [pedidosEmProcesso, setPedidosEmProcesso] = useState<Order[]>([]);
    const [pedidosCozinha, setPedidosCozinha] = useState<Order[]>([]);
    const [pedidosEntrega, setPedidosEntrega] = useState<Order[]>([]);
    const [pedidosFinalizados, setPedidosFinalizados] = useState<Order[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [newOrdersCount, setNewOrdersCount] = useState(0);
    const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);
    const [lastOrdersLength, setLastOrdersLength] = useState(0);

    const API_ENDPOINT = 'http://localhost:8000/pedidos/'; // Rota da sua API para buscar pedidos

    const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log("Iniciando busca de pedidos na API:", API_ENDPOINT);

            const response = await fetch(API_ENDPOINT);
            console.log("Status da resposta:", response.status);

            if (!response.ok) {
                throw new Error(`Erro ao buscar pedidos: ${response.status} - ${response.statusText}`);
            }

            // Problema: você está chamando response.json() duas vezes
            // A primeira chamada consome o corpo da resposta e retorna uma Promise
            // A segunda chamada não tem mais o que consumir

            // Remova este console.log ou modifique-o:
            // console.log(response.status);
            // console.log(response.json()); // Isso consome o corpo da resposta!

            // Em vez disso, faça:
            const responseText = await response.text();
            console.log("Resposta bruta da API:", responseText);

            let data: Order[] = [];
            try {
                // Tente fazer o parse do JSON
                data = JSON.parse(responseText);
                console.log("Dados parseados com sucesso:", data);
            } catch (parseError) {
                console.error("Erro ao fazer parse do JSON:", parseError);
                throw new Error(`Resposta inválida da API: ${responseText}`);
            }

            // Verificar se há novos pedidos comparando o tamanho da lista
            console.log("Quantidade de pedidos recebidos:", data.length);
            console.log("Quantidade anterior de pedidos:", lastOrdersLength);

            if (data.length > lastOrdersLength && lastOrdersLength !== 0) {
                setNewOrdersCount(data.length - lastOrdersLength);
                setIsNewOrderDialogOpen(true); // Abre o dialog de novo pedido
            }
            setLastOrdersLength(data.length); // Atualiza o tamanho da lista anterior

            // Processar e separar os pedidos por status
            console.log("Separando pedidos por status...");
            const processando = data.filter(order => order.status === 'Em Processo');
            const cozinha = data.filter(order => order.status === 'Cozinha');
            const entrega = data.filter(order => order.status === 'Entrega');
            const finalizados = data.filter(order => order.status === 'Finalizado');

            console.log("Pedidos em processo:", processando.length);
            console.log("Pedidos na cozinha:", cozinha.length);
            console.log("Pedidos em entrega:", entrega.length);
            console.log("Pedidos finalizados:", finalizados.length);

            setPedidosEmProcesso(processando);
            setPedidosCozinha(cozinha);
            setPedidosEntrega(entrega);
            setPedidosFinalizados(finalizados);

        } catch (e: any) {
            setError(e.message || "Erro ao buscar pedidos.");
            console.error("Erro ao buscar pedidos:", e);
        } finally {
            setIsLoading(false);
        }
    };


    const handleAcceptNewOrder = () => {
        setIsNewOrderDialogOpen(false);
        setNewOrdersCount(0);
        // Aqui você pode adicionar lógica adicional ao aceitar um novo pedido, se necessário.
    };

    const handleCloseNewOrderDialog = () => {
        setIsNewOrderDialogOpen(false);
        setNewOrdersCount(0);
    };


    const getNextStatus = (currentStatus: string) => {
        switch (currentStatus) {
            case 'Em Processo': return 'Cozinha';
            case 'Cozinha': return 'Entrega';
            case 'Entrega': return 'Finalizado';
            default: return currentStatus; // Ou defina um status padrão ou tratamento de erro
        }
    };


    // Função para avançar o status do pedido (simulada - você precisa implementar no backend)
    const advanceOrder = async (orderId: number, nextStatus: string) => {
        const UPDATE_API_ENDPOINT = `http://localhost:8000/pedidos/${orderId}/status`; // Rota de exemplo para atualizar status
        try {
            const response = await fetch(UPDATE_API_ENDPOINT, {
                method: 'PUT', // Usando PUT conforme solicitado
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: nextStatus }), // Envia o novo status
            });
            if (!response.ok) {
                throw new Error(`Erro ao atualizar pedido ${orderId}: ${response.status} - ${response.statusText}`);
            }
            // Após atualizar no backend, refazer a busca de pedidos para atualizar a interface
            fetchOrders(); // Refaz a busca para atualizar a lista na tela
            console.log(`Pedido ${orderId} avançado para status: ${nextStatus} (ID: ${orderId})`);

        } catch (e: any) {
            setError(e.message || `Erro ao avançar pedido ${orderId}.`);
            console.error(`Erro ao avançar pedido ${orderId}:`, e);
        }
    };


    useEffect(() => {
        fetchOrders(); // Busca inicial de pedidos ao montar o componente

        // Configurar intervalo para buscar pedidos a cada 5 segundos
        const intervalId = setInterval(fetchOrders, 10000); // 5000 milissegundos = 5 segundos

        // Limpar o intervalo ao desmontar o componente para evitar vazamentos de memória
        return () => clearInterval(intervalId);
    }, []); // Dependência vazia para executar apenas na montagem e desmontagem


    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Carregando Pedidos...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Erro ao carregar pedidos: {error}</div>;
    }


    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-semibold mb-6 text-gray-800">Gerenciamento de Pedidos</h1>

            <NewOrderDialog
                isOpen={isNewOrderDialogOpen}
                onClose={handleCloseNewOrderDialog}
                onAccept={handleAcceptNewOrder}
            />


            <div className="flex gap-4 overflow-x-auto">
                <OrderColumn
                    title="Em Processo"
                    orders={pedidosEmProcesso}
                    color="border-blue-500"
                    onAdvance={advanceOrder}
                    buttonIcon={<ChevronRight />}
                />
                <OrderColumn
                    title="Cozinha"
                    orders={pedidosCozinha}
                    color="border-yellow-500"
                    onAdvance={advanceOrder}
                    buttonIcon={<ChevronRight />}
                />
                <OrderColumn
                    title="Entrega"
                    orders={pedidosEntrega}
                    color="border-green-500"
                    onAdvance={advanceOrder}
                    buttonIcon={<ChevronRight />}
                />
                <OrderColumn
                    title="Finalizado"
                    orders={pedidosFinalizados}
                    color="border-gray-400"
                />
            </div>
        </div>
    );
}