import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Link, useLocation } from "react-router-dom";
import { restaurantData } from "./restaurantData";
import PageWrapper from "../components/PageWrapper";
import AdvancedFilters from "../components/AdvancedFilters";


const Restaurants = () => {
  const location = useLocation();
  const [alert, setAlert] = useState(location.state?.message || null);
  const reviewId = location.state?.reviewId || null;
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState({
    price: null,
    advanced: [],
  });
  const [showPriceOptions, setShowPriceOptions] = useState(false);
  const handleSearch = () => {
    console.log("Search with filters:", selectedFilters);
  };

  const [nameInput, setNameInput] = useState("");
  const [nameSuggestions, setNameSuggestions] = useState([]);

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
                <div className="search-bar d-flex align-items-center w-100">

                  {/* Name input with suggestions */}
                  <div className="position-relative me-2" style={{ flex: 1 }}>
                    <input
                      type="text"
                      className="form-control border-0 shadow-none"
                      placeholder="Restaurant name or cuisine"
                      value={nameInput}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNameInput(value);

                        if (value.trim() === "") {
                          setNameSuggestions([]);
                          return;
                        }

                        const matches = Object.values(restaurantData)
                          .filter((restaurant) =>
                            restaurant.name.toLowerCase().includes(value.toLowerCase())
                          )
                          .map((restaurant) => restaurant.name);
                          
                        console.log("User input:", value);
                        console.log("Matched suggestions:", matches);

                        setNameSuggestions(matches.slice(0, 5));
                      }}
                    />
                    {nameSuggestions.length > 0 && (
                      <ul className="list-group position-absolute w-100" style={{ top: "100%", zIndex: 10 }}>
                        {nameSuggestions.map((suggestion, idx) => (
                          <li
                            key={idx}
                            className="list-group-item list-group-item-action"
                            onClick={() => {
                              setNameInput(suggestion);
                              setNameSuggestions([]);
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Location input */}
                  <input
                    type="text"
                    className="form-control border-0 shadow-none me-2"
                    placeholder="Location (e.g. Miami, FL)"
                    style={{ flex: 1 }}
                  />

                  {/* Search button */}
                  <button className="btn search-btn" onClick={handleSearch}>
                    <i className="fas fa-search"></i>
                  </button>

                  {/* Advanced Button */}
                  <button
                    className="btn btn-outline-dark ms-2"
                    onClick={() => setShowAdvanced(prev => !prev)}
                  >
                    Advanced {selectedFilters.advanced.length > 0 && `(${selectedFilters.advanced.length})`}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Modal */}
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
        </section>

        <section className="container py-4">
          <div className="d-flex justify-content-center flex-wrap gap-3">
            <button className="btn btn-outline-dark">Top Rated</button>

            <div className="position-relative">
              <button
                className="btn btn-outline-dark w-100 d-flex flex-column align-items-center justify-content-center rounded-0"
                onClick={() => setShowPriceOptions(prev => !prev)}
                style={{ width: "120px", position: "relative", zIndex: 2 }}
              >
                Price {selectedFilters.price && `: ${selectedFilters.price}`}
              </button>

              {showPriceOptions && (
                <div
                  className="position-absolute top-100 start-0 w-100"
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #000",
                    borderTop: "none",
                    zIndex: 1,
                    padding: "5px 0",
                  }}
                >
                  {["$", "$$", "$$$", "$$$$"].map((symbol, index) => (
                    <div
                      key={index}
                      className="text-center py-2 price-option"
                      style={{
                        cursor: "pointer",
                        fontWeight: selectedFilters.price === symbol ? "bold" : "normal",
                        color: selectedFilters.price === symbol ? "darkgreen" : "black",
                      }}
                      onClick={() => {
                        setSelectedFilters(prev => ({
                          ...prev,
                          price: symbol
                        }));
                        setShowPriceOptions(false);
                      }}
                    >
                      {symbol}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="btn btn-outline-dark">Open Now</button>
            <button className="btn btn-outline-dark">Offers Delivery</button>

            <button
              className="btn btn-outline-secondary"
              onClick={() =>
                setSelectedFilters({
                  price: null,
                  advanced: [],
                })
              }
            >
              Clear Filters
            </button>

          </div>
        </section>

        <section className="container py-5">
          <div className="row g-4">
            {Object.entries(restaurantData)
              .filter(([_, restaurant]) => {
                const { price, advanced } = selectedFilters;

                // Match price
                const matchesPrice = !price || restaurant.price === price;

                // Match each advanced filter
                const matchesAdvanced = advanced.every((tag) =>
                  restaurant.amenities?.some((a) => a.toLowerCase().includes(tag.toLowerCase())) ||
                  restaurant.cuisine?.toLowerCase().includes(tag.toLowerCase()) ||
                  (tag === "Open Now" && restaurant.openNow)
                );

                return matchesPrice && matchesAdvanced;
              })
              .map(([id, restaurant]) => (
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
    </div >
  );
};

export default Restaurants;
