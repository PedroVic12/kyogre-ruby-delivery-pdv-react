import { RouterProvider } from "react-router-dom";
import router from "./router";
import { StockContextProvider } from "./contexts/StockContext";
import './index.css'

export default function ControleEstoquePage() {
  return (
    <StockContextProvider>
      <RouterProvider router={router} />
    </StockContextProvider>
  )
}