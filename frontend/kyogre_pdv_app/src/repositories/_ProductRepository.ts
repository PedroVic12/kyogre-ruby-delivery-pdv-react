import { Product, Category } from '../models/Product';

export class ProductRepository {
  fetchProducts() {
    throw new Error('Method not implemented.');
  }
  private static products: Product[] = [
    {
      id: '1',
      name: 'Americano',
      price: 24,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
      category: 'sanduiches',
      description: 'Pão, hambúrguer, ovo, presunto, queijo, alface, tomate',
      addons: [
        { id: 'extra-cheese', name: 'Queijo Extra', price: 3.50 },
        { id: 'bacon', name: 'Bacon', price: 4.90 },
        { id: 'egg', name: 'Ovo', price: 2.50 },
      ]
    },
    {
      id: '2',
      name: 'Bauru',
      price: 42,
      image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=800',
      category: 'sanduiches',
      description: 'Pão, rosbife, queijo derretido, tomate, alface',
      addons: [
        { id: 'extra-cheese', name: 'Queijo Extra', price: 3.50 },
        { id: 'bacon', name: 'Bacon', price: 4.90 },
      ]
    },
    {
      id: '3',
      name: 'Filé de Carne',
      price: 30,
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=800',
      category: 'sanduiches',
      description: 'Pão, filé grelhado, queijo, alface, tomate',
      addons: [
        { id: 'extra-cheese', name: 'Queijo Extra', price: 3.50 },
        { id: 'bacon', name: 'Bacon', price: 4.90 },
        { id: 'onions', name: 'Cebola Caramelizada', price: 3.00 },
      ]
    },
    {
      id: '4',
      name: 'Filé de Frango',
      price: 27,
      image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&q=80&w=800',
      category: 'sanduiches',
      description: 'Pão, filé de frango grelhado, queijo, alface, tomate',
      addons: [
        { id: 'extra-cheese', name: 'Queijo Extra', price: 3.50 },
        { id: 'bacon', name: 'Bacon', price: 4.90 },
      ]
    },
    {
      id: '5',
      name: 'Misto Quente',
      price: 16,
      image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=800',
      category: 'sanduiches',
      description: 'Pão, presunto, queijo derretido',
      addons: [
        { id: 'extra-cheese', name: 'Queijo Extra', price: 3.50 },
        { id: 'bacon', name: 'Bacon', price: 4.90 },
      ]
    },
    {
      id: '6',
      name: 'Coxinha',
      price: 8,
      image: 'https://images.unsplash.com/photo-1601057956918-f854c2f61d86?auto=format&fit=crop&q=80&w=800',
      category: 'salgados',
      description: 'Massa crocante, recheio de frango',
      addons: [
        { id: 'catupiry', name: 'Catupiry', price: 2.00 },
      ]
    },
    {
      id: '7',
      name: 'Pastel de Carne',
      price: 9,
      image: 'https://images.unsplash.com/photo-1628863353691-0071c8c1874c?auto=format&fit=crop&q=80&w=800',
      category: 'salgados',
      description: 'Massa crocante, recheio de carne moída',
      addons: [
        { id: 'cheese', name: 'Queijo', price: 2.00 },
        { id: 'egg', name: 'Ovo', price: 2.50 },
      ]
    },
    {
      id: '8',
      name: 'Açaí 300ml',
      price: 15,
      image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=800',
      category: 'acai',
      description: 'Açaí cremoso, granola, banana',
      addons: [
        { id: 'granola', name: 'Granola Extra', price: 2.00 },
        { id: 'honey', name: 'Mel', price: 1.50 },
        { id: 'condensed-milk', name: 'Leite Condensado', price: 2.00 },
      ]
    },
    {
      id: '9',
      name: 'Açaí 500ml',
      price: 20,
      image: 'https://images.unsplash.com/photo-1590080876206-c48b4c7aea76?auto=format&fit=crop&q=80&w=800',
      category: 'acai',
      description: 'Açaí cremoso, granola, banana, leite condensado',
      addons: [
        { id: 'granola', name: 'Granola Extra', price: 2.00 },
        { id: 'honey', name: 'Mel', price: 1.50 },
        { id: 'condensed-milk', name: 'Leite Condensado Extra', price: 2.00 },
      ]
    }
  ];

  private static categories: Category[] = [
    {
      id: 'sanduiches',
      name: 'Sanduíches',
      icon: '🍔',
      color: '#4CAF50'
    },
    {
      id: 'salgados',
      name: 'Salgados',
      icon: '🥟',
      color: '#2196F3'
    },
    {
      id: 'acai',
      name: 'Açaí e Pitaya',
      icon: '🍇',
      color: '#9C27B0'
    }
  ];

  static getAllProducts(): Product[] {
    return this.products;
  }

  static getProductsByCategory(category: string): Product[] {
    return this.products.filter(product => product.category === category);
  }

  static getCategories(): Category[] {
    return this.categories;
  }

  static getProductById(id: string): Product | undefined {
    return this.products.find(product => product.id === id);
  }
}