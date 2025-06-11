import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Alert } from 'react-bootstrap';
import BookCard from '../components/BookCard';
import { getBooks, searchBooks } from '../services/api';

const BooksPage = () => {
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await getBooks();
                setBooks(response.data);
            } catch (error) {
                setError('Помилка при завантаженні книг');
                console.error('Помилка:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            setLoading(true);
            const response = await searchBooks(searchQuery);
            setBooks(response.data);
        } catch (error) {
            setError('Помилка при пошуку');
            console.error('Помилка:', error);
        } finally {
            setLoading(false);
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

    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">Всі книги</h1>
            
            <Form onSubmit={handleSearch} className="mb-4">
                <Form.Group>
                    <Form.Control
                        type="text"
                        placeholder="Пошук книг..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Form.Group>
            </Form>

            {error && <Alert variant="danger">{error}</Alert>}

            <Row xs={1} md={2} lg={3} className="g-4">
                {books.map(book => (
                    <Col key={book._id}>
                        <BookCard book={book} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default BooksPage; 