const mongoose = require('mongoose');

const MaintenanceTaskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: true,
    unique: true
  },
  deviceId: {
    type: String,
    required: true,
    ref: 'Device'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['低', '中', '高', '紧急'],
    default: '中'
  },
  status: {
    type: String,
    enum: ['未开始', '进行中', '已完成', '已取消'],
    default: '未开始'
  },
  createdBy: {
    type: String,
    required: true
  },
  assignedTo: {
    type: String
  },
  deadline: {
    type: Date,
    required: true
  },
  budget: {
    type: Number
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  attachments: [{
    name: String,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  completionDetails: {
    completedAt: Date,
    notes: String,
    cost: Number,
    verifiedBy: String,
    verificationDate: Date
  },
  blockchainInfo: {
    transactionHash: String,
    blockNumber: Number,
    timestamp: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MaintenanceTask', MaintenanceTaskSchema);