import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { DashboardPage } from './pages/DashboardPage';


import  {CardapioDigitalPage}  from "./pages/Index";


import CartPage from './pages/CartPage';
import ProductDetail from './pages/ProductDetail';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-60">
        <Sidebar />
        <Header />
        <Routes>

          {/* BoltNew*/}

          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/cardapio" element={<MenuPage />} />


          {/* Lovable DEV */}
          <Route path="/cardapioDigital" element={<CardapioDigitalPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />



        </Routes>
      </div>
    </Router>
  );
}