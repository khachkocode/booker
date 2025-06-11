import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Tabs, Tab } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { getUserCollections, getPublicCollections } from '../services/api';
import CollectionCard from '../components/CollectionCard';

const ProfilePage = () => {
    const { user } = useAuth();
    const [myCollections, setMyCollections] = useState([]);
    const [subscribedCollections, setSubscribedCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCollections = async () => {
        try {
            const [myCollectionsResponse, publicCollectionsResponse] = await Promise.all([
                getUserCollections(),
                getPublicCollections()
            ]);
            
            setMyCollections(myCollectionsResponse.data);
            
            // Фільтруємо публічні колекції, щоб знайти тільки ті, на які користувач підписаний
            const subscribed = publicCollectionsResponse.data.filter(
                collection => collection.followers.includes(user.id)
            );
            setSubscribedCollections(subscribed);
        } catch (error) {
            setError('Помилка при завантаженні колекцій');
            console.error('Помилка:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCollections();
        }
    }, [user]);

    const handleDeleteCollection = (collectionId) => {
        // Оновлюємо список моїх колекцій
        setMyCollections(prevCollections => 
            prevCollections.filter(collection => collection._id !== collectionId)
        );
        // Оновлюємо список підписаних колекцій
        setSubscribedCollections(prevCollections => 
            prevCollections.filter(collection => collection._id !== collectionId)
        );
    };

    if (!user) {
        return (
            <Container className="mt-5">
                <Alert variant="warning">Будь ласка, увійдіть щоб переглянути профіль</Alert>
            </Container>
        );
    }

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
            <Row>
                <Col md={4}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Профіль користувача</Card.Title>
                            <Card.Text>
                                <strong>Ім'я користувача:</strong> {user.username}
                            </Card.Text>
                            <Card.Text>
                                <strong>Email:</strong> {user.email}
                            </Card.Text>
                            <Card.Text>
                                <strong>Роль:</strong> {user.role === 'admin' ? 'Адміністратор' : 'Користувач'}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    <Tabs defaultActiveKey="my-collections" className="mb-4">
                        <Tab eventKey="my-collections" title="Мої колекції">
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Row xs={1} md={2} className="g-4">
                                {myCollections.map(collection => (
                                    <Col key={collection._id}>
                                        <CollectionCard 
                                            collection={collection} 
                                            onDelete={handleDeleteCollection}
                                        />
                                    </Col>
                                ))}
                            </Row>
                            {myCollections.length === 0 && (
                                <Alert variant="info">
                                    У вас поки немає колекцій. Створіть нову колекцію, щоб почати!
                                </Alert>
                            )}
                        </Tab>
                        <Tab eventKey="subscribed" title="Підписані колекції">
                            <Row xs={1} md={2} className="g-4">
                                {subscribedCollections.map(collection => (
                                    <Col key={collection._id}>
                                        <CollectionCard 
                                            collection={collection}
                                            onDelete={handleDeleteCollection}
                                        />
                                    </Col>
                                ))}
                            </Row>
                            {subscribedCollections.length === 0 && (
                                <Alert variant="info">
                                    Ви ще не підписалися на жодну колекцію. Знайдіть цікаві колекції на сторінці колекцій!
                                </Alert>
                            )}
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfilePage; 