const { initDb, addUser, getAllUsers, getUserById, updateUser, deleteUser } = require('./db');

async function main() {
    await initDb();

    // 添加用户
    await addUser('Alice', 'alice@example.com');
    await addUser('Bob', 'bob@example.com');
    console.log('✅ 用户添加成功');

    // 查询所有
    const users = await getAllUsers();
    console.log('📋 所有用户:', users);

    // 查询单个
    const user = await getUserById(1);
    console.log('🔍 用户 1:', user);

    // 更新
    await updateUser(1, 'Alice Smith', 'alice.smith@example.com');
    console.log('✏️ 用户已更新');

    // 删除
    await deleteUser(2);
    console.log('🗑️ 用户已删除');

    // 再次查询
    console.log('📋 更新后用户列表:', await getAllUsers());
}

main().catch(console.error);