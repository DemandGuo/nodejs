// db.js
const sqlite3 = require('sqlite3').verbose();
const { promisify } = require('util');
const path = require('path');
const dbPath = path.join(__dirname, 'data', 'app.db');
const db = new sqlite3.Database(dbPath);

// 将 db.run、db.get、db.all 转为 Promise 风格
const run = promisify(db.run).bind(db);
const get = promisify(db.get).bind(db);
const all = promisify(db.all).bind(db);

// 初始化表
async function initDb() {
    await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function addUser(name, email) {
    try {
        const result = await run(
            'INSERT INTO users (name, email) VALUES (?, ?)',
            [name, email]  // 参数化查询，? 占位符
        );
        return { id: result.lastID, name, email };
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            throw new Error('❌ 邮箱已存在');
        }
        throw err;
    }
}

// 获取所有用户
async function getAllUsers() {
    return await all('SELECT * FROM users ORDER BY id DESC');
}

// 根据 ID 查找用户
async function getUserById(id) {
    return await get('SELECT * FROM users WHERE id = ?', [id]);
}

// 更新用户
async function updateUser(id, name, email) {
    try {
        const result = await run(
            'UPDATE users SET name = ?, email = ? WHERE id = ?',
            [name, email, id]
        );
        return result.changes > 0;
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            throw new Error('❌ 邮箱已被其他用户使用');
        }
        throw err;
    }
}

// 删除用户
async function deleteUser(id) {
    const result = await run('DELETE FROM users WHERE id = ?', [id]);
    return result.changes > 0;
}
module.exports = {
    initDb,
    addUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};