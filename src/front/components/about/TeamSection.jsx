import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaLinkedin, FaTimes, FaGlobe } from "react-icons/fa";

const teamMembers = [
  {
    name: "Noah Flewelling",
    title: "Front-End Lead",
    description: "Noah specializes in user interface design and page structure for BiteFinder. He ensures the app feels smooth, modern, and visually clean.",
  },
  {
    name: "Jackson Steely",
    title: "Back-End Developer",
    description: "Jackson handles the core API logic and database structure, making sure all BiteFinder functionality works reliably behind the scenes.",
  },
  {
    name: "Claudio Grisotto",
    title: "UX & Integration",
    description: "Claudio focuses on connecting front-end and back-end logic with a smooth user experience, testing routes, and cleaning up bugs.",
  },
];

const TeamSection = () => {
  return (
    <section className="py-5 bg-white">
      <Container>
        <div className="text-center mb-5" data-aos="fade-up">
          <p className="text-uppercase small">Team</p>
          <h2 className="fw-bold">Our Team</h2>
          <p className="text-muted w-75 mx-auto">
            Meet the passionate individuals behind BiteFinder.
          </p>
        </div>
        <Row className="gy-4" data-aos="fade-up">
          {teamMembers.map((member, idx) => (
            <Col key={idx} md={4} className="text-center">
              <div
                className="bg-light rounded-circle mx-auto mb-3"
                style={{
                  width: "100px",
                  height: "100px",
                  lineHeight: "100px",
                  fontSize: "40px",
                  background: "#e0e0e0",
                }}
              >
                👤
              </div>
              <h5 className="mb-0">{member.name}</h5>
              <small className="text-muted">{member.title}</small>
              <p className="mt-2">{member.description}</p>
              <div className="d-flex justify-content-center gap-3">
                <FaLinkedin />
                <FaTimes />
                <FaGlobe />
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default TeamSection;
