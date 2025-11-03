const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/blockchain-maintenance', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB 连接成功: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB 连接错误: ${error.message}`);
    console.log('服务将在没有数据库的情况下继续运行（仅用于演示）');
    return false;
  }
};

module.exports = connectDB;