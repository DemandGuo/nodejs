const Product = require('../models/Product');

module.exports = {
    // 你的异步函数实现...
    // 示例：async getAll() { return await Product.find(); }
    async getAll() {
        return await Product.find();
    },
    async getById(id) {
        return await Product.findById(id);
    },
    async create(data) {
        const newProduct = new Product(data);
        return await newProduct.save();
    },
    async update(id, data) {
        return await Product.findByIdAndUpdate(id, data, { new: true });
    },
    async remove(id) {
        return await Product.findByIdAndDelete(id);
    }
};