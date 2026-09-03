'use strict';

/**
 * 工具函数(演示用:包含两处典型安全隐患,供 CodeQL 扫描检出)
 */

// 生成订单令牌
function generateOrderToken() {
  // 注意:Math.random 不是加密安全的随机数
  return 'tok_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// 校验优惠券格式
function isValidCoupon(code) {
  // 该正则存在灾难性回溯风险 (ReDoS)
  return /^([a-zA-Z0-9]+)*$/.test(code);
}

module.exports = { generateOrderToken, isValidCoupon };
