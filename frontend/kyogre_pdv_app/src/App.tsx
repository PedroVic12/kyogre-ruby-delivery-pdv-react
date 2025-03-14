// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MenuPage } from './pages/dashboard/MenuPage';
import { ClientsPage } from './pages/dashboard/ClientsPage';
import { LoginPageComponent } from './pages/dashboard/LoginPage'; // Renomeie para LoginPageComponent
import { ChatPage } from './pages/dashboard/ChatPage';
import { CardapioDigitalPage } from './pages/cardapio/CardapioDigitalPage';
import { ProductDetailsPage } from './pages/cardapio/ProductDetailsPage';
import { CartProvider } from './contexts/CartContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header'; // Importe o Header
import './index.css';
import { HomePage } from './pages/dashboard/HomePage';
import { DashboardPedidosPage } from './pages/dashboard/DashboardPedidos';
import PaginaComponentes from './pages/UI/pagina_componentes.js';
import ControleEstoquePage from '../app/controle_estoque/src/ControleEstoquePage.jsx';
import GarcomMesas from '../app/app_garcom_pdv/pages/GarcomMesas.js';
import CardapioPDV from '../app/app_garcom_pdv/pages/CardapioPDV.js';
import CheckoutPage from '../app/app_garcom_pdv/pages/CheckoutPage.js';
import { CardapioManagerPage } from './pages/dashboard/CardapioManager';

// Debug Mode Switch - CENTRALIZADO AQUI
const isDebug = false; // Defina como false para modo de produção

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loggedInEmail, setLoggedInEmail,] = useState(''); // Novo estado para email do usuário logado

  useEffect(() => {
    if (isDebug) {
      // Auto-login em modo debug
      setIsAuthenticated(true);
      setLoggedInEmail("admin@admin"); // Defina um email padrão para debug
    }
  }, []);

  const handleLoginSuccess = (email: string) => { // Agora aceita email como argumento
    setIsAuthenticated(true);
    setLoggedInEmail(email); // Atualiza o estado com o email do usuário
  };

  return (
    <Router>
      <CartProvider>
        <Routes>
          {/* Rota raiz agora depende da autenticação */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
          />

          {/* Dashboard Routes (Template 2) - Rotas protegidas */}
          <Route
            path="/dashboard/*"
            element={
              isAuthenticated ? (
                <div className="flex min-h-screen bg-gray-100 md:bg-gray-120">
                  <Sidebar
                    isOpen={isSidebarOpen}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                  />
                  <div
                    className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'
                      }`}
                  >
                    <Header
                      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                      isSidebarOpen={isSidebarOpen}
                      loggedInEmail={loggedInEmail}  // Passe loggedInEmail como prop para Header
                    />
                    <main className="p-4 sm:p-6 md:p-8 pt-16">
                      <Routes>
                        <Route index element={<DashboardPedidosPage />} />
                        <Route path="produtos" element={<MenuPage />} />
                        <Route path="clientes" element={<ClientsPage />} />
                        <Route path="pedidos" element={<HomePage />} />
                        <Route path="atendimento" element={<ChatPage />} />
                        <Route path="cardapioManager" element={<CardapioManagerPage isSidebarOpen={isSidebarOpen} />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Outras Rotas (Template 3) - Login agora é uma rota nomeada */}
          <Route
            path="/*"
            element={
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  <Route path="cardapio" element={<CardapioDigitalPage />} />
                  <Route path="product/:id" element={<ProductDetailsPage />} />
                  <Route path="login" element={<LoginPageComponent isDebug={isDebug} onLoginSuccess={handleLoginSuccess} />} /> {/* Passe onLoginSuccess */}
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