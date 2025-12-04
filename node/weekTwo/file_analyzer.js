const fs = require('fs'); // 引入普通的 fs 模块（包含同步方法）
const path = require('path');

// 1. 定义文件路径
const dataDir = path.join(__dirname, 'data');
const fullFilePath = path.join(dataDir, 'report.json');

// 2. 定义要写入的数据
const reportObject = {
    "port": 8080,
    "environment": "development"
};
const jsonContent = JSON.stringify(reportObject, null, 2); // 格式化 JSON 字符串

try {
    console.log('--- 🚀 Starting Synchronous I/O ---');
    
    // **步骤 1: 创建目录 (同步)**
    // 使用 fs.mkdirSync() 确保 data 目录存在
    fs.mkdirSync(dataDir, { recursive: true });
    console.log(`✅ Directory created: ${dataDir}`);
    
    // **步骤 2: 写入文件 (同步)**
    // 使用 fs.writeFileSync() 写入 JSON 内容
    fs.writeFileSync(fullFilePath, jsonContent, 'utf8');
    console.log(`✅ File written successfully: ${path.basename(fullFilePath)}`);

    // **步骤 3: 读取文件 (同步) 和 JSON 解析**
    // 使用 fs.readFileSync() 阻塞式读取内容
    const loadedContent = fs.readFileSync(fullFilePath, 'utf8');
    const loadedConfig = JSON.parse(loadedContent);
    
    // **步骤 4: 路径解析与信息打印**
    const parsedPath = path.parse(fullFilePath);

    console.log('\n--- 📂 File Analysis Results ---');
    console.log(`* 文件的目录: ${parsedPath.dir}`);
    console.log(`* 文件名: ${parsedPath.base}`);
    console.log(`* 文件扩展名: ${parsedPath.ext}`);
    console.log(`* 加载的端口号: ${loadedConfig.port}`); // 打印加载到的数据
    
    console.log('\n--- I/O Completed ---');
    
} catch (err) {
    // 同步操作可以直接使用 try...catch 捕获错误
    console.error('❌ FATAL ERROR during synchronous I/O:', err.message);
}