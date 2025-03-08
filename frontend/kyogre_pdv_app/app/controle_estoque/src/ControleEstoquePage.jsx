import { useState } from "react";
import { StockContextProvider } from "./contexts/StockContext";
import Home from "./pages/Home";
import ListItems from "./pages/items/ListItems";
import CreateItem from "./pages/items/CreateItem";
import ShowItem from "./pages/items/ShowItem";
import UpdateItem from "./pages/items/UpdateItem";
import ItemsLayout from "./pages/items/ItemsLayout";
import './index_estoque.module.css'; // Importar CSS específico

export default function ControleEstoquePage() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedItemId, setSelectedItemId] = useState(null);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home />;
      case "listItems":
        return <ListItems onItemSelect={(id) => {
          setSelectedItemId(id);
          setCurrentPage("showItem");
        }} />;
      case "createItem":
        return <CreateItem onItemCreated={() => setCurrentPage("listItems")} />;
      case "showItem":
        return selectedItemId ? <ShowItem itemId={selectedItemId} /> : <Home />;
      case "updateItem":
        return selectedItemId ? <UpdateItem itemId={selectedItemId} /> : <Home />;
      default:
        return <Home />;
    }
  };

  // Estilo inline para isolar o CSS
  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    boxSizing: 'border-box',
    color: '#333',
    backgroundColor: '#f5f5f5'
  };

  const headerStyle = {
    backgroundColor: '#1a1a1a',
    color: 'white',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '5px'
  };

  const navStyle = {
    display: 'flex',
    gap: '1rem'
  };

  const buttonStyle = {
    backgroundColor: '#4a4a4a',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  };

  const mainStyle = {
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '5px',
    marginTop: '1rem',
    minHeight: '70vh'
  };

  const footerStyle = {
    textAlign: 'center',
    padding: '1rem',
    marginTop: '1rem',
    backgroundColor: '#1a1a1a',
    color: 'white',
    borderRadius: '5px'
  };

  return (
    <StockContextProvider>
      <div style={containerStyle} className="estoque-module">
        <header style={headerStyle}>
          <h1>REACT STOCK</h1>
          <nav style={navStyle}>
            <button style={buttonStyle} onClick={() => setCurrentPage("home")}>Início</button>
            <button style={buttonStyle} onClick={() => setCurrentPage("listItems")}>Itens</button>
            <button style={buttonStyle} onClick={() => setCurrentPage("createItem")}>Novo Item</button>
          </nav>
        </header>
        <main style={mainStyle}>
          {renderPage()}
        </main>
        <footer style={footerStyle}>
          Feito com React - Controle de Estoque
        </footer>
      </div>
    </StockContextProvider>
  );
}
