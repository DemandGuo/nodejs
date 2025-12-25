const eventBus = require('../events/eventBus');
const logService = require('../services/log.service');
const redisClient = require('../utils/redis');

eventBus.on('PRODUCT_CREATED', async ({ product, io }) => {
    // 记录日志
    await logService.record('CREATE', product._id, `创建了新产品: ${product.name}`);
    // 删除缓存
    await redisClient.del('all_products');

    // 3. Socket 推送
    if (io) io.emit('product_added', product);

    console.log('✅ 副作用逻辑处理完毕（日志/缓存/推送）');
});