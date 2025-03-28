import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useLocation } from "react-router-dom";
import { restaurantData } from "./restaurantData";
import PageWrapper from "../components/PageWrapper";


const Restaurants = () => {
  const location = useLocation();
  const [alert, setAlert] = useState(location.state?.message || null);
  const reviewId = location.state?.reviewId || null;

  useEffect(() => {
    if (location.state) {
      // Prevent alert from showing again on refresh
      window.history.replaceState({}, document.title);
    }
  }, []);

  return (
    <div>
      <Navbar />
      <PageWrapper>

      {/* Success Alert */}
      {alert && (
        <div className="alert alert-success alert-dismissible fade show m-0 rounded-0 text-center" role="alert">
          {alert}
          {reviewId && (
            <>
              {" "}
              <Link to="#" className="alert-link">
                View
              </Link>
            </>
          )}
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlert(null)}
          ></button>
        </div>
      )}

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
          {Object.entries(restaurantData).map(([id, restaurant]) => (
            <div key={id} className="col-md-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={restaurant.images[0]}
                  className="card-img-top"
                  alt={restaurant.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    <Link to={`/restaurant/${id}`} className="text-decoration-none text-dark">
                      {restaurant.name}
                    </Link>
                  </h5>
                  <p className="card-text">
                    {restaurant.location} • {restaurant.cuisine} • ⭐ {restaurant.rating}
                  </p>
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-sm btn-dark">Contact</button>
                    <button className="btn btn-sm btn-outline-dark">Reviews</button>
                    <Link to={`/restaurant/${id}`} className="btn btn-sm btn-outline-secondary">
                      Gallery
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      </PageWrapper>
      <Footer />
    </div>
  );
};

export default Restaurants;
