// csv-to-json.js
const fs = require('fs').promises;
const path = require('path')
async function csvToJson(csvPath, jsonPath) {
    const csv = await fs.readFile(csvPath, 'utf-8');
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',');
    const json = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const obj = {};
        headers.forEach((header, j) => {
            obj[header.trim()] = values[j]?.trim();
        });
        json.push(obj);
    }

    await fs.writeFile(path.join(__dirname, jsonPath), JSON.stringify(json, null, 2), 'utf-8');
    console.log('✅ CSV 已转为 JSON');
}

// 使用
(async () => {
    const csvContent = `name,age,city
Alice,30,Beijing
Bob,25,Shanghai`;

    // 方案 A：写入文件再读取（适合原函数）
    await csvToJson(`name,age,city  
Alice,30,Beijing
Bob,25,Shanghai`, 'users.json','userPrse');
    // 方案 B：直接用字符串（推荐，更高效）
    // 可另写一个 csvToJsonFromString 函数
})();
