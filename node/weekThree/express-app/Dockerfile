# 1. 使用官方 Node.js 镜像
FROM node:18-alpine

# 2. 设置容器内的工作目录
WORKDIR /app

# 3. 复制 package.json 并安装依赖
COPY package*.json ./
RUN npm install --production

# 4. 复制你的所有代码（包括 main.js）
COPY . .

# 5. 你的 app.js 或 main.js 监听的端口
EXPOSE 3000

# 6. 启动应用
CMD ["node", "main.js"]