import React, { useState } from 'react';
import { Card, Button, Toast } from 'react-bootstrap';
import { StarFill, Heart, HeartFill } from 'react-bootstrap-icons';
import { useAuth } from '../context/AuthContext';
import { likeReview } from '../services/api';

const ReviewCard = ({ review, onDelete }) => {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState(review.likes.includes(user?._id));
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleLike = async () => {
        try {
            await likeReview(review._id);
            setIsLiked(!isLiked);
            setToastMessage(isLiked ? 'Ви прибрали лайк' : 'Ви поставили лайк');
            setShowToast(true);
            
            // Оновлення стану відгуку після лайку
            review.likes = isLiked
                ? review.likes.filter(id => id !== user._id)
                : [...review.likes, user._id];
        } catch (error) {
            console.error('Помилка при лайку відгуку:', error);
        }
    };

    return (
        <>
            <Card className="mb-3 review-card fade-in">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <Card.Title className="review-author">{review.user.username}</Card.Title>
                            <div className="d-flex align-items-center mb-2">
                                <StarFill className="text-warning me-1" />
                                <span className="rating-value">{review.rating}</span>
                            </div>
                            <Card.Text className="review-text">{review.comment}</Card.Text>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <Button
                                variant="link"
                                className={`p-0 like-button ${isLiked ? 'active' : ''}`}
                                onClick={handleLike}
                                disabled={!user}
                            >
                                {isLiked ? (
                                    <HeartFill className="text-danger" />
                                ) : (
                                    <Heart className="text-muted" />
                                )}
                            </Button>
                            <span className="likes-count">{review.likes.length}</span>
                            {user && user._id === review.user._id && (
                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => onDelete(review._id)}
                                    className="delete-btn"
                                >
                                    Видалити
                                </Button>
                            )}
                        </div>
                    </div>
                    <Card.Text className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                    </Card.Text>
                </Card.Body>
            </Card>

            <Toast 
                show={showToast} 
                onClose={() => setShowToast(false)} 
                delay={3000} 
                autohide
                className="toast-notification"
            >
                <Toast.Header>
                    <strong className="me-auto">Сповіщення</strong>
                </Toast.Header>
                <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
        </>
    );
};

export default ReviewCard; 