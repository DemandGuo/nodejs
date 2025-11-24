// worker.js
const { parentPort } = require('worker_threads');

// 接收主线程传来的数据
parentPort.on('message', (data) => {
  const { start, end } = data;

  let sum = 0;
  for (let i = start; i <= end; i++) {
    sum += i;
  }

  // 计算完成后，把结果发回主线程
  parentPort.postMessage({ sum });
});