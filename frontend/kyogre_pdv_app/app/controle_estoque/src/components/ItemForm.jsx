import { useRef, useState } from "react"
import { PropTypes } from "prop-types"
import StockItem, { CATEGORIES } from "../entities/StockItem"
import useStock from "../hooks/useStock"
import BotaoLoaderMUI from "../../../../src/components/BotaoLoaderMUI"
import { Box, Alert, Collapse } from "@mui/material"

// CategoryModal Component
const CategoryModal = ()=>{
    const [categoryName, setCategoryName] = useState('');
  
    const handleSubmit = () => {
      if (categoryName.trim()) {
        onSave(categoryName);
        setCategoryName('');
        onClose();
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Adicionar Nova Categoria</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nome da Categoria"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Adicionar</Button>
        </DialogActions>
      </Dialog>
    );
  
  }
  

ItemForm.propTypes = {
    itemToUpdate: PropTypes.object,
    onSubmitSuccess: PropTypes.func
}

export default function ItemForm({ itemToUpdate, onSubmitSuccess }) {
    const defaultItem = {
        name: "",
        description: "",
        quantity: 0,
        price: 0,
        category: ""
    }

    const [item, setItem] = useState(itemToUpdate ? itemToUpdate : defaultItem)
    const { addItem, updateItem } = useStock()
    const inputRef = useRef(null)
    const [isLoading, setIsLoading] = useState(false)
    const [feedback, setFeedback] = useState({ message: "", type: "" }) // type pode ser "success" ou "error"

    const handleChange = (ev) => {
        setItem(currentState => {
            return {
                ...currentState, 
                [ev.target.name]: ev.target.value
            }
        })
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault()
        setIsLoading(true)
        setFeedback({ message: "", type: "" })
        
        console.log("Iniciando submissão do formulário...")
        console.log("Dados do item:", item)

        try {
            if (itemToUpdate) {
                console.log("Atualizando item existente com ID:", itemToUpdate.id)
                updateItem(itemToUpdate.id, item)
                setFeedback({ 
                    message: "Item atualizado com sucesso!", 
                    type: "success" 
                })
                console.log("Item atualizado com sucesso!")
                
                if (onSubmitSuccess) {
                    // Pequeno delay para mostrar a mensagem de sucesso antes de redirecionar
                    setTimeout(() => {
                        onSubmitSuccess()
                    }, 1500)
                }
            } else {
                console.log("Criando novo item...")
                const validItem = new StockItem(item)
                addItem(validItem)
                setItem(defaultItem)
                setFeedback({ 
                    message: "Item cadastrado com sucesso", 
                    type: "success" 
                })
                console.log("Novo item criado com sucesso! ID:", validItem.id)
                
                if (onSubmitSuccess) {
                    // Pequeno delay para mostrar a mensagem de sucesso antes de redirecionar
                    setTimeout(() => {
                        onSubmitSuccess()
                    }, 1500)
                }
            }
        } catch (error) {
            console.error("Erro ao processar o item:", error.message)
            setFeedback({ 
                message: "Erro: " + error.message, 
                type: "error" 
            })
        } finally {
            // Simular um pequeno delay para mostrar o loading
            setTimeout(() => {
                setIsLoading(false)
                inputRef.current.focus()
            }, 800)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Collapse in={feedback.message !== ""}>
                <Box sx={{ mb: 2 }}>
                    <Alert 
                        severity={feedback.type === "success" ? "success" : "error"}
                        onClose={() => setFeedback({ message: "", type: "" })}
                    >
                        {feedback.message}
                    </Alert>
                </Box>
            </Collapse>
            
            <div className="row">
                <div>
                    <label htmlFor="name">Nome</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        ref={inputRef}
                        value={item.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="quantity">Quantidade</label>
                    <input
                        type="number"
                        name="quantity"
                        id="quantity"
                        required
                        min={1}
                        value={item.quantity}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="price">Preço</label>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        required
                        min={0}
                        step={0.01}
                        value={item.price}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="category">Categoria</label>
                    <select
                        name="category"
                        id="category"
                        required
                        value={item.category}
                        onChange={handleChange}
                    >
                        <option value="">Selecione uma categoria</option>
                        {CATEGORIES.map((category) => (
                            <option
                                key={category}
                                value={category}
                            >
                                {category}
                            </option>
                        ))}
                    </select>
                    {/* <CategoryModal></CategoryModal> */}

                </div>
            </div>
            <div>
                <label htmlFor="description">Descrição</label>
                <textarea
                    name="description"
                    id="description"
                    required
                    rows={6}
                    value={item.description}
                    onChange={handleChange}
                />
            </div>
            <Box sx={{ mt: 2 }}>
                <BotaoLoaderMUI
                    isLoading={isLoading}
                    onClick={() => {}}
                    text={itemToUpdate ? "Atualizar" : "Salvar"}
                    loadingText="Processando..."
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                />
            </Box>
        </form>
    )
}