/**
 * 核心依赖引入
 */
require('dotenv').config(); // 1. 必须放在最顶部，确保后续模块能读取到环境变量
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// 生产环境增强插件
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

// 数据库连接
const connectDB = require('./db.mongoose');

// 路由引入
const routerAuth = require('./routes/auth.route.js');
const routesProductsMongoose = require('./routes/products.mongoose.route.js');

/**
 * 初始化应用
 */
const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app); // 创建 HTTP Server 以支持 WebSocket

/**
 * 1. 安全与性能中间件 (Global Middlewares)
 */
app.use(helmet()); // 安全防护
app.use(compression()); // Gzip 压缩

// 日志记录：开发环境简洁，生产环境详细
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
} else {
    app.use(morgan('dev'));
}

/**
 * 2. 基础功能中间件
 */
app.use(express.json()); // 解析 JSON 请求体
app.use(express.static(path.join(__dirname, 'public'))); // 静态文件服务
// 在其他中间件之后，路由之前添加
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
/**
 * 3. 数据库连接初始化
 */
connectDB();
console.log('✅ MongoDB connection initialized.');

/**
 * 4. WebSocket (Socket.io) 配置
 */
const io = new Server(server, {
    cors: { origin: "*" } // 允许跨域
});

// 将 io 实例挂载到 app 对象，方便在路由中使用 req.app.get('io')
app.set('io', io);

io.on('connection', (socket) => {
    console.log(`👤 New User Connected: ${socket.id}`);
    
    socket.on('disconnect', () => {
        console.log(`👤 User Disconnected: ${socket.id}`);
    });
});

/**
 * 5. 业务路由定义
 */
app.use('/api/auth', routerAuth);
app.use('/api/products', routesProductsMongoose);

/**
 * 6. 全局错误处理中间件 (必须放在路由之后)
 */
const errorHandler = (err, req, res, next) => {
    console.error(`❌ Error: ${err.stack}`);
    const status = err.status || 500;
    res.status(status).json({
        success: false,
        error: err.message || 'Internal Server Error',
        // 生产环境下隐藏堆栈信息以保护服务器安全
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack 
    });
};
app.use(errorHandler);

/**
 * 7. 启动服务器
 */
server.listen(PORT, () => {
    const mode = process.env.NODE_ENV || 'development';
    console.log(`
==============================================
🚀 CRUD API Server is running!
----------------------------------------------
📍 Mode:    ${mode}
🔗 Local:   http://localhost:${PORT}
🔌 Socket:  Enabled
==============================================
    `);
});