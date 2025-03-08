import ItemForm from "../../components/ItemForm";
import useStock from "../../hooks/useStock";

export default function UpdateItem({ itemId, onBack }) {
    const { getItem } = useStock()
    
    const item = getItem(itemId)
    
    if (!item) {
        return <div>Item não encontrado!</div>
    }

    return (
        <>
            <h2>Atualização dos itens</h2>
            <ItemForm itemToUpdate={item} onSubmitSuccess={onBack} />
        </>
    )
}