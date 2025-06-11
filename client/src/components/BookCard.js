import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { StarFill } from 'react-bootstrap-icons';

const BookCard = ({ book }) => {
    return (
        <Card className="h-100 book-card">
            <div className="book-image-container">
                <Card.Img
                    variant="top"
                    src={book.coverImage}
                    alt={book.title}
                    className="book-image"
                />
            </div>
            <Card.Body className="d-flex flex-column">
                <Card.Title className="book-title">{book.title}</Card.Title>
                <Card.Subtitle className="book-author mb-2">{book.author}</Card.Subtitle>
                <Card.Text className="book-description">
                    {book.description.length > 100
                        ? `${book.description.substring(0, 100)}...`
                        : book.description}
                </Card.Text>
                <div className="book-rating mt-auto">
                    <div className="d-flex align-items-center mb-3">
                        <StarFill className="text-warning me-1" />
                        <span className="rating-value">{book.averageRating.toFixed(1)}</span>
                        <span className="rating-count">({book.totalReviews} відгуків)</span>
                    </div>
                    <div className="d-flex gap-2">
                        <Button 
                            variant="primary" 
                            as={Link} 
                            to={`/books/${book._id}`}
                            className="w-100"
                        >
                            Детальніше
                        </Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default BookCard; 