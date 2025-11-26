const fs = require('fs').promises
const path = require('path')

const DB_FILE = path.join(__dirname, './user.json')

async function ensureDb() {
    try {
        await fs.access(DB_FILE);
    } catch {
        await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
        await fs.writeFile(DB_FILE, '[]', 'utf-8');
    }
}
async function getAllUsers() {
    await ensureDb()
    const data = await fs.readFile(DB_FILE, 'utf-8')
    return JSON.parse(data)
}
async function addUser() {
    const users = await getAllUsers()
    const user = {}
    user.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    users.push(user)
    await fs.writeFile(DB_FILE, JSON.stringify(users, null, 2), 'utf-8');
    return user;
}
async function getUserById(id) {
    if (typeof id !== 'number') {
        throw new Error('❌ getUserById: id 必须是数字');
    }
    const users = await getAllUsers();
    return users.find(u => u.id === id) || null;
}
(async function (params) {
    console.log(await getUserById(2))
}())