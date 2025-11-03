// 维护任务控制器占位实现，用于演示环境
exports.getTasks = async (req, res) => {
  res.json([]);
};

exports.getTask = async (req, res) => {
  res.json({ id: req.params.id });
};

exports.createTask = async (req, res) => {
  res.status(201).json({ id: 'TASK-DEMO-001', ...req.body });
};

exports.updateTask = async (req, res) => {
  res.json({ id: req.params.id, ...req.body });
};

exports.acceptTask = async (req, res) => {
  res.json({ id: req.params.id, status: '已接受' });
};

exports.updateProgress = async (req, res) => {
  res.json({ id: req.params.id, progress: req.body?.progress || 0 });
};

exports.completeTask = async (req, res) => {
  res.json({ id: req.params.id, status: '已完成' });
};

exports.verifyTask = async (req, res) => {
  res.json({ id: req.params.id, verify: '已验收' });
};