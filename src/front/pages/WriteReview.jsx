import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const WriteReview = () => {
  const { id } = useParams(); // Restaurant ID from URL
  const navigate = useNavigate();
  const { store } = useGlobalReducer();
  const [restaurant, setRestaurant] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [originalReviewId, setOriginalReviewId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    text: "",
    title: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Restaurant Search States
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [searchMode, setSearchMode] = useState("static"); // 'static' or 'api'
  const [results, setResults] = useState([]);
  const [searchActive, setSearchActive] = useState(true); // Control whether to show search or review form

  // Static restaurant data
  const staticRestaurants = [
    { id: "r1", name: "COTE Miami", location: "Miami", zip: "33130" },
    { id: "r2", name: "Agliolio", location: "Boynton Beach", zip: "33428" },
    { id: "r3", name: "1000 NORTH", location: "Jupiter", zip: "33469" },
    { id: "r4", name: "Common Grounds Brew & Roastery", location: "West Palm Beach", zip: "33401" },
    { id: "r5", name: "City Oyster & Sushi Bar", location: "Delray Beach", zip: "33432" },
    { id: "r6", name: "La Bamba Mexican Restaurant", location: "Boca Raton", zip: "33433" },
    { id: "r7", name: "Louie Bossi's Ristorante", location: "Fort Lauderdale", zip: "33301" },
    { id: "r8", name: "The Capital Grille", location: "Palm Beach Gardens", zip: "33410" },
    { id: "r9", name: "Ocean View Restaurant", location: "Miami", zip: "33139" },
    { id: "r10", name: "Palm Beach Grill", location: "Palm Beach", zip: "33480" },
    { id: "r11", name: "Miami Spice", location: "Miami", zip: "33131" },
    { id: "r12", name: "South Beach Bistro", location: "Miami Beach", zip: "33139" },
    { id: "r13", name: "Coral Gables Eatery", location: "Miami", zip: "33134" },
    { id: "r14", name: "Little Havana Cafe", location: "Miami", zip: "33135" },
    { id: "r15", name: "Downtown Diner", location: "Miami", zip: "33132" },
  ];

  useEffect(() => {
    // Check if this is an edit operation
    const isEditingRoute = window.location.pathname.includes('/edit-review/');
    
    if (isEditingRoute) {
      // Load the review for editing
      try {
        const savedReviews = localStorage.getItem('user_reviews');
        if (savedReviews) {
          const reviews = JSON.parse(savedReviews);
          const reviewToEdit = reviews.find(review => review.id === id);
          
          if (reviewToEdit) {
            setIsEditing(true);
            setOriginalReviewId(reviewToEdit.id);
            setFormData({
              rating: reviewToEdit.rating,
              text: reviewToEdit.text,
              title: reviewToEdit.title || "",
            });
            setRestaurant({
              id: reviewToEdit.restaurantId,
              name: reviewToEdit.restaurantName,
              location: reviewToEdit.restaurantLocation || '',
            });
            setSearchActive(false); // Skip search interface for editing
            setLoading(false);
          } else {
            // Review not found
            setError("Review not found");
            setLoading(false);
          }
        } else {
          setError("No reviews found");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading review:", err);
        setError("Error loading review");
        setLoading(false);
      }
      return;
    }

    // For new reviews
    if (id) {
      // If we have an ID in the URL, fetch restaurant data
      fetchRestaurantData(id);
      setSearchActive(false); // Skip search interface when ID is provided
    } else {
      // Show search interface when no ID is provided
      setSearchActive(true);
      setLoading(false);
    }
  }, [id]);

  const fetchRestaurantData = (id) => {
    setLoading(true);
    // Find restaurant in static data
    const found = staticRestaurants.find(r => r.id === id);
    
    if (found) {
      setRestaurant(found);
      setSearchActive(false); // Move to review form
      setLoading(false);
    } else {
      // Restaurant not found
      setError("Restaurant not found.");
      setLoading(false);
    }
  };

  // Handle search from API or static data
  const handleSearch = async () => {
    if (!search && !city) {
      setError("Please enter either a restaurant name or city");
      return;
    }

    setLoading(true);
    setError(null);

    if (searchMode === 'static') {
      // Filter static restaurants
      const filtered = staticRestaurants.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        (city && (r.location.toLowerCase().includes(city.toLowerCase()) || r.zip.includes(city)))
      );

      setResults(filtered);
      setLoading(false);
    } else {
      // Search API restaurants
      try {
        const isGitHubCodespace = window.location.hostname.includes('github.dev');
        const API_URL = isGitHubCodespace
          ? import.meta.env.VITE_BACKEND_URL || 'https://fluffy-space-palm-tree-v6ppwgqx95q42pvv7-3001.app.github.dev'
          : 'http://localhost:3000';

        const apiEndpoint = `${API_URL.replace(/\/+$/, '')}/api/search-restaurants`;

        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city: city || search, // use either city or search term
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to search restaurants. Please try again.");
        }

        const data = await response.json();

        if (data.results && data.results.data) {
          // Filter API results if a restaurant name was provided
          let apiResults = data.results.data.slice(0, 15);

          if (search && city) {
            apiResults = apiResults.filter(item =>
              item.name.toLowerCase().includes(search.toLowerCase())
            );
          }

          // Format the results
          const formattedResults = apiResults.map(item => ({
            id: item.location_id,
            name: item.name,
            location: item.address || 'Address not available',
            isApiData: true,
            raw: item // Keep the raw data for later use
          }));

          setResults(formattedResults);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Search error:", err);
        setError(err.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSelect = (selectedRestaurant) => {
    // Store in session storage
    sessionStorage.setItem('reviewingRestaurant', JSON.stringify(selectedRestaurant));
    
    // Set restaurant in component state
    setRestaurant(selectedRestaurant);
    
    // Move to review form
    setSearchActive(false);
  };

  const toggleSearchMode = () => {
    setSearchMode(prev => prev === 'static' ? 'api' : 'static');
    setResults([]);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!store.user) {
      setError("You must be logged in to submit a review.");
      return;
    }
    
    if (!formData.text.trim()) {
      setError("Please write some review text.");
      return;
    }

    try {
      // Create review object
      const review = {
        id: isEditing ? originalReviewId : `review-${Date.now()}`,
        userId: store.user.id,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantLocation: restaurant.location,
        rating: parseInt(formData.rating),
        title: formData.title.trim(),
        text: formData.text.trim(),
        date: new Date().toISOString(),
        username: store.user.username || store.user.email || `${store.user.first_name || ''} ${store.user.last_name || ''}`.trim(),
      };

      // Get existing reviews from localStorage
      const existingReviewsJSON = localStorage.getItem('user_reviews');
      let reviews = [];
      
      if (existingReviewsJSON) {
        reviews = JSON.parse(existingReviewsJSON);
      }

      if (isEditing) {
        // Replace the existing review
        const index = reviews.findIndex(r => r.id === review.id);
        if (index !== -1) {
          reviews[index] = review;
        } else {
          reviews.push(review);
        }
      } else {
        // Add new review
        reviews.push(review);
      }

      // Save back to localStorage
      localStorage.setItem('user_reviews', JSON.stringify(reviews));
      
      // Debug: log the saved reviews
      console.log("Saved reviews:", reviews);
      
      setSuccess(true);
      
      // After a short delay, navigate back to profile
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      console.error("Error saving review:", err);
      setError("Failed to save your review. Please try again.");
    }
  };

  // Go back to restaurant search
  const handleBackToSearch = () => {
    setSearchActive(true);
    setRestaurant(null);
    sessionStorage.removeItem('reviewingRestaurant');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <PageWrapper>
          <div className="container py-5 text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading...</p>
          </div>
        </PageWrapper>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageWrapper>
        <div className="container py-5" style={{ maxWidth: "700px" }}>
          <h1 className="mb-4 text-center fw-bold">
            {isEditing ? "Edit Your Review" : "Write a Review"}
          </h1>
          
          {success ? (
            <div className="alert alert-success">
              Your review has been {isEditing ? "updated" : "submitted"} successfully! Redirecting...
            </div>
          ) : (
            <>
              {/* Restaurant Search Interface */}
              {searchActive && !isEditing && (
                <div className="mb-4">
                  <div className="form-check form-check-inline mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="searchMode"
                      id="staticSearch"
                      checked={searchMode === 'static'}
                      onChange={() => setSearchMode('static')}
                    />
                    <label className="form-check-label" htmlFor="staticSearch">
                      Search Local Restaurants
                    </label>
                  </div>
                  <div className="form-check form-check-inline mb-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="searchMode"
                      id="apiSearch"
                      checked={searchMode === 'api'}
                      onChange={() => setSearchMode('api')}
                    />
                    <label className="form-check-label" htmlFor="apiSearch">
                      Search All Restaurants (API)
                    </label>
                  </div>

                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder={searchMode === 'static' ? "Search restaurant name" : "Restaurant name (optional)"}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder={searchMode === 'static' ? "Zip code or city (optional)" : "City name (required for API search)"}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required={searchMode === 'api'}
                  />

                  <div className="d-grid">
                    <button
                      className="btn btn-dark"
                      onClick={handleSearch}
                      disabled={loading || (searchMode === 'api' && !city)}
                    >
                      {loading ? (
                        <><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Searching...</>
                      ) : (
                        'Search'
                      )}
                    </button>
                  </div>

                  {error && <div className="alert alert-danger mt-3">{error}</div>}
                
                  {results.length > 0 && (
                    <div className="mt-4">
                      <h5 className="fw-semibold mb-3">Select a restaurant to review:</h5>
                      <div className="list-group">
                        {results.map((r) => (
                          <button
                            key={r.id}
                            className="list-group-item list-group-item-action"
                            onClick={() => handleSelect(r)}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <strong>{r.name}</strong>
                                <div className="text-muted small">{r.location}</div>
                              </div>
                              <span className="badge bg-dark rounded-pill">Review</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.length === 0 && !loading && !error && (
                    <div className="text-center mt-4 text-muted">
                      Search to find restaurants to review
                    </div>
                  )}
                </div>
              )}

              {/* Review Form */}
              {!searchActive && restaurant && (
                <>
                  <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="card-title">{restaurant.name}</h5>
                          {restaurant.location && (
                            <p className="card-text text-muted">{restaurant.location}</p>
                          )}
                        </div>
                        
                        {!isEditing && (
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={handleBackToSearch}
                          >
                            Change Restaurant
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {error && <div className="alert alert-danger mb-3">{error}</div>}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="rating" className="form-label">Rating</label>
                      <select
                        className="form-select"
                        id="rating"
                        name="rating"
                        value={formData.rating}
                        onChange={handleInputChange}
                      >
                        <option value="5">5 Stars - Excellent</option>
                        <option value="4">4 Stars - Very Good</option>
                        <option value="3">3 Stars - Good</option>
                        <option value="2">2 Stars - Fair</option>
                        <option value="1">1 Star - Poor</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">Review Title (Optional)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Sum up your experience"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="text" className="form-label">Your Review</label>
                      <textarea
                        className="form-control"
                        id="text"
                        name="text"
                        rows="5"
                        value={formData.text}
                        onChange={handleInputChange}
                        placeholder="Tell others about your experience"
                        required
                      ></textarea>
                    </div>

                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary me-md-2"
                        onClick={() => navigate('/profile')}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-dark">
                        {isEditing ? "Update Review" : "Submit Review"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </PageWrapper>
    </>
  );
};