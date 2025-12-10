const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'inventory.sqlite'), { verbose: console.log });

const app = express();
const PORT = 3000;

app.use(express.json());

// 数据库初始化和关闭 (保持不变)
const createTableStmt = `
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL
    )
`;
db.exec(createTableStmt);
console.log('Database table "products" initialized.');
process.on('exit', () => db.close());
// 注意：在生产环境中，错误处理应更健壮，并确保在致命错误时关闭 DB

// 
const validateProductInput = (req, res, next) => {
    const { name, price } = req.body;
    const numericPrice = Number(price);
    if (!name || isNaN(numericPrice) || numericPrice <= 0) {
        // 如果验证失败，创建一个错误对象并传递给中央错误处理器
        const err = new Error('Validation failed: Name and positive price are required.');
        err.status = 400; // Bad Request
        return next(err);
    }
    // 验证成功，继续执行下一个处理器（即路由函数）
    next();
}
// --- CRUD 路由定义 ---

// C (Create) - 创建新产品
app.post('/api/products', validateProductInput, (req, res) => {
    try {
        const { name, price } = req.body;
        const stmt = db.prepare('INSERT INTO products (name, price) VALUES (?, ?)');
        const info = stmt.run(name, price);
        res.status(201).json({ id: info.lastInsertRowid, name, price });
    } catch (error) {
        next(error); // 将错误传递给中央错误处理器
    }
});

// R (Read All) - 读取所有产品
app.get('/api/products', (req, res) => {
    const stmt = db.prepare('SELECT * FROM products');
    const products = stmt.all();
    res.json({ list: products });
});

// R (Read One) - 读取单个产品
app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const selectOneStmt = db.prepare('SELECT * FROM products WHERE id = ?');
    const result = selectOneStmt.get(id);

    if (result) {
        res.json(result);
    } else {
        res.status(404).json({ error: `Product with ID ${id} not found.` });
    }
});

// U (Update) - 更新单个产品
app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;

    // 基础验证（生产环境中应更全面）
    if (!name && !price) {
        return res.status(400).json({ error: 'At least one field (name or price) must be provided for update.' });
    }

    const updateStmt = db.prepare('UPDATE products SET name = ?, price = ? WHERE id = ?');
    // 使用 name 和 price 的当前值（确保它们要么是有效值，要么是数据库中的旧值，这里简化为只传新值）
    const info = updateStmt.run(name, price, id);

    if (info.changes > 0) {
        res.status(200).json({ message: `Product ${id} updated successfully` });
    } else {
        // ID 不存在或传入的数据与现有数据相同
        res.status(404).json({ error: `Product with ID ${id} not found.` });
    }
});

// D (Delete) - 删除单个产品
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;

    const deleteStmt = db.prepare('DELETE FROM products WHERE id = ?');
    const info = deleteStmt.run(id);

    if (info.changes > 0) {
        // 修正：204 No Content，不带响应体
        res.status(204).end();
    } else {
        res.status(404).json({ error: `Product with ID ${id} not found.` });
    }
});
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal Server Error' });
}
app.use(errorHandler);
// --- 启动服务器 ---
app.listen(PORT, () => {
    console.log(`\n==============================================`);
    console.log(`🚀 CRUD API Server is running!`);
    console.log(`Local: http://localhost:${PORT}`);
    console.log(`==============================================`);
    console.log(`Test Endpoints:`);
    console.log(`  GET All:    /api/products`);
    console.log(`  GET One:    /api/products/1`);
    console.log(`  POST/PUT/DELETE: /api/products/:id`);
    console.log(`==============================================\n`);
});