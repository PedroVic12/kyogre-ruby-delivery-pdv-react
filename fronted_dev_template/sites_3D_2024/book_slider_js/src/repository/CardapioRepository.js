// Modelo para itens do cardápio
class CardapioModel {
  constructor(id, nome, categoria, descricao, preco, imagem, pagina) {
    this.id = id;
    this.nome = nome;
    this.categoria = categoria;
    this.descricao = descricao;
    this.preco = preco;
    this.imagem = imagem;
    this.pagina = pagina; // Página do cardápio onde aparece
  }
}

// Repositório com dados do cardápio
class CardapioRepository {
  constructor() {
    this.items = [
      // Pizzas - Páginas 1-2
      new CardapioModel(
        1,
        "Pizza Margherita",
        "pizzas",
        "Molho de tomate, mussarela, manjericão fresco e azeite",
        49.90,
        "cardapio_1",
        1
      ),
      new CardapioModel(
        2,
        "Pizza Pepperoni",
        "pizzas",
        "Molho de tomate, mussarela, pepperoni importado",
        54.90,
        "cardapio_1",
        1
      ),
      new CardapioModel(
        3,
        "Pizza 4 Queijos",
        "pizzas",
        "Mussarela, parmesão, gorgonzola e catupiry",
        56.90,
        "cardapio_1",
        1
      ),

      // Hambúrgueres - Páginas 3-4
      new CardapioModel(
        4,
        "Classic Burger",
        "hamburgueres",
        "Pão brioche, 180g de blend bovino, queijo cheddar, alface, tomate e molho especial",
        32.90,
        "cardapio_2",
        2
      ),
      new CardapioModel(
        5,
        "Cheese Bacon",
        "hamburgueres",
        "Pão brioche, 180g de blend bovino, queijo cheddar, bacon crocante e molho especial",
        36.90,
        "cardapio_2",
        2
      ),
      new CardapioModel(
        6,
        "Mega Burger",
        "hamburgueres",
        "Pão brioche, duplo blend bovino (360g), duplo queijo, bacon, cebola caramelizada",
        46.90,
        "cardapio_2",
        2
      ),

      // Bebidas - Páginas 5-6
      new CardapioModel(
        7,
        "Refrigerante",
        "bebidas",
        "Coca-Cola, Guaraná ou Sprite (350ml)",
        6.90,
        "cardapio_3",
        3
      ),
      new CardapioModel(
        8,
        "Suco Natural",
        "bebidas",
        "Laranja, Limão, Maracujá ou Abacaxi (500ml)",
        9.90,
        "cardapio_3",
        3
      ),
      new CardapioModel(
        9,
        "Cerveja Artesanal",
        "bebidas",
        "IPA, Pilsen ou Weiss (500ml)",
        18.90,
        "cardapio_3",
        3
      ),
    ];
  }

  // Retorna todos os itens
  getAll() {
    return this.items;
  }

  // Retorna itens por categoria
  getByCategoria(categoria) {
    return this.items.filter(item => item.categoria === categoria);
  }

  // Retorna itens por página
  getByPagina(pagina) {
    return this.items.filter(item => item.pagina === pagina);
  }

  // Retorna item por ID
  getById(id) {
    return this.items.find(item => item.id === id);
  }
}

export const cardapioRepository = new CardapioRepository();
