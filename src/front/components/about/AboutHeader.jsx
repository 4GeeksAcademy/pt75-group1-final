import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const AboutHeader = () => {
  return (
    <section className="bg-dark text-white py-6" style={{ paddingTop: "6rem", paddingBottom: "6rem" }}>
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <p className="text-uppercase small mb-2">Discover</p>
            <h1 className="display-4 fw-bold">Find Your Flavor</h1>
            <p className="lead">
              Connecting food lovers with unforgettable dining experiences through reviews and community engagement.
            </p>
            <p className="lead">
              Whether you're searching for local favorites or hidden gems, BiteFinder helps you discover new tastes,
              share honest opinions, and become part of a passionate food community.
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
              <Button variant="dark" className="rounded-0 ms-2">Sign Up</Button>
            </div>
          </Col>
          <Col md={6} className="text-center mt-4 mt-md-0">
            <img
              src="https://images.pexels.com/photos/2619967/pexels-photo-2619967.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Group enjoying food"
              className="img-fluid rounded"
              style={{
                maxHeight: "360px",
                objectFit: "cover",
                width: "100%",
                borderRadius: "12px"
              }}
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutHeader;
