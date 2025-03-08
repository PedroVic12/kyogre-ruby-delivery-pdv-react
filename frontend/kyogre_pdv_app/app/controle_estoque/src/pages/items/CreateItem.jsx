import ItemForm from "../../components/ItemForm";
import PropTypes from "prop-types";

CreateItem.propTypes = {
    onItemCreated: PropTypes.func
};

export default function CreateItem({ onItemCreated }) {
    return (
        <div>
            <h1>Novo Item</h1>
            <ItemForm onSubmitSuccess={onItemCreated} />
        </div>
    );
}