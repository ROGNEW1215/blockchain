const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 静态文件服务
app.use(express.static(path.join(__dirname, 'client')));

// API路由示例
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    message: '基于区块链的工业设备预测性维护系统服务器运行中',
    modules: {
      deviceManagement: 'ready',
      faultPrediction: 'ready',
      maintenanceManagement: 'ready',
      blockchain: 'ready'
    }
  });
});

// 所有其他请求返回前端应用
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});