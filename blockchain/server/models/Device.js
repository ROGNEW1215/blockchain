const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['正常', '异常', '维护中', '离线'],
    default: '正常'
  },
  installationDate: {
    type: Date,
    default: Date.now
  },
  lastMaintenanceDate: {
    type: Date
  },
  specifications: {
    type: Object
  },
  thresholds: {
    temperature: {
      min: { type: Number },
      max: { type: Number }
    },
    pressure: {
      min: { type: Number },
      max: { type: Number }
    },
    vibration: {
      min: { type: Number },
      max: { type: Number }
    },
    custom: [
      {
        name: { type: String },
        min: { type: Number },
        max: { type: Number }
      }
    ]
  },
  blockchainInfo: {
    transactionHash: { type: String },
    blockNumber: { type: Number },
    timestamp: { type: Date }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Device', DeviceSchema);