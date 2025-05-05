import React, { useState, useEffect } from 'react';
// Certifique-se de que este ficheiro CSS existe e contém o seu CSS original
//import './App.css';

// Componente Principal da Aplicação
function App() {
    // Estado para as transações, inicializado a partir do localStorage ou array vazio
    const [transactions, setTransactions] = useState(() => {
        const localData = localStorage.getItem('transactions');
        return localData ? JSON.parse(localData) : [];
    });

    // Estado para os inputs do formulário
    const [text, setText] = useState('');
    const [amount, setAmount] = useState(''); // Manter como string para controlo do input

    // Guardar transações no localStorage sempre que mudam
    useEffect(() => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }, [transactions]);

    // Calcular o total de ganhos
    const income = transactions
        .filter(item => item.amount > 0)
        .reduce((acc, item) => (acc += item.amount), 0)
        .toFixed(2);

    // Calcular o total de despesas
    const expense = (
        transactions
            .filter(item => item.amount < 0)
            .reduce((acc, item) => (acc += item.amount), 0) * -1 // Multiplicar por -1 para mostrar como positivo
    ).toFixed(2);

    // Calcular o balanço total
    const total = transactions
        .reduce((acc, item) => (acc += item.amount), 0)
        .toFixed(2);

    // Gerar ID único para novas transações
    const generateID = () => {
        // Gerador de ID simples (considerar solução mais robusta para produção)
        return Math.floor(Math.random() * 100000000);
    }

    // Adicionar nova transação
    const addTransaction = (e) => {
        e.preventDefault(); // Prevenir recarregamento da página ao submeter formulário

        // Validação básica
        if (text.trim() === '' || amount.trim() === '') {
            // Usar alert para simplicidade, substituir por melhor sistema de notificação se necessário
            alert('Por favor, adicione um texto e uma quantidade.');
            return;
        }

        // Converter quantidade para número, tratar potencial NaN
        const numericAmount = +amount; // Operador unário + para conversão
        if (isNaN(numericAmount)) {
            alert('Por favor, insira um número válido para a quantidade.');
            return;
        }

        const newTransaction = {
            id: generateID(),
            text: text,
            amount: numericAmount // Usar a quantidade numérica convertida
        };

        // Adicionar nova transação ao início da lista
        setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);

        // Limpar inputs do formulário
        setText('');
        setAmount('');
    };

    // Apagar transação por ID
    const deleteTransaction = (id) => {
        setTransactions(prevTransactions =>
            prevTransactions.filter(transaction => transaction.id !== id)
        );
    };

    // Formatar número como moeda (Real Brasileiro - BRL) - Ajustar se necessário
    const formatCurrency = (num) => {
        // Formatação básica, ajustar locale e opções conforme necessário
        // Usar prefixo R$ conforme dicas do contexto CSS original
        const formattedNum = Math.abs(Number(num)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return `R$ ${formattedNum}`;
    }

    // Determinar sinal para exibição
    const sign = (num) => (Number(num) < 0 ? '-' : '+');


    return (
        // A lógica do container principal é tratada pelos estilos do body no seu CSS
        // Envolvemos o conteúdo em fragmentos ou divs mínimas se necessário
        <>
            <h1>Gestor de Orçamento</h1>

            {/* Área do Componente de Exibição do Balanço */}
            <div className="container">
                <h4>Balanço</h4>
                {/* Exibir balanço total */}
                <h1 id="balanco">
                    {/* Exibir sinal com base no total, formatar moeda */}
                    {Number(total) < 0 ? '-' : ''}{formatCurrency(total)}
                </h1>

                {/* Container de Ganhos/Despesas */}
                <div className="container-ganhos-despesas">
                    {/* Secção de Ganhos */}
                    <div>
                        <h4>Ganhos</h4>
                        {/* Exibir total de ganhos */}
                        <p id="dinheiro-mais" className="dinheiro mais">
                            + {formatCurrency(income)}
                        </p>
                    </div>
                    {/* Secção de Despesas */}
                    <div>
                        <h4>Despesas</h4>
                        {/* Exibir total de despesas */}
                        <p id="dinheiro-menos" className="dinheiro menos">
                            - {formatCurrency(expense)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Área do Histórico de Transações e Formulário */}
            <div className="container"> {/* Assumindo que histórico/formulário também estão dentro de um .container */}
                {/* Título do Histórico */}
                <h3>Histórico</h3>
                {/* Lista de Transações */}
                {/* Nota: A classe 'lista' é aplicada diretamente aqui */}
                <ul id="lista" className="lista">
                    {/* Mapear transações e renderizar cada uma */}
                    {transactions.map(transaction => (
                        // Aplicar classe condicional 'mais' ou 'menos' com base na quantidade
                        <li key={transaction.id} className={transaction.amount < 0 ? 'menos' : 'mais'}>
                            {/* Texto da transação */}
                            {transaction.text}
                            {/* Quantidade da transação com sinal */}
                            <span>{sign(transaction.amount)}{formatCurrency(transaction.amount)}</span>
                            {/* Botão Apagar */}
                            <button
                                onClick={() => deleteTransaction(transaction.id)}
                                className="botao-apagar" // Usar a classe CSS para o botão apagar
                                aria-label={`Apagar ${transaction.text}`} // Etiqueta de acessibilidade
                            >
                                x
                            </button>
                        </li>
                    ))}
                    {/* Mostrar mensagem se não houver transações */}
                    {transactions.length === 0 && (
                        <li className="sem-transacoes"> {/* Adicionada classe para estilo potencial */}
                            Nenhuma transação adicionada ainda.
                        </li>
                    )}
                </ul>

                {/* Título Adicionar Nova Transação */}
                <h3>Adicionar nova transação</h3>
                {/* Formulário Adicionar Transação */}
                <form id="formulario" onSubmit={addTransaction}>
                    {/* Campo Input Texto */}
                    <div className="form-control"> {/* Usar a classe CSS */}
                        <label htmlFor="texto">Texto</label>
                        <input
                            type="text"
                            id="texto"
                            value={text}
                            // Atualizar estado do texto ao mudar
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Escreva o texto..."
                            required // Validação HTML5
                        />
                    </div>
                    {/* Campo Input Quantidade */}
                    <div className="form-control"> {/* Usar a classe CSS */}
                        <label htmlFor="quantidade">
                            Quantidade <br /> (negativo - despesa, positivo - ganho)
                        </label>
                        <input
                            // Usar type="number" é geralmente melhor para input numérico
                            // mas mantido como text para corresponder exatamente ao original se necessário.
                            // Considerar mudar de volta para type="number" com step="0.01"
                            type="text" // Mudar para "number" se preferir validação numérica do browser
                            inputMode="decimal" // Dica para teclados móveis
                            id="quantidade"
                            value={amount}
                            // Atualizar estado da quantidade ao mudar
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Insira quantidade..."
                            required // Validação HTML5
                        />
                    </div>
                    {/* Botão Submeter */}
                    <button
                        type="submit" // Garantir que o tipo do botão é submit para o formulário
                        className="botao" // Usar a classe CSS
                    >
                        Adicionar transação
                    </button>
                </form>
            </div>
        </>
    );
}

// Exportar o componente principal App
export default App;
