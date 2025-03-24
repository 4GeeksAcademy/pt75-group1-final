import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const Restaurants = () => {
  return (
    <div>
      <Navbar />

      {/* Hero Search Header */}
      <section className="py-5 bg-light">
        <div className="container d-flex flex-column align-items-center">
          <h2 className="fw-bold mb-3">Find Restaurants Near You</h2>
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search for restaurants..."
          />
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="container py-4">
        <div className="d-flex justify-content-center flex-wrap gap-3">
          <button className="btn btn-outline-dark">Top Rated</button>
          <button className="btn btn-outline-dark">Price</button>
          <button className="btn btn-outline-dark">Open Now</button>
          <button className="btn btn-outline-dark">Offers Delivery</button>
        </div>
      </section>

      {/* Gallery of Restaurants */}
      <section className="container py-5">
        <div className="row g-4">
          {/* 🔥 Repeat this card for each restaurant */}
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <img
                src="https://via.placeholder.com/400x200"
                className="card-img-top"
                alt="Restaurant"
              />
              <div className="card-body">
                <h5 className="card-title">
                  <Link to="/restaurant/r1" className="text-decoration-none text-dark">
                    COTE Miami
                  </Link>
                </h5>
                <p className="card-text">
                  📍 0.5 miles • 🍔 Burgers • ⭐ 4.5 (120 reviews)
                </p>
                <div className="d-flex justify-content-between">
                  <button className="btn btn-sm btn-dark">Contact</button>
                  <button className="btn btn-sm btn-outline-dark">Reviews</button>
                    <Link to="/restaurant/r1" className="btn btn-sm btn-outline-secondary">
                      Gallery
                    </Link>
                </div>
              </div>
            </div>
          </div>
          {/* 🔁 Add more cards later when API is connected */}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Restaurants;
