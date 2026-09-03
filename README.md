# 订单服务 Order Service

![CI](https://github.com/yueyue0016/github-devops-demo/actions/workflows/ci.yml/badge.svg)
![发布](https://github.com/yueyue0016/github-devops-demo/actions/workflows/docker-publish.yml/badge.svg)

> GitHub 一站式 DevOps 平台演示项目:覆盖 **代码托管 → 评审 → CI/CD → 制品 → 安全 → 度量** 全流程。

## 功能

- `GET /health` — 健康检查
- `GET /products` — 商品列表
- `POST /orders` — 创建订单(自动计算总额、满减优惠)

## 快速开始

```bash
npm install
npm test          # 运行单元测试
npm start         # 启动服务 http://localhost:3000
```

容器方式运行:

```bash
docker run -p 3000:3000 ghcr.io/yueyue0016/order-service:latest
```

## DevOps 流程说明

| 环节 | 实现 |
|---|---|
| 代码托管 | 本仓库,main 分支受规则集保护 |
| 代码评审 | 所有变更必须通过 Pull Request 合入 |
| CI | `.github/workflows/ci.yml`:语法检查 + 单元测试 + 镜像构建验证 |
| CD / 制品 | `.github/workflows/docker-publish.yml`:发布镜像到 ghcr.io 并生成构建溯源 |
| 安全 | CodeQL 代码扫描、Secret 推送保护、Dependabot 依赖检查 |
| 度量 | Insights 面板 + Actions 构建数据 |

## 架构

```
客户端 ──HTTP──▶ server.js ──▶ app.js(业务逻辑)──▶ 内存商品目录
```
