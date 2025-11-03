const mongoose = require('mongoose');

const SmartContractSchema = new mongoose.Schema({
  contractId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  address: {
    type: String,
    required: true
  },
  abi: {
    type: Object,
    required: true
  },
  bytecode: {
    type: String
  },
  deployedAt: {
    type: Date,
    default: Date.now
  },
  deployedBy: {
    type: String
  },
  network: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['设备信息', '维护任务', '数据存储', '其他'],
    required: true
  },
  callCount: {
    type: Number,
    default: 0
  },
  lastCallAt: {
    type: Date
  }
});

module.exports = mongoose.model('SmartContract', SmartContractSchema);