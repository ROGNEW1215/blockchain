const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');
const multer = require('multer');
const path = require('path');

// 配置模型文件上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/models');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 限制50MB
  fileFilter: (req, file, cb) => {
    const filetypes = /json|h5|pb|tflite|onnx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('只允许上传模型文件格式'));
  }
});

// 预测模型路由
router.get('/models', predictionController.getModels);
router.get('/models/:id', predictionController.getModel);
router.post('/models', upload.single('modelFile'), predictionController.uploadModel);
router.put('/models/:id', upload.single('modelFile'), predictionController.updateModel);
router.delete('/models/:id', predictionController.deleteModel);

// 故障预测路由
router.post('/run', predictionController.runPrediction);
router.get('/', predictionController.getPredictions);
router.put('/:id/outcome', predictionController.updatePredictionOutcome);

module.exports = router;