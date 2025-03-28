import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const timelineData = [
  {
    year: "2015",
    text: "BiteFinder was founded with the vision of connecting food lovers. The platform launched with a handful of restaurants and a passionate community.",
  },
  {
    year: "2017",
    text: "We introduced user-generated reviews, allowing diners to share their experiences. This feature significantly enhanced community engagement on the platform.",
  },
  {
    year: "2019",
    text: "BiteFinder expanded its reach, partnering with over 1,000 restaurants nationwide. Our user base grew exponentially, reflecting the platform’s popularity.",
  },
  {
    year: "2021",
    text: "We launched our mobile app, making restaurant discovery even more accessible. Users can now make reservations and save favorites on-the-go.",
  },
  {
    year: "2023",
    text: "Today, BiteFinder continues to innovate, enhancing user experience with new features. We remain committed to connecting food enthusiasts with their next favorite meal.",
  },
];

const Timeline = () => {
    return (
      <section className="py-5 bg-light">
        <Container>
          {/* Header */}
          <div className="text-center mb-5" data-aos="fade-up">
            <p className="text-uppercase small">History</p>
            <h2 className="fw-bold">Key Milestones in BiteFinder's Journey</h2>
            <p className="text-muted w-75 mx-auto">
              BiteFinder began its journey in 2015, aiming to revolutionize restaurant discovery. Over the years, we have achieved significant milestones that have shaped our platform.
            </p>
            <div className="mt-3">
              <Button variant="dark" className="me-2 rounded-0">Learn More</Button>
              <Button variant="outline-dark" className="rounded-0">Sign Up</Button>
            </div>
          </div>
  
          {/* Timeline Rows Wrapper */}
          <div
            className="position-relative"
            style={{ marginTop: "80px", marginBottom: "80px" }}
          >
            {/* Vertical Line inside just the timeline area */}
            <div
              className="bg-dark position-absolute start-50 translate-middle-x"
              style={{
                top: 0,
                bottom: 0,
                width: "2px",
                zIndex: 0,
              }}
            ></div>
  
            {/* Timeline Items */}
            {timelineData.map((item, index) => {
              const isLeft = index % 2 !== 0;
              return (
                <Row
                  key={index}
                  className="mb-5 align-items-center position-relative"
                  data-aos="fade-up"
                  style={{ zIndex: 1 }}
                >
                  <Col md={6} className={isLeft ? "order-md-2 text-start" : "text-end"}>
                    <h5 className="fw-bold">{item.year}</h5>
                  </Col>
                  <Col md={6} className={isLeft ? "order-md-1" : ""}>
                    <div className="bg-white p-4 shadow-sm">
                      <p>{item.text}</p>
                      <div className="d-flex gap-2 mb-3">
                        <Button variant="outline-dark" className="rounded-0">Button</Button>
                        <Button variant="link" className="text-decoration-none">Button &rarr;</Button>
                      </div>
                      <div
                        className="bg-secondary text-white text-center"
                        style={{
                          height: "200px",
                          borderRadius: "10px",
                          lineHeight: "200px",
                        }}
                      >
                        Image Placeholder
                      </div>
                    </div>
                  </Col>
                </Row>
              );
            })}
          </div>
  
          {/* Bottom Message */}
          <div className="text-center pt-4 mt-5 border-top" data-aos="fade-up">
            <p className="text-uppercase small">Journey</p>
            <h3 className="fw-bold">Our Ongoing Commitment to Food Lovers</h3>
            <p className="text-muted w-75 mx-auto">
              BiteFinder is dedicated to enhancing the dining experience for everyone. Join us as we continue to explore new culinary adventures together.
            </p>
            <div>
              <Button variant="dark" className="me-2 rounded-0">Button</Button>
              <Button variant="outline-dark" className="rounded-0">Button &rarr;</Button>
            </div>
          </div>
        </Container>
      </section>
    );
  };
  
  export default Timeline;
  