const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    const { pathname, query } = url.parse(req.url, true);
    if (req.method == "GET" && pathname === '/api/user') {
        const userId = query.id;
        const userData = {
            id: userId,
            name: "User" + userId,
            role: "developer",
            creatTime: new Date().toLocaleDateString()
        }
        res.end(JSON.stringify(userData));
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
})

const port = 3000;
server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});