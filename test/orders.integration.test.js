'use strict';
const { after, before, test } = require('node:test');
const assert = require('node:assert');
const http = require('http');
const server = require('../src/server');

let port;

before(
  () =>
    new Promise((resolve) => {
      server.listen(0, '127.0.0.1', () => {
        port = server.address().port;
        resolve();
      });
    }),
);

after(
  () =>
    new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    }),
);

function request(method, path, body) {
  const payload = body === undefined ? undefined : JSON.stringify(body);

  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        method,
        path,
        headers: payload
          ? {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(payload),
            }
          : undefined,
      },
      (res) => {
        let responseBody = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => (responseBody += chunk));
        res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(responseBody) }));
      },
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

test('POST /orders:非法订单返回 400', async () => {
  const response = await request('POST', '/orders', { items: [] });

  assert.strictEqual(response.statusCode, 400);
  assert.match(response.body.error, /至少一个商品/);
});

test('GET /orders:不支持的方法返回 404', async () => {
  const response = await request('GET', '/orders');

  assert.strictEqual(response.statusCode, 404);
  assert.deepStrictEqual(response.body, { error: 'not found' });
});

test('POST /orders:有效订单返回 201', async () => {
  const response = await request('POST', '/orders', {
    items: [{ sku: 'P001', qty: 2 }],
  });

  assert.strictEqual(response.statusCode, 201);
  assert.match(response.body.id, /^ORD-\d+$/);
  assert.strictEqual(response.body.lines.length, 1);
  assert.strictEqual(response.body.total, 598);
});
