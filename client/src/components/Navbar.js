import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Book, Collection, Person, BoxArrowRight } from 'react-bootstrap-icons';

const Navigation = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        logout();
        setShowLogoutModal(false);
        navigate('/login');
    };

    return (
        <>
            <Navbar expand="lg" className="navbar-custom">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                        <Book className="me-2" size={24} />
                        <span className="me-2">Booker</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/books" className="d-flex align-items-center">
                                <Book className="me-1" />
                                Книги
                            </Nav.Link>
                            <Nav.Link as={Link} to="/collections" className="d-flex align-items-center">
                                <Collection className="me-1" />
                                Колекції
                            </Nav.Link>
                        </Nav>
                        <Nav>
                            {user ? (
                                <>
                                    <Nav.Link as={Link} to="/profile" className="d-flex align-items-center me-2">
                                        <Person className="me-1" />
                                        {user.username}
                                    </Nav.Link>
                                    <Button 
                                        variant="outline-primary" 
                                        onClick={() => setShowLogoutModal(true)}
                                        className="d-flex align-items-center"
                                    >
                                        <BoxArrowRight className="me-1" />
                                        Вийти
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={Link} to="/login" className="d-flex align-items-center">
                                        <Person className="me-1" />
                                        Увійти
                                    </Nav.Link>
                                    <Button variant="primary" as={Link} to="/register">
                                        Реєстрація
                                    </Button>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Підтвердження виходу</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Ви дійсно бажаєте вийти з облікового запису?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
                        Скасувати
                    </Button>
                    <Button variant="primary" onClick={handleLogout}>
                        Вийти
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Navigation; 