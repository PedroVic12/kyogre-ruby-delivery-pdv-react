import React, { useState, useEffect } from 'react';

// Main App Component
function App() {
    // State for transactions, initialized from local storage or empty array
    const [transactions, setTransactions] = useState(() => {
        const localData = localStorage.getItem('transactions');
        return localData ? JSON.parse(localData) : [];
    });

    // State for form inputs
    const [text, setText] = useState('');
    const [amount, setAmount] = useState(''); // Keep amount as string for input control

    // Save transactions to local storage whenever they change
    useEffect(() => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }, [transactions]);

    // Calculate total income
    const income = transactions
        .filter(item => item.amount > 0)
        .reduce((acc, item) => (acc += item.amount), 0)
        .toFixed(2);

    // Calculate total expense
    const expense = (
        transactions
            .filter(item => item.amount < 0)
            .reduce((acc, item) => (acc += item.amount), 0) * -1 // Multiply by -1 to make it positive for display
    ).toFixed(2);

    // Calculate total balance
    const total = transactions
        .reduce((acc, item) => (acc += item.amount), 0)
        .toFixed(2);

    // Generate unique ID for new transactions
    const generateID = () => {
        return Math.floor(Math.random() * 100000000);
    }

    // Add new transaction
    const addTransaction = (e) => {
        e.preventDefault(); // Prevent form submission reload

        // Basic validation
        if (text.trim() === '' || amount.trim() === '') {
            alert('Por favor, adicione um texto e uma quantidade.'); // Simple alert, consider a more integrated message system
            return;
        }

        // Convert amount to number, handle potential NaN
        const numericAmount = +amount; // Unary plus operator for conversion
        if (isNaN(numericAmount)) {
            alert('Por favor, insira um número válido para a quantidade.');
            return;
        }


        const newTransaction = {
            id: generateID(),
            text: text,
            amount: numericAmount // Use the converted numeric amount
        };

        setTransactions(prevTransactions => [newTransaction, ...prevTransactions]); // Add to the beginning of the list

        // Clear form inputs
        setText('');
        setAmount('');
    };

    // Delete transaction by ID
    const deleteTransaction = (id) => {
        setTransactions(prevTransactions =>
            prevTransactions.filter(transaction => transaction.id !== id)
        );
    };

    // Format number as currency (Brazilian Real)
    const formatCurrency = (num) => {
        return `R$ ${Number(num).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    return (
        // Main container with background, text color, layout, and font settings
        <div className="bg-gray-800 text-white flex flex-col items-center justify-start min-h-screen font-['Lato',_sans-serif] text-lg py-10 px-4">
            {/* App title */}
            <h1 className="text-3xl tracking-wide mb-8 text-center font-semibold">Gestor de Orçamento</h1>

            {/* Balance Display Component */}
            <div className="container mx-auto my-4 w-full max-w-md">
                <h4 className="m-0 uppercase font-medium text-center text-xl">Seu Balanço</h4>
                {/* Display total balance */}
                <h1 id="balanco" className="text-4xl tracking-wide my-2 text-center font-bold">
                    {formatCurrency(total)}
                </h1>

                {/* Income/Expense Container */}
                <div className="bg-white shadow-md p-5 flex justify-between my-5 rounded-md text-black">
                    {/* Income Section */}
                    <div className="flex-1 text-center border-r border-gray-300">
                        <h4 className="m-0 uppercase font-medium">Ganhos</h4>
                        {/* Display total income */}
                        <p id="dinheiro-mais" className="text-xl tracking-wide my-1.5 text-green-600 font-semibold">
                            + {formatCurrency(income)}
                        </p>
                    </div>
                    {/* Expense Section */}
                    <div className="flex-1 text-center">
                        <h4 className="m-0 uppercase font-medium">Despesas</h4>
                        {/* Display total expenses */}
                        <p id="dinheiro-menos" className="text-xl tracking-wide my-1.5 text-red-600 font-semibold">
                            - {formatCurrency(expense)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Transaction History and Form Component */}
            <div className="container mx-auto my-4 w-full max-w-md">
                {/* History Title */}
                <h3 className="border-b border-gray-400 pb-2.5 mt-10 mb-4 text-xl font-semibold">Histórico</h3>
                {/* Transaction List */}
                <ul id="lista" className="list-none p-0 mb-10">
                    {/* Map through transactions and render each one */}
                    {transactions.map(transaction => (
                        <li
                            key={transaction.id}
                            // Apply conditional styling based on amount (income/expense)
                            // Add 'group' class for hover effect on delete button
                            className={`group bg-white shadow-md text-gray-700 flex justify-between relative p-2.5 my-2.5 rounded-md ${transaction.amount < 0 ? 'border-r-4 border-red-600' : 'border-r-4 border-green-600'
                                }`}
                        >
                            {/* Transaction text */}
                            {transaction.text}
                            {/* Transaction amount */}
                            <span>
                                {transaction.amount < 0 ? '-' : '+'}
                                {formatCurrency(Math.abs(transaction.amount))}
                            </span>
                            {/* Delete Button */}
                            <button
                                onClick={() => deleteTransaction(transaction.id)}
                                // Styling for delete button, appears on hover over the list item ('group-hover')
                                className="cursor-pointer bg-red-600 border-0 text-white text-lg leading-5 px-2 py-0.5 absolute top-1/2 left-0 transform -translate-x-full -translate-y-1/2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300 ease-in-out rounded-l-md focus:outline-none"
                                aria-label={`Apagar ${transaction.text}`} // Accessibility label
                            >
                                x
                            </button>
                        </li>
                    ))}
                    {/* Show message if no transactions */}
                    {transactions.length === 0 && (
                        <li className="bg-white shadow-md text-gray-500 p-2.5 my-2.5 rounded-md text-center">Nenhuma transação adicionada ainda.</li>
                    )}
                </ul>

                {/* Add Transaction Title */}
                <h3 className="border-b border-gray-400 pb-2.5 mt-10 mb-4 text-xl font-semibold">Adicionar nova transação</h3>
                {/* Add Transaction Form */}
                <form id="formulario" onSubmit={addTransaction}>
                    {/* Text Input Field */}
                    <div className="mb-3">
                        <label htmlFor="texto" className="inline-block my-2.5 font-medium">Texto</label>
                        <input
                            type="text"
                            id="texto"
                            value={text}
                            // Update text state on change
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Escreva o texto..."
                            // Styling for text input
                            className="border border-gray-300 rounded-sm block text-base p-2.5 w-full text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            required // HTML5 validation
                        />
                    </div>
                    {/* Amount Input Field */}
                    <div className="mb-3">
                        <label htmlFor="quantidade" className="inline-block my-2.5 font-medium">
                            Quantidade <br /> (negativo - despesa, positivo - ganho)
                        </label>
                        <input
                            type="number" // Use type="number" for better mobile UX and validation
                            id="quantidade"
                            value={amount}
                            // Update amount state on change
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Insira quantidade..."
                            // Styling for amount input
                            className="border border-gray-300 rounded-sm block text-base p-2.5 w-full text-black focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            step="0.01" // Allow decimal inputs
                            required // HTML5 validation
                        />
                    </div>
                    {/* Submit Button */}
                    <button
                        type="submit" // Ensure button type is submit for form handling
                        // Styling for submit button
                        className="cursor-pointer bg-yellow-600 shadow-md text-white border-0 block text-base mt-4 mb-8 p-2.5 w-full rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-150 ease-in-out font-semibold"
                    >
                        Adicionar transação
                    </button>
                </form>
            </div>
        </div>
    );
}

// Export the main App component
export default App;
