'use strict';
const _ = require('lodash');

/**
 * 订单核心业务逻辑
 */

const PRODUCTS = {
  'P001': { name: '云服务器 · 标准型', price: 299.0 },
  'P002': { name: '对象存储 · 100GB', price: 45.5 },
  'P003': { name: 'AI 推理加速卡', price: 1299.0 },
};

/** 创建订单 */
function createOrder(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('订单必须包含至少一个商品');
  }
  const lines = items.map(({ sku, qty }) => {
    const product = PRODUCTS[sku];
    if (!product) throw new Error(`未知商品: ${sku}`);
    if (!Number.isInteger(qty) || qty <= 0) throw new Error(`商品数量非法: ${qty}`);
    return { sku, name: product.name, price: product.price, qty, subtotal: product.price * qty };
  });
  return {
    id: `ORD-${Date.now()}`,
    lines,
    total: _.round(_.sumBy(lines, 'subtotal'), 2),
    createdAt: new Date().toISOString(),
  };
}

/** 计算订单总额(含满减) */
function orderTotal(order) {
  let total = _.sumBy(order.lines, 'subtotal');
  // 满 1000 减 100
  if (total >= 1000) total -= 100;
  return _.round(total, 2);
}

/** VIP 会员折扣:95 折 */
function applyVipDiscount(order) {
  const discounted = _.round(order.total * 0.9, 2);
  return { ...order, total: discounted, vip: true };
}

module.exports = { createOrder, orderTotal, applyVipDiscount, PRODUCTS };

