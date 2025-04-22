import React, { useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import useGlobalReducer from "../../hooks/useGlobalReducer";
import AOS from "aos";
import "aos/dist/aos.css";

const Timeline = () => {
  const { dispatch } = useGlobalReducer();

  // Initialize AOS on component mount
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: false,
      offset: 100
    });

    // Refresh AOS on window resize to handle animations correctly
    window.addEventListener('resize', AOS.refresh);

    return () => {
      window.removeEventListener('resize', AOS.refresh);
    };
  }, []);

  const timelineData = [
    {
      year: "2015",
      title: "BiteFinder Launches",
      text: "BiteFinder was founded with the vision of connecting food lovers. The platform launched with a handful of restaurants and a passionate community.",
    },
    {
      year: "2017",
      title: "User Reviews Go Live",
      text: "We introduced user-generated reviews, allowing diners to share their experiences. This feature significantly enhanced community engagement on the platform.",
    },
    {
      year: "2019",
      title: "National Restaurant Partnerships",
      text: "BiteFinder expanded its reach, partnering with over 1,000 restaurants nationwide. Our user base grew exponentially, reflecting the platform's popularity.",
    },
    {
      year: "2021",
      title: "Mobile App Release",
      text: "We launched our mobile app, making restaurant discovery even more accessible. Users can now make reservations and save favorites on-the-go.",
    },
    {
      year: "2023",
      title: "Innovating the Dining Experience",
      text: "Today, BiteFinder continues to innovate, enhancing user experience with new features. We remain committed to connecting food enthusiasts with their next favorite meal.",
    }
  ];

  const timelineImages = [
    "https://images.pexels.com/photos/3184160/pexels-photo-3184160.jpeg?auto=compress&cs=tinysrgb&w=800", // 2015: Startup/launch
    "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/4252134/pexels-photo-4252134.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "https://images.pexels.com/photos/8927699/pexels-photo-8927699.jpeg?auto=compress&cs=tinysrgb&w=800", // 2021: Mobile app
  ];

  return (
    <section id="timeline" className="py-5 bg-light">
      <Container>
        {/* Header */}
        <div className="text-center mb-5" data-aos="fade-down">
          <p className="text-uppercase small">History</p>
          <h2 className="fw-bold">Key Milestones in BiteFinder's Journey</h2>
          <p className="text-muted w-75 mx-auto">
            BiteFinder began its journey in 2015, aiming to revolutionize restaurant discovery. Over the years, we have achieved significant milestones that have shaped our platform.
          </p>
          {/* No buttons here as requested */}
        </div>

        {/* Timeline Rows Wrapper */}
        <div
          className="position-relative"
          style={{ marginTop: "80px", marginBottom: "80px" }}
        >
          {/* Vertical Line */}
          <div
            className="bg-dark position-absolute start-50 translate-middle-x"
            style={{ top: 0, bottom: 0, width: "2px", zIndex: 0 }}
          ></div>

          {timelineData.map((item, index) => {
            const isLeft = index % 2 !== 0;
            return (
              <Row
                key={index}
                className="mb-5 align-items-center position-relative"
                data-aos="fade-down"
                data-aos-delay={index * 150}
                style={{ zIndex: 1 }}
              >
                <Col md={6} className={isLeft ? "order-md-2 text-start" : "text-end"}>
                  <h5 className="fw-bold">{item.year}</h5>
                </Col>
                <Col md={6} className={isLeft ? "order-md-1" : ""}>
                  <div className="bg-white p-4 shadow-sm">
                    <h5 className="fw-bold mb-3">{item.title}</h5>
                    <p>{item.text}</p>
                    <img
                      src={timelineImages[index]}
                      alt={`Timeline event ${item.year}`}
                      className="img-fluid"
                      style={{
                        height: "200px",
                        width: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        borderRadius: "10px"
                      }}
                    />
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
            {/* Updated buttons to use React Router for navigation */}
            <Link to="/login" className="btn btn-dark me-2">
              Sign In
            </Link>
            <Link to="/signup" className="btn btn-outline-dark">
              Join &rarr;
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Timeline;