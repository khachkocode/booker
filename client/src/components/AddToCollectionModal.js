import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { getUserCollections, addBookToCollection } from '../services/api';

const AddToCollectionModal = ({ show, onHide, bookId, onBookAdded }) => {
    const { user } = useAuth();
    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (show && user) {
            fetchCollections();
        }
    }, [show, user]);

    const fetchCollections = async () => {
        try {
            const response = await getUserCollections(user.id);
            setCollections(response.data);
            if (response.data.length > 0) {
                setSelectedCollection(response.data[0]._id);
            }
        } catch (error) {
            setError('Помилка при завантаженні колекцій');
            console.error('Помилка:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCollection) return;

        try {
            setLoading(true);
            setError('');
            await addBookToCollection(selectedCollection, bookId);
            onBookAdded(selectedCollection);
            onHide();
        } catch (error) {
            setError(error.response?.data?.message || 'Помилка при додаванні книги до колекції');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Додати книгу до колекції</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Виберіть колекцію</Form.Label>
                        <Form.Select
                            value={selectedCollection}
                            onChange={(e) => setSelectedCollection(e.target.value)}
                            required
                        >
                            {collections.map(collection => (
                                <option key={collection._id} value={collection._id}>
                                    {collection.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={onHide} className="me-2">
                            Скасувати
                        </Button>
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? 'Додавання...' : 'Додати'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddToCollectionModal; 