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
import { Category, Product } from '../../types/menu';
import { cardapioService } from '../../controllers/cardapio_controller';
import UploadImage from '../../utils/upload_files_supabase';
import { useAuth } from '../../contexts/AuthContext';

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
          <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%' }} /> :
          <Box sx={{ width: '100%', height: '100%', border: '1px solid #ccc' }} />
        }
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle1">{product.name}</Typography>
        <Typography variant="body2" color="text.secondary">R$ {product.price} reais</Typography>
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

// CategoryCard Component
const CategoryCard = ({
  category,
  onAddProduct,
  onDeleteCategory,
  onEditProduct,
  onDeleteProduct
}: {
  category: Category,
  onAddProduct: (categoryName: string) => void,
  onDeleteCategory: (categoryId: number) => void,
  onEditProduct: (product: Product) => void,
  onDeleteProduct: (productId: number) => void
}) => {
  // Get background color based on category name
  const getBgColor = () => {
    switch (category.name) {
      case 'Hamburguer': return '#2196f3';
      case 'Pizza': return '#4caf50';
      case 'Sucos': return '#2196f3';
      case 'Salgados': return '#4caf50';
      default: return '#9c27b0';
    }
  };

  // Get lighter background color for content
  const getContentBgColor = () => {
    switch (category.name) {
      case 'Hamburguer': return '#bbdefb';
      case 'Pizza': return '#c8e6c9';
      case 'Sucos': return '#bbdefb';
      case 'Salgados': return '#c8e6c9';
      default: return '#e1bee7';
    }
  };

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 2,
      overflow: 'hidden'
    }}>
      <Box sx={{
        bgcolor: getBgColor(),
        p: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white'
      }}>
        <IconButton size="small" sx={{ color: 'white' }} onClick={() => onDeleteCategory(category.id)}>
          <RemoveIcon />
        </IconButton>
        <Typography variant="h6">{category.name}</Typography>
        <IconButton size="small" sx={{ color: 'white' }} onClick={() => onAddProduct(category.name)}>
          <AddIcon />
        </IconButton>
      </Box>
      <Box sx={{
        p: 1,
        flexGrow: 1,
        minHeight: 200,
        bgcolor: getContentBgColor(),
        overflowY: 'auto'
      }}>
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
    adicionais: {
      nome_adicional: '',
      preco: 0
    }
    
  });
  const [hasAdditionals, setHasAdditionals] = useState(false);
  const [, setUploadedImageUrl] = useState(''); // New state for the uploaded image URL

 // Callback function to receive the URL from UploadImage
  const handleUploadSuccess = (url: string) => {
    setUploadedImageUrl(url);
    setFormData({ ...formData, imageUrl: url });
  };
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        id: editingProduct.id,
        name: editingProduct.name,
        price: editingProduct.price,
        category: '', // This would come from the category context in a real implementation
        imageUrl: editingProduct.imageUrl || '',
        description: editingProduct.description || '',
        isAvailable: editingProduct.isAvailable || false,
        adicionais: {
          nome_adicional: '',
          preco: 0
        }
      });
    } else {
      setFormData({
        id: 0,
        name: '',
        price: 0,
        category: categoryOptions[0] || '',
        imageUrl: 'https://picsum.photos/200/300', //!change here
        description: '',
        isAvailable: true,
        adicionais: {
          nome_adicional: '',
          preco: 0
        }
      });
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
const handleChangeAdicionais = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData({
    ...formData,
    adicionais: { // Update the nested adicionais object
      ...formData.adicionais, // Keep existing properties of adicionais
      nome_adicional: e.target.value // Update nome_adicional
    }
  });
};

// New handler for "Adicional Price" TextField
const handleChangeAdicionaisPreco = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData({
    ...formData,
    adicionais: { // Update the nested adicionais object
      ...formData.adicionais, // Keep existing properties of adicionais
      preco: Number(e.target.value) // Update preco (ensure it's a number)
    }
  });
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
                label="Preço (R$)"
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

              <UploadImage onUploadSuccess={handleUploadSuccess} /> {/* Pass the callback function */}
 

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
                </Grid>
                <Grid item xs={6} mb={2} mt={2}>
                  <TextField
                    fullWidth
                    label="Nome do Adicional"
                    name="nome_adicional" // <-- Name for the additional name field
                    value={formData.adicionais.nome_adicional} // <-- Bind to formData.adicionais.nome_adicional
                    onChange={handleChangeAdicionais} // <-- Create handleChangeAdicionais
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Preço do Adicional (R$)"
                    name="preco_adicional" // <-- Name for the additional price field
                    type="number"
                    value={formData.adicionais.preco} // <-- Bind to formData.adicionais.preco
                    onChange={handleChangeAdicionaisPreco} // <-- Create handleChangeAdicionaisPreco
                  />
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

