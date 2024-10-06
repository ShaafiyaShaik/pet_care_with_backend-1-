const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'all.html'));
});

// Route for Registration
app.post('/register', (req, res) => {
    const { name, phone, age, email, pin, city, sub_area, password } = req.body;

    if (!name || !phone || !age || !email || !pin || !city || !sub_area || !password) {
        return res.send('<script>alert("All fields are required!"); window.location.href="/";</script>');
    }

    let users = [];
    if (fs.existsSync('users.json')) {
        users = JSON.parse(fs.readFileSync('users.json'));
    }

    const userExists = users.some(user => user.email === email);
    if (userExists) {
        return res.send('<script>alert("User already registered!"); window.location.href="/";</script>');
    }

    const newUser = { name, phone, age, email, pin, city, sub_area, password }; 
    users.push(newUser);
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));

    return res.send('<script>alert("Registration successful!"); window.location.href="/";</script>');
});

app.post('/login', (req, res) => {
    console.log('Received login request:', req.body); 

    const { email, password } = req.body;

    if (!email || !password) {
        console.log('Missing fields'); 
        return res.send('<script>alert("Both email and password are required!"); window.location.href="/";</script>');
    }

    let users = [];
    if (fs.existsSync('users.json')) {
        users = JSON.parse(fs.readFileSync('users.json'));
    }

    const user = users.find(user => user.email === email);
    if (!user) {
        console.log('User not found:', email); 
        return res.send('<script>alert("User not found! Please register."); window.location.href="/";</script>');
    }

    if (user.password !== password) {
        console.log('Invalid password for user:', email); 
        return res.send('<script>alert("Invalid password!"); window.location.href="/";</script>');
    }

    console.log('Login successful for user:', email); 
    return res.send('<script>alert("Login successful!"); window.location.href="/";</script>');
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
