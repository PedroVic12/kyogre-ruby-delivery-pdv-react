import PropTypes from "prop-types"
import useStock from "../hooks/useStock"

DeleteButton.propTypes = {
    itemId: PropTypes.number,
    itemName: PropTypes.string,
    onDelete: PropTypes.func
}

export default function DeleteButton({ itemName, itemId, onDelete }) {
    const { deleteItem } = useStock()

    const handleDelete = () => {
        if(confirm(`Tem certeza que deseja excluir o ${itemName}?`)) {
            deleteItem(itemId)
            if (onDelete) {
                onDelete()
            }
            alert("Excluído com sucesso.")
        }
    }

    return (
        <button
            className="button is-danger is-small"
            onClick={handleDelete}
        >
            Excluir
        </button>
    )
}