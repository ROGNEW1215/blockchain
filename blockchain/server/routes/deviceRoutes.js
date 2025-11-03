const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

// 设备管理路由
router.get('/', deviceController.getDevices);
router.get('/:id', deviceController.getDevice);
router.post('/', deviceController.createDevice);
router.put('/:id', deviceController.updateDevice);
router.delete('/:id', deviceController.deleteDevice);

// 设备数据路由
router.post('/data', deviceController.uploadDeviceData);
router.get('/data/query', deviceController.getDeviceData);

module.exports = router;