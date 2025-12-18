const Product = require('../models/Product');
const Log = require('../models/log.model');

module.exports = {
    async getAll() {
        return await Product.find();
    },

    async getById(id) {
        return await Product.findById(id);
    },

    // 重点修改：传入 io 对象进行实时推送
    async create(data, io) {
        // 1. 操作第一张表：创建产品
        const newProduct = new Product(data);
        const savedProduct = await newProduct.save();

        // 2. 操作第二张表：自动创建关联日志
        const newLog = new Log({
            action: 'CREATE',
            targetId: savedProduct._id,
            message: `成功上架新产品: ${savedProduct.name}`
        });
        await newLog.save();

        // 3. 触发实时通知
        if (io) {
            // 向所有连接的客户端广播“产品已添加”事件
            io.emit('product_added', savedProduct);
            // 也可以广播“系统日志已更新”事件
            io.emit('log_updated', { type: 'INFO', msg: '有一条新的操作记录' });
        }

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
        return updatedProduct;
    }
};