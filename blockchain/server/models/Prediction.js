const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    ref: 'Device'
  },
  modelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PredictionModel',
    required: true
  },
  result: {
    faultType: {
      type: String,
      required: true
    },
    probability: {
      type: Number,
      required: true
    },
    estimatedTime: {
      type: Date
    },
    faultLocation: {
      type: String
    },
    riskLevel: {
      type: String,
      enum: ['低', '中', '高'],
      required: true
    }
  },
  actualOutcome: {
    confirmed: {
      type: Boolean,
      default: false
    },
    actualFaultType: {
      type: String
    },
    actualTime: {
      type: Date
    },
    notes: {
      type: String
    }
  },
  blockchainInfo: {
    transactionHash: String,
    blockNumber: Number,
    timestamp: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prediction', PredictionSchema);