import { useContext } from "react";
import { StockContext } from "../contexts/StockContext";

export default function useStock() {
    return useContext(StockContext) 
} 