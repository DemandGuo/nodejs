const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    action: String,    // 操作类型：CREATE, UPDATE, DELETE
    targetId: mongoose.Schema.Types.ObjectId,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);