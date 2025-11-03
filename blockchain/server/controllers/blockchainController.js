// 区块链控制器占位实现，用于演示环境
exports.getNodes = async (req, res) => {
  res.json([]);
};

exports.getNode = async (req, res) => {
  res.json({ id: req.params.id });
};

exports.addNode = async (req, res) => {
  res.status(201).json({ id: 'NODE-DEMO-001', ...req.body });
};

exports.updateNodeStatus = async (req, res) => {
  res.json({ id: req.params.id, status: req.body?.status || '在线' });
};

exports.getContracts = async (req, res) => {
  res.json([]);
};

exports.getContract = async (req, res) => {
  res.json({ id: req.params.id });
};

exports.addContract = async (req, res) => {
  res.status(201).json({ id: 'CONTRACT-DEMO-001', ...req.body });
};

exports.callContract = async (req, res) => {
  res.json({ id: req.params.id, result: 'OK' });
};

exports.getBlockInfo = async (req, res) => {
  res.json({ height: 0, latest: null });
};

exports.getTransactionInfo = async (req, res) => {
  res.json({ txHash: req.params.txHash, status: 'CONFIRMED' });
};