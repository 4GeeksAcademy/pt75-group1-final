import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Link, useLocation } from "react-router-dom";
import { restaurantData } from "./restaurantData";
import PageWrapper from "../components/PageWrapper";
import AdvancedFilters from "../components/AdvancedFilters";

// This is a simple search bar component since your original was not provided
const SearchBar = ({ value, onChange }) => (
  <input
    type="text"
    className="form-control border-0 shadow-none"
    placeholder="Enter city name (e.g. Miami)"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

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
  
  const [cityQuery, setCityQuery] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [nameSuggestions, setNameSuggestions] = useState([]);

  const handleSearch = async () => {
    if (!cityQuery.trim()) {
      setError("Please enter a city name");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    const isGitHubCodespace = window.location.hostname.includes('github.dev');
    const API_URL = isGitHubCodespace 
      ? import.meta.env.VITE_BACKEND_URL
      : 'http://localhost:3000';
  
    try {
      const response = await fetch(`${API_URL}/api/search-restaurants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ city: cityQuery }),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch restaurants");
      }
  
      const data = await response.json();
      console.log("API response:", data);
      
      if (data.results && data.results.data) {
        setRestaurants(data.results.data.slice(0, 10) || []);
      } else {
        setRestaurants([]);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
                  <div className="position-relative me-2" style={{ flex: 1 }}>
                    <SearchBar value={cityQuery} onChange={setCityQuery} />
                  </div>

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

                  <button 
                    className="btn search-btn" 
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? 
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> :
                      <i className="fas fa-search"></i>
                    }
                  </button>

                  {/* Advanced Button */}
                  <button
                    className="btn btn-outline-dark ms-2"
                    onClick={() => setShowAdvanced(prev => !prev)}
                  >
                    Advanced {selectedFilters.advanced.length > 0 && `(${selectedFilters.advanced.length})`}
                  </button>
                </div>
                
                {/* Error message display */}
                {error && <div className="mt-2 text-danger">{error}</div>}
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
            {/* Display API results if available, otherwise fall back to static data */}
            {(restaurants.length > 0 ? restaurants : Object.entries(restaurantData))
              .filter(item => {
                // For API results
                if (!Array.isArray(item)) {
                  const restaurant = item;
                  // Apply filters to API results (adapt as needed based on actual API response format)
                  return true; // Modify this based on your API response structure
                }
                
                // For static data
                const [_, restaurant] = item;
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
              .map((item, index) => {
                // Handle API results
                if (!Array.isArray(item)) {
                  const restaurant = item;
                  return (
                    <div key={`api-${index}`} className="col-md-4">
                      <div className="card h-100 shadow-sm">
                        <img
                          src={restaurant.photo?.images?.medium?.url || "https://via.placeholder.com/400x200?text=Restaurant+Image"}
                          className="card-img-top"
                          alt={restaurant.name}
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                        <div className="card-body">
                          <h5 className="card-title">
                            <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-dark">
                              {restaurant.name}
                            </a>
                          </h5>
                          <p className="card-text">
                            {restaurant.address} • {restaurant.cuisine?.[0]?.name || "Various"} • ⭐ {restaurant.rating || "N/A"}
                          </p>
                          <div className="d-flex justify-content-between">
                            <button className="btn btn-sm btn-dark">Contact</button>
                            <button className="btn btn-sm btn-outline-dark">Reviews</button>
                            <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-secondary">
                              Website
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                // Handle static data
                const [id, restaurant] = item;
                return (
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
                );
              })}
          </div>
        </section>
      </PageWrapper>
      <Footer />
    </div >
  );
};

export default Restaurants;