import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import useGlobalReducer from "../hooks/useGlobalReducer";


const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const user = store.user;

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="navbar-wrapper position-relative">
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
        <div className="container">
          <Link to="/" className="navbar-brand fw-bold">BiteFinder</Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav text-center">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/restaurants">Explore Restaurants</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/write-review">Write a Review</Link>
              </li>
              <li className="nav-item">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search restaurants..."
                />
              </li>
              {user && (
                <li className="nav-item">
                  <button className="btn btn-outline-dark" onClick={handleLogout}>Logout</button>
                </li>
              )}
            </ul>
          </div>

          <div className="ms-auto">
            {user ? (
              <img src="https://loremflickr.com/320/240" alt="Profile" className="rounded-circle" style={{ width: "40px", height: "40px" }} />
            ) : (
              <Link to="/signup" className="btn btn-primary">Join</Link>
            )}
          </div>
        </div>
      </nav>

      <div className="navbar-curve"></div>
    </div>
  );
};

export default Navbar;