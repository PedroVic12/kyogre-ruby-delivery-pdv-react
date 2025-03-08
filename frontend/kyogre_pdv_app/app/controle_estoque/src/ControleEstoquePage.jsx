import { useState, useEffect } from "react";
import { StockContextProvider } from "./contexts/StockContext";
import Home from "./pages/Home";
import ListItems from "./pages/items/ListItems";
import CreateItem from "./pages/items/CreateItem";
import ShowItem from "./pages/items/ShowItem";
import UpdateItem from "./pages/items/UpdateItem";

import { Button,  IconButton } from '@mui/material';

export default function ControleEstoquePage() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedItemId, setSelectedItemId] = useState(null);

  // Estilos inline completos baseados no CSS original
  const styles = {
    estoqueContainer: {
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      backgroundColor: '#2c2c2d',
      color: '#fefefe',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
    },
    estoqueHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      borderBottom: '2px solid #fefefe',
      backgroundColor: '#2c2c2d'
    },
    estoqueTitle: {
      fontSize: '1.5rem',
      fontWeight: '900',
      margin: '1rem 0'
    },
    estoqueNav: {
      display: 'flex'
    },
    estoqueNavLink: {
      display: 'inline-block',
      padding: '1rem',
      cursor: 'pointer',
      fontSize: '1.2rem',
      transition: 'background-color 0.2s'
    },
    estoqueNavLinkHover: {
      backgroundColor: '#fefefe11'
    },
    estoqueMain: {
      flex: '1 0 auto',
      padding: '0 2rem',
      backgroundColor: '#2c2c2d'
    },
    estoqueFooter: {
      padding: '1rem 2rem',
      textAlign: 'center',
      borderTop: '2px solid #fefefe',
      backgroundColor: '#2c2c2d',
      fontSize: '1rem',
      color: '#fefefe'
    },
    estoqueButton: {
      backgroundColor: '#5ba7fd',
      borderRadius: '0.25rem',
      border: '0',
      color: '#2c2c2d',
      cursor: 'pointer',
      display: 'inline-block',
      fontSize: '1rem',
      padding: '0.5em 1em',
      textDecoration: 'none',
      transition: '0.2s'
    },
    estoqueButtonMargin: {
      marginLeft: '0.75rem'
    },
    estoqueDangerButton: {
      backgroundColor: '#ff5258'
    },
    estoqueTable: {
      borderCollapse: 'collapse',
      marginTop: '2rem',
      width: '100%'
    },
    estoqueThead: {
      backgroundColor: '#1c1a1d',
      boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.25)',
      textAlign: 'left'
    },
    estoqueTh: {
      padding: '1.25rem'
    },
    estoqueTd: {
      padding: '1.25rem'
    },
    estoqueTrHover: {
      backgroundColor: 'rgba(28, 26, 29, 0.33)',
      cursor: 'default'
    },
    estoqueRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '2rem'
    },
    estoqueDashboardCard: {
      backgroundColor: '#1c1a1d',
      boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.25)',
      borderRadius: '0.25rem',
      cursor: 'default',
      fontSize: '1.125rem',
      marginTop: '2rem',
      padding: '1rem 2rem',
      flex: '1 0 16rem'
    },
    estoqueDashboardCardSpan: {
      display: 'block',
      fontSize: '3rem',
      margin: '1rem 0',
      textAlign: 'center'
    },
    estoqueForm: {
      margin: '0 auto',
      maxWidth: '70rem',
      padding: '2rem 0'
    },
    estoqueInput: {
      backgroundColor: '#1c1a1d',
      borderRadius: '0.25rem',
      border: '0',
      color: '#fefefe',
      display: 'block',
      marginTop: '0.5rem',
      marginBottom: '1rem',
      padding: '0.75rem',
      width: '100%'
    },
    estoqueH1: {
      fontSize: '3rem',
      fontWeight: '300',
      marginBottom: '1.5rem'
    },
    estoqueH2: {
      fontSize: '2rem',
      fontWeight: '300',
      marginBottom: '1rem',
      display: 'inline-block',
      marginRight: '2rem'
    },
    estoqueItemSpan: {
      backgroundColor: '#1c1a1d',
      boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.25)',
      borderRadius: '0.25rem',
      cursor: 'default',
      fontSize: '1.125rem',
      marginTop: '2rem',
      padding: '1rem 2rem'
    },
    estoqueItemP: {
      fontSize: '1.25rem',
      marginTop: '2rem'
    },
    // Estilos para os componentes filhos
    childComponentStyles: {
      main: {
        marginTop: '25px',
        marginBottom: '25px'
      },
      h1: {
        fontSize: '3rem',
        fontWeight: '300',
        marginBottom: '1.5rem'
      },
      row: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2rem'
      },
      dashboardCard: {
        backgroundColor: '#1c1a1d',
        boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.25)',
        borderRadius: '0.25rem',
        cursor: 'default',
        fontSize: '1.125rem',
        marginTop: '2rem',
        padding: '1rem 2rem',
        flex: '1 0 16rem'
      },
      dashboardCardSpan: {
        display: 'block',
        fontSize: '3rem',
        margin: '1rem 0',
        textAlign: 'center'
      },
      table: {
        borderCollapse: 'collapse',
        marginTop: '2rem',
        width: '100%'
      },
      thead: {
        backgroundColor: '#1c1a1d',
        boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.25)',
        textAlign: 'left'
      },
      th: {
        padding: '1.25rem'
      },
      td: {
        padding: '1.25rem'
      },
      button: {
        backgroundColor: '#5ba7fd',
        borderRadius: '0.25rem',
        border: '0',
        color: '#2c2c2d',
        cursor: 'pointer',
        display: 'inline-block',
        fontSize: '1rem',
        padding: '0.5em 1em',
        textDecoration: 'none',
        transition: '0.2s'
      },
      buttonSmall: {
        fontSize: '0.875rem'
      }
    }
  };

  // Função para renderizar a página atual
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home />;
      case "listItems":
        return (
          <ListItems 
            onItemSelect={(id) => {
              setSelectedItemId(id);
              setCurrentPage("showItem");
            }} 
          />
        );
      case "createItem":
        return (
          <CreateItem 
            onItemCreated={() => {
              setCurrentPage("listItems");
            }} 
          />
        );
      case "showItem":
        return selectedItemId ? (
          <ShowItem 
            itemId={selectedItemId} 
            onBack={() => setCurrentPage("listItems")}
            onEdit={(id) => {
              setSelectedItemId(id);
              setCurrentPage("updateItem");
            }}
          />
        ) : <Home />;
      case "updateItem":
        return selectedItemId ? (
          <UpdateItem 
            itemId={selectedItemId} 
            onBack={() => setCurrentPage("showItem")}
          />
        ) : <Home />;
      default:
        return <Home />;
    }
  };

  // Função para lidar com o hover dos botões
  const [hoveredButton, setHoveredButton] = useState(null);

  // Injetar estilos nos componentes filhos
  const injectStyles = () => {
    // Criar um elemento style
    const styleElement = document.createElement('style');
    
    // Definir o CSS para os componentes filhos
    styleElement.textContent = `
      .estoque-module-container .main {
        margin-top: 25px;
        margin-bottom: 25px;
      }
      
      .estoque-module-container h1 {
        font-size: 3rem;
        font-weight: 300;
        margin-bottom: 1.5rem;
      }
      
      .estoque-module-container .row {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
      }
      
      .estoque-module-container .dashboard-card {
        background-color: #1c1a1d;
        box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.25);
        border-radius: 0.25rem;
        cursor: default;
        font-size: 1.125rem;
        margin-top: 2rem;
        padding: 1rem 2rem;
        flex: 1 0 16rem;
      }
      
      .estoque-module-container .dashboard-card span {
        display: block;
        font-size: 3rem;
        margin: 1rem 0;
        text-align: center;
      }
      
      .estoque-module-container table {
        border-collapse: collapse;
        margin-top: 2rem;
        width: 100%;
      }
      
      .estoque-module-container thead {
        background-color: #1c1a1d;
        box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.25);
        text-align: left;
      }
      
      .estoque-module-container th, 
      .estoque-module-container td {
        padding: 1.25rem;
      }
      
      .estoque-module-container tbody tr:hover {
        background-color: rgba(28, 26, 29, 0.33);
        cursor: default;
      }
      
      .estoque-module-container .button {
        background-color: #5ba7fd;
        border-radius: 0.25rem;
        border: 0;
        color: #2c2c2d;
        cursor: pointer;
        display: inline-block;
        font-size: 1rem;
        padding: 0.5em 1em;
        text-decoration: none;
        transition: 0.2s;
      }
      
      .estoque-module-container .button + .button {
        margin-left: 0.75rem;
      }
      
      .estoque-module-container .button:hover {
        filter: brightness(0.9);
      }
      
      .estoque-module-container .button.is-small {
        font-size: 0.875rem;
      }
      
      .estoque-module-container .button.is-danger {
        background-color: #ff5258;
      }
      
      .estoque-module-container .recent,
      .estoque-module-container .low {
        flex: 1 0 16rem;
      }
      
      .estoque-module-container input, 
      .estoque-module-container textarea, 
      .estoque-module-container select {
        background-color: #1c1a1d;
        border-radius: 0.25rem;
        border: 0;
        color: #fefefe;
        display: block;
        margin-top: 0.5rem;
        margin-bottom: 1rem;
        padding: 0.75rem;
        width: 100%;
      }
    `;
    
    // Adicionar o elemento style ao head
    document.head.appendChild(styleElement);
    
    // Retornar uma função para remover o estilo quando o componente for desmontado
    return () => {
      document.head.removeChild(styleElement);
    };
  };

  // Injetar estilos quando o componente for montado
  useEffect(() => {
    return injectStyles();
  }, []);

  return (
    <StockContextProvider>
      <div style={styles.estoqueContainer} className="estoque-module-container">
        <header style={styles.estoqueHeader} className="estoque-module-header">
          <h1 style={styles.estoqueTitle} className="estoque-module-title">Controle Estoque - REACT 2025 </h1>
          <nav style={styles.estoqueNav} className="estoque-module-nav">
            <Button 
              style={{
                ...styles.estoqueNavLink,
                ...(hoveredButton === 'home' ? styles.estoqueNavLinkHover : {})
              }} 
              className="estoque-module-nav-link"
              onClick={() => setCurrentPage("home")}
              onMouseEnter={() => setHoveredButton('home')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Início
            </Button>
            <Button 
              style={{
                ...styles.estoqueNavLink,
                ...(hoveredButton === 'items' ? styles.estoqueNavLinkHover : {})
              }} 
              className="estoque-module-nav-link"
              onClick={() => setCurrentPage("listItems")}
              onMouseEnter={() => setHoveredButton('items')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Itens
            </Button>
            <Button 
              style={{
                ...styles.estoqueNavLink,
                ...(hoveredButton === 'new' ? styles.estoqueNavLinkHover : {})
              }} 
              className="estoque-module-nav-link"
              onClick={() => setCurrentPage("createItem")}
              onMouseEnter={() => setHoveredButton('new')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Novo Item
            </Button>
          </nav>
        </header>
        <main style={styles.estoqueMain} className="estoque-module-main">
          {renderPage()}
        </main>
        <footer style={styles.estoqueFooter} className="estoque-module-footer">
          Feito com React and Claude AI - Controle de Estoque © {new Date().getFullYear()}
        </footer>
      </div>
    </StockContextProvider>
  );
}
