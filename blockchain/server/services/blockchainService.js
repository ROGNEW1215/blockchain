// 简易区块链存证服务模拟，用于演示环境
exports.uploadToBlockchain = async (type, payload) => {
  const tx = Math.random().toString(16).slice(2).padEnd(64, '0');
  return {
    transactionHash: `0x${tx}`,
    blockNumber: Math.floor(1000 + Math.random() * 9000),
    timestamp: new Date()
  };
};