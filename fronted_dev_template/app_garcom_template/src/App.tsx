import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import GarcomMesas from './pages/GarcomMesas';
import CardapioPDV from './pages/CardapioPDV';
import CheckoutPage from './pages/CheckoutPage';

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<GarcomMesas />} />
        <Route path="/cardapio/:mesa" element={<CardapioPDV />} />
        <Route path="/checkout/:pedidoId" element={<CheckoutPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;