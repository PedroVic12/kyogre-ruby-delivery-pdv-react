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

  return (
    <StockContextProvider>
      <div className="stock-container">
        <header className="header">
          <h1>REACT STOCK</h1>
          <nav>
            <button onClick={() => setCurrentPage("home")}>Início</button>
            <button onClick={() => setCurrentPage("listItems")}>Itens</button>
            <button onClick={() => setCurrentPage("createItem")}>Novo Item</button>
          </nav>
        </header>
        <main>
          {renderPage()}
        </main>
        <footer className="footer">
          Feito com React - Controle de Estoque
        </footer>
      </div>
    </StockContextProvider>
  );
}
