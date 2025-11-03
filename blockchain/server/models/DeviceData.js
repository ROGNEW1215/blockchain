const mongoose = require('mongoose');

const DeviceDataSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    ref: 'Device'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  data: {
    temperature: Number,
    pressure: Number,
    vibration: Number,
    custom: [{
      name: String,
      value: Number
    }]
  },
  isAnomaly: {
    type: Boolean,
    default: false
  },
  anomalyDetails: {
    detected: [String],
    severity: {
      type: String,
      enum: ['低', '中', '高'],
    }
  },
  blockchainInfo: {
    transactionHash: String,
    blockNumber: Number,
    timestamp: Date
  }
});

// 索引以提高查询性能
DeviceDataSchema.index({ deviceId: 1, timestamp: -1 });
DeviceDataSchema.index({ isAnomaly: 1 });

module.exports = mongoose.model('DeviceData', DeviceDataSchema);