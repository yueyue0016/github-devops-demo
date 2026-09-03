'use strict';
const http = require('http');
const { createOrder, PRODUCTS } = require('./app');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method === 'GET' && req.url === '/health') {
    res.end(JSON.stringify({ status: 'ok', service: 'order-service' }));
  } else if (req.method === 'GET' && req.url === '/products') {
    res.end(JSON.stringify(PRODUCTS));
  } else if (req.method === 'POST' && req.url === '/orders') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      try {
        const order = createOrder(JSON.parse(body).items);
        res.statusCode = 201;
        res.end(JSON.stringify(order));
      } catch (e) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: e.message }));
      }
    });
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'not found' }));
  }
});

server.listen(PORT, () => console.log(`订单服务已启动: http://localhost:${PORT}`));
