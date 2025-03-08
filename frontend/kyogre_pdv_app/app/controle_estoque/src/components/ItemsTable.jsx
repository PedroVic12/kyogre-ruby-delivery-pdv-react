import useStock from "../hooks/useStock"
import DeleteButton from "./DeleteButton"
import PropTypes from "prop-types"

ItemsTable.propTypes = {
    onItemSelect: PropTypes.func
}

export default function ItemsTable({ onItemSelect }) { 
    const { items } = useStock()

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
                        <button 
                            className="button is-primary is-small"
                            onClick={() => onItemSelect && onItemSelect(item.id)}
                        >
                            Ver
                        </button>
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