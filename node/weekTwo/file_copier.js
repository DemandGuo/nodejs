const fs = require('fs');
const path = require('path');

// --- 任务 1: 确保源文件存在并写入内容 ---
const sourceFilePath = path.join(__dirname, 'source.txt');
const destFilePath = path.join(__dirname, 'destination.txt');

// 使用同步方法确保源文件存在（这是服务器启动前常用的方法）
try {
    const content = 'This is the large file content that will be streamed.\n'.repeat(50);
    fs.writeFileSync(sourceFilePath, content, 'utf8');
    console.log('✅ Source file created for streaming test.');
} catch (error) {
    console.error('Fatal: Could not prepare source file:', error.message);
    process.exit(1);
}

console.log('--- Starting Pipe Operation ---');

// --- 任务 2, 3, 4: 创建流和连接管道 ---
const source = fs.createReadStream(sourceFilePath);
const dest = fs.createWriteStream(destFilePath);

// 核心：使用 pipe 连接可读流和可写流
source.pipe(dest);

// --- 任务 5: 错误处理和完成提示 ---

// 监听可读流的错误（读取时可能发生的错误）
source.on('error', err => {
    console.error('❌ Error during file reading (Source):', err.message);
    // 确保在出错时关闭可写流
    dest.end();
});

// 监听可写流的错误（写入时可能发生的错误）
dest.on('error', err => {
    console.error('❌ Error during file writing (Destination):', err.message);
});

// 监听 'close' 事件，表示写入已完成
dest.on('close', () => {
    console.log('\n======================================================');
    console.log('🎉 File copy finished using pipe() - Highly efficient!');
    console.log(`Source size: ${fs.statSync(sourceFilePath).size} bytes`);
    console.log(`Destination size: ${fs.statSync(destFilePath).size} bytes`);
    console.log('======================================================');
});