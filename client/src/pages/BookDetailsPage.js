import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Star, StarFill } from 'react-bootstrap-icons';
import { useAuth } from '../context/AuthContext';
import { getBook, getBookReviews, createReview, deleteReview } from '../services/api';
import ReviewCard from '../components/ReviewCard';
import AddToCollectionModal from '../components/AddToCollectionModal';

const BookDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);
    const [showAddToCollection, setShowAddToCollection] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [bookResponse, reviewsResponse] = await Promise.all([
                    getBook(id),
                    getBookReviews(id)
                ]);
                
                if (bookResponse.data) {
                    setBook(bookResponse.data);
                } else {
                    setError('Книгу не знайдено');
                }
                
                if (reviewsResponse.data) {
                    setReviews(reviewsResponse.data);
                }
            } catch (error) {
                console.error('Помилка при завантаженні даних:', error);
                setError(error.response?.data?.message || 'Помилка при завантаженні даних');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('Будь ласка, увійдіть щоб залишити відгук');
            return;
        }

        try {
            setSubmitting(true);
            const response = await createReview({
                bookId: id,
                ...newReview
            });
            setReviews([response.data, ...reviews]);
            setNewReview({ rating: 5, comment: '' });
        } catch (error) {
            setError(error.response?.data?.message || 'Помилка при створенні відгуку');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await deleteReview(reviewId);
            setReviews(reviews.filter(review => review._id !== reviewId));
        } catch (error) {
            setError('Помилка при видаленні відгуку');
        }
    };

    const handleBookAddedToCollection = (collectionId) => {
        if (book) {
            setBook({
                ...book,
                collections: [...book.collections, collectionId]
            });
        }
    };

    if (loading) {
        return (
            <Container className="mt-5">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Завантаження...</span>
                    </div>
                </div>
            </Container>
        );
    }

    if (!book) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">Книгу не знайдено</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Row>
                <Col md={4}>
                    <Card>
                        <Card.Img
                            variant="top"
                            src={book.coverImage}
                            alt={book.title}
                            style={{ height: '400px', objectFit: 'cover' }}
                        />
                    </Card>
                </Col>
                <Col md={8}>
                    <h1>{book.title}</h1>
                    <h4 className="text-muted mb-4">{book.author}</h4>
                    <p>{book.description}</p>
                    <div className="mb-4">
                        <h5>Жанри:</h5>
                        <div className="d-flex gap-2">
                            {book.genre.map((genre, index) => (
                                <span key={index} className="badge bg-secondary">
                                    {genre}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <h5>Рейтинг:</h5>
                        <div className="d-flex align-items-center">
                            <StarFill className="text-warning me-1" />
                            <span>{book.averageRating.toFixed(1)}</span>
                            <span className="text-muted ms-2">
                                ({book.totalReviews} відгуків)
                            </span>
                        </div>
                    </div>
                    {user && (
                        <Button 
                            variant="outline-primary" 
                            onClick={() => setShowAddToCollection(true)}
                            className="mb-4"
                        >
                            Додати до колекції
                        </Button>
                    )}
                </Col>
            </Row>

            <Row className="mt-5">
                <Col>
                    <h2>Відгуки</h2>
                    {user && (
                        <Card className="mb-4">
                            <Card.Body>
                                <Form onSubmit={handleSubmitReview}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Оцінка</Form.Label>
                                        <div className="d-flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Button
                                                    key={star}
                                                    variant="link"
                                                    className="p-0"
                                                    onClick={() => setNewReview({ ...newReview, rating: star })}
                                                >
                                                    {star <= newReview.rating ? (
                                                        <StarFill className="text-warning" />
                                                    ) : (
                                                        <Star className="text-warning" />
                                                    )}
                                                </Button>
                                            ))}
                                        </div>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Ваш відгук</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            value={newReview.comment}
                                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                            required
                                        />
                                    </Form.Group>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Відправка...' : 'Залишити відгук'}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    )}

                    {error && <Alert variant="danger">{error}</Alert>}

                    {reviews.map(review => (
                        <ReviewCard
                            key={review._id}
                            review={review}
                            onDelete={handleDeleteReview}
                        />
                    ))}
                </Col>
            </Row>

            <AddToCollectionModal
                show={showAddToCollection}
                onHide={() => setShowAddToCollection(false)}
                bookId={id}
                onBookAdded={handleBookAddedToCollection}
            />
        </Container>
    );
};

export default BookDetailsPage; 