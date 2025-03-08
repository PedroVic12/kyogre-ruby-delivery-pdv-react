import useStock from "../../hooks/useStock"
import DeleteButton from "../../components/DeleteButton"

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}

export default function ShowItem({ itemId, onBack, onEdit }) {
    const { getItem } = useStock()
    
    const item = getItem(itemId)
    
    if (!item) {
        return <div>Item não encontrado!</div>
    }

    // Estilos inline para a página de detalhes
    const styles = {
        container: {
            padding: '2rem',
            backgroundColor: '#1c1a1d',
            borderRadius: '8px',
            boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.25)',
            marginBottom: '2rem'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            borderBottom: '1px solid #333',
            paddingBottom: '1rem'
        },
        title: {
            fontSize: '2.5rem',
            fontWeight: '300',
            margin: '0'
        },
        actions: {
            display: 'flex',
            gap: '0.5rem'
        },
        infoCard: {
            backgroundColor: '#2c2c2d',
            padding: '1.5rem',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        },
        infoRow: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1.5rem',
            marginBottom: '1.5rem'
        },
        infoItem: {
            flex: '1 0 200px',
            backgroundColor: '#252526',
            padding: '1rem',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
        label: {
            fontSize: '0.9rem',
            color: '#aaa',
            marginBottom: '0.5rem',
            display: 'block'
        },
        value: {
            fontSize: '1.2rem',
            fontWeight: '500'
        },
        description: {
            fontSize: '1.1rem',
            lineHeight: '1.6',
            marginBottom: '1.5rem'
        },
        dates: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.9rem',
            color: '#aaa',
            borderTop: '1px solid #333',
            paddingTop: '1rem',
            marginTop: '1rem'
        },
        backButton: {
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '1rem',
            transition: 'background-color 0.2s'
        }
    };

    return (
        <div>
            <button 
                style={styles.backButton}
                onClick={onBack}
            >
                ← Voltar para a lista
            </button>
            
            <div style={styles.container}>
                <div style={styles.header}>
                    <h2 style={styles.title}>{item.name}</h2>
                    <div style={styles.actions}>
                        <button 
                            className="button is-small" 
                            onClick={() => onEdit(item.id)}
                        >
                            Atualizar
                        </button>
                        <DeleteButton 
                            itemId={item.id} 
                            itemName={item.name} 
                            onDelete={onBack}
                        />
                    </div>
                </div>
                
                <div style={styles.infoRow}>
                    <div style={styles.infoItem}>
                        <span style={styles.label}>ID do Produto</span>
                        <div style={styles.value}>{item.id}</div>
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.label}>Categoria</span>
                        <div style={styles.value}>{item.category}</div>
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.label}>Quantidade em Estoque</span>
                        <div style={styles.value}>{item.quantity} unidades</div>
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.label}>Preço</span>
                        <div style={styles.value}>R$ {parseFloat(item.price).toFixed(2)}</div>
                    </div>
                </div>
                
                <div style={styles.infoCard}>
                    <span style={styles.label}>Descrição do Produto</span>
                    <p style={styles.description}>{item.description || "Sem descrição disponível."}</p>
                </div>
                
                <div style={styles.dates}>
                    <div>Cadastrado em: {formatDate(new Date(item.createdAt))}</div>
                    <div>Atualizado em: {formatDate(new Date(item.updatedAt))}</div>
                </div>
            </div>
        </div>
    )
}