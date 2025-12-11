// db.js
const Database = require('better-sqlite3');
const path = require('path');

// 1. 初始化数据库连接
const db = new Database(path.join(__dirname, 'inventory.sqlite'), { verbose: console.log });

// 2. 确保表存在
const createTableStmt = `
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL
    )
`;
db.exec(createTableStmt);
console.log('Database table "products" initialized.');

// 3. 导出连接对象供服务层使用
module.exports = db;