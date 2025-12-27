const { createClient } = require('redis');
const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});
client.on('error', (err) => console.log('Redis Client Error', err));
// // 连接 Redis
// (async () => {
//     await client.connect();
//     console.log('🚀 Connected to Redis');
// })();
// 只有当不是测试环境时，才自动执行连接
if (process.env.NODE_ENV !== 'test') {
    (async () => {
        await client.connect();
        console.log('🚀 Connected to Redis');
    })();
}

module.exports = client;