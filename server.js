require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken'); // Import jwt
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB:", err));

// User model
const User = require('./models/user');

// Serve the all.html file on the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'all.html')); // Adjust the path based on where your all.html is located
});

// User Registration
app.post('/register', async (req, res) => {
    const { name, phone, age, email, pin, city, sub_area, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.send('<script>alert("User already registered!"); window.location.href="/";</script>');
        }

        const newUser = new User({ name, phone, age, email, pin, city, sub_area, password });
        await newUser.save();

        res.send('<script>alert("Registration successful!"); window.location.href="/";</script>');
    } catch (err) {
        console.error("Error during registration:", err);
        res.send('<script>alert("Error occurred!"); window.location.href="/";</script>');
    }
});

// User Login
app.post('/login', async (req, res) => {
    console.log('Received login request:', req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        console.log('Missing fields');
        return res.status(400).json({ message: "Both email and password are required!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        console.log('User not found:', email);
        return res.status(404).json({ message: "User not found! Please register." });
    }

    // Here you would typically check the password against a hashed version
    if (user.password !== password) {
        console.log('Invalid password for user:', email);
        return res.status(401).json({ message: "Invalid password!" });
    }

    console.log('Login successful for user:', email);

    // Generate JWT
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    // Instead of sending JSON response, we will send an alert and redirect
    res.send(`<script>alert("Login successful!"); window.location.href="/";</script>`);
});


// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from header
    if (!token) return res.sendStatus(403); // Forbidden

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
};

// Example of a protected route
app.get('/protected', authenticateJWT, (req, res) => {
    res.send(`Hello ${req.user.email}, this is a protected route!`);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
