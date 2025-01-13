import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { MenuPage } from './pages/MenuPage';
import { ClientsPage } from './pages/ClientsPage';
import { OrdersPage } from './pages/OrdersPage';
import { LoginPage } from './pages/LoginPage';
import { ChatPage } from './pages/ChatPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <Header />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/cardapio" element={<MenuPage />} />
          <Route path="/clientes" element={<ClientsPage />} />
          <Route path="/pedidos" element={<OrdersPage />} />
          <Route path="/cadastro" element={<LoginPage />} />
          <Route path="/atendimento" element={<ChatPage />} />
        </Routes>
      </div>
    </Router>
  );
}