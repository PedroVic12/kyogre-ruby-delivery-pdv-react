// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
//import { DashboardPage } from './pages/dashboard/DashboardPage';
import { MenuPage } from './pages/dashboard/MenuPage';
import { ClientsPage } from './pages/dashboard/ClientsPage';
import { LoginPage } from './pages/dashboard/LoginPage';
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

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <CartProvider>
        <Routes>
          {/* Redirect root path to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Dashboard Routes (Template 2) - now more responsive */}
          <Route
            path="/dashboard/*"
            element={
              <div className="flex min-h-screen bg-gray-100 md:bg-gray-120"> {/*Adjust background color for better contrast and responsiveness*/}
                {/* Sidebar - responsive adjustments */}
                <Sidebar
                  isOpen={isSidebarOpen}
                  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <div
                  className={`flex-1 transition-all duration-300 ${
                    isSidebarOpen ? 'md:ml-64' : 'ml-0'
                  }`}
                >
                  {/* Header - responsive adjustments */}
                  <Header
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    isSidebarOpen={isSidebarOpen}
                  />

                  {/* Dashboard Content - responsive adjustments */}
                  <main className="p-4 sm:p-6 md:p-8 pt-16">
                    <Routes>
                     {/* <Route index element={<DashboardPage />} />  */}

                      <Route index element={<DashboardPedidosPage />} /> {/* Index route for /dashboard */}
                      <Route path="produtos" element={<MenuPage />} />
                      <Route path="clientes" element={<ClientsPage />} />
                      <Route path="pedidos" element={<HomePage />} />
                      <Route path="atendimento" element={<ChatPage />} />
                    </Routes>
                  </main>
                </div>
              </div>
            }
          />

          {/* Other Routes (Template 3) - responsive adjustments */}
          <Route
            path="/*"
            element={
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  <Route path="cardapio" element={<CardapioDigitalPage />} />
                  <Route path="product/:id" element={<ProductDetailsPage />} />
                  <Route path="login" element={<LoginPage />} />
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
