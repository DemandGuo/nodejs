const path = require('path')
const fs = require('fs').promises

const inputFilePath = path.join(__dirname, 'txt')
const outInputFilePath = path.join(__dirname, 'ouyInput.txt')
async function readAndWriteFile(params) {
    try {
        console.log('🔍 正在读取文件夹...');
        const items = await fs.readdir(inputFilePath, 'utf-8');
        const txtFiles = items.filter(item => item.endsWith('.txt'));
        if (txtFiles.length === 0) {
            console.log('⚠️  没有找到任何 .txt 文件，请检查文件夹内容。');
            return;
        }
        let combinedContent = '# 📚 合并的文本文件内容\n\n';
        for (const file of txtFiles) {
            const filePath = path.join(inputFilePath, file);
            const content = await fs.readFile(filePath, 'utf-8');
            combinedContent += `--- 文件：${file} ---\n\n${content}\n\n`;
        }
        await fs.writeFile(outInputFilePath, `--- 这是从 input.txt 复制的内容 ---\n\n${combinedContent}\n\n--- end ---`)
        console.log('✅ 文件写入成功！已保存为：', outInputFilePath);
    } catch (err) {
        console.error('❌ 操作失败:', err.message);
    }
}
readAndWriteFile();