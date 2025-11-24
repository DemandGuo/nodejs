import { createReadStream, createWriteStream } from 'fs'
import { Transform } from 'stream'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
process.on('uncaughtException', (err) => {
    console.log(err)
    process.exit(1)
})
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
try {
    const readStream = createReadStream(path.join(__dirname, '/big-file.txt'), { encoding: 'utf-8' })
    const writeStream = createWriteStream(path.join(__dirname, '/output.txt'), { encoding: 'utf-8' });

    console.log(__filename, '10')
    const upperCaseTransform = new Transform({
        transform(chunk, encoding, callBcak) {
            const upperChunk = chunk.toString().toUpperCase();
            this.push(upperChunk)
            callBcak()
        }
    })

    console.log('🔁 开始通过 Stream 处理文件...');

    readStream.pipe(upperCaseTransform).pipe(writeStream)

    writeStream.on('finish', () => {
        console.log('✅ 文件处理完成！结果已写入 output.txt');
    })

    // 6. 错误处理
    readStream.on('error', (err) => {
        console.error('❌ 读取文件出错:', err);
    });

    writeStream.on('error', (err) => {
        console.error('❌ 写入文件出错:', err);
    });


} catch (err) {
    console.log(err.message)
}