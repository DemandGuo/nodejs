const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/inventoryDB';

// 1. 初始化数据库连接
// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

const connectDB = async () => {
    try {
        // 使用 mongoose.connect 连接到数据库
        await mongoose.connect(dbURI);
        console.log('🎉 MongoDB connected successfully!');
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        // 如果连接失败，退出进程
        process.exit(1);
    }
}
module.exports = connectDB;