import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";

const RestaurantDetails = () => {
    const { id } = useParams();


  return (
    <div>
      <Navbar />
      <p className="text-center mt-3">Viewing restaurant ID: {id}</p>

      {/* Header with Large Image and Info */}
      <section className="position-relative text-white">
        <div
          className="bg-dark"
          style={{ height: "300px", backgroundImage: "url('https://via.placeholder.com/1200x300')", backgroundSize: "cover", backgroundPosition: "center" }}
        ></div>
        <div className="container position-absolute top-50 start-50 translate-middle">
          <h1 className="fw-bold">Sample Restaurant Name</h1>
          <p className="mb-1">💲$$ • 🍝 Italian • ⭐ 4.5</p>
          <p className="mb-3">🟢 Open Now</p>
          <div className="d-flex gap-3">
            <button className="btn btn-light btn-sm">See Hours</button>
            <button className="btn btn-outline-light btn-sm">View All Photos</button>
          </div>
        </div>
      </section>

      {/* Feature Buttons */}
      <section className="container py-4">
        <div className="d-flex justify-content-center flex-wrap gap-3">
          <button className="btn btn-outline-dark">Share</button>
          <button className="btn btn-outline-dark">Save</button>
          <button className="btn btn-outline-dark">Reviews</button>
          <button className="btn btn-dark">Make Reservation</button>
        </div>
      </section>

      {/* Menu Section */}
      <section className="container py-4">
        <h3 className="fw-bold mb-3">Popular Dishes</h3>
        <ul className="list-group">
          <li className="list-group-item">🍝 Spaghetti Carbonara</li>
          <li className="list-group-item">🍕 Margherita Pizza</li>
          <li className="list-group-item">🥗 Caesar Salad</li>
        </ul>
      </section>

      {/* Location Section */}
      <section className="container py-4">
        <h3 className="fw-bold mb-3">Location & Hours</h3>
        <p>📍 123 Pasta Lane, Food City, FL 55555</p>
        <p>🕒 Open Daily: 11am – 10pm</p>
        <div className="bg-secondary" style={{ width: "100%", height: "200px", borderRadius: "8px" }}></div>
      </section>

      {/* About Section */}
      <section className="container py-4">
        <h3 className="fw-bold mb-3">About the Restaurant</h3>
        <p>
          Sample Restaurant has been serving delicious Italian cuisine since 1995. We pride ourselves on our
          family recipes, fresh ingredients, and cozy dining atmosphere.
        </p>
      </section>

      {/* Amenities Section */}
      <section className="container py-4">
        <h3 className="fw-bold mb-3">Amenities</h3>
        <ul className="list-group">
          <li className="list-group-item">🍷 Full Bar</li>
          <li className="list-group-item">🥡 Takeout Available</li>
          <li className="list-group-item">🚗 Delivery Available</li>
        </ul>
      </section>

      <Footer />
    </div>
  );
};

export default RestaurantDetails;
