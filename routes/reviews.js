const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Book = require('../models/Book');
const auth = require('../middleware/auth');

// Отримати всі відгуки для книги
router.get('/book/:bookId', async (req, res) => {
    try {
        const reviews = await Review.find({ book: req.params.bookId })
            .populate('user', 'username')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
});

// Створити новий відгук
router.post('/', auth, async (req, res) => {
    try {
        const { bookId, rating, comment } = req.body;

        // Перевірка чи користувач вже залишив відгук
        const existingReview = await Review.findOne({
            user: req.userId,
            book: bookId
        });

        if (existingReview) {
            return res.status(400).json({ message: 'Ви вже залишили відгук для цієї книги' });
        }

        const review = new Review({
            user: req.userId,
            book: bookId,
            rating,
            comment
        });

        await review.save();

        // Оновлення середнього рейтингу книги
        const book = await Book.findById(bookId);
        const reviews = await Review.find({ book: bookId });
        book.averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        book.totalReviews = reviews.length;
        await book.save();

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
});

// Оновити відгук
router.put('/:id', auth, async (req, res) => {
    try {
        const review = await Review.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!review) {
            return res.status(404).json({ message: 'Відгук не знайдено' });
        }

        review.rating = req.body.rating;
        review.comment = req.body.comment;
        review.updatedAt = Date.now();

        await review.save();
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
});

// Видалити відгук
router.delete('/:id', auth, async (req, res) => {
    try {
        const review = await Review.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });

        if (!review) {
            return res.status(404).json({ message: 'Відгук не знайдено' });
        }

        // Оновлення середнього рейтингу книги
        const book = await Book.findById(review.book);
        const reviews = await Review.find({ book: review.book });
        book.averageRating = reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
            : 0;
        book.totalReviews = reviews.length;
        await book.save();

        res.json({ message: 'Відгук видалено' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
});

// Лайкнути відгук
router.post('/:id/like', auth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).json({ message: 'Відгук не знайдено' });
        }

        const likeIndex = review.likes.indexOf(req.userId);
        if (likeIndex === -1) {
            review.likes.push(req.userId);
        } else {
            review.likes.splice(likeIndex, 1);
        }

        await review.save();
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
});

module.exports = router; 