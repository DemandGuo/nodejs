const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, '分类名称必填'], 
        unique: true, // 确保分类名不重复
        trim: true 
    },
    description: { 
        type: String, 
        default: '' 
    }
}, { timestamps: true }); // 自动记录创建和更新时间

module.exports = mongoose.model('Category', categorySchema);