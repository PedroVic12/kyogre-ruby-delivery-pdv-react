import useStock from "../hooks/useStock"
import DeleteButton from "./DeleteButton"
import PropTypes from "prop-types"
import { useState, useEffect } from "react"
import BotaoLoaderMUI from "../../../../src/components/BotaoLoaderMUI"
import { Box, Typography, CircularProgress } from "@mui/material"

ItemsTable.propTypes = {
    onItemSelect: PropTypes.func
}

export default function ItemsTable({ onItemSelect }) { 
    const { items } = useStock()
    const [isLoading, setIsLoading] = useState(true)
    const [viewItem, setViewItem] = useState(null)

    // Simular carregamento inicial dos dados
    useEffect(() => {
        console.log("Carregando lista de itens...")
        const timer = setTimeout(() => {
            setIsLoading(false)
            console.log(`${items.length} itens carregados com sucesso!`)
        }, 1000)
        
        return () => clearTimeout(timer)
    }, [items])

    const handleViewItem = (itemId) => {
        setViewItem(itemId)
        console.log(`Visualizando detalhes do item ${itemId}`)
        
        // Simular um pequeno delay antes de navegar
        setTimeout(() => {
            setViewItem(null)
            if (onItemSelect) {
                onItemSelect(itemId)
            }
        }, 500)
    }

    if (isLoading) {
        return (
            <Box 
                sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    flexDirection: 'column',
                    p: 4,
                    gap: 2
                }}
            >
                <CircularProgress size={40} />
                <Typography variant="body1">Carregando itens...</Typography>
            </Box>
        )
    }

    if (items.length === 0) {
        return (
            <Box 
                sx={{ 
                    textAlign: 'center', 
                    p: 4 
                }}
            >
                <Typography variant="h6">Nenhum item cadastrado</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Adicione novos itens para visualizá-los aqui.
                </Typography>
            </Box>
        )
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Em Estoque</th>
                    <th>Categoria</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item) => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.quantity} unid.</td>
                        <td>{item.category}</td>
                        <td>
                            <BotaoLoaderMUI
                                isLoading={viewItem === item.id}
                                onClick={() => handleViewItem(item.id)}
                                text="Ver"
                                loadingText="Carregando..."
                                variant="contained"
                                color="primary"
                                size="small"
                            />
                            <DeleteButton 
                                itemName={item.name}
                                itemId={item.id}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}