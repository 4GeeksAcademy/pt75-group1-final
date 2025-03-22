import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Testimonial from "../components/Testimonial"; 
import user-placeholder.png from "../assets/img/user-placeholder.png";


const About = () => {
  return (
    <div>
      <Navbar />

      {/* Header Section */}
      <section className="text-center bg-light py-6">
        <div className="container">
          <h1 className="fw-bold">About BiteFinder</h1>
          <p className="lead text-muted mt-3">
            Discover. Share. Dine. BiteFinder connects food lovers with their next great meal through community-driven reviews and trusted recommendations.
          </p>
        </div>
      </section>

      {/* Mission, Vision, and Values */}
      <section className="container py-6">
        <h2 className="fw-bold mb-4 text-center">Our Mission, Vision & Values</h2>
        <div className="row text-center">
          <div className="col-md-4">
            <h5>🌟 Mission</h5>
            <p>To help users discover amazing restaurants and make confident dining choices based on real experiences.</p>
          </div>
          <div className="col-md-4">
            <h5>🌍 Vision</h5>
            <p>To become the world’s most trusted and community-driven restaurant discovery platform.</p>
          </div>
          <div className="col-md-4">
            <h5>💬 Values</h5>
            <p>Honesty, community, inclusivity, and a passion for food.</p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-light py-6">
        <div className="container">
          <h2 className="fw-bold mb-4 text-center">Our Journey</h2>
          <ul className="timeline list-unstyled">
            <li className="mb-4">
              <h6 className="fw-bold">2022 - Concept Born</h6>
              <p>The idea of BiteFinder was sparked by three foodies who wanted better tools to explore their local food scenes.</p>
            </li>
            <li className="mb-4">
              <h6 className="fw-bold">2023 - MVP Launched</h6>
              <p>The first version of the app launched with basic features for restaurant search and reviews.</p>
            </li>
            <li className="mb-4">
              <h6 className="fw-bold">2024 - Community Growth</h6>
              <p>Thousands of users joined BiteFinder, and the platform expanded its features and partner network.</p>
            </li>
          </ul>
        </div>
      </section>

{/* Team Section */}
<section className="container py-6 mt-5">
  <h2 className="fw-bold text-center mb-5">Meet the Team</h2>
  <div className="row justify-content-center">
    <div className="col-md-4 text-center mb-5">
      <img
        src={user-placeholder.png}
        className="rounded-circle shadow-sm mb-3"
        alt="Noah"
        style={{ width: "150px", height: "150px", objectFit: "cover" }}
      />
      <h5 className="fw-bold mb-1">Noah</h5>
      <p className="text-muted mb-0">Designer</p>
    </div>
    <div className="col-md-4 text-center mb-5">
      <img
        src={user-placeholder.png}
        className="rounded-circle shadow-sm mb-3"
        alt="Alex"
        style={{ width: "150px", height: "150px", objectFit: "cover" }}
      />
      <h5 className="fw-bold mb-1">Claudio</h5>
      <p className="text-muted mb-0">Frontend Developer</p>
    </div>
    <div className="col-md-4 text-center mb-5">
      <img
        src={user-placeholder.png}
        className="rounded-circle shadow-sm mb-3"
        alt="Jordan"
        style={{ width: "150px", height: "150px", objectFit: "cover" }}
      />
      <h5 className="fw-bold mb-1">Jackson</h5>
      <p className="text-muted mb-0">Backend Developer</p>
    </div>
  </div>
</section>


      {/* Partners Section */}
      <section className="bg-light py-6">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">Our Partners</h2>
          <div className="d-flex justify-content-center gap-5 flex-wrap">
            <img src="https://via.placeholder.com/100x50" alt="Partner 1" />
            <img src="https://via.placeholder.com/100x50" alt="Partner 2" />
            <img src="https://via.placeholder.com/100x50" alt="Partner 3" />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <Testimonial /> 

      {/* Contact Section */}
      <section className="container py-6">
        <h2 className="fw-bold text-center mb-4">Get in Touch</h2>
        <p className="text-center mb-4">
          For partnerships, media inquiries, or general questions, feel free to contact us!
        </p>
        <div className="text-center">
          <p>Email: info@bitefinder.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
