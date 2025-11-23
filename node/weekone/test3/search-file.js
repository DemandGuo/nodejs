import { promises as fs } from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const docsFolder = path.join(__dirname, 'docs'); // 要扫描的文件夹，放你的 .txt 文件
const keyword = 'Node.js'; // 你要搜索的关键词
const reportFile = path.join(__dirname, 'report.txt'); // 最终生成的报告文件

async function searchInFiles(params) {
    try {
        console.log('🔍 正在扫描文件夹:', docsFolder);
        const items = await fs.readdir(docsFolder);
        // 2. 筛选出 .txt 文件
        const txtFiles = items.filter(item => item.endsWith('.txt'));

        if (txtFiles.length === 0) {
            console.log('⚠️  没有找到任何 .txt 文件');
            return;
        }
        console.log('✅ 找到 .txt 文件:', txtFiles);
        // 3. 逐个读取文件内容，检查是否包含关键词
        // const results = []
        // for (const file of txtFiles) {
        //     const filePath = path.join(docsFolder, file);
        //     const content = await fs.readFile(filePath, 'utf-8');

        //     if (content.includes(keyword)) {
        //         results.push({
        //             文件名: file,
        //             匹配内容: content.substring(0, 100) + '...' // 只展示前100个字符
        //         });
        //     }
        // }
        const fileResults = await Promise.all(txtFiles.map(async (file) => {
            const filePath = path.join(docsFolder, file);
            const content = await fs.readFile(filePath, 'utf-8');
            return {
                file,
                content
            }
        }))
        // 3. 筛选包含关键词的文件
        const results = fileResults.filter(({ content }) =>
            content.includes(keyword)
        );
        // 4. 如果没有匹配到内容
        if (results.length === 0) {
            console.log(`🔍 没有文件包含关键词 "${keyword}"`);
        } else {
            console.log(`✅ 找到 ${results.length} 个文件包含关键词 "${keyword}"`);

            // 5. 拼接报告内容
            const reportContent = `=== 搜索报告：关键词 "${keyword}" ===\n\n` +
                results.map(r => `📄 文件：${r.文件名}\n   内容预览：${r.匹配内容}\n\n`).join('');

            // 6. 写入报告文件 report.txt
            await fs.writeFile(reportFile, reportContent, 'utf-8');

            console.log(`🎉 报告已生成，保存为: ${reportFile}`);
        }
    } catch (err) {
        console.error('❌ 发生错误:', err.message);
    }
}
searchInFiles();