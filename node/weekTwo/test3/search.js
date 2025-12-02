// write_async.js
const fsPromises = require('fs').promises;
const path = require('path');
const filePath = path.join(__dirname, 'output.txt');
async function writeData() {
    try {
        const content = 'Hello Node.js File System!\n';
        // 写入文件，如果没有则创建
        await fsPromises.writeFile(filePath, content, 'utf8');

        // 追加内容
        await fsPromises.appendFile(filePath, 'This is appended content.\n', 'utf8');

        console.log('File writing and appending successful.');
    } catch (err) {
        console.error('Failed to write file:', err);
    }
}

writeData();