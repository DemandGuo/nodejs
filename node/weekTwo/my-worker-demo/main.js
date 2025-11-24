const { Worker } = require('worker_threads');
const path = require('path')

// 要计算的数字范围
const totalNumbers = 1e9; // 10亿
const threadCount = 4;    // 开 4 个线程
const perThread = Math.floor(totalNumbers / threadCount);

const workers = [];
let completedWorkers = 0;
let finalSum = 0;

console.log('🚀 开始多线程计算...');

for (let i = 0; i < threadCount; i++) {
    const start = i * perThread + 1;
    const end = (i + 1) * perThread;
    const worker = new Worker(path.join(__dirname, './worker.js'));
    worker.on('message', ({ sum }) => {
        console.log(`✅ 线程 ${i + 1} 完成，部分和: ${sum}`);
        finalSum += sum;
        completedWorkers++;

        if (completedWorkers === threadCount) {
            console.log(`🎉 所有线程完成！最终总和: ${finalSum}`);
        }
    });
    worker.on('error', (err) => {
        console.error(`❌ 线程 ${i + 1} 出错:`, err);
    });

    worker.on('exit', (code) => {
        if (code !== 0) {
            console.error(`❌ 线程 ${i + 1} 异常退出，代码: ${code}`);
        }
    });
    // 启动线程，并传入计算范围
    worker.postMessage({ start, end });

    workers.push(worker);
}