import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { createCollection } from '../services/api';

const CreateCollectionModal = ({ show, onHide, onCollectionCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        isPublic: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            const response = await createCollection(formData);
            onCollectionCreated(response.data);
            onHide();
            setFormData({ name: '', description: '', isPublic: false });
        } catch (error) {
            setError(error.response?.data?.message || 'Помилка при створенні колекції');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Створити нову колекцію</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Назва колекції</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Опис</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Зробити публічною"
                            checked={formData.isPublic}
                            onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                        />
                    </Form.Group>
                    <div className="d-flex justify-content-end">
                        <Button variant="secondary" onClick={onHide} className="me-2">
                            Скасувати
                        </Button>
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? 'Створення...' : 'Створити'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default CreateCollectionModal; 