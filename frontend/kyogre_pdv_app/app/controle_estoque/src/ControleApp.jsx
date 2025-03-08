// ControleApp.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { CartProvider } from './contexts/CartContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ControleEstoquePage from './ControleEstoquePage';
import './index.css';

export default function ControleApp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <Router>
      <CartProvider>
        <div className="flex min-h-screen bg-gray-120">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <div className={`flex-1 transition-all ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
            <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
            <div className="p-6 pt-16">
              <Routes>
                <Route path="/controle_estoque" element={<ControleEstoquePage />} />
              </Routes>
            </div>
          </div>
        </div>
      </CartProvider>
    </Router>
  );
}