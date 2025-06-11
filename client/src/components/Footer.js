import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Github, Telegram, Instagram } from 'react-bootstrap-icons';

const Footer = () => {
    return (
        <footer className="footer mt-auto py-4 bg-white border-top">
            <Container>
                <Row className="align-items-center">
                    <Col md={4} className="text-center text-md-start mb-3 mb-md-0">
                        <h5 className="mb-3">Booker</h5>
                        <p className="text-muted mb-0">
                            Ваша персональна бібліотека в цифровому форматі
                        </p>
                    </Col>
                    <Col md={4} className="text-center mb-3 mb-md-0">
                        <h6 className="mb-3">Слідкуйте за нами</h6>
                        <div className="social-links">
                            <a href="https://github.com" className="me-3 text-dark" target="_blank" rel="noopener noreferrer">
                                <Github size={24} />
                            </a>
                            <a href="https://t.me" className="me-3 text-dark" target="_blank" rel="noopener noreferrer">
                                <Telegram size={24} />
                            </a>
                            <a href="https://instagram.com" className="text-dark" target="_blank" rel="noopener noreferrer">
                                <Instagram size={24} />
                            </a>
                        </div>
                    </Col>
                    <Col md={4} className="text-center text-md-end">
                        <p className="mb-0 text-muted">© 2025 Booker. Всі права захищено</p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer; 