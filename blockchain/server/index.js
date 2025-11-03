const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// 加载环境变量
dotenv.config({ path: './config/.env' });

// 连接数据库（异步处理，不阻塞服务启动）
(async () => {
  const dbConnected = await connectDB();
  if (dbConnected) {
    console.log('数据库连接成功，所有功能可用');
  } else {
    console.log('数据库连接失败，部分功能可能不可用');
  }
})();

const app = express();

// 中间件
app.use(express.json());
app.use(cors());

// 确保上传目录存在（用于模型与维护附件）
const ensureDir = (p) => {
  try {
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p, { recursive: true });
    }
  } catch (e) {
    console.error('创建上传目录失败:', p, e.message);
  }
};
ensureDir(path.join(__dirname, '../uploads/models'));
ensureDir(path.join(__dirname, '../uploads/maintenance'));

// 路由
app.use('/api/devices', require('./routes/deviceRoutes'));
app.use('/api/predictions', require('./routes/predictionRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/blockchain', require('./routes/blockchainRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// 生产环境下的静态资源
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`服务器运行在端口 ${PORT}`));