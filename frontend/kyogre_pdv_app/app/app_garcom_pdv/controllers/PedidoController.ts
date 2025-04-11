//PedidoCOntroller.ts

import { useAuth } from "../../../src/contexts/AuthContext";

// src/types/menu.ts
export interface Adicional {
  nome_adicional: string;
  preco: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  description: string;
  isAvailable: boolean;
  adicionais?: Adicional[]; //! Changed to an array of Adicional objects
  categoria?: string;
  url_imagem?: string;
  descricao?: string;
  disponivel?: boolean;
}

export interface Category {
  id: number;
  name: string;
  products: Product[];
}


export interface CartItem extends Product {
  quantity: number;
}

//! Exemplo de pedido que funciona enviando por servidor(tem que ser a risca)

// {
//   id: 1861,
//   nome_cliente: 'Pedro Victor',
//   telefone: '5521999289987',
//   endereco: 'Niterói',
//   complemento: 'Centro, perto do Plaza shopping',
//   forma_pagamento: 'Dinheiro',
//   status: 'em processo',
//   total_pagar: 96,
//   data_pedido: {
//     data: '06/03/2025',
//     hora: ' 03:08:19',
//   },
//   carrinho: [
//     {
//       quantidade: 1,
//       nome: 'Americano',
//       preco: 24,
//     },
//     {
//       quantidade: 1,
//       nome: 'Bauru',
//       preco: 42,
//     },
//     {
//       quantidade: 1,
//       nome: 'Filé de Carne',
//       preco: 30,
//     },
//   ],
// }



//! Interface aceito no banco de dados e api para funcionar o request POST
export interface PedidoMesa {
  id: number;
  nome_cliente: string;
  telefone: string;
  endereco: string
  complemento: string
  forma_pagamento?: 'dinheiro' | 'debito' | 'credito' | 'pix';
  status: 'em processo' | 'cozinha' | 'entrega' | 'finalizado';
  total_pagar: number;
  data_pedido: {
    data: string;
    hora: string;
  };
  carrinho: {
    quantidade: number;
    nome: string;
    preco: number;
  }[];
}
const { token } = useAuth();

class PedidoController {
  private static instance: PedidoController;
  private pedidos: PedidoMesa[] = [];

  private constructor() { }

  static getInstance(): PedidoController {
    if (!PedidoController.instance) {
      PedidoController.instance = new PedidoController();
    }
    return PedidoController.instance;
  }


  fazerPedido = async (pedidoData: PedidoMesa) => {
    console.log('Iniciando envio do pedido de teste...');
    console.log('Dados do pedido:', pedidoData);
    console.log('Token:', token);

    try {
      const resposta = await fetch('https://raichu-server.up.railway.app/api/pedidos/', {
        // Use 'http://docker-raichu/api/pedidos/' para teste local
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(pedidoData),
      });

      console.log('Resposta recebida:', resposta.status);

      if (resposta.ok) {
        const data = await resposta.json();
        console.log('Pedido criado com sucesso:', data);

        alert('Pedido enviado com sucesso!');
      } else {
        const erroTexto = await resposta.text();
        console.error('Erro ao criar pedido:', erroTexto);

        alert(`Erro ao criar pedido. Status: ${resposta.status}`);
      }
    } catch (error) {
      console.error('Exceção ao enviar requisição:', error);
 
      alert(`Erro ao enviar requisição: ${error}`);
    } finally {
    }
  };




  createPedido(pedido: Omit<PedidoMesa, 'id' | 'status' | 'endereco' | "telefone">): PedidoMesa {
    const newPedido: PedidoMesa = {
      ...pedido,
      id: Math.floor(Math.random() * 9000) + 1000,
      status: 'em processo',
      endereco: "Pedido no local",
      telefone: ""
    };

    this.pedidos.push(newPedido);
    this.savePedidos();
    return newPedido;
  }


  criarPedidoGroundon(pedido: Omit<PedidoMesa,  'status'  | "telefone">): PedidoMesa {

    const newPedido: PedidoMesa = {
      ...pedido,
      status: 'em processo',
      telefone: "telefone do cliente",
    };

    this.pedidos.push(newPedido);
    this.savePedidos();
    return newPedido;
  }

  getPedidos(): PedidoMesa[] {
    return this.pedidos;
  }

  getPedido(id: number): PedidoMesa | undefined {
    return this.pedidos.find(p => p.id === id);
  }

  updatePedidoStatus(id: number, status: PedidoMesa['status']): PedidoMesa | undefined {
    const pedido = this.pedidos.find(p => p.id === id);
    if (pedido) {
      pedido.status = status;
      this.savePedidos();
    }
    return pedido;
  }

  updatePaymentMethod(id: number, method: PedidoMesa['forma_pagamento']): PedidoMesa | undefined {
    const pedido = this.pedidos.find(p => p.id === id);
    if (pedido) {
      pedido.forma_pagamento = method;
      this.savePedidos();
    }
    return pedido;
  }

  private savePedidos(): void {
    localStorage.setItem('pedidos', JSON.stringify(this.pedidos));
  }

  loadPedidos(): void {
    const savedPedidos = localStorage.getItem('pedidos');
    if (savedPedidos) {
      this.pedidos = JSON.parse(savedPedidos);
      console.log(this.pedidos)
    }
  }
}

export default PedidoController;