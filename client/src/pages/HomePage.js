import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BookCard from '../components/BookCard';
import CollectionCard from '../components/CollectionCard';
import { getBooks } from '../services/api';
import { getPublicCollections } from '../services/api';

const HomePage = () => {
    const [books, setBooks] = useState([]);
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [booksData, collectionsData] = await Promise.all([
                    getBooks(),
                    getPublicCollections()
                ]);
                setBooks(booksData.data);
                // Сортуємо колекції за кількістю підписників
                const sortedCollections = collectionsData.data.sort((a, b) => 
                    b.followers.length - a.followers.length
                );
                setCollections(sortedCollections);
            } catch (error) {
                setError('Помилка при завантаженні даних');
                console.error('Помилка:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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

    return (
        <Container className="mt-4">
            <div className="text-center mb-5">
                <h1 className="display-4 mb-3">Відкрийте світ книг разом з Booker</h1>
                <p className="lead text-muted">
                    Створюйте власні колекції улюблених книг, діліться враженнями та знаходьте однодумців. 
                    Ваша персональна бібліотека в цифровому форматі.
                </p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Популярні книги</h2>
                <Button 
                    variant="outline-primary"
                    onClick={() => navigate('/books')}
                >
                    Показати всі
                </Button>
            </div>

            <Row xs={1} md={2} lg={3} className="g-4 mb-5">
                {books.slice(0, 3).map(book => (
                    <Col key={book._id}>
                        <BookCard book={book} />
                    </Col>
                ))}
            </Row>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Популярні колекції</h2>
                <Button 
                    variant="outline-primary"
                    onClick={() => navigate('/collections')}
                >
                    Показати всі
                </Button>
            </div>

            <Row xs={1} md={2} lg={3} className="g-4">
                {collections.slice(0, 3).map(collection => (
                    <Col key={collection._id}>
                        <CollectionCard collection={collection} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default HomePage; 