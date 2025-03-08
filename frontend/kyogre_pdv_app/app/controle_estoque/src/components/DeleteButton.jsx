import PropTypes from "prop-types"
import useStock from "../hooks/useStock"
import { useState } from "react"
import BotaoLoaderMUI from "../../../../src/components/BotaoLoaderMUI"

DeleteButton.propTypes = {
    itemId: PropTypes.number,
    itemName: PropTypes.string,
    onDelete: PropTypes.func
}

export default function DeleteButton({ itemName, itemId, onDelete }) {
    const { deleteItem } = useStock()
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        if(confirm(`Tem certeza que deseja excluir o ${itemName}?`)) {
            setIsLoading(true)
            console.log(`Iniciando exclusão do item ${itemId}: ${itemName}`)
            
            try {
                // Simular um pequeno delay para mostrar o loading
                await new Promise(resolve => setTimeout(resolve, 800))
                
                deleteItem(itemId)
                console.log(`Item ${itemId} excluído com sucesso!`)
                
                if (onDelete) {
                    // Pequeno delay antes de redirecionar
                    setTimeout(() => {
                        onDelete()
                    }, 500)
                }
                
                alert("Excluído com sucesso.")
            } catch (error) {
                console.error("Erro ao excluir item:", error)
                alert("Erro ao excluir item: " + error.message)
            } finally {
                setIsLoading(false)
            }
        }
    }

    return (
        <BotaoLoaderMUI
            isLoading={isLoading}
            onClick={handleDelete}
            text="Excluir"
            loadingText="Excluindo..."
            variant="contained"
            color="error"
            size="small"
            sx={{ ml: 1 }}
        />
    )
}