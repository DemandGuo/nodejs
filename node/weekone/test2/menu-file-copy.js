#!/usr/bin/env node
import { promises as fs } from 'fs'
import path from 'path'
import * as readline from 'readline';

// 创建 readline 接口
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function showMenu() {
    console.log('\n📁 文件操作工具');
    console.log('=====================');
    console.log('1. 📄 复制文件');
    console.log('2. 🚪 退出');
    console.log('=====================');
    console.log('请选择操作（输入数字 1 或 2）:');
}
// 复制文件函数（复用你之前的逻辑）
async function copyFile(source, destination) {
    try {
        console.log(`\n🔍 正在从 "${source}" 复制到 "${destination}"`);
        const data = await fs.readFile(source);
        await fs.writeFile(destination, data);
        console.log('✅ 文件复制成功！🎉');
    } catch (err) {
        console.error('❌ 复制失败:', err.message);
    }
}

async function main(params) {
    while (true) {
        showMenu();
        const input = await new Promise((resolve) => {
            rl.question('', (answer) => {
                resolve(answer.trim());
            });
        })
        const choice = input;
        if (choice === '1') {
            // const readline = require('readline').createInterface({
            //     input: process.stdin,
            //     output: process.stdout
            // })
            // readline.question('请输入源文件路径（如：source.txt）: ', async (source) => {
            //     readline.question('请输入目标文件路径（如：destination.txt）: ', async (destination) => {
            //         await copyFile(source, destination);
            //         readline.close();
            //     });
            // });
            // 用户选择：复制文件
            const source = await new Promise((resolve) => {
                rl.question('请输入源文件路径（如：source.txt）: ', (answer) => {
                    resolve(answer.trim());
                });
            });

            const destination = await new Promise((resolve) => {
                rl.question('请输入目标文件路径（如：destination.txt）: ', (answer) => {
                    resolve(answer.trim());
                });
            });
            copyFile(source, destination)
        } else if (choice === '2') {
            console.log('👋 再见！感谢使用文件操作工具。');
            process.exit(0)
        } else {
            console.log('❌ 无效选择，请输入 1 或 2', choice);
        }
    }
}

main()