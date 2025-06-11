import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { getPublicCollections } from '../services/api';
import CollectionCard from '../components/CollectionCard';
import CreateCollectionModal from '../components/CreateCollectionModal';

const CollectionsPage = () => {
    const { user } = useAuth();
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            const response = await getPublicCollections();
            setCollections(response.data);
        } catch (error) {
            setError('Помилка при завантаженні колекцій');
            console.error('Помилка:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCollectionCreated = (newCollection) => {
        setCollections([newCollection, ...collections]);
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
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Колекції книг</h1>
                {user && (
                    <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                        Створити колекцію
                    </Button>
                )}
            </div>

            <Row xs={1} md={2} lg={3} className="g-4">
                {collections.map(collection => (
                    <Col key={collection._id}>
                        <CollectionCard collection={collection} />
                    </Col>
                ))}
            </Row>

            <CreateCollectionModal
                show={showCreateModal}
                onHide={() => setShowCreateModal(false)}
                onCollectionCreated={handleCollectionCreated}
            />
        </Container>
    );
};

export default CollectionsPage; 