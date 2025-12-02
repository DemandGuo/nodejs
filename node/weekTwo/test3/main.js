const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
try {
    var readStream = fs.createReadStream(path.join(__dirname, 'input.txt'));
    var writeStream = fs.createWriteStream(path.join(__dirname, 'output.txt'));

    readStream.pipe(writeStream);

    readStream.on('end', function () {
        console.log('文件复制完成');
    });
} catch (err) {
    console.error('出错:', err);
}

fs.createReadStream(path.join(__dirname, 'input.txt'))
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream(path.join(__dirname, 'input.txt.gz')));

console.log('文件压缩完成');

