// db-promise.js
import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件目录（ES Module 中 __dirname 不存在）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 数据库文件路径
const dbPath = path.join(__dirname, 'data', 'app.db');

// 创建数据库连接
const db = new sqlite3.Database(dbPath);

// 将 db.run, db.get, db.all 转为 Promise 风格
const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this); // this 包含 lastID, changes 等
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// 初始化数据库表
export async function initDb() {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await run('DELETE FROM users'); // 清空数据
  console.log('✅ 数据库表已初始化');
}

// 添加用户
export async function addUser(name, email) {
  try {
    const info = await run(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    return {
      id: info.lastID,
      name,
      email,
    };
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw new Error('❌ 邮箱已存在，请使用其他邮箱');
    }
    throw err;
  }
}

// 获取所有用户
export async function getAllUsers() {
  return await all('SELECT * FROM users ORDER BY id DESC');
}

// 根据 ID 查找用户
export async function getUserById(id) {
  const row = await get('SELECT * FROM users WHERE id = ?', [id]);
  return row || null;
}

// 更新用户
export async function updateUser(id, name, email) {
  try {
    const info = await run(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, id]
    );
    return info.changes > 0;
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw new Error('❌ 邮箱已被其他用户使用');
    }
    throw err;
  }
}

// 删除用户
export async function deleteUser(id) {
  const info = await run('DELETE FROM users WHERE id = ?', [id]);
  return info.changes > 0;
}

// 关闭数据库连接（可选）
export function closeDb() {
  db.close();
}