const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 1998;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database('./menu.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the menu database.');
});

// Create table if not exists for orders
db.run(`CREATE TABLE IF NOT EXISTS orders (
    id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT NOT NULL,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    endereco TEXT NOT NULL,
    complemento TEXT,
    formaPagamento TEXT NOT NULL,
    status TEXT NOT NULL,
    totalPagar REAL NOT NULL
)`);

// GET endpoint to retrieve all orders
app.get('/orders', (req, res) => {
    db.all('SELECT * FROM orders', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// POST endpoint to create a new order
app.post('/orders', (req, res) => {
    const { data, nome, telefone, endereco, complemento, formaPagamento, status, totalPagar } = req.body;
    db.run(`INSERT INTO orders (data, nome, telefone, endereco, complemento, formaPagamento, status, totalPagar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
    [data, nome, telefone, endereco, complemento, formaPagamento, status, totalPagar], 
    function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id_pedido: this.lastID, data, nome, telefone, endereco, complemento, formaPagamento, status, totalPagar });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});