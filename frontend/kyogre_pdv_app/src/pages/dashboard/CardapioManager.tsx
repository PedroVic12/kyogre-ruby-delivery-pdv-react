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
import { Category, Product, Adicional} from '../../types/menu';
import { cardapioService } from '../../controllers/cardapio_controller';
import UploadImage from '../../utils/upload_files_supabase';
import { useAuth } from '../../contexts/AuthContext';
import {FloatActionButton} from '../../components/ui/FloatActionButton';




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
  const getBgColor = () => category.color || '#9c27b0'; // Usar a cor da categoria ou uma cor padrão

  // Get lighter background color for content
  // const getContentBgColor = () => {
  //   switch (category.name) {
  //     case 'Hamburguer': return '#bbdefb';
  //     case 'Pizza': return '#c8e6c9';
  //     case 'Sucos': return '#bbdefb';
  //     case 'Salgados': return '#c8e6c9';
  //     default: return '#e1bee7';
  //   }
  // };

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 2,
      overflow: 'hidden',
      bgcolor: getBgColor(), // Aplicar a cor da categoria como fundo do card inteiro
      color: 'white' // Ajustar a cor do texto para contraste
    }}>
      <Box sx={{
        p: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
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

// CategoryModal Component
const CategoryModal = ({
  open,
  onClose,
  onSave
}: {
  open: boolean,
  onClose: () => void,
  onSave: (categoryName: string, categoryColor: string) => void // Ajustado para incluir a cor
}) => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryColor, setCategoryColor] = useState('#9c27b0'); // Cor padrão

  const handleSubmit = () => {
    if (categoryName.trim()) {
      onSave(categoryName, categoryColor); // Enviar a cor junto com o nome
      setCategoryName('');
      setCategoryColor('#9c27b0'); // Resetar a cor para o padrão
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
            {/* Botões de seleção de cores */}
            <Box
              sx={{
                width: 40,
                height: 40,
                bgcolor: '#9c27b0',
                border: categoryColor === '#9c27b0' ? '3px solid black' : '1px solid #ccc',
                borderRadius: '50%',
                cursor: 'pointer',
              }}
              onClick={() => setCategoryColor('#9c27b0')}
            />
            <Box
              sx={{
                width: 40,
                height: 40,
                bgcolor: '#2196f3',
                border: categoryColor === '#2196f3' ? '3px solid black' : '1px solid #ccc',
                borderRadius: '50%',
                cursor: 'pointer',
              }}
              onClick={() => setCategoryColor('#2196f3')}
            />
            <Box
              sx={{
                width: 40,
                height: 40,
                bgcolor: '#4caf50',
                border: categoryColor === '#4caf50' ? '3px solid black' : '1px solid #ccc',
                borderRadius: '50%',
                cursor: 'pointer',
              }}
              onClick={() => setCategoryColor('#4caf50')}
            />
            <Box
              sx={{
                width: 40,
                height: 40,
                bgcolor: '#ff9800',
                border: categoryColor === '#ff9800' ? '3px solid black' : '1px solid #ccc',
                borderRadius: '50%',
                cursor: 'pointer',
              }}
              onClick={() => setCategoryColor('#ff9800')}
            />
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained">Adicionar</Button>
      </DialogActions>
    </Dialog>
  );
};

//! Cardapio Manager

//TODO -> Arrumar editar produto e adicionar categoria. Tem que receber o cardapio de cada cliente separado e ter CRUD completo com a restapi pro supabase
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


  // com o context do login, consumir a API para buscar os produtos de cada usuario. 

  // o envio de foto no storage deu ruim e editar o produto tem que ser o ID certo 

  const nome = user?.nome;
  const tabela = user?.tabela;
  const bucket = user?.storage;
  
  useEffect(() => {
    console.log("🔍 Sessão:", nome, tabela, bucket);
    carregarProdutos();

  }, []);


  const carregarProdutos = async () => {
    try {
      setIsLoading(true);
      const produtos = await cardapioService.buscarProdutos();

      // Agrupa produtos por categoria
      const categoriaMap = new Map<string, Product[]>();
      produtos.forEach((produto) => {
        const categoria = produto.categoria || '';
        if (!categoriaMap.has(categoria)) {
          categoriaMap.set(categoria, []);
        }
        categoriaMap.get(categoria)?.push({
          id: produto.id,
          nome_produto: produto.nome_produto,
          preco: produto.preco,
          imageUrl: produto.url_imagem,
          descricao: produto.descricao,
          isAvailable: produto.disponivel || true,
          categoria: produto.categoria,
          price: undefined,
          name: undefined,
          description: undefined
        });
      });

      // Converte o Map para o formato de categorias
      const novasCategorias: Category[] = Array.from(categoriaMap).map(([name, products], index) => ({
        id: index,
        name,
        products,
        color: '#000000' // Adicionei uma cor padrão, você pode alterar conforme necessário
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
      if (productData.id > 0) {
        // Atualizar produto existente
        await cardapioService.updateProduct(productData.id, {
          nome_produto: productData.name,
          preco: productData.price,
          categoria: productData.category,
          url_imagem: productData.imageUrl,
          descricao: productData.description,
          disponivel: productData.isAvailable,
          adicionais: productData.adicionais.length > 0 ? productData.adicionais : null, // Enviar null se não houver adicionais
        });
      } else {
        // Criar novo produto
        await cardapioService.criarProduto({
          id: 0, // ID será gerado automaticamente
          nome_produto: productData.name,
          preco: productData.price,
          categoria: productData.category,
          url_imagem: productData.imageUrl,
          descricao: productData.description,
          disponivel: productData.isAvailable,
          adicionais: productData.adicionais.length > 0 ? productData.adicionais : null,
          isAvailable: true,
          price: undefined,
          name: undefined,
          description: undefined
        });
      }
  
      await carregarProdutos(); // Recarrega os produtos
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  const handleAddCategory = (categoryName: string, categoryColor: string) => {
    if (categories.some(cat => cat.name === categoryName)) {
      alert('Esta categoria já existe!');
      return;
    }
  
    const newCategory: Category = {
      id: Math.max(0, ...categories.map(c => c.id)) + 1,
      name: categoryName,
      products: [],
      color: categoryColor // Adicionar a cor à categoria
    };
  
    setCategories([...categories, newCategory]);
  };

  const categoryNames = categories.map(category => category.name);


  // 1. Primeiro ajuste a interface de Action
  interface Action {
    icon: React.ReactNode;
    name: string;
    onClick: () => void;
  }

  // 2. Defina as ações corretamente
  const selected_button_functions: Action[] = [
    {
      icon: <AddIcon fontSize="large" color='primary' />,
      name: 'Adicionar  Produto',
      onClick: () => {
        setEditingProduct(null);
        setIsProductModalOpen(true);
      }
    },
    {
      icon: <EditIcon fontSize="large"   color='success' />,
      name: 'Criar Categoria',
      onClick: () => setIsCategoryModalOpen(true)
      }
    
  ];

  return (
    <div className="ml-2 pt-8 p-2">
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, mt: 2, flexDirection: { xs: 'column', sm: 'row' } }}> {/* Adicionado flexDirection para mobile */}

      
     
      <div>
          <h1>Bem-vindo! {nome?.toLocaleUpperCase()}</h1>
          {/* <h2>Tabela: {tabela}</h2>
          <h2>Bucket: {bucket}</h2> */}
        </div>

        <Typography variant="h4" component="h1" sx={{ mb: { xs: 2, sm: 0 } }}>Gerenciador de Cardápio</Typography> {/* Adicionado marginBottom para mobile */}


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


      <FloatActionButton
        mainButtonIcon={<AddIcon />}
        mainButtonTooltip="Ações rápidas"
        actions={selected_button_functions}
      />



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



        {/* ! Your TestePedidoButton would go here */}


        {/* <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setIsProductModalOpen(true)}
          >
            Adicionar Novo Produto
          </Button>


          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={() => setIsCategoryModalOpen(true)}
          >
            Adicionar Categoria
          </Button> */}
          
    </div>
  );
}