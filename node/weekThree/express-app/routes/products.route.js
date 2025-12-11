// routes/products.route.js
const express = require('express');
const router = express.Router();
// 修正 1A: 统一导入变量名为 productsService
const productsService = require('../services/products.service'); 

// 路由级中间件：输入验证
const validateProductInput = (req, res, next) => {
    const { name, price } = req.body;
    const numericPrice = Number(price);
    
    // 基础验证逻辑
    if (!name || isNaN(numericPrice) || numericPrice <= 0) {
        const err = new Error('Validation failed: Name and positive price are required.');
        err.status = 400; // Bad Request
        return next(err);
    }
    next();
}

// --- CRUD 路由 ---

// C (Create) - 创建新产品
// 路由路径修正为 '/'，以便在 app.js 中挂载到 /api/products
router.post('/', validateProductInput, (req, res, next) => {
    try {
        const { name, price } = req.body;
        // 修正 1B: 捕获服务层返回的 info 对象
        const info = productsService.add(name, price); 
        
        // 使用 info.lastInsertRowid
        res.status(201).json({ 
            id: info.lastInsertRowid, 
            name, 
            price 
        });
    } catch (error) {
        // 将所有同步操作的错误传递给全局错误处理器
        next(error); 
    }
});

// R (Read All) - 读取所有产品
router.get('/', (req, res) => {
    const products = productsService.getAll();
    res.json({ list: products });
});

// R (Read One) - 读取单个产品
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const result = productsService.getById(id);
    if (result) {
        res.json(result);
    } else {
        res.status(404).json({ error: `Product with ID ${id} not found.` });
    }
});

// U (Update) - 更新单个产品
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;
    
    if (!name && !price) {
        return res.status(400).json({ error: 'At least one field (name or price) must be provided for update.' });
    }

    // 修正 2: 使用 update 函数名
    const info = productsService.update(name, price, id);
    
    if (info.changes > 0) {
        res.status(200).json({ message: `Product ${id} updated successfully` });
    } else {
        res.status(404).json({ error: `Product with ID ${id} not found or no changes made` });
    }
});

// D (Delete) - 删除单个产品
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    
    const info = productsService.deleteById(id);
    
    if (info.changes > 0) {
        res.status(204).end();
    } else {
        res.status(404).json({ error: `Product with ID ${id} not found.` });
    }
});

module.exports = router;