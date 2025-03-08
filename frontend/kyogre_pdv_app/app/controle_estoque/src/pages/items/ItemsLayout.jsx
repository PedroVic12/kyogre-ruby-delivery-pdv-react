import { Outlet, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ItemsLayout() {
    const { pathname } = useLocation( ) // hook que permite que a gente saiba a rota em que estamos

    return (
        <main>
            <h1>Stock Items</h1>
            <div className="tabs">
                <Link 
                    to="/items" 
                    className={`tab ${pathname === "/items" ? "active" : ""}`}
                >
                    Todos os itens
                </Link>
                <Link 
                    to="/items/new" 
                    className={`tab ${pathname === "/items/new" ? "active" : ""}`}
                >
                    Novo item
                </Link>
            </div>
            <Outlet />
        </main>
    )
}