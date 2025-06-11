import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Додаємо токен до всіх запитів
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Книги
export const getBooks = () => api.get('/books');
export const getBook = (id) => api.get(`/books/${id}`);
export const searchBooks = (query) => api.get('/books/search', { params: { q: query } });
export const createBook = (data) => api.post('/books', data);
export const updateBook = (id, data) => api.put(`/books/${id}`, data);
export const deleteBook = (id) => api.delete(`/books/${id}`);

// Відгуки
export const getBookReviews = (bookId) => api.get(`/reviews/book/${bookId}`);
export const createReview = (data) => api.post('/reviews', data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);
export const likeReview = (id) => api.post(`/reviews/${id}/like`);

// Колекції
export const getPublicCollections = () => api.get('/collections/public');
export const getUserCollections = () => api.get('/collections/user');
export const createCollection = (data) => api.post('/collections', data);
export const getCollection = (id) => api.get(`/collections/${id}`);
export const updateCollection = (id, data) => api.put(`/collections/${id}`, data);
export const deleteCollection = (id) => api.delete(`/collections/${id}`);
export const addBookToCollection = (collectionId, bookId) => 
    api.post(`/collections/${collectionId}/books/${bookId}`);
export const removeBookFromCollection = (collectionId, bookId) => 
    api.delete(`/collections/${collectionId}/books/${bookId}`);
export const followCollection = (id) => api.post(`/collections/${id}/follow`);
export const unfollowCollection = (id) => api.delete(`/collections/${id}/follow`);

// Автентифікація
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const getCurrentUser = () => api.get('/auth/me');

export default api; 