const http = require('http');
// 引入 os 模块用于获取网络接口信息
const os = require('os'); 

const PORT = 4000;

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


const server = http.createServer((req, res) => {
    switch (true) {
        case req.url === '/':
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('<h1>Welcome to the API Test Server</h1>');
            break;
        case req.url === '/api/time':
            if (req.method === 'GET') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                const response = {
                    currentTime: new Date().toISOString()
                };
                res.end(JSON.stringify(response));
            } else {
                res.writeHead(405, { 'Content-Type': 'text/plain' });
                res.end('Method Not Allowed');
            }
            break;
        case req.url === '/api/submit' && req.method === 'POST':
            const bodyChunks = []; 
            
            req.on('data', chunk => {
                bodyChunks.push(chunk);
            });
            
            req.on('end', () => {
                try {
                    const rawBody = Buffer.concat(bodyChunks).toString('utf8');
                    const parsedData = JSON.parse(rawBody); 
                    
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    const response = {
                        message: 'Data received successfully',
                        receivedData: parsedData
                    };
                    res.end(JSON.stringify(response));
                } catch (err) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end(`Invalid JSON or internal error: ${err.message}`);
                }
            });
            break;
        default:
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Resource Not Found');
    }
});

// 错误处理：处理端口占用等异步错误
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use.`);
        // 确保进程退出，避免僵尸进程
        process.exit(1); 
    } else {
        console.error('❌ Server Error:', err.message);
    }
});

server.listen(PORT, () => {
    // 获取当前实际监听的端口（如果 PORT 为 0，这个值会不同）
    const actualPort = server.address().port; 
    
    // 获取局域网 IP 地址
    const networkIp = getNetworkIp();

    console.log(`\n==============================================`);
    console.log(`✅ Simple Server is running!`);
    console.log(`==============================================`);
    console.log(`   - Local (Browser Access): http://localhost:${actualPort}`);
    if (networkIp !== '0.0.0.0') {
        console.log(`   - Network (LAN Access):   http://${networkIp}:${actualPort}`);
    }
    console.log(`==============================================\n`);
});