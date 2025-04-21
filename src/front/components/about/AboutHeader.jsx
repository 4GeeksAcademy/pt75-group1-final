import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AboutHeader = () => {
  const navigate = useNavigate();

  // Navigation handler for Sign Up button
  const handleSignUpClick = () => {
    navigate('/signup');
  };

  return (
    <section className="bg-dark text-white py-5">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <p className="text-uppercase small mb-2">Discover</p>
            <h1 className="display-4 fw-bold">Find Your Flavor</h1>
            <p className="lead">
              Connecting food lovers with unforgettable dining experiences through reviews and community engagement.
            </p>
            <div className="mt-4">
            <Button
              as="a"
              href="#timeline"
              className="rounded-0 px-4 py-2 fw-bold"
              style={{ backgroundColor: "white", color: "black", border: "1px solid black" }}
            >
              Learn More
            </Button>
              <Button 
                variant="dark" 
                className="rounded-0"
                onClick={handleSignUpClick}
              >
                Sign Up
              </Button>
            </div>
          </Col>
          <Col md={6} className="text-center mt-4 mt-md-0">
            <div className="bg-secondary" style={{ width: "100%", height: "250px", borderRadius: "12px" }}>
              {/* Placeholder Image */}
              <span className="d-inline-block text-white-50" style={{ lineHeight: "250px" }}>
                Image Placeholder
              </span>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutHeader;