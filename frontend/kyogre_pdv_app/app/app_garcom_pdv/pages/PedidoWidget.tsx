import React, { useState, } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Box,
    Select,
    MenuItem,
    FormControl,
} from '@mui/material';
import { Plus, Minus } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
}

interface Category {
    id: string;
    name: string;
    products: Product[];
}

interface CartItem extends Product {
    quantity: number;
    assignedTo?: string;
}

interface OrderData {
    customerName: string;
    customersCount: number;
    peopleNames: string[];
    items: CartItem[];
    total: number;
}

const OrderComponent: React.FC = () => {
    // Estados existentes
    const [categories,] = useState<Category[]>([]);
    const [activeTab,] = useState<string>('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [customerName, setCustomerName] = useState('');
    const [customersCount, setCustomersCount] = useState<number>(1);

    // Novo estado para gerenciar nomes das pessoas
    const [peopleNames, setPeopleNames] = useState<string>('');

    // Validação dos nomes das pessoas
    const validatePeopleNames = (): boolean => {
        const nameList = peopleNames
            .split(',')
            .map(name => name.trim())
            .filter(name => name.length > 0);
        return nameList.length === customersCount;
    };

    // Função para obter array de nomes limpos
    const getPeopleNamesList = (): string[] => {
        return peopleNames
            .split(',')
            .map(name => name.trim())
            .filter(name => name.length > 0);
    };

    // Função modificada para adicionar ao carrinho
    const addToCart = (product: Product, assignedTo: string) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(
                item => item.id === product.id && item.assignedTo === assignedTo
            );

            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id && item.assignedTo === assignedTo
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prevCart, { ...product, quantity: 1, assignedTo }];
        });
    };

    // Função modificada para remover do carrinho
    const removeFromCart = (productId: string, assignedTo: string) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(
                item => item.id === productId && item.assignedTo === assignedTo
            );

            if (existingItem && existingItem.quantity > 1) {
                return prevCart.map(item =>
                    item.id === productId && item.assignedTo === assignedTo
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            }

            return prevCart.filter(
                item => !(item.id === productId && item.assignedTo === assignedTo)
            );
        });
    };

    // Cálculo do total
    const calculateTotal = (): number => {
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    // Finalizar pedido
    const handleFinishOrder = () => {
        if (!validatePeopleNames()) return;

        const orderData: OrderData = {
            customerName,
            customersCount,
            peopleNames: getPeopleNamesList(),
            items: cart,
            total: calculateTotal()
        };

        console.log('Dados do pedido:', orderData);
        // Aqui você pode adicionar a lógica para enviar o pedido
    };

    // Componente de item do carrinho (reutilizável)
    const CartItemComponent = ({ item }: { item: CartItem }) => (
        <div key={`${item.id}-${item.assignedTo}`} className="flex justify-between items-center p-2">
            <Box sx={{ width: 40, height: 40, bgcolor: '#e0e0e0', mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.imageUrl ? (
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <Box sx={{ width: '100%', height: '100%', border: '1px solid #ccc' }} />
                )}
            </Box>

            <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">R$ {item.price.toFixed(2)}</p>
            </div>

            <div className="flex flex-col items-end gap-2">
                <FormControl size="small" sx={{ minWidth: 120, mb: 1 }}>
                    <Select
                        value={item.assignedTo || ''}
                        onChange={(e) => {
                            const newCart = cart.map(cartItem =>
                                cartItem.id === item.id ? { ...cartItem, assignedTo: e.target.value } : cartItem
                            );
                            setCart(newCart);
                        }}
                    >
                        {getPeopleNamesList().map(name => (
                            <MenuItem key={name} value={name}>
                                {name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => item.assignedTo && removeFromCart(item.id, item.assignedTo)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                        <Minus size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                        onClick={() => {
                            const product = categories
                                .find(cat => cat.name.toLowerCase() === activeTab)
                                ?.products.find(prod => prod.id === item.id);
                            if (product && item.assignedTo) {
                                addToCart(product, item.assignedTo);
                            }
                        }}
                        className="p-1 text-green-500 hover:bg-green-50 rounded"
                    >
                        <Plus size={16} />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Modal do Carrinho (Mobile) */}
            <Dialog open={isCartOpen} onClose={() => setIsCartOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Pedido</DialogTitle>
                <DialogContent>
                    <div className="space-y-2 mb-2">
                        <TextField
                            fullWidth
                            margin="normal"
                            label="Nome do Cliente"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            placeholder="Nome do cliente"
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            type="number"
                            label="Número de Pessoas"
                            value={customersCount}
                            onChange={(e) => setCustomersCount(Number(e.target.value))}
                            inputProps={{ min: "1" }}
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Nomes das Pessoas"
                            value={peopleNames}
                            onChange={(e) => setPeopleNames(e.target.value)}
                            placeholder="Nome1, Nome2, Nome3..."
                            error={!validatePeopleNames()}
                            helperText={!validatePeopleNames() ?
                                `Digite ${customersCount} nomes separados por vírgula` : ''}
                        />
                    </div>

                    <div className="space-y-4 mb-4">
                        {cart.map((item) => (
                            <CartItemComponent key={`${item.id}-${item.assignedTo}`} item={item} />
                        ))}
                    </div>

                    <div className="border-t pt-4">
                        <div className="flex justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span>R$ {calculateTotal().toFixed(2)}</span>
                        </div>
                    </div>
                </DialogContent>

                <Button
                    fullWidth
                    onClick={handleFinishOrder}
                    disabled={cart.length === 0 || !customerName || !validatePeopleNames()}
                    className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                >
                    Finalizar Pedido
                </Button>
            </Dialog>

            {/* Carrinho (Desktop) */}
            <aside className="w-full md:w-1/3 bg-white p-4 shadow-lg md:block hidden">
                <div className="mb-6">
                    <TextField
                        fullWidth
                        label="Nome do Cliente"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Nome do cliente"
                    />
                </div>

                <div className="mb-6">
                    <TextField
                        fullWidth
                        type="number"
                        label="Número de Pessoas"
                        value={customersCount}
                        onChange={(e) => setCustomersCount(Number(e.target.value))}
                        inputProps={{ min: "1" }}
                    />
                </div>

                <div className="mb-6">
                    <TextField
                        fullWidth
                        label="Nomes das Pessoas"
                        value={peopleNames}
                        onChange={(e) => setPeopleNames(e.target.value)}
                        placeholder="Nome1, Nome2, Nome3..."
                        error={!validatePeopleNames()}
                        helperText={!validatePeopleNames() ?
                            `Digite ${customersCount} nomes separados por vírgula` : ''}
                    />
                </div>

                <h2 className="text-lg font-semibold mb-4">Pedido da mesa</h2>

                <div className="space-y-4 mb-4">
                    {cart.map((item) => (
                        <CartItemComponent key={`${item.id}-${item.assignedTo}`} item={item} />
                    ))}
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>R$ {calculateTotal().toFixed(2)}</span>
                    </div>

                    <Button
                        fullWidth
                        onClick={handleFinishOrder}
                        disabled={cart.length === 0 || !customerName || !validatePeopleNames()}
                        className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400"
                    >
                        Finalizar Pedido
                    </Button>
                </div>
            </aside>
        </>
    );
};

export default OrderComponent;