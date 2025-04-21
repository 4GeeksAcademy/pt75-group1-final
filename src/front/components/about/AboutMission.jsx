import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const AboutMission = () => {
  return (
    <section className="py-5 bg-white">
      <Container>
        <Row className="align-items-center">
          <Col md={6}>
            <h2 className="fw-bold mb-4">
              Connecting Food Lovers with Unforgettable Dining Experiences
            </h2>
          </Col>
          <Col md={6}>
            <p>
              At BiteFinder, our mission is to unite food enthusiasts with exceptional dining experiences.
              We believe that every meal should be memorable, and our platform is designed to help you discover
              the best restaurants tailored to your tastes. Our values center around community engagement,
              transparency, and a passion for culinary exploration.
            </p>
          </Col>
        </Row>

        <div className="mt-5">
          <img
            src="https://images.pexels.com/photos/4252136/pexels-photo-4252136.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Chef preparing food"
            className="img-fluid w-100"
            style={{
              height: "600px",
              objectFit: "cover",
              objectPosition: "center 90%",
              borderRadius: "15px"
            }}
          />
        </div>
      </Container>
    </section>
  );
};

export default AboutMission;
