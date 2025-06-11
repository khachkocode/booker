import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookDetailsPage from './pages/BookDetailsPage';
import CollectionsPage from './pages/CollectionsPage';
import BooksPage from './pages/BooksPage';
import CollectionDetailsPage from './pages/CollectionDetailsPage';
import ProfilePage from './pages/ProfilePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="d-flex flex-column min-vh-100">
                    <Navigation />
                    <main className="flex-grow-1">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/books" element={<BooksPage />} />
                            <Route path="/books/:id" element={<BookDetailsPage />} />
                            <Route path="/collections" element={<CollectionsPage />} />
                            <Route path="/collections/:id" element={<CollectionDetailsPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
