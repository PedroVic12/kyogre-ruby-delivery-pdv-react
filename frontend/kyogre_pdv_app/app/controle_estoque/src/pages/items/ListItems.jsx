import ItemsTable from "../../components/ItemsTable";
import PropTypes from "prop-types";

ListItems.propTypes = {
    onItemSelect: PropTypes.func
};

export default function ListItems({ onItemSelect }) {
    return (
        <div>
            <h1>Todos os Itens</h1>
            <ItemsTable onItemSelect={onItemSelect} />
        </div>
    );
}