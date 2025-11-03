const mongoose = require('mongoose');

const BlockchainNodeSchema = new mongoose.Schema({
  nodeId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  port: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['在线', '离线', '同步中'],
    default: '离线'
  },
  lastSeen: {
    type: Date
  },
  publicKey: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BlockchainNode', BlockchainNodeSchema);