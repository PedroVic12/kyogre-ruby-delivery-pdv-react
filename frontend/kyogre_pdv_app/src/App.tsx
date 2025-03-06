import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { DashboardPage } from './pages/dashboard/DashboardPage';
import { MenuPage } from './pages/dashboard/MenuPage';
import { ClientsPage } from './pages/dashboard/ClientsPage';
import { OrdersPage } from './pages/dashboard/OrdersPage';
import { LoginPage } from './pages/dashboard/LoginPage';
import { ChatPage } from './pages/dashboard/ChatPage';



import { CardapioDigitalPage } from './pages/cardapio/CardapioDigitalPage';
import { ProductDetailsPage } from './pages/cardapio/ProductDetailsPage';
import { CartProvider } from './contexts/CartContext';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';






import './index.css';

import TabelasMesasPage from './pages/app_garcom/mesasPage';

export default function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>

          <Route path="/" element={<Navigate to="dashboard" replace />} />

          //!Rotas Admin Dashboard (Template 2)
          <Route
            path="/dashboard/*"
            element={
              <div className="min-h-screen bg-gray-50">
                <Sidebar />
                <Header />
                <div className="pt-16">
                  <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="produtos" element={<MenuPage />} />
                    <Route path="clientes" element={<ClientsPage />} />
                    <Route path="pedidos" element={<OrdersPage />} />
                    <Route path="cadastro" element={<LoginPage />} />
                    <Route path="atendimento" element={<ChatPage />} />
                    <Route path="cadastro" element={<LoginPage />} />
                    <Route path="garcom" element={<TabelasMesasPage />} />

                  </Routes>
                </div>
              </div>
            }
          />

          //! Template 3 (Cardapio Digital)
          <Route
            path="/*"
            element={
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  <Route path="cardapio" element={<CardapioDigitalPage />} />
                  <Route path="product/:id" element={<ProductDetailsPage />} />

                </Routes>
              </div>
            }
          />
        </Routes>
      </CartProvider>
    </Router>
  );
}