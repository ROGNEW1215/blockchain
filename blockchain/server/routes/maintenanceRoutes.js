const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const multer = require('multer');
const path = require('path');

// 配置文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/maintenance');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 限制10MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf|doc|docx|xls|xlsx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('只允许上传图片和文档文件'));
  }
});

// 维护任务路由
router.get('/', maintenanceController.getTasks);
router.get('/:id', maintenanceController.getTask);
router.post('/', maintenanceController.createTask);
router.put('/:id', maintenanceController.updateTask);

// 任务操作路由
router.post('/:id/accept', maintenanceController.acceptTask);
router.post('/:id/progress', maintenanceController.updateProgress);
router.post('/:id/complete', maintenanceController.completeTask);
router.post('/:id/verify', maintenanceController.verifyTask);

module.exports = router;