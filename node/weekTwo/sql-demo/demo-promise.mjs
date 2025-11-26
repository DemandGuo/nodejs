// demo-promise.mjs
import {
    initDb,
    addUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} from './db-promise.mjs';

async function main() {
    try {
        await initDb();

        // 添加用户
        const user1 = await addUser('Alice', 'alice@example.com');
        console.log('➕ 添加用户:', user1);

        const user2 = await addUser('Bob', 'bob@example.com');
        console.log('➕ 添加用户:', user2);

        // 获取所有用户
        const users = await getAllUsers();
        console.log('📋 所有用户:', users);

        // 查找用户
        const user = await getUserById(1);
        console.log('🔍 查找 ID=1:', user);

        // 更新用户
        const updated = await updateUser(1, 'Alice Smith', 'alice.smith@example.com');
        console.log(updated ? '✏️ 更新成功' : '❌ 用户不存在');

        // 删除用户
        const deleted = await deleteUser(2);
        console.log(deleted ? '🗑️ 删除成功' : '❌ 用户不存在');

        // 再次查看
        console.log('📋 更新后用户列表:', await getAllUsers());
    } catch (err) {
        console.error('❌ 错误:', err.message);
    }
}

main();