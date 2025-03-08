import { Link, Outlet } from "react-router-dom";

export default function RootLayout() {
    return (
        <>
            <header className="header">
                <Link to="/" className="logo">REACT STOCK</Link>
                <nav>
                    <Link to="/">Início</Link>
                    <Link to="/items">Itens</Link>
                </nav>
            </header>
            <div>
                <Outlet /> {/* Coloca o contéudo dinâmico aqui dentro */}
            </div>
            <footer className="footer">
                Feito com React e React Router!
            </footer>
        </>
    )
}