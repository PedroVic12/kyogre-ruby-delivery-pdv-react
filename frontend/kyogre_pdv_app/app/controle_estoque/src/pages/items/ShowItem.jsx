import { Link, useParams } from "react-router-dom"
import useStock from "../../hooks/useStock"
import DeleteButton from "../../components/DeleteButton"

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}

export default function ShowItem() {
    const { getItem } = useStock()
    const { id } = useParams()

    const item = getItem(id)

    return (
        <div className="item">
            <h2>{item.name}</h2>
            <Link to={`/items/${item.id}/update`} className="button is-small">Atualizar</Link>
            <DeleteButton itemId={item.id} itemName={item.name} />
            <div className="row">
                <span>Categoria: {item.category}</span>
                <span>Quantidade em estoque: {item.quantity}</span>
                <span>Preço: R$ {item.price}</span>
            </div>
            <p>{item.description}</p>
            <div className="row">
                <p>Cadastrado em: {formatDate(new Date(item.createdAt))}</p>
                <p>Atualizado em: {formatDate(new Date(item.updatedAt))}</p>
            </div>
        </div>
    )
}