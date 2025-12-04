const EventEmitter = require('events');

const orderEmitter = new EventEmitter();

try {
    // 监听订单创建事件
    orderEmitter.on('orderShipped', ({ orderId, amount }) => {
        console.log(`✅ Order Created: orderId=${orderId}, amount=${amount}`);
    });

    orderEmitter.on('orderFulfilled', ({ orderId }) => {
        console.log(`❌ Order Failed: ID=${orderId}`);
    });

    orderEmitter.on('paymentFailed', ({ reason }) => {
        return console.error(`❌ Payment Failed: reason=${reason}`);
    });

    orderEmitter.emit('orderShipped', { orderId: 101, amount: 50 });
    orderEmitter.emit('orderFulfilled', { orderId: 101, });
    orderEmitter.emit('paymentFailed', { reason: 'Insufficient funds' });
} catch (err) {
    console.error(' FATAL ERROR in Order System:', err.message);
}