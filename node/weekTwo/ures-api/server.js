import express from 'express'
import { fileURLToPath } from 'url';
import path from 'path';
import { initDb } from './db-promise.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());
// 路由
import usersRouter from './routes/users.js';
app.use('/api/users', usersRouter);

// 根路径欢迎页
app.get('/', (req, res) => {
    res.send(`
    <h1>🎉 用户管理 API 运行中</h1>
    <p>访问 <a href="/api/users">/api/users</a> 查看用户列表</p>
    <p>文档：GET /api/users?page=1&limit=5</p>
  `);
});

// 统一错误处理中间件
app.use((err, req, res, next) => {
    console.error('❌ 服务器错误:', err.stack);
    res.status(500).json({ error: '服务器内部错误', details: err.message });
});

// 404 处理
app.use((req, res) => {
    res.status(404).json({ error: '接口不存在' });
});

// 启动服务器
async function startServer() {
    try {
        await initDb(); // 初始化数据库
        app.listen(PORT, () => {
            console.log(`✅ 服务器运行在 http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ 启动失败:', err.message);
    }
}
startServer();