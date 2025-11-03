const mongoose = require('mongoose');

const PredictionModelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  deviceType: {
    type: String,
    required: true
  },
  version: {
    type: String,
    required: true
  },
  accuracy: {
    type: Number,
    min: 0,
    max: 100
  },
  parameters: {
    type: Object
  },
  modelFile: {
    type: String,
    required: true
  },
  createdBy: {
    type: String
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

module.exports = mongoose.model('PredictionModel', PredictionModelSchema);