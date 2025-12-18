const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const db = require('./db');
const app = express();
const PORT = 3000;

// const router = require('./routes/products.route.js');
const routerAuth = require('./routes/auth.route.js');
const routesProductsMongoose = require('./routes/products.mongoose.route.js');

const connectDB = require('./db.mongoose');
connectDB();

// --- 启动服务器 ---
const server = http.createServer(app); // 用 app 创建 HTTP 服务器
const io = new Server(server, {
    cors: { origin: "*" } // 允许跨域连接
});
app.set('io', io);
io.on('connection', (socket) => {
    console.log('A user connected via WebSocket:', socket.id);
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// 中间件配置
require('dotenv').config({
    path: path.resolve(__dirname, './.env')
});
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// 数据库初始化和关闭 (保持不变)

console.log('Database table "products" initialized.');
// process.on('exit', () => db.close());
// 注意：在生产环境中，错误处理应更健壮，并确保在致命错误时关闭 DB
const authMiddleware = require('./middlewares/auth.middleware');
// app.use(authMiddleware);
// 

// --- CRUD 路由定义 ---
app.use('/api/auth', routerAuth);
// app.use('/api/products', authMiddleware, router);
// 选择使用 Mongoose 版本的路由
app.use('/api/products', routesProductsMongoose);


const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal Server Error' });
}
app.use(errorHandler);

// server.listen(PORT);
// app.listen(PORT);

server.listen(PORT, () => {
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