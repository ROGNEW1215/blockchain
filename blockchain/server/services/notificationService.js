// 简易通知服务模拟，用于演示环境
exports.sendAlert = async (device, details) => {
  console.log('[MockAlert] 设备异常预警', {
    deviceId: device?.deviceId,
    severity: details?.severity,
    detected: details?.detected
  });
};