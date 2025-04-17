import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

const getBiteMessage = (count) => {
  if (count >= 100) return "🥳 Legend! You've devoured 100+!";
  if (count >= 50) return "🔥 You're on fire!";
  if (count >= 25) return "😋 You’ve got an appetite!";
  if (count >= 10) return "🍽️ You’re stuffed!";
  if (count >= 5) return "😄 Keep going!";
  return "Welcome, hungry friend!";
};

const getNextMilestone = (count) => {
  if (count < 25) return 25;
  if (count < 50) return 50;
  if (count < 100) return 100;
  if (count < 200) return 200;
  return 500;
};

const getComboMessage = (count) => {
  if (count % 100 === 0) return "💀 FOOD GOD MODE";
  if (count % 50 === 0) return "🔥 MASSIVE BITE COMBO!";
  if (count % 25 === 0) return "💪 You’re crushing it!";
  if (count % 10 === 0) return "😋 Snack streak!";
  return "🍴 Yum!";
};



const Restaurants = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Add useNavigate hook for navigation
  const [alert, setAlert] = useState(location.state?.message || null);
  const reviewId = location.state?.reviewId || null;
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [emojiEatenCount, setEmojiEatenCount] = useState(0); // 🍽️ counter for clicked emojis


  // Get global state and dispatch for favorites
  const { store, dispatch } = useGlobalReducer();
  const favorites = store.favorites || [];

  // Add these two lines right here:
  const [hasSearched, setHasSearched] = useState(false);
  const resultsRef = useRef(null);

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

  // Function to handle viewing restaurant details
  const handleViewDetails = (restaurant) => {
    // For API data
    if (!Array.isArray(restaurant)) {
      // Store the API restaurant data in sessionStorage before navigating
      const restaurantDetails = JSON.stringify(restaurant);
      sessionStorage.setItem('apiRestaurantDetails', restaurantDetails);

      // Generate a temporary ID for the API restaurant
      const tempId = restaurant.location_id || restaurant.id || `api-${Date.now()}`;
      navigate(`/restaurant/${tempId}`, { state: { isApiData: true } });
    }
    // For static data
    else {
      const [id, _] = restaurant;
      navigate(`/restaurant/${id}`);
    }
  };

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

        // Set hasSearched to true to trigger the transition effect
        setHasSearched(true);
      } else {
        setRestaurants([]);
        setIsApiData(true);

        // Also set hasSearched to true for empty results
        setHasSearched(true);
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
    const dataToFilter = restaurants;

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


  useEffect(() => {
    if (!hasSearched) {
      document.body.classList.add('search-active');
    } else {
      document.body.classList.remove('search-active');
    }

    return () => {
      document.body.classList.remove('search-active');
    };
  }, [hasSearched]);

  useEffect(() => {
    const emojiList = ["🍕", "🍔", "🍣", "🍩", "🌮", "🍟", "🍜", "🍦"];
    const container = document.querySelector(".emoji-rain-background");
    container.style.height = `${document.body.scrollHeight}px`;
    const numEmojis = 30;

    const createEmoji = () => {
      const emoji = document.createElement("div");
      emoji.classList.add("emoji");
      emoji.textContent = emojiList[Math.floor(Math.random() * emojiList.length)];
      emoji.style.left = `${Math.random() * 100}%`;
      emoji.style.animationDuration = `${5 + Math.random() * 5}s`;
      emoji.style.fontSize = `${1 + Math.random() * 2}rem`;
      emoji.style.opacity = Math.random();

      // Add click event for particle pop
      emoji.addEventListener("click", (e) => {
        console.log("🍕 emoji clicked!");
        e.stopPropagation();
        createParticles(e.clientX, e.clientY);
        emoji.remove();

        // Animate bite counter box
        const counterBox = document.querySelector(".bite-counter");
        if (counterBox) {
          counterBox.classList.remove("shake"); // restart animation
          void counterBox.offsetWidth; // force reflow
          counterBox.classList.add("shake");
        }


        setEmojiEatenCount(prev => {
          const nextCount = prev + 1;
          const comboMessage = getComboMessage(nextCount);

          // Pop-up message logic
          if (!["🍴 Yum!"].includes(comboMessage)) {
            const comboText = document.createElement("div");
            comboText.classList.add("combo-popup");
            comboText.textContent = comboMessage;

          }

          return nextCount;
        });
      });

      container.appendChild(emoji);

      console.log("🎯 emoji added", emoji); // NEW
      emoji.onclick = () => console.log("🧪 emoji clicked via .onclick"); // NEW

      // Remove after animation
      setTimeout(() => {
        if (emoji.parentElement) {
          emoji.remove();
        }
      }, 10000);
    };
    const createParticles = (x, y) => {
      const particleCount = 18; // More crumbs!
      const colors = ["#f5deb3", "#e0c083", "#d9a74f", "#fff2cc"];

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.classList.add("emoji-particle");

        // Position at the click location
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        // Crumb-like styles
        const size = Math.random() * 6 + 4; // 4px to 10px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.borderRadius = "50%";
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];

        // Big scatter effect
        const angle = Math.random() * 2 * Math.PI;
        const distance = 80 + Math.random() * 60; // 80–140px explosion
        const translateX = Math.cos(angle) * distance;
        const translateY = Math.sin(angle) * distance;

        // Add initial transform for animation
        particle.style.setProperty('--tx', `${translateX}px`);
        particle.style.setProperty('--ty', `${translateY}px`);

        container.appendChild(particle);

        setTimeout(() => {
          particle.remove();
        }, 1000); // 1 second lifetime
      }
    };

    const interval = setInterval(() => {
      if (container && document.body.contains(container)) {
        createEmoji();

      }
    }, 800); // Every 300ms

    return () => clearInterval(interval); // Cleanup
  }, []);



  return (
    <div>
      <Navbar />
      <div className="emoji-rain-background"></div>


      {emojiEatenCount > 0 && (
        <div className="floating-bite-container">
          <div className="bite-counter floating-bite-box shake-on-update">
            <div className="bite-count-text">
              🍴 Eaten: <strong>{emojiEatenCount}</strong>
            </div>
            <div className="bite-message">{getBiteMessage(emojiEatenCount)}</div>
            <div className="bite-milestone">
              Next award at {getNextMilestone(emojiEatenCount)} bites!! 🎯🥇🚀
            </div>
          </div>
        </div>
      )}
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

        {/* Search Section with transition effect */}
        <section
          className={`search-section ${hasSearched ? 'searched' : ''}`}
          style={{
            opacity: hasSearched ? 0 : 1,
            transition: 'opacity 1s ease, visibility 0s 1s',
            visibility: hasSearched ? 'hidden' : 'visible',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            width: '100vw',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1000,
            background: 'white'
          }}
        >
          <div className="container text-center" style={{ maxWidth: "650px" }}>
            <div className="mb-3">
              <h1 className="fw-bold mb-2" style={{ fontSize: '2.3rem' }}>
                Find Your Next Favorite Restaurant
              </h1>
              <p className="text-muted mb-3">
                Search by city to discover amazing dining options
              </p>
            </div>

            <div className="position-relative mx-auto" style={{ maxWidth: "500px" }}>
              {/* Search bar */}
              <div className="d-flex align-items-center w-100 mb-2">
                <div className="d-flex flex-grow-1" style={{
                  backgroundColor: "#e0e0e0",
                  borderRadius: "999px",
                  overflow: "hidden",
                  height: "48px",
                  alignItems: "center"
                }}>
                  <input
                    type="text"
                    className="form-control border-0 shadow-none"
                    placeholder="Search by city (e.g. Miami)"
                    value={cityQuery}
                    onChange={(e) => setCityQuery(e.target.value)}
                    style={{
                      backgroundColor: "#e0e0e0",
                      borderRadius: "999px",
                      height: "48px"
                    }}
                  />
                  <button
                    className="btn"
                    onClick={handleSearch}
                    disabled={loading}
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      border: "none",
                      height: "48px",
                      width: "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "0 999px 999px 0",
                      marginRight: "-1px",
                      fontSize: "18px"
                    }}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      <i className="fas fa-search"></i>
                    )}
                  </button>
                </div>
              </div>

              {/* Advanced Button */}
              <div className="d-flex justify-content-center">
                <button
                  className="btn btn-outline-secondary rounded-pill d-flex align-items-center gap-2 px-3 py-1"
                  onClick={() => setShowAdvanced(prev => !prev)}
                  style={{ fontSize: '0.9rem' }}
                >
                  <i className="fas fa-sliders-h"></i>
                  Advanced
                </button>
              </div>

              {/* Error message display */}
              {error && <div className="mt-2 text-danger text-center">{error}</div>}

              {/* Floating Advanced Panel */}
              {showAdvanced && (
                <div
                  className="position-absolute bg-white shadow p-3"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "20px",
                    animation: "fadeSlide 0.3s ease",
                    zIndex: 1055,
                    top: "90px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "340px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                  }}
                >
                  <AdvancedFilters
                    selectedFilters={selectedFilters}
                    onChange={(updated) => setSelectedFilters(updated)}
                    onApply={(filters) => {
                      setSelectedFilters(filters);
                      setShowAdvanced(false);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Results Section - with transition effect */}
        <div
          className={`results-container ${hasSearched ? 'show' : ''}`}
          style={{
            opacity: hasSearched ? 1 : 0,
            transform: hasSearched ? 'translateY(0)' : 'translateY(20vh)',
            transition: 'opacity 1.5s ease, transform 1.5s ease',
            transitionDelay: '0.3s',
            visibility: hasSearched ? 'visible' : 'hidden',
            position: 'relative'
          }}
        >
          {/* Reference point for scrolling to results */}
          <div ref={resultsRef}></div>

          {/* More Filters Section - Only visible after search */}
          <section className="container py-4">
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-outline-dark"
                onClick={() => setShowMoreFilters(prev => !prev)}
              >
                {showMoreFilters ? "Hide Filters" : "More Filters"}
              </button>
            </div>

            <div
              className="mt-3 overflow-hidden"
              style={{
                maxHeight: showMoreFilters ? '500px' : '0',
                transition: 'max-height 0.4s ease',
                padding: showMoreFilters ? '20px' : '0',
                opacity: showMoreFilters ? 1 : 0,
                transform: showMoreFilters ? 'translateY(0)' : 'translateY(-10px)',
                transitionProperty: 'max-height, padding, opacity, transform',
                transitionDuration: '0.4s',
                transitionTimingFunction: 'ease'
              }}
            >
              <div className="d-flex flex-wrap justify-content-center gap-2 px-2 py-2 bg-white rounded shadow-sm">
                <button
                  className={`btn ${selectedFilters.topRated ? 'btn-dark' : 'btn-outline-dark'} rounded-pill`}
                  onClick={() => toggleFilter('topRated')}
                >
                  Top Rated
                </button>

                <div className="position-relative">
                  <button
                    className={`btn ${selectedFilters.price ? 'btn-dark' : 'btn-outline-dark'} rounded-pill`}
                    onClick={() => setShowPriceOptions(prev => !prev)}
                    style={{ minWidth: "110px" }}
                  >
                    Price {selectedFilters.price && `: ${selectedFilters.price}`}
                  </button>

                  {showPriceOptions && (
                    <div
                      className="position-absolute top-100 start-0 w-100 mt-1 bg-white border shadow-sm rounded"
                      style={{ zIndex: 1 }}
                    >
                      {["$", "$$", "$$$", "$$$$"].map((symbol, index) => (
                        <div
                          key={index}
                          className="text-center py-2"
                          style={{
                            cursor: "pointer",
                            fontWeight: selectedFilters.price === symbol ? "bold" : "normal",
                            color: selectedFilters.price === symbol ? "darkgreen" : "black",
                          }}
                          onClick={() => {
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
                  className={`btn ${selectedFilters.openNow ? 'btn-dark' : 'btn-outline-dark'} rounded-pill`}
                  onClick={() => toggleFilter('openNow')}
                >
                  Open Now
                </button>

                <button
                  className={`btn ${selectedFilters.offersDelivery ? 'btn-dark' : 'btn-outline-dark'} rounded-pill`}
                  onClick={() => toggleFilter('offersDelivery')}
                >
                  Offers Delivery
                </button>

                <button
                  className="btn btn-outline-secondary rounded-pill"
                  onClick={clearAllFilters}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </section>

          {/* Results Section */}
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
                        <div className="card h-100 shadow-sm hover-float">
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
                              <button
                                className="btn btn-sm btn-dark"
                                onClick={() => handleViewDetails(restaurant)}
                              >
                                Details
                              </button>
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
                      <div className="card h-100 shadow-sm hover-float">
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
                            <button
                              className="btn btn-sm btn-dark"
                              onClick={() => handleViewDetails(item)}
                            >
                              Details
                            </button>
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
        </div>
      </PageWrapper>
    </div>
  );
};

export default Restaurants;