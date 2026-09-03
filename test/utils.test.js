'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const { isValidCoupon } = require('../src/utils');

test('优惠券校验:仅接受字母和数字', () => {
  assert.strictEqual(isValidCoupon('SAVE2026'), true);
  assert.strictEqual(isValidCoupon('SAVE-2026'), false);
});

test('优惠券校验:快速拒绝超长非法输入', () => {
  assert.strictEqual(isValidCoupon('a'.repeat(50) + '!'), false);
});
