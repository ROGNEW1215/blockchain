const express = require('express');
const router = express.Router();
const blockchainController = require('../controllers/blockchainController');

// 节点管理路由
router.get('/nodes', blockchainController.getNodes);
router.get('/nodes/:id', blockchainController.getNode);
router.post('/nodes', blockchainController.addNode);
router.put('/nodes/:id/status', blockchainController.updateNodeStatus);

// 智能合约路由
router.get('/contracts', blockchainController.getContracts);
router.get('/contracts/:id', blockchainController.getContract);
router.post('/contracts', blockchainController.addContract);
router.post('/contracts/:id/call', blockchainController.callContract);

// 区块信息路由
router.get('/blocks', blockchainController.getBlockInfo);
router.get('/transactions/:txHash', blockchainController.getTransactionInfo);

module.exports = router;