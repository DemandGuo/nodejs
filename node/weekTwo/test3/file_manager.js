// 更改代码，使路径拼接更清晰
const fs = require('fs').promises;
const path = require('path');

// 1. 定义 logs 目录的绝对路径
const logsDir = path.join(__dirname, 'logs');
const logFilePath = path.join(logsDir, 'apps.txt'); // 使用 logsDir 变量

async function createAndWriteFile() {
    try {
        // 1. 确保目录存在
        await fs.mkdir(logsDir, { recursive: true }); 
        
        // 2. 写入文件（使用 logFilePath 变量）
        await fs.writeFile(logFilePath, Date.now().toString(), 'utf8');

        // 3. 读取文件（使用 logFilePath 变量）
        const data = await fs.readFile(logFilePath, 'utf8');
        
        console.log('✅ File created and content written successfully.');
        console.log(`⏱️ Timestamp content: ${data}`);
        
    } catch (err) {
        console.error('❌ Error creating or writing file:', err.message);
    }
}

createAndWriteFile();