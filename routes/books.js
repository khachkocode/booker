const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Отримати всі книги
router.get('/', async (req, res) => {
    try {
        const books = await Book.find()
            .populate('reviews', 'rating comment user')
            .sort({ createdAt: -1 });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
});

// Пошук книг
router.get('/search', async (req, res) => {
    try {
        console.log('Отримано запит на пошук:', req.query);
        const query = req.query.q;
        
        if (!query) {
            console.log('Параметр пошуку відсутній');
            return res.status(400).json({ message: 'Параметр пошуку не вказано' });
        }

        console.log('Шукаємо книги з запитом:', query);
        const books = await Book.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { author: { $regex: query, $options: 'i' } },
                { genre: { $regex: query, $options: 'i' } }
            ]
        })
        .populate('reviews', 'rating comment user')
        .sort({ createdAt: -1 });

        console.log('Знайдено книг:', books.length);
        res.json(books);
    } catch (error) {
        console.error('Помилка при пошуку книг:', error);
        res.status(500).json({ 
            message: 'Помилка сервера', 
            error: error.message,
            stack: error.stack 
        });
    }
});

// Отримати книгу за ID
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate('reviews', 'rating comment user createdAt')
            .populate('collections', 'name description');
            
        if (!book) {
            return res.status(404).json({ message: 'Книгу не знайдено' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
});

// Створити нову книгу
router.post('/', [auth, adminAuth], async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
});

// Оновити книгу
router.put('/:id', [auth, adminAuth], async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!book) {
            return res.status(404).json({ message: 'Книгу не знайдено' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
});

// Видалити книгу
router.delete('/:id', [auth, adminAuth], async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Книгу не знайдено' });
        }
        res.json({ message: 'Книгу видалено' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
});

module.exports = router; 