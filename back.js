const express = require('express');
const app = express();

const fs = require('fs');
const jwt = require('jsonwebtoken');

const privateKey = fs.readFileSync('private.key');

const cors = require('cors');
app.use(cors())
app.use(express.json());

app.post('/login', (req, res) => {
    var payload = req.body;
    var data = fs.readFileSync('data.json');
    var users = JSON.parse(data);
    var user = users.find(user => user.username === payload.username);
    if (user && user.password === payload.password) {
        var payload = { user: user.username };
        jwt.sign({ payload }, privateKey, { algorithm: 'RS256', expiresIn: "2h" }, (err, token) => {
            res.status(200).json({
                "success": true,
                "token": token
            });
        });
    } else {
        res.status(401).json({
            "success": false,
            "message": "Invalid username or password"
        });
    }
});

app.get('/user', (req, res) => {
    var token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, privateKey, { algorithm: 'RS256' }, (err, decoded) => {
        if (err) {
            console.log(err);
            res.status(401).json({
                "success": false,
                "message": "Invalid token"
            });
        } else {
            var data = fs.readFileSync('data.json');
            var users = JSON.parse(data);
            var user = users.find(user => user.username === decoded.payload.user);
            res.status(200).json({
                "success": true,
                "user": user
            });
        }
    });
});

app.post('/user', (req, res) => {
    var token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, privateKey, { algorithm: 'RS256' }, (err, decoded) => {
        if (err) {
            console.log(err);
            res.status(401).json({
                "success": false,
                "message": "Invalid token"
            });
        } else {
            var data = fs.readFileSync('data.json');
            var users = JSON.parse(data);
            var user = users.find(user => user.username === decoded.payload.user);
            user.tasks = req.body.tasks;
            fs.writeFileSync('data.json', JSON.stringify(users));
            res.status(200).json({
                "success": true,
                "user": user
            });
        }
    });
});

app.post('/register', (req, res) => {
    var payload = req.body;
    var data = fs.readFileSync('data.json');
    var users = JSON.parse(data);
    var user = users.find(user => user.username === payload.username);
    if (user) {
        res.status(401).json({
            "success": false,
            "message": "Username already exists"
        });
    } else {
        users.push({
            "username": payload.username,
            "password": payload.password,
            "tasks": []
        });
        fs.writeFileSync('data.json', JSON.stringify(users));
        res.status(200).json({
            "success": true,
            "message": "User registered successfully"
        });
        // maybe autologin after register but cba,
        // user can login manually to remember
        // their password yada yada yada
    }
});

app.listen(3000, () => {
    console.log('Server started');
});