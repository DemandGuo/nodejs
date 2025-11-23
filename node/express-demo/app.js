const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let users = [{ id: 1, name: '张三', age: 20 }, {
    id: 2, name: '李四', age: 22
}]

app.get('/api/users', (req, res) => {
    res.send(users);
})
app.get('/api/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    if (user) res.send(user);
    else res.status(404).send({ error: '用户不存在' });
})
app.post('/api/user', (req, res) => {
    const newUser = {
        id: users.length + 1,
        name: req.body.name, // 前端 POST 传的 JSON 数据
        age: req.body.age
    };
    console.log(newUser, '24---');
    users.push(newUser);
    res.status(201).send(newUser);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});