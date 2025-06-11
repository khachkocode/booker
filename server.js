const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Імпорт маршрутів
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const reviewRoutes = require('./routes/reviews');
const collectionRoutes = require('./routes/collections');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Підключення до MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/book-review-service', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Підключено до MongoDB'))
.catch(err => console.error('Помилка підключення до MongoDB:', err));

// Підключення маршрутів
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/collections', collectionRoutes);

// Базовий роут
app.get('/', (req, res) => {
    res.json({ message: 'Ласкаво просимо до API сервісу оцінок книг' });
});

// Обробка помилок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Щось пішло не так!', error: err.message });
});

// Порт сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
}); 