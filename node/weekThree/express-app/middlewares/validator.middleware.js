const Joi = require('joi');
// 定义用户注册和登录的验证模式

const validate = (schema) => {
    return (req, res, next) => {
        // validate(数据, 规则)
        const { error } = schema.validate(req.body, { abortEarly: false }); // abortEarly: false 返回所有错误而非第一个
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return res.status(400).json({
                success: false,
                message: "数据验证失败",
                details: errorMessage
            });
        }
        next();
    };
};

const schemas = {
    // 1. 创建产品的规则
    productCreate: Joi.object({
        name: Joi.string().min(2).max(50).required().messages({
            'string.empty': '产品名称不能为空',
            'string.min': '名称至少需要 2 个字符'
        }),
        price: Joi.number().positive().required().messages({
            'number.positive': '价格必须是正数'
        }),
        stock: Joi.number().integer().min(0).default(0),
        category: Joi.string().optional()
    }),
    // 2. 修改库存的规则
    stockUpdate: Joi.object({
        stock: Joi.number().integer().min(0).required().messages({
            'number.min': '库存不能小于 0',
            'number.base': '库存必须是一个数字'
        })
    })
}

module.exports = {
    validate,
    schemas
};