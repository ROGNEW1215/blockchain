const PredictionModel = require('../models/PredictionModel');
const Prediction = require('../models/Prediction');
const Device = require('../models/Device');
const DeviceData = require('../models/DeviceData');
const { uploadToBlockchain } = require('../services/blockchainService');
const path = require('path');
const fs = require('fs');

// 获取所有预测模型
exports.getModels = async (req, res) => {
  try {
    const models = await PredictionModel.find();
    res.json(models);
  } catch (error) {
    res.status(500).json({ message: '获取模型列表失败', error: error.message });
  }
};

// 获取单个预测模型
exports.getModel = async (req, res) => {
  try {
    const model = await PredictionModel.findById(req.params.id);
    if (!model) {
      return res.status(404).json({ message: '模型不存在' });
    }
    res.json(model);
  } catch (error) {
    res.status(500).json({ message: '获取模型信息失败', error: error.message });
  }
};

// 上传预测模型
exports.uploadModel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '请上传模型文件' });
    }

    const model = new PredictionModel({
      name: req.body.name,
      description: req.body.description,
      deviceType: req.body.deviceType,
      version: req.body.version,
      accuracy: req.body.accuracy,
      parameters: JSON.parse(req.body.parameters || '{}'),
      modelFile: req.file.path,
      createdBy: req.body.createdBy
    });

    // 上传到区块链
    const blockchainData = await uploadToBlockchain('predictionModel', {
      name: model.name,
      version: model.version,
      deviceType: model.deviceType,
      fileHash: req.file.filename // 使用文件名作为哈希
    });
    
    model.blockchainInfo = blockchainData;
    await model.save();
    
    res.status(201).json(model);
  } catch (error) {
    res.status(400).json({ message: '上传模型失败', error: error.message });
  }
};

// 更新预测模型
exports.updateModel = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      updatedAt: Date.now()
    };
    
    if (req.body.parameters) {
      updateData.parameters = JSON.parse(req.body.parameters);
    }
    
    if (req.file) {
      updateData.modelFile = req.file.path;
    }
    
    const model = await PredictionModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!model) {
      return res.status(404).json({ message: '模型不存在' });
    }
    
    // 更新区块链数据
    const blockchainData = await uploadToBlockchain('predictionModelUpdate', {
      id: model._id,
      name: model.name,
      version: model.version,
      deviceType: model.deviceType
    });
    
    model.blockchainInfo = blockchainData;
    await model.save();
    
    res.json(model);
  } catch (error) {
    res.status(400).json({ message: '更新模型失败', error: error.message });
  }
};

// 删除预测模型
exports.deleteModel = async (req, res) => {
  try {
    const model = await PredictionModel.findById(req.params.id);
    
    if (!model) {
      return res.status(404).json({ message: '模型不存在' });
    }
    
    // 删除模型文件
    if (model.modelFile && fs.existsSync(model.modelFile)) {
      fs.unlinkSync(model.modelFile);
    }
    
    await model.remove();
    
    // 记录到区块链
    await uploadToBlockchain('predictionModelDelete', { id: req.params.id });
    
    res.json({ message: '模型已删除' });
  } catch (error) {
    res.status(500).json({ message: '删除模型失败', error: error.message });
  }
};

// 执行故障预测
exports.runPrediction = async (req, res) => {
  try {
    const { deviceId, modelId } = req.body;
    
    // 检查设备是否存在
    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ message: '设备不存在' });
    }
    
    // 检查模型是否存在
    const model = await PredictionModel.findById(modelId);
    if (!model) {
      return res.status(404).json({ message: '预测模型不存在' });
    }
    
    // 获取设备数据
    const deviceData = await DeviceData.find({ deviceId })
      .sort({ timestamp: -1 })
      .limit(100);
    
    if (deviceData.length === 0) {
      return res.status(400).json({ message: '没有足够的设备数据进行预测' });
    }
    
    // 执行预测（这里是模拟预测结果）
    const predictionResult = simulatePrediction(deviceData, model);
    
    // 创建预测记录
    const prediction = new Prediction({
      deviceId,
      modelId,
      result: predictionResult
    });
    
    // 上传到区块链
    const blockchainData = await uploadToBlockchain('prediction', {
      deviceId,
      modelId,
      result: predictionResult
    });
    
    prediction.blockchainInfo = blockchainData;
    await prediction.save();
    
    res.status(201).json(prediction);
  } catch (error) {
    res.status(400).json({ message: '执行预测失败', error: error.message });
  }
};

// 获取预测记录
exports.getPredictions = async (req, res) => {
  try {
    const { deviceId, startDate, endDate, limit = 20 } = req.query;
    
    const query = {};
    
    if (deviceId) {
      query.deviceId = deviceId;
    }
    
    // 添加时间范围过滤
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const predictions = await Prediction.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('modelId', 'name version accuracy');
    
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ message: '获取预测记录失败', error: error.message });
  }
};

// 更新预测结果（实际情况）
exports.updatePredictionOutcome = async (req, res) => {
  try {
    const prediction = await Prediction.findByIdAndUpdate(
      req.params.id,
      { actualOutcome: req.body },
      { new: true, runValidators: true }
    );
    
    if (!prediction) {
      return res.status(404).json({ message: '预测记录不存在' });
    }
    
    // 更新区块链数据
    const blockchainData = await uploadToBlockchain('predictionOutcome', {
      id: prediction._id,
      actualOutcome: req.body
    });
    
    prediction.blockchainInfo = blockchainData;
    await prediction.save();
    
    res.json(prediction);
  } catch (error) {
    res.status(400).json({ message: '更新预测结果失败', error: error.message });
  }
};

// 模拟预测结果（实际项目中应该使用真实的机器学习模型）
function simulatePrediction(deviceData, model) {
  // 检查是否有异常数据
  const anomalies = deviceData.filter(data => data.isAnomaly);
  const anomalyRate = anomalies.length / deviceData.length;
  
  // 根据异常率确定故障类型和风险等级
  let faultType, riskLevel, probability;
  
  if (anomalyRate > 0.3) {
    faultType = '轴承磨损';
    riskLevel = '高';
    probability = 0.8 + Math.random() * 0.2;
  } else if (anomalyRate > 0.1) {
    faultType = '润滑不足';
    riskLevel = '中';
    probability = 0.5 + Math.random() * 0.3;
  } else if (anomalies.length > 0) {
    faultType = '温度异常';
    riskLevel = '低';
    probability = 0.3 + Math.random() * 0.2;
  } else {
    faultType = '正常运行';
    riskLevel = '低';
    probability = Math.random() * 0.1;
  }
  
  // 估计故障时间（当前时间加上一个随机天数）
  const daysToAdd = riskLevel === '高' ? 7 : (riskLevel === '中' ? 30 : 90);
  const estimatedTime = new Date();
  estimatedTime.setDate(estimatedTime.getDate() + daysToAdd);
  
  return {
    faultType,
    probability,
    estimatedTime,
    faultLocation: '主轴承',
    riskLevel
  };
}