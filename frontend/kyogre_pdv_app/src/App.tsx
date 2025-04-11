// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { ClientsPage } from './pages/dashboard/ClientsPage';
import { LoginPageComponent } from './pages/dashboard/LoginPage';
import { ChatPage } from './pages/dashboard/ChatPage';
import { CardapioDigitalPage } from './pages/cardapio/CardapioDigitalPage';
import { ProductDetailsPage } from './pages/cardapio/ProductDetailsPage';
import { CartProvider } from './contexts/CartContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import './index.css';
import { HomePage } from './pages/dashboard/HomePage';
import { DashboardPedidosPage } from './pages/dashboard/DashboardPedidos';
import PaginaComponentes from './pages/UI/pagina_componentes.js';
import ControleEstoquePage from '../app/controle_estoque/src/ControleEstoquePage.jsx';
import GarcomMesas from '../app/app_garcom_pdv/pages/GarcomMesas.js';
import CardapioPDV from '../app/app_garcom_pdv/pages/CardapioPDV.js';
import CheckoutPage from '../app/app_garcom_pdv/pages/CheckoutPage.js';
import { CardapioManagerPage } from './pages/dashboard/CardapioManager';
import { useAuth } from './contexts/AuthContext';
import PDFGeneratorPage from './components/ui/pdf_generator';

const isProduction = true; //! Altere para false se quiser simular login automático em desenvolvimento

// recomendo salvar no login o user_id ou empresa_id também (retornado pela API), para ser o identificador principal de tudo (storage path, tabelas, permissões).

// exemplo:
// PastaStorage: `/cardapios/${user.empresa_id}/logo.png`
// TabelaCardapio: `cardapio_${user.empresa_id}`

function App() {
    const { isAuthenticated, isAuthLoading } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (isAuthLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen text-gray-600">
                <span className="text-lg animate-pulse">🔐 Verificando sessão de login...</span>
            </div>
        );
    }

    return (
        <Router>
            <CartProvider>
                <Routes>
                    <Route
                        path="/"
                        element={
                            isAuthenticated ? (
                                <Navigate to="/dashboard" replace />
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />

                    <Route
                        path="/dashboard/*"
                        element={
                            isAuthenticated ? (
                                <div className="flex min-h-screen bg-gray-100">
                                    {/* Sidebar */}
                                    <Sidebar
                                        isOpen={isSidebarOpen}
                                        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                                    />

                                    {/* Main Content */}
                                    <div
                                        className={`flex-1 transition-all duration-300 ${
                                            isSidebarOpen ? 'md:ml-64' : 'ml-0'
                                        }`}
                                    >
                                        {/* Header */}
                                        <Header
                                            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                                            isSidebarOpen={isSidebarOpen}
                                        />

                                        {/* Main Content Area */}
                                        <main className="p-4 sm:p-6 md:p-8 pt-16">
                                            <Routes>
                                                <Route index element={<DashboardPedidosPage />} />
                                                {/* <Route path="produtos" element={<MenuPage />} /> */}
                                                <Route path="clientes" element={<ClientsPage />} />
                                                <Route path="pedidos" element={<HomePage />} />
                                                <Route path="atendimento" element={<ChatPage />} />
                                                <Route
                                                    path="cardapioManager"
                                                    element={
                                                        <CardapioManagerPage
                                                            isSidebarOpen={isSidebarOpen}
                                                        />
                                                    }
                                                />
                                            </Routes>
                                        </main>
                                    </div>
                                </div>
                            ) : (
                                <Navigate to="/login" replace />
                            )
                        }
                    />

                    <Route
                        path="/*"
                        element={
                            <div className="min-h-screen bg-gray-50">
                                <Routes>
                                    <Route path="cardapio" element={<CardapioDigitalPage />} />
                                    <Route path="product/:id" element={<ProductDetailsPage />} />
                                    <Route
                                        path="login"
                                        element={<LoginPageComponent isDebug={!isProduction} />}
                                    />
                                    <Route path="pedido_pdf" element={<PDFGeneratorPage />} />
                                    <Route path="controle_estoque" element={<ControleEstoquePage />} />
                                    <Route path="pagina_componentes" element={<PaginaComponentes />} />
                                    <Route path="app_garcom" element={<GarcomMesas />} />
                                    <Route path="cardapio/:mesa" element={<CardapioPDV />} />
                                    <Route path="checkout/:pedidoId" element={<CheckoutPage />} />
                                </Routes>
                            </div>
                        }
                    />
                </Routes>
            </CartProvider>
        </Router>
    );
}

export default App;