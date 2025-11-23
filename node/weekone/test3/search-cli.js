#!/usr/bin/env node
// #!/usr/bin/env node
import { Command } from 'commander'
import { promises as fs } from 'fs'
import path, { dirname } from 'path'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const program = new Command();

program
    .name('search-cli')
    .description('搜索文件夹中的文本文件，查找包含关键词的文件，并生成报告')
    .version('1.0.0')
    .argument('<folder>', '要搜索的文件夹路径，例如 ./docs')
    .argument('<keyword>', '要搜索的关键词，例如 Node.js')
    .action(async (folder, keyword) => {
        try {
            console.log('🔍 正在扫描文件夹:', folder);
            console.log('🔍 关键词:', keyword);
            const items = await fs.readdir(folder);
            // 2. 筛选 .txt 文件
            const txtFiles = items.filter((item) => item.endsWith('.txt'));
            if (txtFiles.length === 0) {
                console.log('⚠️  没有找到任何 .txt 文件');
                return;
            }
            console.log('✅ 找到 .txt 文件:', txtFiles);
            // 3. 逐一读取文件，检查是否包含关键词
            const filsList = await Promise.all(items.map(async (file) => {
                const filePath = path.join(folder, file)
                const fileContent = await fs.readFile(filePath, 'utf-8')
                return {
                    file,
                    fileContent
                }
            }));
            const results = filsList.filter(({ fileContent }) => fileContent.includes(keyword));
            if (results.length === 0) {
                console.log(`🔍 没有文件包含关键词 "${keyword}"`);
            } else {
                console.log(`✅ 找到 ${results.length} 个文件包含关键词 "${keyword}"`);

                // 4. 生成报告内容
                const reportContent = `=== 搜索报告：关键词 "${keyword}" ===\n\n` +
                    results.map(r => `📄 文件：${r.file}\n   内容预览：${r.fileContent}\n\n`).join('');

                // 5. 写入报告文件
                const reportFile = path.join(__dirname, 'report.txt');
                await fs.writeFile(reportFile, reportContent, 'utf-8');

                console.log(`🎉 报告已生成: ${reportFile}`);
            }
        } catch (err) {
            console.error('❌ 发生错误:', err.message);
        }
    })

program.parse(process.argv);