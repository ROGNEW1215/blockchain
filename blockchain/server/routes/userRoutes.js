const express = require('express');
const router = express.Router();

// 简易用户路由占位，避免模块缺失导致服务无法启动
router.get('/', (req, res) => {
  res.json({ message: 'users API ok' });
});

module.exports = router;