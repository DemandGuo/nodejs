// services/products.service.js

// 假设 db.js 就在父目录
const db = require('../db'); 

module.exports = {
    /**
     * C - 创建新产品
     * @param {string} name 
     * @param {number} price 
     * @returns {object} 包含 lastInsertRowid 的信息对象
     */
    add(name, price) {
        const stmt = db.prepare('INSERT INTO products (name, price) VALUES (?, ?)');
        // 返回 run() 的结果，方便路由层获取新 ID
        return stmt.run(name, price); 
    },

    /**
     * R - 获取所有产品
     */
    getAll() {
        const stmt = db.prepare('SELECT * FROM products');
        return stmt.all();
    },

    /**
     * R - 根据 ID 获取单个产品
     * @param {number} id 
     */
    getById(id) {
        const selectOneStmt = db.prepare('SELECT * FROM products WHERE id = ?');
        return selectOneStmt.get(id); // get() 返回单个对象或 undefined
    },

    /**
     * U - 更新产品
     * 修正：确保接收 name, price, id 三个参数
     */
    update(name, price, id) { 
        const updateStmt = db.prepare('UPDATE products SET name = ?, price = ? WHERE id = ?');
        // 参数顺序必须匹配 SQL 中的占位符顺序：name, price, id
        return updateStmt.run(name, price, id); 
    },

    /**
     * D - 删除产品
     * @param {number} id 
     */
    deleteById(id) {
        const deleteStmt = db.prepare('DELETE FROM products WHERE id = ?');
        return deleteStmt.run(id); // 返回 info 对象，包含 info.changes
    }
}