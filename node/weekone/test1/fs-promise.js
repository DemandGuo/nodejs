// 上面 Promise 版其实就是 async/await 写法
// 也可以用 util.promisify 把回调风格转 Promise
const fs = require('fs');
const util = require('util');
const path = require('path');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function run() {
  try {
    const inputPath = path.join(__dirname, 'input.txt');
    const outputPath = path.join(__dirname, 'output_await.txt');
    const data = await readFile(inputPath, 'utf8');
    await writeFile(outputPath, data.toUpperCase(), 'utf8');
    console.log('async/await版：文件已保存为', outputPath);
  } catch (err) {
    console.error('async/await出错:', err);
  }
}
run();