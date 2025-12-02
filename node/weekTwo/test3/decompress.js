const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
fs.createReadStream(path.join(__dirname, 'input.txt.gz'))
    .pipe(zlib.createGunzip())
    .pipe(fs.createWriteStream(path.join(__dirname, 'decompressed_output.txt')));

console.log('文件解压完成');