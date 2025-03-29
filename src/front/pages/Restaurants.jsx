import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useLocation } from "react-router-dom";
import { restaurantData } from "./restaurantData";
import PageWrapper from "../components/PageWrapper";
import AdvancedFilters from "../components/AdvancedFilters";

const Restaurants = () => {
  const location = useLocation();
  const [alert, setAlert] = useState(location.state?.message || null);
  const reviewId = location.state?.reviewId || null;
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  useEffect(() => {
    if (location.state) {
      window.history.replaceState({}, document.title);
    }
  }, []);

  return (
    <div>
      <Navbar />
      <PageWrapper>
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

        <section className="py-5 bg-light">
          <div className="d-flex flex-column align-items-center">
            <div className="d-flex flex-wrap justify-content-center gap-3 w-100" style={{ maxWidth: "900px" }}>
              <div className="search-bar-container flex-grow-1">
                <div className="search-bar d-flex align-items-center">
                  <input
                    type="text"
                    className="form-control border-0 shadow-none"
                    placeholder="Restaurant name or cuisine"
                  />
                  <div className="divider"></div>
                  <input
                    type="text"
                    className="form-control border-0 shadow-none"
                    placeholder="Location (e.g. Miami, FL)"
                  />
                  <button className="btn search-btn">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>

              <button
                className="btn btn-outline-dark"
                onClick={() => setShowAdvanced(prev => !prev)}
              >
                Advanced {selectedFilters.length > 0 && `(${selectedFilters.length})`}
              </button>
            </div>

            {showAdvanced && (
              <>
                <div
                  className="modal-backdrop fade show"
                  style={{ zIndex: 1040 }}
                  onClick={() => setShowAdvanced(false)}
                ></div>

                <div
                  className="modal fade show d-block"
                  tabIndex="-1"
                  role="dialog"
                  style={{ zIndex: 1050 }}
                  onClick={() => setShowAdvanced(false)}
                >
                  <div
                    className="modal-dialog modal-lg modal-dialog-centered"
                    role="document"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Advanced Filters</h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => setShowAdvanced(false)}
                        ></button>
                      </div>
                      <div className="modal-body">
                        <AdvancedFilters
                          selectedFilters={selectedFilters}
                          onChange={(updated) => setSelectedFilters(updated)}
                          onApply={(filters) => {
                            setSelectedFilters(filters);
                            setShowAdvanced(false);
                            console.log("Applied filters:", filters);
                          }}
                        />
                      </div>

                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="container py-4">
          <div className="d-flex justify-content-center flex-wrap gap-3">
            <button className="btn btn-outline-dark">Top Rated</button>
            <button className="btn btn-outline-dark">Price</button>
            <button className="btn btn-outline-dark">Open Now</button>
            <button className="btn btn-outline-dark">Offers Delivery</button>
          </div>
        </section>

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
