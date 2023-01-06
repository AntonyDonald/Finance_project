import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <Container>
            <Row>
                <Col md={12}>
                    <div style={{ textAlign: 'center' }}>
                        <h1>Finance Collection</h1>
                    </div>
                </Col>
                <Col>
                    <div>
                        <h4>Customer information &nbsp;
                            <Link to='/customer'>
                                <Button><FaArrowRight /></Button>
                            </Link>
                        </h4>
                    </div>
                    <div>
                        <h4>Product Details &nbsp;
                            <Link to='/product'>
                                <Button><FaArrowRight /></Button>
                            </Link>
                        </h4>
                    </div>
                    <div>
                        <h4>Basic Details &nbsp;
                            <Link to='/details'>
                                <Button><FaArrowRight /></Button>
                            </Link>
                        </h4>
                    </div>
                    <div>
                        <h4>Transaction Details &nbsp;
                            <Link to='/transaction'>
                                <Button><FaArrowRight /></Button>
                            </Link>
                        </h4>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default HomePage