const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Реєстрація
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Перевірка чи користувач вже існує
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Користувач з таким email або іменем вже існує' });
        }

        // Створення нового користувача
        const user = new User({ username, email, password });
        await user.save();

        // Створення токену
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
});

// Вхід
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Пошук користувача
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Користувача не знайдено' });
        }

        // Перевірка паролю
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Невірний пароль' });
        }

        // Створення токену
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
});

// Створення адміністратора
router.post('/create-admin', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Перевірка чи користувач вже існує
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Користувач з таким email або іменем вже існує' });
        }

        // Створення нового адміністратора
        const user = new User({ 
            username, 
            email, 
            password,
            role: 'admin'
        });
        await user.save();

        // Створення токену
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
});

module.exports = router; 