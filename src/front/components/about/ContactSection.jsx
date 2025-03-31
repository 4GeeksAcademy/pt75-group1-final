import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const ContactSection = () => {
  return (
    <section className="py-5 bg-white">
      <Container>
        <Row className="text-center g-5 align-items-start">
          <Col md={4}>
            <FaEnvelope size={40} className="mb-3" />
            <h5 className="fw-bold">Contact</h5>
            <p className="text-muted">
              We’d love to hear from you! Reach out anytime.
            </p>
            <a href="mailto:info@bitefinder.com" className="text-dark text-decoration-none">
              info@bitefinder.com
            </a>
          </Col>
          <Col md={4}>
            <FaPhone size={40} className="mb-3" />
            <h5 className="fw-bold">Phone</h5>
            <p className="text-muted">
              For inquiries, call us directly at your convenience.
            </p>
            <a href="tel:+15551234567" className="text-dark text-decoration-none">
              +1 (555) 123–4567
            </a>
          </Col>
          <Col md={4}>
            <FaMapMarkerAlt size={40} className="mb-3" />
            <h5 className="fw-bold">Office</h5>
            <p className="text-muted">
              Visit us at our headquarters for any partnership opportunities.
            </p>
            <a
              href="https://www.google.com/maps?q=456+Culinary+Ave,+Melbourne+VIC+3000+AU"
              target="_blank"
              rel="noreferrer"
              className="text-dark text-decoration-none"
            >
              456 Culinary Ave, Melbourne VIC 3000 AU
            </a>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ContactSection;
