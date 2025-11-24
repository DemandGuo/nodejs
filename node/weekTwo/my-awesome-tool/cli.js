#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { searchFiles } from './lib/search.js';

const program = new Command();
program
    .name('my-search')
    .description('搜索文件夹中的文本文件')
    .version('1.0.0')
    .option('-f, --folder <path>', '文件夹路径', './docs')
    .option('-k, --keyword <word>', '关键词', 'Node.js')
    .action(async (options) => {
        try {
            console.log(chalk.blue('🔍 开始搜索...'));
            const results = await searchFiles(options.folder, options.keyword);

            if (results.length === 0) {
                console.log(chalk.yellow('❌ 没有找到匹配文件'));
            } else {
                console.log(chalk.green(`✅ 找到 ${results.length} 个匹配文件:`));
                results.forEach(r => {
                    console.log(chalk.cyan(`📄 ${r.file}`));
                });
            }
        } catch (err) {
            console.error(chalk.red('❌ 错误:'), err.message);
        }
    });

program.parse(process.argv);