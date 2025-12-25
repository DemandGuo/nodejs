const Product = require('../models/Product');
const Log = require('../models/log.model');
const redisClient = require('../utils/redis');
const sharp = require('sharp');
const path = require('path');
const Category = require('../models/Category');
const ImageServer = require('./image.service')
const logService = require('./log.service'); // 引入日志服务
const eventBus = require('../events/eventBus');
// 定义全局上传根目录
const UPLOAD_ROOT = path.join(process.cwd(), 'uploads');
module.exports = {
    async getAll() {
        const cacheKey = 'all_products';
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log('从 Redis 缓存中获取产品列表');
            return JSON.parse(cachedData);
        }
        console.log('从数据库中获取产品列表');
        const products = await Product.find();
        await redisClient.set(cacheKey, JSON.stringify(products), { EX: 3600 }); // 缓存 3600 秒
        return products;
    },

    async getById(id) {
        return await Product.findById(id);
    },

    // 重点修改：传入 io 对象进行实时推送
    async create(data, io) {
        // 1. 操作第一张表：创建产品
        const newProduct = new Product(data);
        const savedProduct = await newProduct.save();
        eventBus.emit('PRODUCT_CREATED', { product: savedProduct, io });
        return savedProduct;
    },

    async update(id, data, io) {
        const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });

        if (updatedProduct) {
            // 更新时也记录日志
            await Log.create({
                action: 'UPDATE',
                targetId: id,
                message: `更新了产品信息: ${updatedProduct.name}`
            });

            if (io) io.emit('product_updated', updatedProduct);
        }
        // 只要数据变了，就立刻删除缓存
        await redisClient.del('all_products');
        return updatedProduct;
    },

    async remove(id, io) {
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (deletedProduct) {
            // 删除时记录日志
            await Log.create({
                action: 'DELETE',
                targetId: id,
                message: `删除了产品: ${deletedProduct.name}`
            });

            if (io) io.emit('product_deleted', { id });
        }
        // 只要数据变了，就立刻删除缓存
        await redisClient.del('all_products');
        return deletedProduct;
    },
    async updateStock(id, newStock, io) {
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: id, stock: { $gte: -changeAmount } }, // 确保减少后不会小于 0
            { $inc: { stock: changeAmount } },           // 增量修改
            { new: true }
        );

        if (!updatedProduct) {
            throw new Error('库存不足或产品不存在');
        }
        if (updatedProduct) {
            // 2. 记录日志
            await Log.create({
                action: 'STOCK_UPDATE',
                targetId: id,
                message: `产品 [${updatedProduct.name}] 库存变更为: ${newStock}`
            });

            // 3. 核心：通过 WebSocket 向全网广播“库存变化”事件
            // 我们只发送必要的数据（ID 和新库存），减少带宽开销
            if (io) {
                io.emit('stock_changed', {
                    id: updatedProduct._id,
                    stock: updatedProduct.stock,
                    name: updatedProduct.name
                });
            }
        }
        // 只要数据变了，就立刻删除缓存
        await redisClient.del('all_products');
        return updatedProduct;
    },
    async getstatus() {
        const stats = await Product.aggregate([
            {
                // 1. 过滤：只统计价格大于 0 的
                $match: { price: { $gt: 0 } }
            },
            {
                // 2. 分组：按 category 字段分组
                $group: {
                    _id: "$category",
                    totalProducts: { $sum: 1 },         // 计数
                    avgPrice: { $avg: "$price" },       // 平均价
                    totalStockValue: { $sum: { $multiply: ["$price", "$stock"] } } // 总资产
                }
            },
            {
                // 3. 排序：按总资产降序排列
                $sort: { totalStockValue: -1 }
            }
        ]);
        return stats;
    },
    // 1. 新增：创建分类逻辑
    async createCategory(data) {
        const category = new Category(data);
        return await category.save();
    },

    // 2. 新增：图片处理逻辑 (把复杂的 sharp 逻辑搬过来)
    async processImage(file) {
        // const thumbnailName = `thumb-${file.filename}`;
        // 注意：这里的路径计算要准确
        const thumbnailName = await ImageServer.generateThumbnail(file);
        return {
            originalName: file.filename,
            thumbnailName: thumbnailName
        };
    }
};