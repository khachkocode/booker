import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { followCollection, deleteCollection } from '../services/api';
import { Collection, People, Book, CheckCircleFill, Trash } from 'react-bootstrap-icons';

const CollectionCard = ({ collection, onDelete }) => {
    const { user } = useAuth();
    const [isFollowing, setIsFollowing] = useState(collection.followers.includes(user?.id));
    const [isOwner, setIsOwner] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        if (user && collection.user) {
            console.log('User ID:', user.id);
            console.log('Collection User ID:', collection.user._id);
            setIsOwner(user.id === collection.user._id);
        }
    }, [user, collection]);

    const handleFollow = async () => {
        if (!user) return;
        
        try {
            await followCollection(collection._id);
            const newIsFollowing = !isFollowing;
            setIsFollowing(newIsFollowing);
            
            collection.followers = newIsFollowing
                ? [...collection.followers, user.id]
                : collection.followers.filter(id => id !== user.id);
        } catch (error) {
            console.error('Помилка при підписці на колекцію:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteCollection(collection._id);
            if (onDelete) {
                onDelete(collection._id);
            }
            setShowDeleteModal(false);
            window.location.reload();
        } catch (error) {
            console.error('Помилка при видаленні колекції:', error);
        }
    };

    return (
        <>
            <Card className="h-100 collection-card fade-in">
                <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                            <Card.Title className="collection-title">
                                <Collection className="me-2" />
                                {collection.name}
                            </Card.Title>
                            <Card.Subtitle className="collection-author">
                                Автор: {collection.user.username}
                            </Card.Subtitle>
                        </div>
                        {isOwner ? (
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => setShowDeleteModal(true)}
                                className="delete-btn"
                            >
                                <Trash />
                            </Button>
                        ) : user && (
                            <Button
                                variant={isFollowing ? "outline-secondary" : "outline-primary"}
                                onClick={handleFollow}
                                className={`follow-btn ${isFollowing ? 'active' : ''}`}
                            >
                                {isFollowing ? (
                                    <>
                                        <CheckCircleFill className="me-1" />
                                        Ви підписані
                                    </>
                                ) : (
                                    <>
                                        <People className="me-1" />
                                        Підписатися
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                    
                    <Card.Text className="collection-description">
                        {collection.description || 'Немає опису'}
                    </Card.Text>

                    <div className="collection-stats mt-auto">
                        <div className="d-flex align-items-center mb-2">
                            <Book className="me-2 text-primary" />
                            <span>{collection.books.length} книг</span>
                        </div>
                        <div className="d-flex align-items-center">
                            <People className="me-2 text-primary" />
                            <span>{collection.followers.length} підписників</span>
                        </div>
                    </div>

                    <Button 
                        variant="primary" 
                        as={Link} 
                        to={`/collections/${collection._id}`}
                        className="mt-3 w-100"
                    >
                        Переглянути
                    </Button>
                </Card.Body>
            </Card>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Видалення колекції</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Ви впевнені, що хочете видалити колекцію "{collection.name}"?
                    Це не можна буде відмінити.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Скасувати
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Видалити
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CollectionCard; 