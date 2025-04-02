import React, { useState } from "react";
import SearchBar from "./SearchBar";

const RestaurantSearch = () => {
  const [query, setQuery] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/search-restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ city: query }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch restaurants");
      }

      const data = await response.json();
      setRestaurants(data.results.slice(0, 5) || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <SearchBar value={query} onChange={setQuery} />
      <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <p className="text-danger">{error}</p>}

      <div>
        {restaurants.length > 0 ? (
          <ul>
            {restaurants.map((restaurant, index) => (
              <li key={index}>{restaurant.name}</li>
            ))}
          </ul>
        ) : (
          !loading && <p>No restaurants found.</p>
        )}
      </div>
    </div>
  );
};

export default RestaurantSearch;
