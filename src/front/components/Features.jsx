import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import d1 from "../assets/discover/d1.jpg";
import d2 from "../assets/discover/d2.jpg";
import d3 from "../assets/discover/d3.jpg";

const features = [
  {
    id: 1,
    title: "Effortless Restaurant Search at Your Fingertips",
    description: "Find restaurants based on cuisine, location, and ratings.",
    image: d1,
    alt: "Search Feature",
  },
  {
    id: 2,
    title: "Make Reservations with Just a Few Clicks",
    description: "Secure your table instantly and avoid long waits.",
    image: d2,
    alt: "Reservations Feature",
  },
  {
    id: 3,
    title: "Share Your Dining Experiences with the Community",
    description: "Post reviews and photos to help others discover.",
    image: d3,
    alt: "Reviews Feature",
  },
];

const Features = () => {
  return (
    <section className="bg-white py-5 border-top border-bottom">
      <div className="container">
        {/* Label */}
        <p className="text-uppercase text-muted fw-semibold small mb-2">Discover</p>

        {/* Title & Description */}
        <h2 className="fw-bold mb-3 fs-2">
          Explore the Best Dining Experiences Near You
        </h2>
        <p className="text-muted fs-5 mb-4" style={{ maxWidth: "720px" }}>
          BiteFinder connects food lovers with their next favorite restaurant.
          From reviews to reservations, we make dining out effortless.
        </p>

        {/* Card Grid */}
        <div className="row row-cols-1 row-cols-md-3 g-4 mt-2 mb-5">
          {features.map((feature) => (
            <div key={feature.id} className="col d-flex align-items-stretch">
              <div className="card shadow-sm border-0 p-3 transition hover-float text-start">
                <img
                  src={feature.image}
                  alt={feature.alt}
                  className="img-fluid w-100"
                  style={{
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <div className="card-body px-0 pt-3">
                  <h5 className="fw-bold">{feature.title}</h5>
                  <p>{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="d-flex gap-3">
          <Link to="/about">
            <button className="btn btn-outline-dark px-4 py-2">Learn More</button>
          </Link>
          <Link to="/signup">
            <button className="btn btn-dark px-4 py-2">Sign Up</button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;