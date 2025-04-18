import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";

const WriteReview = () => {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [searchMode, setSearchMode] = useState("static"); // 'static' or 'api'
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Static restaurant data
  const staticRestaurants = [
    { id: "r1", name: "COTE Miami", location: "Miami", zip: "33130" },
    { id: "r2", name: "Agliolio", location: "Boynton Beach", zip: "33428" },
    { id: "r3", name: "1000 NORTH", location: "Jupiter", zip: "33469" },
    { id: "r4", name: "Common Grounds Brew & Roastery", location: "West Palm Beach", zip: "33401" },
    { id: "r5", name: "City Oyster & Sushi Bar", location: "Delray Beach", zip: "33432" },
  ];

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

  const handleSelect = (restaurant) => {
    if (restaurant.isApiData) {
      // For API restaurants, store restaurant info in sessionStorage
      sessionStorage.setItem('reviewingRestaurant', JSON.stringify({
        id: restaurant.id,
        name: restaurant.name,
        isApiData: true,
        // Include any other necessary restaurant data
        rawData: restaurant.raw
      }));
    }

    // Navigate to the review form
    navigate(`/write-review/${restaurant.id}`);
  };

  const toggleSearchMode = () => {
    setSearchMode(prev => prev === 'static' ? 'api' : 'static');
    setResults([]);
    setError(null);
  };

  return (
    <>
      <Navbar />
      <PageWrapper>
        <div className="container py-5" style={{ maxWidth: "700px" }}>
          <h1 className="mb-4 text-center fw-bold">Write a Review</h1>

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
          </div>

          {results.length > 0 && (
            <div>
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
      </PageWrapper>
      <Footer />
    </>
  );
};

export default WriteReview;