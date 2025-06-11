const express = require('express');
const router = express.Router();
const Collection = require('../models/Collection');
const auth = require('../middleware/auth');

// Отримати всі публічні колекції
router.get('/public', async (req, res) => {
    try {
        const collections = await Collection.find({ isPublic: true })
            .populate('user', 'username')
            .populate('books', 'title author coverImage')
            .sort({ createdAt: -1 });
        res.json(collections);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
});

// Отримати колекції користувача
router.get('/user', auth, async (req, res) => {
    try {
        console.log('Отримано запит на отримання колекцій користувача:', req.userId);
        
        const collections = await Collection.find({
            user: req.userId
        })
        .populate('user', 'username')
        .populate('books', 'title author coverImage')
        .sort({ createdAt: -1 });

        console.log('Знайдено колекцій:', collections.length);
        res.json(collections);
    } catch (error) {
        console.error('Помилка при отриманні колекцій користувача:', error);
        res.status(500).json({ 
            message: 'Помилка сервера', 
            error: error.message,
            stack: error.stack 
        });
    }
});

// Отримати колекцію за ID
router.get('/:id', async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id)
            .populate('user', 'username')
            .populate('books', 'title author description coverImage averageRating totalReviews genre')
            .populate('followers', 'username');

        if (!collection) {
            return res.status(404).json({ message: 'Колекцію не знайдено' });
        }

        // Перевіряємо чи користувач має доступ до колекції
        if (!collection.isPublic && (!req.userId || collection.user.toString() !== req.userId)) {
            return res.status(403).json({ message: 'Доступ до цієї колекції заборонено' });
        }

        res.json(collection);
    } catch (error) {
        console.error('Помилка при отриманні колекції:', error);
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
});

// Створити нову колекцію
router.post('/', auth, async (req, res) => {
    try {
        const collection = new Collection({
            ...req.body,
            user: req.userId
        });
        await collection.save();
        res.status(201).json(collection);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
});

// Оновити колекцію
router.put('/:id', auth, async (req, res) => {
    try {
        const collection = await Collection.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!collection) {
            return res.status(404).json({ message: 'Колекцію не знайдено' });
        }

        Object.assign(collection, req.body);
        collection.updatedAt = Date.now();
        await collection.save();
        res.json(collection);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
});

// Видалити колекцію
router.delete('/:id', auth, async (req, res) => {
    try {
        const collection = await Collection.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });

        if (!collection) {
            return res.status(404).json({ message: 'Колекцію не знайдено' });
        }

        res.json({ message: 'Колекцію видалено' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
});

// Додати книгу до колекції
router.post('/:id/books/:bookId', auth, async (req, res) => {
    try {
        const collection = await Collection.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!collection) {
            return res.status(404).json({ message: 'Колекцію не знайдено' });
        }

        const bookId = req.params.bookId;
        if (!collection.books.includes(bookId)) {
            collection.books.push(bookId);
            await collection.save();
        }

        res.json(collection);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
});

// Видалити книгу з колекції
router.delete('/:id/books/:bookId', auth, async (req, res) => {
    try {
        const collection = await Collection.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!collection) {
            return res.status(404).json({ message: 'Колекцію не знайдено' });
        }

        collection.books = collection.books.filter(
            bookId => bookId.toString() !== req.params.bookId
        );
        await collection.save();
        res.json(collection);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
});

// Підписатися на колекцію
router.post('/:id/follow', auth, async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);
        if (!collection) {
            return res.status(404).json({ message: 'Колекцію не знайдено' });
        }

        if (collection.user.toString() === req.userId) {
            return res.status(400).json({ message: 'Ви не можете підписатися на свою колекцію' });
        }

        const followerIndex = collection.followers.indexOf(req.userId);
        if (followerIndex === -1) {
            collection.followers.push(req.userId);
        } else {
            collection.followers.splice(followerIndex, 1);
        }

        await collection.save();
        res.json(collection);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
});

module.exports = router; 