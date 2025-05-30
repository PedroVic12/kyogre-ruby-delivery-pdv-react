import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Grid,
  Select,
  FormControl,
  InputLabel,
  Stack,
  SelectChangeEvent,
  Switch,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Adicional, Category, Product } from '../../../types/menu';
import { useAuth } from '../../../contexts/AuthContext';
import UploadImage from '../../../utils/upload_files_supabase';

// Inicializa categoryColors a partir do localStorage ou com valores padrão
const getInitialCategoryColors = (): { [key: string]: string } => {
  const savedColors = localStorage.getItem('categoryColors');
  return savedColors
    ? JSON.parse(savedColors)
    : {
        Hamburguer: '#000000',
        Pizza: '#9c27b0',
        Bebidas: '#2196f3',
        Salgados: '#4caf50',
        Sobremesas: '#ff9800',
        // Adicione mais categorias e cores aqui
      };
};

const categoryColors = getInitialCategoryColors();

const saveCategoryColorsToLocalStorage = (colors: { [key: string]: string }) => {
  localStorage.setItem('categoryColors', JSON.stringify(colors));
};


// ProductCard Component
const ProductCard = ({
  product,
  onEdit,
  onDelete
}: {
  product: Product,
  onEdit: (product: Product) => void,
  onDelete: (id: number) => void
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 1, mb: 1, bgcolor: '#f5f5f5' }}>
      <Box sx={{ width: 40, height: 40, bgcolor: '#e0e0e0', mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {product.imageUrl ?
          <img src={product.imageUrl} alt={product.nome_produto} style={{ width: '100%', height: '100%' }} /> :
          <Box sx={{ width: '100%', height: '100%', border: '10px solid #ccc' }} />
        }
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1">{product.nome_produto}</Typography>
        {/* <Typography variant="body2" color="text.secondary">R$ {product.preco} reais</Typography> */}
        <Typography variant="body2" color="text.success">$ {product.preco} </Typography>

      </Box>



      <IconButton onClick={handleClick} size="small">
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => { onEdit(product); handleClose(); }}>
          <EditIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
          Editar Produto
        </MenuItem>
        <MenuItem onClick={() => { onDelete(product.id); handleClose(); }}>
          <DeleteIcon color="error" fontSize="small" sx={{ mr: 1 }} />
          Deletar Produto
        </MenuItem>
      </Menu>
    </Card>
  );
};
// ProductModal Component
const ProductModal = ({
  open,
  onClose,
  onSave,
  categoryOptions,
  editingProduct
}: {
  open: boolean,
  onClose: () => void,
  onSave: (productData: any) => void,
  categoryOptions: string[],
  editingProduct: Product | null
}) => {
  const [formData, setFormData] = useState({
    id: 0,
    name: '',
    price: 0,
    category: '',
    imageUrl: '',
    description: '',
    isAvailable: true,
    adicionais: [] as Adicional[], // Array de adicionais    
  });
  const [hasAdditionals, setHasAdditionals] = useState(false);
  const [, setUploadedImageUrl] = useState(''); // New state for the uploaded image URL

  const folder_name = useAuth().user?.storage;

  console.log("🔍 Folder Name:", folder_name);

  
  const handleAddAdicional = () => {
    setFormData({
      ...formData,
      adicionais: [...formData.adicionais, { nome_adicional: '', preco: 0 }],
    });
  };
  

  const handleRemoveAdicional = (index: number) => {
    const updatedAdicionais = formData.adicionais.filter((_, i) => i !== index);
    setFormData({ ...formData, adicionais: updatedAdicionais });
  };
  
 // Callback function to receive the URL from UploadImage
  const handleUploadSuccess = (url: string) => {
    setUploadedImageUrl(url);
    setFormData({ ...formData, imageUrl: url });
  };
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        id: editingProduct.id,
        name: editingProduct.nome_produto,
        price: editingProduct.preco,
        category: editingProduct.categoria || '',
        imageUrl: editingProduct.imageUrl || '',
        description: editingProduct.descricao || '',
        isAvailable: editingProduct.isAvailable || false,
        adicionais: editingProduct.adicionais || [], // Carregar adicionais existentes ou array vazio
      });
      setHasAdditionals(!!editingProduct.adicionais && editingProduct.adicionais.length > 0); // Ativar o switch se houver adicionais
    } else {
      setFormData({
        id: 0,
        name: '',
        price: 0,
        category: categoryOptions[0] || '',
        imageUrl: 'https://picsum.photos/200/300',
        description: '',
        isAvailable: true,
        adicionais: [],
      });
      setHasAdditionals(false);
    }
  }, [editingProduct, categoryOptions, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    const value = e.target.value;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeCategoria = (e: SelectChangeEvent<string>) => {
    setFormData({ ...formData, category: e.target.value });
  };

// New handler for "Adicional Name" TextField
const handleChangeAdicionais = (index: number, field: keyof Adicional, value: string | number) => {
  const updatedAdicionais = [...formData.adicionais]; // Cria uma cópia do array
  updatedAdicionais[index] = { ...updatedAdicionais[index], [field]: value }; // Atualiza o campo específico do adicional
  setFormData({ ...formData, adicionais: updatedAdicionais }); // Atualiza o estado com o novo array
};


  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome do Produto"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Preço em (R$)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  labelId="Categoria"
                  label="Categoria"
                  onChange={handleChangeCategoria}
                >
                  {categoryOptions.map((category) => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>

              <UploadImage onUploadSuccess={handleUploadSuccess} storagePath={folder_name} /> {/* Pass the callback function */}
 

              <TextField
                fullWidth
                label="URL da Imagem"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                name="description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
          </Grid>

          </Grid>
            <div className="flex items-center justify-between">
              {/* "Disponível" and "Adicionais?" Switches (from previous step) */}
              <span className="text-sm font-medium text-gray-700">Disponível</span>
              <Switch
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              />
              <span className="text-sm font-medium text-gray-700">Adicionais?</span>
              <Switch
                checked={hasAdditionals}
                onChange={(e) => setHasAdditionals(e.target.checked)}
              />
            </div>

        

           {/* Conditionally render Additionals Fields based on hasAdditionals state */}
           {hasAdditionals && (
              <> {/* Use a Fragment to group the conditionally rendered Grid items */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">Adicionais:</Typography>
            {formData.adicionais.map((adicional, index) => (
              <Grid container spacing={2} key={index} alignItems="center">
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label="Nome do Adicional"
                    value={adicional.nome_adicional}
                    onChange={(e) => handleChangeAdicionais(index, 'nome_adicional', e.target.value)}
                  />
                </Grid>
                <Grid item xs={5}>
                  <TextField
                    fullWidth
                    label="Preço do Adicional (R$)"
                    type="number"
                    value={adicional.preco}
                    onChange={(e) => handleChangeAdicionais(index, 'preco', Number(e.target.value))}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton color="error" onClick={() => handleRemoveAdicional(index)}>
                    <RemoveIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddAdicional}
              sx={{ mt: 2 }}
            >
              Adicionar Adicional
            </Button>
          </Grid>
              </>
            )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Salvar</Button>
      </DialogActions>
    </Dialog>
  );
};




//! Categoria Component
const CategoryModal = ({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (categoryName: string, categoryColor: string) => void;
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryColor, setCategoryColor] = useState('#000000'); // Cor padrão

  const handleSubmit = () => {
    if (categoryName.trim()) {
      // Adiciona a nova categoria ao estado global de cores
      if (!categoryColors[categoryName]) {
        categoryColors[categoryName] = categoryColor;
        saveCategoryColorsToLocalStorage(categoryColors); // Salva no localStorage
      }

      onSave(categoryName, categoryColor); // Enviar a cor junto com o nome
      setCategoryName('');
      setCategoryColor('#000000'); // Resetar a cor para o padrão
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
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Escolha uma Cor:</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            {/* Gerar opções de cores dinamicamente a partir de categoryColors */}
            {Object.values(categoryColors).map((color) => (
              <Box
                key={color}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: color,
                  border: categoryColor === color ? '3px solid black' : '1px solid #ccc',
                  borderRadius: '50%',
                  cursor: 'pointer',
                }}
                onClick={() => setCategoryColor(color)}
              />
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CategoryCard = ({
  category,
  onAddProduct,
  onDeleteCategory,
  onEditProduct,
  onDeleteProduct,
}: {
  category: Category;
  onAddProduct: (categoryName: string) => void;
  onDeleteCategory: (categoryId: number) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
}) => {
  // Determinar a cor com base no nome da categoria
  const getBgColor = () => categoryColors[category.name] || '#000000'; // Cor padrão é preta

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: getBgColor(), // Aplicar a cor da categoria como fundo do card inteiro
        color: 'white', // Ajustar a cor do texto para contraste
      }}
    >
      <Box
        sx={{
          p: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <IconButton size="small" sx={{ color: 'white' }} onClick={() => onDeleteCategory(category.id)}>
          <RemoveIcon />
        </IconButton>
        <Typography variant="h6">{category.name}</Typography>
        <IconButton size="small" sx={{ color: 'white' }} onClick={() => onAddProduct(category.name)}>
          <AddIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          p: 1,
          flexGrow: 1,
          minHeight: 200,
          overflowY: 'auto',
        }}
      >
        {category.products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={onEditProduct}
            onDelete={onDeleteProduct}
          />
        ))}
      </Box>
    </Card>
  );
};

