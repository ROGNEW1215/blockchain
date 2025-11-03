const Device = require('../models/Device');
const DeviceData = require('../models/DeviceData');
const { uploadToBlockchain } = require('../services/blockchainService');
const { sendAlert } = require('../services/notificationService');

// 获取所有设备
exports.getDevices = async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: '获取设备列表失败', error: error.message });
  }
};

// 获取单个设备
exports.getDevice = async (req, res) => {
  try {
    const device = await Device.findOne({ deviceId: req.params.id });
    if (!device) {
      return res.status(404).json({ message: '设备不存在' });
    }
    res.json(device);
  } catch (error) {
    res.status(500).json({ message: '获取设备信息失败', error: error.message });
  }
};

// 创建设备
exports.createDevice = async (req, res) => {
  try {
    const device = new Device(req.body);
    
    // 上传到区块链
    const blockchainData = await uploadToBlockchain('device', device);
    device.blockchainInfo = blockchainData;
    
    await device.save();
    res.status(201).json(device);
  } catch (error) {
    res.status(400).json({ message: '创建设备失败', error: error.message });
  }
};

// 更新设备
exports.updateDevice = async (req, res) => {
  try {
    const device = await Device.findOneAndUpdate(
      { deviceId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!device) {
      return res.status(404).json({ message: '设备不存在' });
    }
    
    // 更新区块链数据
    const blockchainData = await uploadToBlockchain('deviceUpdate', device);
    device.blockchainInfo = blockchainData;
    await device.save();
    
    res.json(device);
  } catch (error) {
    res.status(400).json({ message: '更新设备失败', error: error.message });
  }
};

// 删除设备
exports.deleteDevice = async (req, res) => {
  try {
    const device = await Device.findOneAndDelete({ deviceId: req.params.id });
    
    if (!device) {
      return res.status(404).json({ message: '设备不存在' });
    }
    
    // 记录到区块链
    await uploadToBlockchain('deviceDelete', { deviceId: req.params.id });
    
    res.json({ message: '设备已删除' });
  } catch (error) {
    res.status(500).json({ message: '删除设备失败', error: error.message });
  }
};

// 上传设备数据
exports.uploadDeviceData = async (req, res) => {
  try {
    const { deviceId, data } = req.body;
    
    // 检查设备是否存在
    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ message: '设备不存在' });
    }
    
    // 检查数据是否异常
    const isAnomaly = checkAnomaly(data, device.thresholds);
    const deviceData = new DeviceData({
      deviceId,
      data,
      isAnomaly: isAnomaly.detected,
      anomalyDetails: isAnomaly.details
    });
    
    // 上传到区块链
    const blockchainData = await uploadToBlockchain('deviceData', deviceData);
    deviceData.blockchainInfo = blockchainData;
    
    await deviceData.save();
    
    // 如果数据异常，发送预警
    if (isAnomaly.detected) {
      await sendAlert(device, isAnomaly.details);
      
      // 更新设备状态
      device.status = '异常';
      await device.save();
    }
    
    res.status(201).json(deviceData);
  } catch (error) {
    res.status(400).json({ message: '上传数据失败', error: error.message });
  }
};

// 获取设备数据
exports.getDeviceData = async (req, res) => {
  try {
    const { deviceId, startDate, endDate, limit = 100, anomalyOnly } = req.query;
    
    const query = { deviceId };
    
    // 添加时间范围过滤
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    
    // 仅查询异常数据
    if (anomalyOnly === 'true') {
      query.isAnomaly = true;
    }
    
    const data = await DeviceData.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: '获取设备数据失败', error: error.message });
  }
};

// 检查数据是否异常
function checkAnomaly(data, thresholds) {
  const result = {
    detected: false,
    details: {
      detected: [],
      severity: '低'
    }
  };
  
  // 检查温度
  if (data.temperature && thresholds.temperature) {
    if (data.temperature < thresholds.temperature.min || data.temperature > thresholds.temperature.max) {
      result.detected = true;
      result.details.detected.push('温度');
    }
  }
  
  // 检查压力
  if (data.pressure && thresholds.pressure) {
    if (data.pressure < thresholds.pressure.min || data.pressure > thresholds.pressure.max) {
      result.detected = true;
      result.details.detected.push('压力');
    }
  }
  
  // 检查振动
  if (data.vibration && thresholds.vibration) {
    if (data.vibration < thresholds.vibration.min || data.vibration > thresholds.vibration.max) {
      result.detected = true;
      result.details.detected.push('振动');
    }
  }
  
  // 检查自定义参数
  if (data.custom && thresholds.custom) {
    data.custom.forEach(item => {
      const threshold = thresholds.custom.find(t => t.name === item.name);
      if (threshold && (item.value < threshold.min || item.value > threshold.max)) {
        result.detected = true;
        result.details.detected.push(item.name);
      }
    });
  }
  
  // 确定严重程度
  if (result.details.detected.length > 2) {
    result.details.severity = '高';
  } else if (result.details.detected.length > 0) {
    result.details.severity = '中';
  }
  
  return result;
}