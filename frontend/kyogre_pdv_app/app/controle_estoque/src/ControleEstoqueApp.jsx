import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import Home from "./pages/Home";
import ListItems from "./pages/items/ListItems";
import CreateItem from "./pages/items/CreateItem";
import ShowItem from "./pages/items/ShowItem";
import UpdateItem from "./pages/items/UpdateItem";
import ItemsLayout from "./pages/items/ItemsLayout";
import './index_estoque.module.css'; // Importar CSS específico

export default function ControleEstoqueApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="items" element={<ItemsLayout />}>
            <Route index element={<ListItems />} />
            <Route path="new" element={<CreateItem />} />
            <Route path=":id" element={<ShowItem />} />
            <Route path=":id/update" element={<UpdateItem />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}