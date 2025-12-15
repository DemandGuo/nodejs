const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../db');
const secretKey = process.env.JWT_SECRET;

module.exports = {
    /**
     * 用户注册 
     * @param {string} username 
     * @param {string} password 
     */
    async register(username, password) {
        // 检查用户名是否已存在
        const existingUserStmt = db.prepare('SELECT * FROM users WHERE username = ?');
        const existingUser = existingUserStmt.get(username);
        if (existingUser) {
            throw new Error('Username already exists');
        }
        // 哈希密码
        const hashedPassword = await bcrypt.hash(password, 10);
        // 插入新用户
        const insertUserStmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
        const info = insertUserStmt.run(username, hashedPassword);
        return { id: info.lastInsertRowid, username };
    },

    /**
     * 根据用户名查找用户
     * @param {string} username
     * @return {object|null} 用户对象或 null
     */
    getByUsername(username) {
        const getUserStmt = db.prepare('SELECT * FROM users WHERE username = ?');
        return getUserStmt.get(username);
    },

    async login(username, password) {
        // 待实现的登录逻辑
        const user =  this.getByUsername(username);
        if (!user) {
            throw new Error('Invalid username or password');
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error('Invalid username or password');
        }
        return jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '2h' });
    }
}