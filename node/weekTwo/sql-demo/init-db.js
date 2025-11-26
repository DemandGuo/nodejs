const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

// 数据库文件路径
const dbPath = path.join(__dirname, 'data', 'app.db');

// 确保 data 目录存在
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('📁 已创建 data 目录');
}

console.log('数据库路径:', dbPath); // 调试用

// 打开数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ 数据库连接失败:', err.message);
        return;
    }
    console.log('✅ 成功连接到 SQLite 数据库');

    // 执行 SQL（建表）
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
        if (err) {
            console.error('❌ 建表失败:', err.message);
        } else {
            console.log('✅ 表 users 创建成功或已存在');
        }

        // 关闭连接
        db.close((closeErr) => {
            if (closeErr) {
                console.error('关闭连接时出错:', closeErr.message);
            } else {
                console.log('🔚 数据库连接已关闭');
            }
        });
    });
});