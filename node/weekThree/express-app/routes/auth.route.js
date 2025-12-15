const express = require('express');
const router = express.Router();
const authService = require('../services/auth.service');

// 用户注册
/**
 * @desc 注册新用户
 * @route POST /api/auth/register
 * @access Public
 * @param {string} username
 * @param {string} password
 * @return {object} 新注册用户的信息 { id, username }
 * */ 
router.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await authService.register(username, password);
        res.status(201).json({ id: user.id, username: user.username });
    } catch (error) {
        next(error);
    }

})

// 用户登录
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const token = await authService.login(username, password);
        res.json({ token });
    } catch (error) {
        next(error);
    }
});
module.exports = router;