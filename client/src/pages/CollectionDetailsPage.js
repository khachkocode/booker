import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { getCollection, followCollection } from '../services/api';
import BookCard from '../components/BookCard';

const CollectionDetailsPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isOwner, setIsOwner] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        fetchCollection();
    }, [id]);

    useEffect(() => {
        if (user && collection) {
            console.log('User ID:', user.id);
            console.log('Collection User ID:', collection.user._id);
            setIsOwner(user.id === collection.user._id);
            setIsFollowing(collection.followers.includes(user.id));
        }
    }, [user, collection]);

    const fetchCollection = async () => {
        try {
            const response = await getCollection(id);
            setCollection(response.data);
        } catch (error) {
            setError('Помилка при завантаженні колекції');
            console.error('Помилка:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async () => {
        try {
            await followCollection(id);
            setIsFollowing(!isFollowing);
            setCollection(prev => ({
                ...prev,
                followers: prev.followers.includes(user.id)
                    ? prev.followers.filter(followerId => followerId !== user.id)
                    : [...prev.followers, user.id]
            }));
        } catch (error) {
            setError('Помилка при підписці на колекцію');
            console.error('Помилка:', error);
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

    if (!collection) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">Колекцію не знайдено</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Row>
                <Col>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1>{collection.name}</h1>
                            <p className="text-muted">Автор: {collection.user.username}</p>
                        </div>
                        {!isOwner && user && (
                            <Button
                                variant={isFollowing ? "outline-secondary" : "outline-primary"}
                                onClick={handleFollow}
                            >
                                {isFollowing ? 'Відписатися' : 'Підписатися'}
                            </Button>
                        )}
                    </div>

                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Опис</Card.Title>
                            <Card.Text>
                                {collection.description || 'Немає опису'}
                            </Card.Text>
                            <div className="d-flex gap-3">
                                <span className="text-muted">
                                    {collection.books.length} книг
                                </span>
                                <span className="text-muted">
                                    {collection.followers.length} підписників
                                </span>
                            </div>
                        </Card.Body>
                    </Card>

                    <h2 className="mb-4">Книги в колекції</h2>
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {collection.books.map(book => (
                            <Col key={book._id}>
                                <BookCard book={book} />
                            </Col>
                        ))}
                    </Row>

                    {error && <Alert variant="danger" className="mt-4">{error}</Alert>}
                </Col>
            </Row>
        </Container>
    );
};

export default CollectionDetailsPage; 