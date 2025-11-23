// copy-file.js
import { promises as fs } from 'fs';
import path from 'path';

// 从命令行参数中获取源和目标（process.argv）
// Node.js 启动时参数为：node copy-file.js source.txt dest.txt
// process.argv[0] = node, process.argv[1] = copy-file.js, 所以文件名从 index 2 开始
const args = process.argv.slice(2);

if (args.length !== 2) {
  console.log('📌 请按如下格式运行：');
  console.log('   node copy-file.js <源文件路径> <目标文件路径>');
  console.log('示例：node copy-file.js source.txt destination.txt');
  process.exit(1);
}

const [sourcePath, destinationPath] = args;

async function copyFile(source, destination) {
  try {
    console.log(`🔍 正在从 "${source}" 复制到 "${destination}"`);

    const data = await fs.readFile(source);
    await fs.writeFile(destination, data);

    console.log('✅ 文件复制成功！🎉');
  } catch (err) {
    console.error('❌ 复制失败:', err.message);
  }
}

// 执行
copyFile(sourcePath, destinationPath);