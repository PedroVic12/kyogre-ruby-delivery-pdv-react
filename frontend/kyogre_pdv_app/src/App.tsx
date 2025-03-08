// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { DashboardPage } from './pages/dashboard/DashboardPage';
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
import TabelasMesasPage from '../app/app_garcom_pdv/mesasPage';
import { HomePage } from './pages/dashboard/HomePage';
import { DashboardPedidosPage } from './pages/dashboard/DashboardPedidos';
import PaginaComponentes from './pages/UI/pagina_componentes.js';

import ControleEstoquePage from '../app/controle_estoque/src/ControleEstoquePage.jsx';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
      <Router>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />

            {/* Rotas Admin Dashboard (Template 2) */}
            <Route
              path="/dashboard/*"
              element={
                <div className="flex min-h-screen bg-gray-120">

                  {/* Sidebar */}
                  <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                  <div className={`flex-1 transition-all ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>

                    {/* Header */}
                    <Header
                      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                      isSidebarOpen={isSidebarOpen}
                    />

                    {/* Rotas Admin Dashboard (Template 2) */}
                    <div className="p-6 pt-16">
                      <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="produtos" element={<MenuPage />} />
                        <Route path="clientes" element={<ClientsPage />} />
                        <Route path="pedidos" element={<HomePage />} />
                        <Route path="atendimento" element={<ChatPage />} />
                        <Route path="kanban" element={<DashboardPedidosPage />} />

                      </Routes>
                    </div>
                  </div>
                </div>
              }
            />

            {/*  Template 3 (Cardapio Digital) - APENAS TELAS FORA DO DASHBOARD */}
            <Route
              path="/*"
              element={
                <div className="min-h-screen bg-gray-50">
                  <Routes>
                    <Route path="cardapio" element={<CardapioDigitalPage />} />
                    <Route path="product/:id" element={<ProductDetailsPage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="garcom" element={<TabelasMesasPage />} />
                    <Route path="controle_estoque" element={<ControleEstoquePage />} />
                    <Route path="pagina_componentes" element={ <PaginaComponentes />} />

                  </Routes>
                </div>
              }
            />
          </Routes>
        </CartProvider>
      </Router>
  );
}