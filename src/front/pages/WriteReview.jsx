import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";

const WriteReview = () => {
  const [search, setSearch] = useState("");
  const [zip, setZip] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const restaurantList = [
    { id: "r1", name: "COTE Miami", zip: "33130" },
    { id: "r2", name: "Agliolio", zip: "33428" },
    { id: "r3", name: "1000 NORTH", zip: "33469" },
    { id: "r4", name: "Common Grounds Brew & Roastery", zip: "33401" },
    { id: "r5", name: "City Oyster & Sushi Bar", zip: "33432" },
  ];

  const handleSearch = () => {
    const filtered = restaurantList.filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) &&
      (!zip || r.zip.includes(zip))
    );
    setResults(filtered);
  };

  const handleSelect = (id) => {
    navigate(`/write-review/${id}`);
  };

  return (
    <>
      <Navbar />
      <PageWrapper>
        <div className="container py-5" style={{ maxWidth: "600px" }}>
          <h1 className="mb-4 text-center fw-bold">Write a Review</h1>

          <div className="mb-4">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Search restaurant name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Zip code (optional)"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
            <div className="d-grid">
              <button className="btn btn-dark" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>

          {results.length > 0 && (
            <div>
              <h5 className="fw-semibold mb-3">Select a restaurant:</h5>
              <ul className="list-group">
                {results.map((r) => (
                  <li
                    key={r.id}
                    className="list-group-item list-group-item-action"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleSelect(r.id)}
                  >
                    {r.name} <small className="text-muted">({r.zip})</small>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </PageWrapper>
      <Footer />
    </>
  );
};

export default WriteReview;