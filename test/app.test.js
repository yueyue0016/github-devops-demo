'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const { createOrder, orderTotal, applyVipDiscount } = require('../src/app');

test('创建订单:正常下单', () => {
  const order = createOrder([{ sku: 'P001', qty: 2 }]);
  assert.strictEqual(order.lines.length, 1);
  assert.strictEqual(order.total, 598.0);
});

test('创建订单:未知商品应报错', () => {
  assert.throws(() => createOrder([{ sku: 'BAD', qty: 1 }]), /未知商品/);
});

test('创建订单:空订单应报错', () => {
  assert.throws(() => createOrder([]), /至少一个商品/);
});

test('订单总额:满 1000 减 100', () => {
  const order = createOrder([{ sku: 'P003', qty: 1 }]);
  assert.strictEqual(orderTotal(order), 1199.0);
});

test('VIP 折扣:总额按 95 折计算', () => {
  const order = createOrder([{ sku: 'P001', qty: 2 }]);
  const vip = applyVipDiscount(order);
  assert.strictEqual(vip.total, 568.1);
  assert.strictEqual(vip.vip, true);
});

