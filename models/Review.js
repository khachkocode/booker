const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Оновлення середнього рейтингу книги при створенні відгуку
reviewSchema.post('save', async function(doc) {
    const Book = mongoose.model('Book');
    const book = await Book.findById(doc.book);
    
    const reviews = await mongoose.model('Review').find({ book: doc.book });
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    
    book.averageRating = totalRating / reviews.length;
    book.totalReviews = reviews.length;
    await book.save();
});

module.exports = mongoose.model('Review', reviewSchema); 