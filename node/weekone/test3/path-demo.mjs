import path from "path";
const folder = 'docs';
const fileName = 'notes.txt'
const fullPath = path.join(folder, fileName)
console.log(fullPath)

console.log(path.basename(fullPath))
console.log(path.extname(fullPath))
console.log(path.parse(fullPath))
console.log(path.basename(fullPath, path.extname(fullPath)))

const packager = path.join(import.meta.url, 'package.json')
console.log(path.basename(packager))
console.log(path.extname(packager))