// CategoryModal Component
const CategoryModal = ({
  open,
  onClose,
  onSave
}: {
  open: boolean,
  onClose: () => void,
  onSave: (categoryName: string) => void
}) => {
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
};


//! Cardapio Manager
interface CardapioManagerPageProps {
  isSidebarOpen: boolean;
}

export function CardapioManagerPage({ isSidebarOpen,  }: CardapioManagerPageProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [, setSelectedCategory] = useState('');

  const { user } = useAuth();

  const nome = user?.nome;
  const tabela = user?.tabela;
  const bucket = user?.storage;
  
  useEffect(() => {
    console.log("🔍 Sessão carregada:", nome, tabela, bucket);
    carregarProdutos();
  }, []);




  const carregarProdutos = async () => {
    try {
      setIsLoading(true);
      const produtos = await cardapioService.buscarProdutos();

      // Agrupa produtos por categoria
      const categoriaMap = new Map<string, Product[]>();
      produtos.forEach(produto => {


        if (!categoriaMap.has(produto.categoria)) {
          categoriaMap.set(produto.categoria, []);
        }
        categoriaMap.get(produto.categoria)?.push({
          id: produto.id,
          name: produto.nome_produto,
          price: produto.preco,
          imageUrl: produto.url_imagem,
          description: produto.descricao,
          isAvailable: produto.disponivel
        });
      });

      // Converte o Map para o formato de categorias
      const novasCategorias: Category[] = Array.from(categoriaMap).map(([name, products], index) => ({
        id: index,
        name,
        products
      }));

      setCategories(novasCategorias);
      setIsLoading(false);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setIsLoading(false);
    }
  };

  const handleAddProduct = (categoryName: string) => {

    setSelectedCategory(categoryName);
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await cardapioService.deletarProduto(productId);
      await carregarProdutos(); // Recarrega os produtos
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
    }
  };

  const handleDeleteCategory = (categoryId: number) => {
    // Just for the demo, in a real app this would call an API
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    alert(`Categoria ${categories.find(c => c.id === categoryId)?.name} removida!`);
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      await cardapioService.criarProduto({
        id: productData.id || 0,
        nome_produto: productData.name,
        preco: productData.price,
        categoria: productData.category,
        url_imagem: productData.imageUrl,
        descricao: productData.description,
        disponivel: true,
        adicionais: {
          nome_adicional: '',
          preco: 0
        }

        // adicionais: hasAdditionals ? productData.adicionais : {
        //   nome_adicional: '',
        //   preco: 0
        // }
      });

      await carregarProdutos(); // Recarrega os produtos
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleAddCategory = (categoryName: string) => {
    // In a real app, this would call an API to create the category
    if (categories.some(cat => cat.name === categoryName)) {
      alert('Esta categoria já existe!');
      return;
    }

    const newCategory: Category = {
      id: Math.max(0, ...categories.map(c => c.id)) + 1,
      name: categoryName,
      products: []
    };

    setCategories([...categories, newCategory]);
  };

  const categoryNames = categories.map(category => category.name);

  return (
    <div className="ml-2 pt-8 p-2">
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, mt: 2, flexDirection: { xs: 'column', sm: 'row' } }}> {/* Adicionado flexDirection para mobile */}

      
      <Typography variant="h4" component="h1" sx={{ mb: { xs: 2, sm: 0 } }}>Gerenciar Cardápio</Typography> {/* Adicionado marginBottom para mobile */}
     
         <div>
            <h1>Bem-vindo, {nome}</h1>
        </div>

      <Stack
          direction={{ xs: 'column', sm: 'row' }} // Empilha verticalmente em xs, horizontal em sm e acima
          spacing={2}
          sx={{
            width: { xs: '100%', sm: 'auto' }, // Largura total em xs, auto em sm e acima
            // Ajuste responsivo da direção e alinhamento baseado em isSidebarOpen (ou largura da tela)
            flexDirection: isSidebarOpen ? 'column' : { xs: 'column', sm: 'row' }, // Empilha se sidebar aberta (ou em xs), senão, row
            alignItems: isSidebarOpen ? 'stretch' : 'center', // Estica botões verticalmente se sidebar aberta, alinha ao centro senão
          }}
        >
      
      <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsProductModalOpen(true)}
          >
            Adicionar Novo Produto
          </Button>

          {/* Your TestePedidoButton would go here */}

          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => setIsCategoryModalOpen(true)}
          >
            Adicionar Categoria
          </Button>
        </Stack>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
              <CategoryCard
                category={category}
                onAddProduct={handleAddProduct}
                onDeleteCategory={handleDeleteCategory}
                onEditProduct={handleEditProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <ProductModal
        open={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        categoryOptions={categoryNames}
        editingProduct={editingProduct}
      />

      <CategoryModal
        open={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleAddCategory}
      />
    </div>
  );
}