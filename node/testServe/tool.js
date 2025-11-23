#!/usr/bin/env node
import { Command } from 'commander';
import { readdirSync, renameSync } from 'fs';
import { join, basename, dirname, parse, extname } from 'path';
import { cleanRedundantPrefix, cleanRedundantSuffix } from './helper.js'

const program = new Command();
program.argument('<folder>', '要处理的文件夹路径')
    .option('--prefix <prefix>', '设置文件名前缀')
    .option('--suffix <suffix>', '设置文件名后缀')
    .option('--dry-run', '预览将要重命名的文件，但不实际执行改名')
    .option('--date-prefix', '在文件名前添加当前日期，如 20240610_')
    .option('--number-prefix', '在文件名前添加序号，如 001_')
    .option('--extensions <exts>', '只处理指定的文件扩展名，如 .jpg,.png（用逗号分隔）')
    .option('--exclude-file <fileName>', '排除某个具体文件，如 backup.jpg')
    .description('一个批量重命名文件的命令行工具')
    .version('1.0.0');

program.parse();

const options = program.opts()

const [folderPath] = program.args
const isDryRun = options.dryRun;
const allowedExtensions = options.extensions
    ? options.extensions.split(',').map(e => e.trim().toLowerCase())
    : null; //

console.log('📂 文件夹路径:', folderPath);
console.log('🔧 选项:', options);

let renamedCount = 0;
let skippedCount = 0;
let fileCounter = 1;
const getDateString = () => {
    const now = new Date();
    return now.toISOString().slice(0, 10).replace(/-/g, ''); // 20240610
};
const getNumberPrefix = () => {
    return fileCounter.toString().padStart(3, '0') + '_'; // 001_
};
try {
    processDirectory(folderPath);
} catch (err) {
    console.error('❌ 无法读取文件夹:', folderPath, err.message);
}
function processDirectory(directoryPath) {
    const entries = readdirSync(directoryPath, { withFileTypes: true });

    entries.forEach((dirent) => {
        const fullPath = join(directoryPath, dirent.name);

        if (dirent.isDirectory()) {
            // 如果是文件夹，递归处理
            processDirectory(fullPath);
        } else if (dirent.isFile()) {
            // 如果是文件，执行重命名逻辑
            processFile(fullPath, directoryPath);
        }
    });
}
function processFile(filePath, parentDir) {
    const ext = extname(filePath).toLowerCase();
    const fileName = basename(filePath);
    if (allowedExtensions && !allowedExtensions.includes(ext)) {
        console.log(`⚠️  跳过（非目标扩展名）: "${fileName}"`);
        skippedCount++;
        return;
    }
    const nameWithoutExt = parse(fileName).name;
    let newName = nameWithoutExt;
    // --- 清理多余的前缀 ---
    if (options.prefix) {
        newName = cleanRedundantPrefix(newName, options.prefix);
    }

    // --- 清理多余的后缀 ---
    if (options.suffix) {
        newName = cleanRedundantSuffix(newName, options.suffix);
    }
    if (options.prefix && !newName.startsWith(options.prefix)) {
        newName = options.prefix + newName;
    }
    if (options.suffix && !newName.endsWith(options.suffix)) {
        newName = newName + options.suffix;
    }
    if (options.datePrefix) {
        newName = getDateString() + '_' + newName;
    }
    if (options.numberPrefix) {
        newName = getNumberPrefix() + newName;
        fileCounter++;
    }
    const finalNewName = join(parentDir, newName + ext)
    // 避免新文件名和旧文件名一样（没有实际改动）
    if (filePath === finalNewName) {
        skippedCount++;
        console.log(`⚠️  无需重命名: "${fileName}"（已经包含前缀/后缀或未提供参数）`);
        return;
    }
    if (isDryRun) {
        return console.log(`🔍 [预览] 将重命名: "${fileName}" → "${finalNewName}"`);
    }
    try {
        renameSync(filePath, finalNewName)
        renamedCount++;
        console.log(`✅ 重命名: "${fileName}" → "${newName + ext}"`);
    } catch (err) {
        console.error(`❌ 无法重命名 "${fileName}":`, err.message);
    }
}

if (isDryRun) {
    console.log('🔍 提示：当前为预览模式（--dry-run），未实际修改任何文件。');
} else {
    console.log('\n📊 操作完成：');
    console.log(`✅ 成功重命名：${renamedCount} 个文件`);
    console.log(`⚠️  跳过（无需改动）：${skippedCount} 个文件`);
}
