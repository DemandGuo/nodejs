// routes/products.mongoose.route.js (优化后)

const express = require('express');
const router = express.Router();
const productsService = require('../services/products.service.mongoose');
const { validate, schemas } = require('../middlewares/validator.middleware');

// --- 辅助函数：处理未找到资源 ---
function handleNotFound(product, res) {
    if (!product) {
        const err = new Error('Product not found');
        err.status = 404;
        throw err; // 抛出错误让 catch 块捕获并传递给 next(error)
    }
    return product;
}

// 获取所有产品
router.get('/', async (req, res, next) => {
    try {
        const products = await productsService.getAll();
        res.json(products);
    } catch (err) {
        next(err); // 将所有错误传递给中央处理器
    }
});

// 根据ID获取单个产品
router.get('/:id', async (req, res, next) => {
    try {
        const product = await productsService.getById(req.params.id);

        // Mongoose 返回 null 时，抛出 404 错误
        if (!product) {
            const err = new Error('Product not found');
            err.status = 404;
            return next(err);
        }

        res.json(product);
    } catch (err) {
        // Mongoose 可能会因为 ID 格式错误抛出 CastError，中央处理器应处理
        next(err);
    }
});

// 创建新产品
router.post('/', validate(schemas.productCreate), async (req, res, next) => {
    try {
        const io = req.app.get('io');
        const newProduct = await productsService.create(req.body, io);
        res.status(201).json(newProduct);
    } catch (err) {
        // Mongoose 验证失败 (Validation Error) 会在这里被捕获
        err.status = 400; // 假设所有创建失败都是客户端输入错误
        next(err);
    }
});

// 更新产品
router.put('/:id', async (req, res, next) => {
    try {
        const io = req.app.get('io');
        const updatedProduct = await productsService.update(req.params.id, req.body, io);

        if (!updatedProduct) {
            const err = new Error('Product not found');
            err.status = 404;
            return next(err);
        }

        res.json(updatedProduct); // 返回更新后的资源
    } catch (err) {
        err.status = 400; // 假设更新失败可能是验证错误或 ID 格式错误
        next(err);
    }
});


// 删除产品
router.delete('/:id', async (req, res, next) => {
    try {
        const io = req.app.get('io');
        const deletedProduct = await productsService.remove(req.params.id, io);

        // Mongoose deleteOne/findByIdAndDelete 返回 null 或操作结果
        if (!deletedProduct) {
            const err = new Error('Product not found');
            err.status = 404;
            return next(err);
        }

        // 204 No Content 是删除成功的标准响应
        res.status(204).end();
    } catch (err) {
        next(err); // 将错误传递给中央处理器
    }
});

// PATCH /api/products/:id/stock
router.patch('/:id/stock', validate(schemas.stockUpdate), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;
        const io = req.app.get('io');
        const updated = await productsService.updateStock(id, stock, io);
        if (!updated) {
            return res.status(404).json({ error: '未找到该产品' });
        }
        res.json(updated);
    } catch (err) {
        next(err);
    }
});

module.exports = router;