import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Link, useLocation } from "react-router-dom";
import { restaurantData } from "./restaurantData";
import PageWrapper from "../components/PageWrapper";
import AdvancedFilters from "../components/AdvancedFilters";
import useGlobalReducer from "../hooks/useGlobalReducer"; // Import the global reducer

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
  
  // Get global state and dispatch for favorites
  const { store, dispatch } = useGlobalReducer();
  const favorites = store.favorites || [];
  
  // Enhanced filters state
  const [selectedFilters, setSelectedFilters] = useState({
    price: null,
    advanced: [],
    topRated: false,
    openNow: false,
    offersDelivery: false
  });
  
  const [showPriceOptions, setShowPriceOptions] = useState(false);
  
  const [cityQuery, setCityQuery] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [isApiData, setIsApiData] = useState(false);

  // Check if a restaurant is in favorites
  const isFavorite = (restaurant) => {
    if (!Array.isArray(favorites)) return false;
    
    // For API data
    if (!Array.isArray(restaurant)) {
      return favorites.some(fav => 
        !Array.isArray(fav) && 
        (
          // Match by ID if available
          (restaurant.id && fav.id === restaurant.id) ||
          (restaurant.location_id && fav.location_id === restaurant.location_id) ||
          // Fallback to matching by name
          (restaurant.name && fav.name === restaurant.name)
        )
      );
    }
    
    // For static data
    return favorites.some(fav => 
      Array.isArray(fav) && fav[0] === restaurant[0]
    );
  };

  // Function to toggle favorite status
  const toggleFavorite = (restaurant) => {
    // Create a unique identifier for the restaurant
    let restaurantId;
    
    if (Array.isArray(restaurant)) {
      restaurantId = restaurant[0]; // For static data, use the key
    } else {
      // For API data, use location_id, id, or name as identifier
      restaurantId = restaurant.location_id || restaurant.id || restaurant.name;
    }
    
    // Check if already in favorites
    if (isFavorite(restaurant)) {
      // Remove from favorites
      const newFavorites = Array.isArray(favorites) ? favorites.filter(fav => {
        if (Array.isArray(fav)) {
          return fav[0] !== restaurantId;
        } else {
          const favId = fav.location_id || fav.id || fav.name;
          return favId !== restaurantId;
        }
      }) : [];
      
      dispatch({ type: 'SET_FAVORITES', payload: newFavorites });
    } else {
      // Add to favorites - make sure we're appending to the existing array
      const newFavorites = Array.isArray(favorites) ? [...favorites, restaurant] : [restaurant];
      dispatch({ type: 'SET_FAVORITES', payload: newFavorites });
    }
  };

  const handleSearch = async () => {
    if (!cityQuery.trim()) {
      setError("Please enter a city name");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    const isGitHubCodespace = window.location.hostname.includes('github.dev');
    // Fixed the API URL - removed any potential double slashes
    const API_URL = isGitHubCodespace 
      ? import.meta.env.VITE_BACKEND_URL || 'https://fluffy-space-palm-tree-v6ppwgqx95q42pvv7-3001.app.github.dev'
      : 'http://localhost:3000';
  
    try {
      // Ensure there are no double slashes in the URL
      const apiEndpoint = `${API_URL.replace(/\/+$/, '')}/api/search-restaurants`;
      console.log("API endpoint:", apiEndpoint); // Debug the final URL
      
      const response = await fetch(apiEndpoint, {
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
        const apiResults = data.results.data.slice(0, 10) || [];
        
        // Log first result structure
        if (apiResults.length > 0) {
          console.log("First API restaurant structure:", apiResults[0]);
        }
        
        // Better normalization of API data to ensure filter buttons work
        const normalizedResults = apiResults.map(item => {
          // Convert price_level to $ format if needed
          let priceStr = item.price;
          if (!priceStr && item.price_level) {
            priceStr = '$'.repeat(Math.min(item.price_level, 4));
          }
          
          // Handle rating properly
          const ratingValue = parseFloat(item.rating || item.average_rating || "0");
          
          // Better handling of open status
          const isOpenNow = 
            item.open_now === true || 
            (item.hours && item.hours.open_now === true) ||
            (item.open_now_text && item.open_now_text.toLowerCase().includes("open")) || 
            item.is_open === true;
          
          // Better handling of delivery
          const hasDelivery = 
            item.offers_delivery === true || 
            (item.delivery && item.delivery.is_delivery_available === true) ||
            (item.availability && item.availability.delivery === true);
          
          return {
            ...item,
            // Normalized properties with better fallbacks
            normalizedPrice: priceStr,
            normalizedRating: ratingValue,
            normalizedOpenNow: isOpenNow,
            normalizedDelivery: hasDelivery
          };
        });
        
        console.log("Normalized results:", normalizedResults);
        setRestaurants(normalizedResults);
        setIsApiData(true);
      } else {
        setRestaurants([]);
        setIsApiData(true);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message);
      setIsApiData(false);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle filter toggle with debugging
  const toggleFilter = (filterName) => {
    console.log(`Toggling filter: ${filterName}`); // Debug which filter is being toggled
    setSelectedFilters(prev => {
      const newFilters = {
        ...prev,
        [filterName]: !prev[filterName]
      };
      console.log("New filter state:", newFilters); // Debug the new state
      return newFilters;
    });
  };

  // Function to clear all filters
  const clearAllFilters = () => {
    console.log("Clearing all filters");
    setSelectedFilters({
      price: null,
      advanced: [],
      topRated: false,
      openNow: false,
      offersDelivery: false
    });
  };

  // Helper function to convert price string to number for sorting
  const getPriceValue = (priceStr) => {
    if (!priceStr) return 0;
    return priceStr.length; // $ = 1, $$ = 2, $$$ = 3, $$$$ = 4
  };

  // Get filtered and sorted restaurants
  const getFilteredRestaurants = () => {
    console.log("Filtering restaurants with filters:", selectedFilters);
    
    const { price, advanced, topRated, openNow, offersDelivery } = selectedFilters;
    const dataToFilter = restaurants.length > 0 ? restaurants : Object.entries(restaurantData);
    
    // If we have data, log the first item for debugging
    if (dataToFilter.length > 0) {
      const firstItem = dataToFilter[0];
      console.log("First item to filter type:", Array.isArray(firstItem) ? "Static data" : "API data");
    }
    
    // Filter the restaurants
    const filtered = dataToFilter.filter(item => {
      // For API results (normalized data)
      if (!Array.isArray(item)) {
        const restaurant = item;
        
        // Use normalized properties for consistent filtering
        const matchesPrice = !price || restaurant.normalizedPrice === price;
        
        // Fixed topRated filter logic for API data
        const matchesTopRated = !topRated || (restaurant.normalizedRating && restaurant.normalizedRating >= 4.5);
        
        const matchesOpenNow = !openNow || restaurant.normalizedOpenNow === true;
        const matchesDelivery = !offersDelivery || restaurant.normalizedDelivery === true;
        
        // Add debugging for topRated filter
        if (topRated) {
          console.log(`Restaurant ${restaurant.name}: Rating = ${restaurant.normalizedRating}, Matches top rated? ${restaurant.normalizedRating >= 4.5}`);
        }
        
        return matchesPrice && matchesTopRated && matchesOpenNow && matchesDelivery;
      }
      
      // For static data
      const [_, restaurant] = item;
      
      const matchesPrice = !price || restaurant.price === price;
      
      // Fixed topRated filter logic for static data
      const rating = parseFloat(restaurant.rating);
      const matchesTopRated = !topRated || (rating && rating >= 4.5);
      
      const matchesOpenNow = !openNow || restaurant.openNow === true;
      const matchesDelivery = !offersDelivery || restaurant.offersDelivery === true;
      const matchesAdvanced = advanced.every((tag) =>
        restaurant.amenities?.some((a) => a.toLowerCase().includes(tag.toLowerCase())) ||
        restaurant.cuisine?.toLowerCase().includes(tag.toLowerCase()) ||
        (tag === "Open Now" && restaurant.openNow)
      );
      
      // Add debugging for topRated filter
      if (topRated) {
        console.log(`Restaurant ${restaurant.name}: Rating = ${rating}, Matches top rated? ${rating >= 4.5}`);
      }
      
      return matchesPrice && matchesTopRated && matchesOpenNow && matchesDelivery && matchesAdvanced;
    });
    
    // Apply sorting based on active filters
    let sortedResults = [...filtered];
    
    // Create a sorting function to handle the different data formats
    const sortByRating = (a, b) => {
      // For API data
      if (!Array.isArray(a) && !Array.isArray(b)) {
        return b.normalizedRating - a.normalizedRating;
      }
      
      // For Static data
      if (Array.isArray(a) && Array.isArray(b)) {
        const ratingA = parseFloat(a[1].rating) || 0;
        const ratingB = parseFloat(b[1].rating) || 0;
        return ratingB - ratingA;
      }
      
      return 0;
    };
    
    const sortByPrice = (a, b) => {
      // For API data
      if (!Array.isArray(a) && !Array.isArray(b)) {
        return getPriceValue(a.normalizedPrice) - getPriceValue(b.normalizedPrice);
      }
      
      // For Static data
      if (Array.isArray(a) && Array.isArray(b)) {
        return getPriceValue(a[1].price) - getPriceValue(b[1].price);
      }
      
      return 0;
    };
    
    // Apply sorting priority based on which filters are active
    const hasActiveFilter = topRated || price || openNow || offersDelivery;
    
    if (topRated) {
      console.log("Sorting by rating since Top Rated is selected");
      sortedResults = sortedResults.sort(sortByRating);
    } else if (price) {
      console.log("Sorting by price since Price filter is selected");
      sortedResults = sortedResults.sort(sortByPrice);
    } else if (openNow) {
      console.log("Sorting with Open Now restaurants first");
      sortedResults = sortedResults.sort((a, b) => {
        // For API data
        if (!Array.isArray(a) && !Array.isArray(b)) {
          // Put open restaurants first
          if (a.normalizedOpenNow && !b.normalizedOpenNow) return -1;
          if (!a.normalizedOpenNow && b.normalizedOpenNow) return 1;
          // If both have same open status, no sorting change
          return 0;
        }
        
        // For Static data
        if (Array.isArray(a) && Array.isArray(b)) {
          // Put open restaurants first
          if (a[1].openNow && !b[1].openNow) return -1;
          if (!a[1].openNow && b[1].openNow) return 1;
          // If both have same open status, no sorting change
          return 0;
        }
        
        return 0;
      });
    } else if (offersDelivery) {
      console.log("Sorting with Delivery restaurants first");
      sortedResults = sortedResults.sort((a, b) => {
        // For API data
        if (!Array.isArray(a) && !Array.isArray(b)) {
          // Put delivery restaurants first
          if (a.normalizedDelivery && !b.normalizedDelivery) return -1;
          if (!a.normalizedDelivery && b.normalizedDelivery) return 1;
          // If both have same delivery status, no sorting change
          return 0;
        }
        
        // For Static data
        if (Array.isArray(a) && Array.isArray(b)) {
          // Put delivery restaurants first
          if (a[1].offersDelivery && !b[1].offersDelivery) return -1;
          if (!a[1].offersDelivery && b[1].offersDelivery) return 1;
          // If both have same delivery status, no sorting change
          return 0;
        }
        
        return 0;
      });
    }
    // No default sorting when no filters are active
    
    return sortedResults;
  };

  const filteredRestaurants = getFilteredRestaurants();

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
            <button 
              className={`btn ${selectedFilters.topRated ? 'btn-dark' : 'btn-outline-dark'}`}
              onClick={() => {
                console.log("Top Rated button clicked");
                toggleFilter('topRated');
              }}
            >
              Top Rated
            </button>

            <div className="position-relative">
              <button
                className={`btn ${selectedFilters.price ? 'btn-dark' : 'btn-outline-dark'} w-100 d-flex flex-column align-items-center justify-content-center rounded-0`}
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
                        console.log(`Price ${symbol} selected`);
                        setSelectedFilters(prev => ({
                          ...prev,
                          price: prev.price === symbol ? null : symbol
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

            <button 
              className={`btn ${selectedFilters.openNow ? 'btn-dark' : 'btn-outline-dark'}`}
              onClick={() => {
                console.log("Open Now button clicked");
                toggleFilter('openNow');
              }}
            >
              Open Now
            </button>
            
            <button 
              className={`btn ${selectedFilters.offersDelivery ? 'btn-dark' : 'btn-outline-dark'}`}
              onClick={() => {
                console.log("Offers Delivery button clicked");
                toggleFilter('offersDelivery');
              }}
            >
              Offers Delivery
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={clearAllFilters}
            >
              Clear Filters
            </button>
          </div>
        </section>

        <section className="container py-5">
          <div className="row g-4">
            {filteredRestaurants.length > 0 ? (
              filteredRestaurants.map((item, index) => {
                // Handle API results
                if (!Array.isArray(item)) {
                  const restaurant = item;
                  const isItemFavorite = isFavorite(restaurant);
                  
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
                            {restaurant.address || restaurant.location?.address} • {restaurant.cuisine?.[0]?.name || "Various"} • ⭐ {restaurant.normalizedRating || restaurant.rating || "N/A"}
                            {restaurant.normalizedPrice && <span> • {restaurant.normalizedPrice}</span>}
                            {restaurant.normalizedOpenNow && <span className="text-success"> • Open Now</span>}
                            {restaurant.normalizedDelivery && <span className="text-primary"> • Delivers</span>}
                          </p>
                          <div className="d-flex justify-content-between">
                            <button className="btn btn-sm btn-dark">Contact</button>
                            <button className="btn btn-sm btn-outline-dark">Reviews</button>
                            
                            {/* Favorite Button */}
                            <button 
                              className={`btn btn-sm ${isItemFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
                              onClick={() => toggleFavorite(restaurant)}
                              aria-label={isItemFavorite ? "Remove from favorites" : "Add to favorites"}
                            >
                              <i className="fas fa-heart"></i>
                            </button>
                            
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
                const isItemFavorite = isFavorite(item);
                
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
                          {restaurant.price && <span> • {restaurant.price}</span>}
                          {restaurant.openNow && <span className="text-success"> • Open Now</span>}
                          {restaurant.offersDelivery && <span className="text-primary"> • Delivers</span>}
                        </p>
                        <div className="d-flex justify-content-between">
                          <button className="btn btn-sm btn-dark">Contact</button>
                          <button className="btn btn-sm btn-outline-dark">Reviews</button>
                          
                          {/* Favorite Button */}
                          <button 
                            className={`btn btn-sm ${isItemFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
                            onClick={() => toggleFavorite(item)}
                            aria-label={isItemFavorite ? "Remove from favorites" : "Add to favorites"}
                          >
                            <i className="fas fa-heart"></i>
                          </button>
                          
                          <Link to={`/restaurant/${id}`} className="btn btn-sm btn-outline-secondary">
                            Gallery
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : isApiData ? (
              <div className="col-12 text-center py-5">
                <h3>No restaurants found</h3>
                <p>Try a different search or change your filters</p>
              </div>
            ) : (
              <div className="col-12 text-center py-5">
                <h3>Search for restaurants</h3>
                <p>Enter a city name to get started</p>
              </div>
            )}
          </div>
        </section>
      </PageWrapper>
      <Footer />
    </div>
  );
};

export default Restaurants;