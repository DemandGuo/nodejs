const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
// 如果 db.sqlite 文件不存在，它会自动创建
const db = new Database(path.join(__dirname, 'inventory.sqlite'), { verbose: console.log });

const app = express();
const PORT = 3000;

app.use(express.json());

// SQL 语句，使用 IF NOT EXISTS 避免重复创建时报错
const createTableStmt = `
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL
    )
`;
// 使用 db.exec() 执行不需要返回结果的 SQL 语句
db.exec(createTableStmt);
console.log('Database table "products" initialized.');
process.on('exit', () => db.close());
app.get('/products', (req, res) => {
    const stmt = db.prepare('SELECT * FROM products');
    const products = stmt.all();
    res.json({ "list": products });
});

app.post('/products', (req, res) => {
    const { name, price } = req.body;
    const numericPrice = Number(price);
    if (!name || typeof name !== 'string' || isNaN(numericPrice) || numericPrice <= 0) {
        return res.status(400).json({ error: 'Invalid input: name must be provided and price must be a positive number.' });
    }
    const stmt = db.prepare('INSERT INTO products (name, price) VALUES (?, ?)');
    const info = stmt.run(name, price);
    res.status(201).json({ "data": { id: info.lastInsertRowid, name, price } });

});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});