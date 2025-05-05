// ===============================
// Components
// ===============================

const Home = ({ items }) => {
    const totalItems = items.length;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <div className="flex flex-wrap gap-6">
                <Paper className="p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-medium">Total Items</h2>
                    <span className="text-3xl font-bold">{totalItems}</span>
                </Paper>
                <Paper className="p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-medium">Total Quantity</h2>
                    <span className="text-3xl font-bold">{totalQuantity}</span>
                </Paper>
            </div>
        </div>
    );
};

const ListItems = ({
    items,
    onItemSelect,
    onDelete,
}) => {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-semibold">Items</h1>
            {items.length === 0 ? (
                <div className="text-gray-500">No items found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow
                                    key={item.id}
                                    className="hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer"
                                    onClick={() => onItemSelect(item.id)}
                                >
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell align="right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                color="error"
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onDelete(item.id);
                                                }}
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};

const CreateItem = ({
    onItemCreated,
    onCancel
}) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreate = async () => {
        setLoading(true);
        setError(null);

        if (!name.trim() || !quantity || Number(quantity) < 0) {
            setError('Please provide a valid name and quantity.');
            setLoading(false);
            return;
        }

        try {
            const quantityNum = Number(quantity);
            onItemCreated({ name, quantity: quantityNum, description });
            setName('');
            setQuantity('');
            setDescription('');
        } catch (err) {
            setError(err.message || 'Failed to create item.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Create Item</h1>
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium">
                        Name
                    </label>
                    <TextField
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Item Name"
                        className="mt-1"
                        disabled={loading}
                        fullWidth
                        margin="normal"
                    />
                </div>
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium">
                        Quantity
                    </label>
                    <TextField
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="0"
                        className="mt-1"
                        disabled={loading}
                        fullWidth
                        margin="normal"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Item Description"
                        className="mt-1 w-full p-3 border rounded"
                        rows={3}
                        disabled={loading}
                    />
                </div>
                {error && (
                    <div className="text-red-500 text-sm flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" />
                        {error}
                    </div>
                )}
                <div className="flex justify-end gap-4">
                    <Button variant="outlined" onClick={onCancel} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleCreate} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Plus className="mr-2 h-4 w-4" />
                                Create
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

const ShowItem = ({
    item,
    onBack,
    onEdit,
    onDelete
}) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="outlined" onClick={onBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <h1 className="text-2xl font-semibold">Item Details</h1>
                <div>
                    <Button variant="contained" onClick={() => onEdit(item.id)} className="mr-2">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                    <Button color="error" variant="contained" onClick={() => onDelete(item.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>
            <div className="space-y-4">
                <Paper className="p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-medium">Name</h2>
                    <p className="text-gray-900">{item.name}</p>
                </Paper>
                <Paper className="p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-medium">Quantity</h2>
                    <p className="text-gray-900">{item.quantity}</p>
                </Paper>
                <Paper className="p-4 rounded-lg shadow-md">
                    <h2 className="text-lg font-medium">Description</h2>
                    <p className="text-gray-500">{item.description}</p>
                </Paper>
            </div>
        </div>
    );
};

const UpdateItem = ({
    item,
    onBack,
    onUpdate,
}) => {
    const [name, setName] = useState(item.name);
    const [quantity, setQuantity] = useState(item.quantity);
    const [description, setDescription] = useState(item.description);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleUpdate = async () => {
        setLoading(true);
        setError(null);

        if (!name.trim() || !quantity || Number(quantity) < 0) {
            setError('Please provide a valid name and quantity.');
            setLoading(false);
            return;
        }

        try {
            const quantityNum = Number(quantity);
            onUpdate(item.id, { name, quantity: quantityNum, description });
        } catch (err) {
            setError(err.message || 'Failed to update item.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="outlined" onClick={onBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <h1 className="text-2xl font-semibold">Edit Item</h1>
            </div>
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium">
                        Name
                    </label>
                    <TextField
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Item Name"
                        className="mt-1"
                        disabled={loading}
                        fullWidth
                        margin="normal"
                    />
                </div>
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium">
                        Quantity
                    </label>
                    <TextField
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="0"
                        className="mt-1"
                        disabled={loading}
                        fullWidth
                        margin="normal"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Item Description"
                        className="mt-1 w-full p-3 border rounded"
                        rows={3}
                        disabled={loading}
                    />
                </div>
                {error && (
                    <div className="text-red-500 text-sm flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" />
                        {error}
                    </div>
                )}
                <Button
                    variant="contained"
                    onClick={handleUpdate}
                    disabled={loading}
                    fullWidth
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};
