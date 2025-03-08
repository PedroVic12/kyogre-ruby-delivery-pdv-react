import PropTypes from "prop-types"
import useStock from "../hooks/useStock"
import { useNavigate } from "react-router-dom"

DeleteButton.propTypes = {
    itemId: PropTypes.number,
    itemName: PropTypes.string
}

export default function DeleteButton({ itemName, itemId }) {
    const { deleteItem } = useStock()
    const navigate = useNavigate()

    const handleDelete = () => {
        if(confirm(`Tem certeza que deseja excluir o ${itemName}?`)) {
            deleteItem(itemId)
            navigate("/items")
            alert("Exluído.")
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