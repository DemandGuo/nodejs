const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');

const PORT = 5000;
const FILE_PATH = path.join(__dirname, 'largefile.txt');
const HOST = ''
    ; // 监听所有可用的网络接口

// 辅助函数：获取局域网 IP 地址
// 辅助函数：获取局域网 IP 地址
function getNetworkIp() {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            // 筛选出 IPv4 地址，非本地回环地址 (127.0.0.1)，且非内部接口
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return '0.0.0.0'; // 如果找不到有效 IP
}

// 确保测试文件存在（这是集成实践的一部分，用于确保运行环境）
try {
    if (!fs.existsSync(FILE_PATH)) {
        // 创建一个 2MB 的缓冲区数据作为大文件
        const buffer = Buffer.alloc(2 * 1024 * 1024, 'A simple repetitive test string for large file download...\n');
        fs.writeFileSync(FILE_PATH, buffer);
        console.log(`[Setup] Created a 2MB test file at: ${FILE_PATH}`);
    }
} catch (e) {
    console.error(`[Setup Error] Could not create test file: ${e.message}`);
    process.exit(1);
}
const server = http.createServer((req, res) => {
    if (req.url === '/download' && req.method === 'GET') {

        // 创建文件的可读流
        const fileStream = fs.createReadStream(FILE_PATH);

        // 处理流错误   
        fileStream.on('error', (err) => {
            // 检查是否是文件不存在的错误
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Error: The requested file was not found.');
            } else {
                // 默认处理所有其他 I/O 错误
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error while reading the file.');
            }
        });
        // 设置响应头，指示浏览器下载文件
        res.writeHead(200, {
            'Content-Disposition': 'attachment; filename="largefile.txt"',
            'Content-Type': 'application/octet-stream'
        });
        // 将文件流管道传输到响应
        fileStream.pipe(res);

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// 监听启动错误（如端口占用）
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use.`);
    } else {
        console.error('❌ Server Error:', err.message);
    }
    process.exit(1);
});
server.listen(PORT, HOST, () => {
    const localIp = 'localhost';
    const networkIp = getNetworkIp();
    console.log(`🚀 Download Server is running!`);
    console.log(`* Local:            http://${localIp}:${PORT}/download`);
    console.log(`* On Your Network:  http://${networkIp}:${PORT}/download`);
});  