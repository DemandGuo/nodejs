# 系统概览（overview）

本文档是工程的“全局地图”，用于让人和 AI 快速建立对系统边界、架构与关键入口的共同认知。

## 目录

- [1. 这是什么系统](#1-这是什么系统)
- [2. 系统边界（做什么 / 不做什么）](#2-系统边界做什么--不做什么)
- [3. 关键入口（从哪里读代码）](#3-关键入口从哪里读代码)
- [4. 代码组织（工程结构与依赖方向）](#4-代码组织工程结构与依赖方向)
- [5. 关键子系统（按“改动入口”组织）](#5-关键子系统按改动入口组织)
- [6. 运行时关键机制（需要知道的"不变量"）](#6-运行时关键机制需要知道的不变量)
- [7. 常见改动路径（面向开发/AI）](#7-常见改动路径面向开发ai)
- [8. 常见陷阱与排障索引](#8-常见陷阱与排障索引)
- [9. 文档导航（为 AI 准备）](#9-文档导航为-ai-准备)

---

## 1. 这是什么系统

**系统名称**：Express 产品库存管理系统

**核心职责**：
- 提供 RESTful API 进行产品（Product）和分类（Category）的增删改查
- 用户认证与授权（JWT Token 机制）
- 支持图片上传和处理
- 实时通信能力（WebSocket/Socket.io）
- 支持 Docker 容器化部署

**技术栈**：
- **运行环境**：Node.js 18+
- **Web 框架**：Express 5.x
- **数据库**：MongoDB (通过 Mongoose ODM)
- **缓存**：Redis
- **实时通信**：Socket.io
- **认证**：JWT (jsonwebtoken)
- **图片处理**：Sharp
- **部署**：Docker + Docker Compose

---

## 2. 系统边界（做什么 / 不做什么）

### ✅ 做什么

1. **用户管理**
   - 用户注册（密码 bcrypt 加密）
   - 用户登录（JWT Token 签发）
   - 基于 Token 的身份验证

2. **产品管理**
   - CRUD 操作（创建、读取、更新、删除）
   - 分页查询
   - 按分类筛选
   - 价格范围搜索
   - 统计信息（总数、平均价格等）

3. **分类管理**
   - 创建和管理产品分类
   - 分类与产品的关联关系

4. **文件上传**
   - 图片上传（Multer）
   - 图片优化处理（Sharp）
   - 静态资源服务

5. **实时通信**
   - WebSocket 连接管理
   - 实时事件推送

6. **安全与性能**
   - Helmet 安全头
   - Gzip 压缩
   - 请求日志（Morgan）
   - 输入验证（Joi）

### ❌ 不做什么

- 前端界面（仅提供 API）
- 订单管理
- 支付集成
- 多租户支持
- 复杂的权限管理（RBAC）
- 邮件通知
- 第三方登录（OAuth）

---

## 3. 关键入口（从哪里读代码）

### 🚀 启动入口

**文件**：`main.js`

**作用**：
1. 加载环境变量（`dotenv`）
2. 初始化 Express 应用
3. 配置中间件（安全、压缩、日志、解析）
4. 连接数据库（MongoDB）
5. 配置 Socket.io
6. 注册业务路由
7. 全局错误处理
8. 启动 HTTP 服务器

**关键代码流程**：
```
加载 .env → 创建 Express App → 配置中间件 → 连接 MongoDB 
→ 初始化 Socket.io → 注册路由 → 错误处理 → 监听端口
```

### 📍 路由入口

| 路由前缀 | 文件路径 | 功能 | 是否需要认证 |
|---------|---------|------|-------------|
| `/api/auth` | `routes/auth.route.js` | 用户注册/登录 | ❌ |
| `/api/products` | `routes/products.mongoose.route.js` | 产品 CRUD | ✅ |

### 🔧 配置文件

- **环境变量**：`.env` (开发) / `.env.production` (生产)
- **包管理**：`package.json`
- **Docker**：`Dockerfile` + `docker-compose.yml`

---

## 4. 代码组织（工程结构与依赖方向）

### 📁 目录结构

```
express-app/
├── main.js                    # 🚀 应用启动入口
├── app.js                     # 📝 早期示例文件（已废弃）
├── db.mongoose.js             # 🗄️ MongoDB 连接配置
├── package.json               # 📦 依赖声明
├── Dockerfile                 # 🐳 Docker 镜像构建
├── docker-compose.yml         # 🐳 容器编排配置
├── .env / .env.production     # 🔐 环境变量
│
├── routes/                    # 🛣️ 路由层（API 端点定义）
│   ├── auth.route.js          #    用户认证路由
│   ├── products.mongoose.route.js #  产品管理路由
│   └── products.route.js      #    早期示例（已废弃）
│
├── middlewares/               # 🔀 中间件层
│   ├── auth.middleware.js     #    JWT 验证中间件
│   ├── validator.middleware.js#    请求验证中间件（Joi）
│   └── upload.middleware.js   #    文件上传中间件（Multer）
│
├── services/                  # 💼 业务逻辑层
│   ├── auth.service.js        #    认证业务逻辑
│   ├── products.service.mongoose.js # 产品业务逻辑
│   ├── category.service.js    #    分类业务逻辑
│   ├── image.service.js       #    图片处理逻辑
│   └── log.service.js         #    日志服务
│
├── models/                    # 📊 数据模型层（Mongoose Schema）
│   ├── Product.js             #    产品模型
│   ├── Category.js            #    分类模型
│   └── log.model.js           #    日志模型
│
├── utils/                     # 🛠️ 工具库
│   └── redis.js               #    Redis 客户端配置
│
├── public/                    # 🌐 静态文件（前端资源）
│   └── index.html
│
├── uploads/                   # 📸 用户上传文件目录
│
├── events/                    # 📡 事件总线（EventEmitter）
│   └── eventBus.js            #    全局事件发布/订阅中心
│
├── subscribers/               # 📬 事件订阅者
│   └── product.subscriber.js  #    产品相关事件监听器
```

### 🔄 依赖方向

```
main.js (应用入口)
  ↓
  ├─→ subscribers (事件订阅者初始化)
  ↓
routes (路由层)
  ↓
middlewares (中间件层：认证、验证、上传)
  ↓
services (业务逻辑层)
  ↓
  ├─→ events/eventBus (发布事件)
  ↓         ↓
models      subscribers (订阅事件)
  ↓
db.mongoose.js / utils (数据库连接 / 工具)
```

**核心原则**：
- 单向依赖，避免循环引用
- 路由层只负责请求处理和响应
- 业务逻辑集中在 services 层
- models 层只定义数据结构

---

## 5. 关键子系统（按"改动入口"组织）

### 5.1 认证系统

**涉及文件**：
- `routes/auth.route.js`
- `services/auth.service.js`
- `middlewares/auth.middleware.js`

**功能**：
- 用户注册：密码 bcrypt 哈希存储
- 用户登录：验证密码，签发 JWT
- Token 验证：通过 `authMiddleware` 保护路由

**关键 API**：
```
POST /api/auth/register  # 注册
POST /api/auth/login     # 登录
```

### 5.2 产品管理系统

**涉及文件**：
- `routes/products.mongoose.route.js`
- `services/products.service.mongoose.js`
- `models/Product.js`
- `models/Category.js`

**功能**：
- 产品 CRUD
- 分类管理
- 分页查询
- 条件过滤（分类、价格区间）
- 统计数据

**关键 API**：
```
GET    /api/products           # 获取产品列表（分页）
POST   /api/products           # 创建产品
GET    /api/products/:id       # 获取单个产品
PUT    /api/products/:id       # 更新产品
DELETE /api/products/:id       # 删除产品
GET    /api/products/stats     # 统计数据
POST   /api/products/category  # 创建分类
```

### 5.3 文件上传系统

**涉及文件**：
- `middlewares/upload.middleware.js`
- `services/image.service.js`

**功能**：
- 使用 Multer 处理文件上传
- Sharp 图片压缩和优化
- 存储在 `/uploads` 目录
- 通过 `/uploads` 路径访问

### 5.4 实时通信系统

**涉及文件**：
- `main.js`（Socket.io 初始化）
- `services/products.service.mongoose.js`（Socket 事件发送）

**功能**：
- WebSocket 连接管理
- 实时推送产品更新
- 实时推送库存变化

**关键事件**：
```javascript
// Socket.io 事件（实时推送到前端）
io.emit('product_added', product)      // 新增产品
io.emit('product_updated', product)    // 更新产品
io.emit('product_deleted', { id })     // 删除产品
io.emit('stock_changed', { id, stock }) // 库存变化
```

### 5.5 事件订阅系统

**涉及文件**：
- `events/eventBus.js`（事件总线）
- `subscribers/product.subscriber.js`（产品事件订阅者）
- `services/products.service.mongoose.js`（事件发布者）

**功能**：
- 解耦业务逻辑与副作用（日志、缓存、通知）
- 基于 Node.js EventEmitter 的发布/订阅模式
- 异步处理副作用任务

**架构设计**：
```
Service (发布者)              EventBus              Subscriber (订阅者)
     |
     |-- eventBus.emit('PRODUCT_CREATED') --→ eventBus.on('PRODUCT_CREATED')
     |                                              |
     |                                              ├─→ 记录日志
     |                                              ├─→ 清除缓存
     |                                              └─→ Socket 推送
```

**关键事件**：
```javascript
// 后端事件（内部系统通信）
eventBus.emit('PRODUCT_CREATED', { product, io })  // 产品创建
```

**优势**：
- **解耦**：Service 层不需要关心日志、缓存等副作用
- **可扩展**：新增订阅者无需修改现有代码
- **易测试**：副作用逻辑独立，便于单元测试
- **可维护**：每个订阅者职责单一，易于理解和修改

---

## 6. 运行时关键机制（需要知道的"不变量"）

### 🔐 认证流程

1. 用户调用 `/api/auth/login` 获取 Token
2. 后续请求在 Header 中携带 `Authorization: Bearer <token>`
3. `authMiddleware` 验证 Token 并将用户信息注入 `req.user`
4. 路由处理器通过 `req.user` 获取当前用户

### 🗄️ 数据库连接

- **MongoDB**：通过 `mongoose.connect()` 连接
- **连接 URI**：`mongodb://localhost:27017/inventoryDB`
- **重要**：应用启动时必须成功连接 MongoDB，否则进程退出

### 🌐 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `NODE_ENV` | 运行环境 | `development` |
| `PORT` | 服务器端口 | `3000` |
| `JWT_SECRET` | JWT 签名密钥 | （必须配置） |
| `MONGO_URI` | MongoDB 连接 URI | `mongodb://localhost:27017/inventoryDB` |

### 🛡️ 错误处理

- 所有路由通过 `try-catch` 捕获错误
- 错误统一传递给 `next(error)`
- 全局错误处理中间件返回 JSON 格式
- 生产环境隐藏错误堆栈

### 📡 事件系统工作流程

**初始化**（应用启动时）：
```javascript
// main.js 中加载所有订阅者
require('./subscribers/product.subscriber');
```

**业务触发**（Service 层）：
```javascript
// services/products.service.mongoose.js
const savedProduct = await newProduct.save();
eventBus.emit('PRODUCT_CREATED', { product: savedProduct, io });
```

**订阅处理**（Subscriber 层）：
```javascript
// subscribers/product.subscriber.js
eventBus.on('PRODUCT_CREATED', async ({ product, io }) => {
    await logService.record('CREATE', product._id, `创建了新产品`);
    await redisClient.del('all_products');
    if (io) io.emit('product_added', product);
});
```

**关键点**：
- 事件订阅者在应用启动时注册
- 事件是异步处理的，不阻塞主流程
- 可以有多个订阅者监听同一个事件

---

## 7. 常见改动路径（面向开发/AI）

### 场景 1：添加新的 API 端点

1. 在 `routes/` 中创建或修改路由文件
2. 在 `services/` 中实现业务逻辑
3. 如需数据库操作，在 `models/` 中定义 Schema
4. 在 `main.js` 中注册路由

### 场景 2：添加新的数据模型

1. 在 `models/` 中创建新的 Mongoose Schema
2. 在对应的 Service 中引入并使用
3. 考虑是否需要迁移历史数据

### 场景 3：添加认证保护

在路由注册时添加 `authMiddleware`：
```javascript
app.use('/api/protected', authMiddleware, protectedRouter);
```

### 场景 4：添加请求验证

1. 在 `middlewares/validator.middleware.js` 中定义 Joi Schema
2. 在路由中使用 `validate(schemas.yourSchema)`

### 场景 5：添加新的事件订阅

1. 在 Service 中发布事件：
```javascript
eventBus.emit('YOUR_EVENT', { data });
```

2. 在 `subscribers/` 中创建新的订阅者文件
3. 在 `main.js` 中引入订阅者：
```javascript
require('./subscribers/your.subscriber');
```

### 场景 6：部署到生产环境

```bash
# 使用 Docker Compose 启动
docker-compose up -d

# 或直接使用 npm
npm start
```

---

## 8. 常见陷阱与排障索引

### ⚠️ 常见问题

#### 问题 1：数据库连接失败

**症状**：应用启动时报错 `MongoDB connection failed`

**排查**：
1. 检查 MongoDB 服务是否启动
2. 验证连接 URI 是否正确
3. 检查网络/防火墙设置

**解决**：
```bash
# 启动 MongoDB（Docker）
docker run -d -p 27017:27017 mongo:latest
```

#### 问题 2：JWT 验证失败

**症状**：请求返回 `401 Unauthorized`

**排查**：
1. 检查 Header 是否包含 `Authorization: Bearer <token>`
2. 验证 Token 是否过期
3. 确认 `JWT_SECRET` 环境变量是否一致

#### 问题 3：文件上传失败

**症状**：上传接口返回 500 错误

**排查**：
1. 检查 `uploads/` 目录是否存在且有写权限
2. 验证文件大小是否超过限制（默认 5MB）
3. 检查 `sharp` 模块是否正确安装

#### 问题 4：CORS 跨域错误

**症状**：前端请求被浏览器阻止

**解决**：在 `main.js` 中添加 CORS 中间件
```javascript
const cors = require('cors');
app.use(cors());
```

### 🔍 日志查看

- **开发环境**：控制台直接输出（morgan 'dev' 格式）
- **生产环境**：详细日志（morgan 'combined' 格式）
- **Docker 容器**：`docker logs <container_id>`

---

## 9. 文档导航（为 AI 准备）

### 📚 代码阅读建议顺序

1. **快速入门**：先读 `main.js` 了解整体结构
2. **认证流程**：`routes/auth.route.js` → `services/auth.service.js` → `middlewares/auth.middleware.js`
3. **核心业务**：`routes/products.mongoose.route.js` → `services/products.service.mongoose.js` → `models/Product.js`
4. **中间件机制**：依次查看 `middlewares/` 下的文件
5. **部署配置**：`Dockerfile` + `docker-compose.yml`

### 🎯 关键代码位置索引

| 关注点 | 文件 | 行数/函数 |
|--------|------|----------|
| 应用启动 | `main.js` | 全文 |
| 路由注册 | `main.js` | `app.use()` 调用 |
| JWT 验证 | `middlewares/auth.middleware.js` | `authMiddleware` |
| 产品创建 | `services/products.service.mongoose.js` | `create()` |
| 事件发布 | `services/products.service.mongoose.js` | `eventBus.emit()` |
| 事件订阅 | `subscribers/product.subscriber.js` | `eventBus.on()` |
| 数据库连接 | `db.mongoose.js` | `connectDB()` |
| 错误处理 | `main.js` | `errorHandler` 中间件 |

### 🤖 AI 协作提示

- **修改业务逻辑**：优先查看 `services/` 层
- **调整 API 端点**：修改 `routes/` 文件
- **数据结构变更**：更新 `models/` 中的 Schema
- **添加验证规则**：编辑 `middlewares/validator.middleware.js`
- **性能优化**：关注数据库查询（`services/` 层）和中间件顺序（`main.js`）
- **添加副作用处理**：在 `subscribers/` 中添加事件订阅者
- **跨模块通信**：使用 `events/eventBus` 发布/订阅事件

### 📝 技术文档链接

- [Express 官方文档](https://expressjs.com/)
- [Mongoose 官方文档](https://mongoosejs.com/)
- [JWT 介绍](https://jwt.io/)
- [Socket.io 文档](https://socket.io/docs/)
- [Docker Compose 文档](https://docs.docker.com/compose/)