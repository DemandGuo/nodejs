const Log = require('../models/log.model');

module.exports = {
    async record(action, targetId, message) {
        try {
            return await Log.create({ action, targetId, message });
        } catch (err) {
            console.error('日志记录失败', err); // 日志报错不应打断主业务
        }
    }
};