const { createClient } = require('redis');
const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});
client.on('error', (err) => console.log('Redis Client Error', err));
// 连接 Redis
(async () => {
    await client.connect();
    console.log('🚀 Connected to Redis');
})();

module.exports = client;