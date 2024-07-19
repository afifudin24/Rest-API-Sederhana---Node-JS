console.log('Hello, world!');

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const dataFilePath = path.join(__dirname, 'data', 'users.json');

// Middleware parsing body dari permintaan
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Helper function untuk membaca data JSON dari file
const readData = () => {
    try{
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    }catch(error){
        return [];
    }
}


const writeData = (data) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
};

// Endpoint mendapatkan semua pengguna
app.get('/users', (req, res) => {
    const users = readData();
    res.json(users);
})

// Endpoint mendapatkan user berdasarkan id
app.get('/users/:id', (req, res) => {
    const users = readData();
    const user = users.find(u => u.id === parseInt(req.params.id));
    if(user){
        res.json(user);
    }else{
        res.status(404).json({message : 'user not found!'});
    }
})

// endpoint menambahkan pengguna baru
app.post('/users', (req, res) => {
    const users = readData();
    const newUser = {
        id : users.length > 0 ? users[users.length - 1].id + 1 : 1,
        name : req.body.name,
        email : req.body.email
    };
    users.push(newUser);
    writeData(users);
    res.status(201).json(newUser);
});

app.put('/users:id', (req,res) => {
    const users = readData();
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if(userIndex !== -1){
        users[userIndex].name = req.body.name || users[userIndex].name;
        users[userIndex].email = req.body.email || users[userIndex].email;
        writeData(users);
        res.json(users[userIndex])
    }else{
        res.status(404).json({message : "user not found!"});
    }
});
app.delete('/users/:id', (req, res) => {
  let users = readData();
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  if (userIndex !== -1) {
    users = users.filter(u => u.id !== parseInt(req.params.id));
    writeData(users);
    res.json({ message: 'User deleted' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Menjalankan server pada port yang ditentukan
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
// endpoint delete user
