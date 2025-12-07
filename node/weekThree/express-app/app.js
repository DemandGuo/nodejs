const express = require('express');
const app = express();
const port = 3000;
// logger.js
const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} request to ${req.url}`);
    // 关键：调用 next() 将控制权交给下一个处理程序
    next();
};
// 使用：app.use(logger);
app.use(logger);

app.use(express.json());
// 1. POST 路由：创建产品
app.post('/api/products', (req, res) => {
    // 修正：使用 res.status(201).send(...) 确保设置了正确的 201 Created 状态码
    res.status(201).send({ "status": "Product created successfully" });
});

// 2. 动态 GET 路由：按 ID 获取产品
app.get('/api/products/:productId', (req, res) => {
    const productId = req.params.productId;
    console.log(`Requested Product ID: ${productId}`);

    // 返回 JSON 响应，回显请求的 ID
    res.send({
        "id": productId,
        "name": `Product ${productId}`,
        "description": "Sample data retrieved via dynamic route."
    });
});

// 3. 查询字符串 GET 路由：搜索
app.get('/api/search', (req, res) => {
    const query = req.query.q; // 获取 ?q= 的值
    console.log(`Received search query: ${query}`);

    // 返回纯文本，显示搜索关键词
    res.send(`Searching for: ${query || 'No keyword provided'}`);
});
app.post('/api/users', (req, res) => {
    res.status(201).send({ "status": "User received", "data": req.body });
});

// 启动服务器
app.listen(port, () => {
    console.log(`✅ Express server listening at http://localhost:${port}`);
    console.log(`   - Test POST: curl -X POST http://localhost:${port}/api/products`);
    console.log(`   - Test GET ID: http://localhost:${port}/api/products/123`);
    console.log(`   - Test GET Query: http://localhost:${port}/api/search?q=laptop`);
});