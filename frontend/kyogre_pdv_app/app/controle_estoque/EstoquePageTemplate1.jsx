import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Home, Package, List, ArrowLeft, Save, ArrowDown, ArrowUp } from 'lucide-react';

const ControleEstoquePage = () => {
  // Initial Categories
  const initialCategories = [
    { id: '1', name: 'Bebidas' },
    { id: '2', name: 'Alimentos' },
    { id: '3', name: 'Descartáveis' },
    { id: '4', name: 'Limpeza' }
  ];

  // State
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('lanchoneteItems');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('lanchoneteCategories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('lanchoneteTransactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentPage, setCurrentPage] = useState('home');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState('entrada');
  const [transactionQuantity, setTransactionQuantity] = useState(1);
  const [transactionNotes, setTransactionNotes] = useState('');
  const [error, setError] = useState(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('lanchoneteItems', JSON.stringify(items));
    localStorage.setItem('lanchoneteCategories', JSON.stringify(categories));
    localStorage.setItem('lanchoneteTransactions', JSON.stringify(transactions));
  }, [items, categories, transactions]);

  // Item CRUD Operations
  const handleAddItem = (item) => {
    const newItem = {
      id: crypto.randomUUID(),
      ...item,
      createdAt: new Date().toISOString(),
    };
    setItems((prevItems) => [...prevItems, newItem]);
    setCurrentPage('list');
  };

  const handleUpdateItem = (id, updates) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
      )
    );
    setCurrentPage('show');
  };

  const handleDeleteItem = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    if (selectedItemId === id) {
      setSelectedItemId(null);
    }
    setCurrentPage('list');
  };

  // Category Operations
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      setError('O nome da categoria não pode estar vazio');
      return;
    }

    const newCategory = {
      id: crypto.randomUUID(),
      name: newCategoryName.trim()
    };
    
    setCategories(prev => [...prev, newCategory]);
    setNewCategoryName('');
    setIsAddCategoryModalOpen(false);
    setError(null);
  };

  const handleDeleteCategory = (categoryId) => {
    const itemsWithCategory = items.filter(item => item.categoryId === categoryId);
    if (itemsWithCategory.length > 0) {
      setError(`Não é possível excluir esta categoria porque ${itemsWithCategory.length} item(s) a utilizam.`);
      return;
    }

    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
    setError(null);
  };

  // Transaction Operations
  const handleAddTransaction = () => {
    const selectedItem = items.find(item => item.id === selectedItemId);
    if (!selectedItem) return;

    const quantity = parseInt(transactionQuantity, 10);
    if (isNaN(quantity) || quantity <= 0) {
      setError('Quantidade deve ser um número positivo');
      return;
    }

    if (transactionType === 'saida') {
      if (selectedItem.quantity < quantity) {
        setError(`Estoque insuficiente. Disponível: ${selectedItem.quantity}`);
        return;
      }
    }

    const newTransaction = {
      id: crypto.randomUUID(),
      itemId: selectedItemId,
      type: transactionType,
      quantity: quantity,
      notes: transactionNotes,
      timestamp: new Date().toISOString()
    };

    const updatedItems = items.map(item => {
      if (item.id === selectedItemId) {
        const newQuantity = transactionType === 'entrada'
          ? item.quantity + quantity
          : item.quantity - quantity;
        
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    setTransactions(prev => [...prev, newTransaction]);
    setItems(updatedItems);
    setIsTransactionModalOpen(false);
    setTransactionQuantity(1);
    setTransactionNotes('');
    setError(null);
  };

  // Components
  const Home = ({ items, transactions }) => {
    const totalItems = items.length;
    const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const lowStockItems = items.filter(item => item.quantity <= item.minQuantity);
    
    const recentTransactions = [...transactions]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 5);

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold">Controle de Estoque - Lanchonete</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium mb-2">Total de Itens</h2>
            <span className="text-3xl font-bold">{totalItems}</span>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium mb-2">Qtde. Total em Estoque</h2>
            <span className="text-3xl font-bold">{totalQuantity}</span>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium mb-2">Itens em Baixo Estoque</h2>
            <span className="text-3xl font-bold text-red-500">{lowStockItems.length}</span>
          </div>
        </div>

        {lowStockItems.length > 0 && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h2 className="font-semibold text-red-700 mb-2">Atenção: Itens em Baixo Estoque</h2>
            <ul className="list-disc list-inside">
              {lowStockItems.map(item => (
                <li key={item.id} className="text-red-600">
                  {item.name} - Atual: {item.quantity}, Mínimo: {item.minQuantity}
                </li>
              ))}
            </ul>
          </div>
        )}

        {recentTransactions.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium mb-4">Transações Recentes</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Data</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Item</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Tipo</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Qtde</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentTransactions.map(transaction => {
                    const item = items.find(i => i.id === transaction.itemId);
                    return (
                      <tr key={transaction.id}>
                        <td className="px-4 py-2 text-sm text-gray-500">
                          {new Date(transaction.timestamp).toLocaleString('pt-BR')}
                        </td>
                        <td className="px-4 py-2 text-sm">{item?.name || 'Item removido'}</td>
                        <td className="px-4 py-2 text-sm">
                          <span className={`inline-flex items-center ${
                            transaction.type === 'entrada' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'entrada' ? (
                              <ArrowDown className="w-4 h-4 mr-1" />
                            ) : (
                              <ArrowUp className="w-4 h-4 mr-1" />
                            )}
                            {transaction.type === 'entrada' ? 'Entrada' : 'Saída'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-sm">{transaction.quantity}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ListItems = ({ items, categories, onItemSelect, onDelete }) => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Produtos em Estoque</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsAddCategoryModalOpen(true)} 
              className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Nova Categoria
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md">{error}</div>
        )}
        
        {items.length === 0 ? (
          <div className="text-gray-500 bg-white p-6 rounded-md">
            Nenhum item encontrado. Comece adicionando novos produtos!
          </div>
        ) : (
          <div className="bg-white overflow-x-auto rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Un.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => {
                  const category = categories.find(c => c.id === item.categoryId);
                  const stockStatus = 
                    item.quantity <= 0 ? "Esgotado" : 
                    item.quantity <= item.minQuantity ? "Baixo" : "OK";
                  
                  const stockStatusClass = 
                    item.quantity <= 0 ? "bg-red-100 text-red-800" : 
                    item.quantity <= item.minQuantity ? "bg-yellow-100 text-yellow-800" : 
                    "bg-green-100 text-green-800";

                  return (
                    <tr 
                      key={item.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => onItemSelect(item.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{category?.name || 'Sem categoria'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {parseFloat(item.price).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatusClass}`}>
                          {stockStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2" onClick={e => e.stopPropagation()}>
                          <button 
                            onClick={() => {
                              setSelectedItemId(item.id);
                              setCurrentPage('update');
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => onDelete(item.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Category List */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Categorias</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Itens</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => {
                  const itemCount = items.filter(item => item.categoryId === category.id).length;
                  
                  return (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{itemCount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          disabled={itemCount > 0}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Category Modal */}
        {isAddCategoryModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Nova Categoria</h2>
              
              {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>
              )}
              
              <div className="mb-4">
                <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  id="categoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Ex: Bebidas, Salgados, Doces..."
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setIsAddCategoryModalOpen(false);
                    setNewCategoryName('');
                    setError(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const CreateItem = ({ onItemCreated, onCancel, categories }) => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState('');
    const [minQuantity, setMinQuantity] = useState(5);
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
    const [unit, setUnit] = useState('unidade');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [supplier, setSupplier] = useState('');

    const handleCreate = async () => {
      setLoading(true);
      setError(null);

      if (!name.trim()) {
        setError('Nome do produto é obrigatório');
        setLoading(false);
        return;
      }

      if (isNaN(quantity) || parseInt(quantity) < 0) {
        setError('Quantidade deve ser um número não negativo');
        setLoading(false);
        return;
      }

      if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
        setError('Preço unitário deve ser um valor positivo');
        setLoading(false);
        return;
      }

      if (isNaN(minQuantity) || parseInt(minQuantity) < 0) {
        setError('Quantidade mínima deve ser um número não negativo');
        setLoading(false);
        return;
      }

      try {
        const newItem = {
          name: name.trim(),
          quantity: parseInt(quantity),
          price: parseFloat(price),
          minQuantity: parseInt(minQuantity),
          description,
          categoryId,
          unit,
          supplier
        };
        
        onItemCreated(newItem);
        clearForm();
      } catch (err) {
        setError(err.message || 'Erro ao criar produto');
      } finally {
        setLoading(false);
      }
    };

    const clearForm = () => {
      setName('');
      setQuantity(0);
      setPrice('');
      setMinQuantity(5);
      setDescription('');
      setCategoryId(categories[0]?.id || '');
      setUnit('unidade');
      setSupplier('');
      setError(null);
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Cadastrar Novo Produto</h1>
          <button 
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md flex items-center hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Produto *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ex: Refrigerante Cola 2L"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                disabled={loading || categories.length === 0}
              >
                {categories.length === 0 ? (
                  <option value="">Nenhuma categoria disponível</option>
                ) : (
                  categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade Inicial *
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                min="0"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                Unidade de Medida
              </label>
              <select
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                disabled={loading}
              >
                <option value="unidade">Unidade</option>
                <option value="kg">Quilograma (kg)</option>
                <option value="g">Grama (g)</option>
                <option value="l">Litro (L)</option>
                <option value="ml">Mililitro (ml)</option>
                <option value="pacote">Pacote</option>
                <option value="caixa">Caixa</option>
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Preço Unitário (R$) *
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                min="0"
                step="0.01"
                placeholder="0.00"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="minQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade Mínima *
              </label>
              <input
                type="number"
                id="minQuantity"
                value={minQuantity}
                onChange={(e) => setMinQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                min="0"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Alerta será exibido quando estoque estiver abaixo deste valor
              </p>
            </div>

            <div>
              <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                Fornecedor
              </label>
              <input
                type="text"
                id="supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nome do fornecedor"
                disabled={loading}
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Informações adicionais sobre o produto"
              disabled={loading}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Cadastrar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ShowItem = ({ item, category, onEdit, onDelete, onTransaction, transactions, onBack }) => {
    if (!item) return null;

    const stockStatus = 
      item.quantity <= 0 ? "Esgotado" : 
      item.quantity <= item.minQuantity ? "Baixo" : "OK";
    
    const stockStatusClass = 
      item.quantity <= 0 ? "bg-red-100 text-red-800" : 
      item.quantity <= item.minQuantity ? "bg-yellow-100 text-yellow-800" : 
      "bg-green-100 text-green-800";

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Detalhes do Produto</h1>
          <div className="flex space-x-2">
            <button 
              onClick={onBack}
              className="px-4 py-2 border border-gray-300 rounded-md flex items-center hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar
            </button>
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md flex items-center hover:bg-indigo-700"
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Excluir
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium mb-4">Informações Básicas</h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Nome</dt>
                    <dd className="mt-1 text-sm text-gray-900">{item.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Categoria</dt>
                    <dd className="mt-1 text-sm text-gray-900">{category?.name || 'Sem categoria'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Fornecedor</dt>
                    <dd className="mt-1 text-sm text-gray-900">{item.supplier || 'Não especificado'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Descrição</dt>
                    <dd className="mt-1 text-sm text-gray-900">{item.description || 'Sem descrição'}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h2 className="text-lg font-medium mb-4">Estoque</h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Quantidade Atual</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {item.quantity} {item.unit}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Quantidade Mínima</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {item.minQuantity} {item.unit}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatusClass}`}>
                        {stockStatus}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Preço Unitário</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {parseFloat(item.price).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      })}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <button
                    onClick={onTransaction}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Registrar Movimentação
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="border-t border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium mb-4">Histórico de Movimentações</h2>
            {transactions.length === 0 ? (
              <p className="text-gray-500">Nenhuma movimentação registrada</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(transaction.timestamp).toLocaleString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center ${
                            transaction.type === 'entrada' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'entrada' ? (
                              <ArrowDown className="w-4 h-4 mr-1" />
                            ) : (
                              <ArrowUp className="w-4 h-4 mr-1" />
                            )}
                            {transaction.type === 'entrada' ? 'Entrada' : 'Saída'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.quantity} {item.unit}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {transaction.notes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const UpdateItem = ({ item, categories, onItemUpdated, onCancel }) => {
    const [name, setName] = useState(item.name);
    const [price, setPrice] = useState(item.price);
    const [minQuantity, setMinQuantity] = useState(item.minQuantity);
    const [description, setDescription] = useState(item.description || '');
    const [categoryId, setCategoryId] = useState(item.categoryId);
    const [unit, setUnit] = useState(item.unit);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [supplier, setSupplier] = useState(item.supplier || '');

    const handleUpdate = async () => {
      setLoading(true);
      setError(null);

      if (!name.trim()) {
        setError('Nome do produto é obrigatório');
        setLoading(false);
        return;
      }

      if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
        setError('Preço unitário deve ser um valor positivo');
        setLoading(false);
        return;
      }

      if (isNaN(minQuantity) || parseInt(minQuantity) < 0) {
        setError('Quantidade mínima deve ser um número não negativo');
        setLoading(false);
        return;
      }

      try {
        const updates = {
          name: name.trim(),
          price: parseFloat(price),
          minQuantity: parseInt(minQuantity),
          description,
          categoryId,
          unit,
          supplier
        };
        
        onItemUpdated(item.id, updates);
      } catch (err) {
        setError(err.message || 'Erro ao atualizar produto');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Editar Produto</h1>
          <button 
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md flex items-center hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Produto *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Categoria *
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                disabled={loading}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                Unidade de Medida
              </label>
              <select
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                disabled={loading}
              >
                <option value="unidade">Unidade</option>
                <option value="kg">Quilograma (kg)</option>
                <option value="g">Grama (g)</option>
                <option value="l">Litro (L)</option>
                <option value="ml">Mililitro (ml)</option>
                <option value="pacote">Pacote</option>
                <option value="caixa">Caixa</option>
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Preço Unitário (R$) *
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                min="0"
                step="0.01"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="minQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade Mínima *
              </label>
              <input
                type="number"
                id="minQuantity"
                value={minQuantity}
                onChange={(e) => setMinQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                min="0"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Alerta será exibido quando estoque estiver abaixo deste valor
              </p>
            </div>

            <div>
              <label htmlFor="supplier" className="block text-sm font-medium text-gray-700 mb-1">
                Fornecedor
              </label>
              <input
                type="text"
                id="supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Nome do fornecedor"
                disabled={loading}
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Navigation Bar
  const NavBar = () => (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              onClick={() => setCurrentPage('home')}
              className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${
                currentPage === 'home' ? 'text-indigo-700 bg-indigo-50' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Home className="h-5 w-5 mr-1" />
              Início
            </button>
            <button
              onClick={() => setCurrentPage('list')}
              className={`ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md ${
                currentPage === 'list' ? 'text-indigo-700 bg-indigo-50' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Package className="h-5 w-5 mr-1" />
              Produtos
            </button>
          </div>
          {currentPage === 'list' && (
            <button
              onClick={() => setCurrentPage('create')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5 mr-1" />
              Novo Produto
            </button>
          )}
        </div>
      </div>
    </nav>
  );

  // Main Layout
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {renderPage()}
      </main>

      {/* Transaction Modal */}
      {isTransactionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {transactionType === 'entrada' ? 'Registrar Entrada' : 'Registrar Saída'}
            </h2>
            
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Movimentação
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setTransactionType('entrada')}
                    className={`flex-1 py-2 px-4 rounded-md ${
                      transactionType === 'entrada'
                        ? 'bg-green-100 text-green-800 border-2 border-green-500'
                        : 'bg-gray-100 text-gray-800 border border-gray-300'
                    }`}
                  >
                    <ArrowDown className="h-5 w-5 mx-auto mb-1" />
                    Entrada
                  </button>
                  <button
                    onClick={() => setTransactionType('saida')}
                    className={`flex-1 py-2 px-4 rounded-md ${
                      transactionType === 'saida'
                        ? 'bg-red-100 text-red-800 border-2 border-red-500'
                        : 'bg-gray-100 text-gray-800 border border-gray-300'
                    }`}
                  >
                    <ArrowUp className="h-5 w-5 mx-auto mb-1" />
                    Saída
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantidade
                </label>
                <input
                  type="number"
                  id="quantity"
                  value={transactionQuantity}
                  onChange={(e) => setTransactionQuantity(parseInt(e.target.value, 10))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  id="notes"
                  value={transactionNotes}
                  onChange={(e) => setTransactionNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Motivo da movimentação..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsTransactionModalOpen(false);
                  setTransactionQuantity(1);
                  setTransactionNotes('');
                  setError(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddTransaction}
                className={`px-4 py-2 rounded-md text-white ${
                  transactionType === 'entrada'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControleEstoquePage;