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

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    image_path TEXT NOT NULL
)`);

// GET endpoint to retrieve products
app.get('/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// POST endpoint to add a new product
app.post('/products', (req, res) => {
    const { name, price, image_path } = req.body;
    db.run(`INSERT INTO products (name, price, image_path) VALUES (?, ?, ?)`, [name, price, image_path], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, name, price, image_path });
    });
});

// api.js
const createProduct = async (name, price, imagePath) => {
    const response = await fetch("http://localhost:8000/products/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price,
        image_path: imagePath,
      }),
    });
  
    if (!response.ok) {
      throw new Error("Failed to create product");
    }
  
    const data = await response.json();
    return data;
  };

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    //iniciando...
    

});



//! npm install express sqlite3 body-parser cors