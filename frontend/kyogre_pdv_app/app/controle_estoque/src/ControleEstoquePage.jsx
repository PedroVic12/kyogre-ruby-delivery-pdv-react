import { RouterProvider } from "react-router-dom";
import router from "./router";
import { StockContextProvider } from "./contexts/StockContext";
import styles from './index_estoque.module.css'; // Importar como CSS Module (objeto 'styles')


export default function ControleEstoquePage() {
  return (
    <StockContextProvider>
      <RouterProvider router={router} />

    </StockContextProvider>
  )
}