import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../Navbar.css"; 

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const userProfilePhoto = "https://loremflickr.com/320/240";
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="navbar-wrapper position-relative">
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
        <div className="container">
          {/* Logo */}
          <Link to="/" className="navbar-brand fw-bold">BiteFinder</Link>

          {/* Toggle button for mobile view */}
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

          {/* Navbar Items */}
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

              {/* Dropdown Menu */}
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  More Options
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><Link className="dropdown-item" to="/about">About Us</Link></li>
                  <li><Link className="dropdown-item" to="/contact">Contact</Link></li>
                  <li><a className="dropdown-item" href="#" onClick={handleLogout}>Logout</a></li>
                </ul>
              </li>
            </ul>
          </div>

          {/* Right-Aligned Search and Profile */}
          <div className="d-flex align-items-center ms-auto gap-3">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search restaurants..."
            />
            <img
              src={userProfilePhoto}
              alt="Profile"
              className="profile-photo rounded-circle"
              style={{ width: "40px", height: "40px" }}
            />
          </div>
        </div>
      </nav>

      {/* 🔥 Decorative curve layer */}
      <div className="navbar-curve"></div>
    </div>
  );
};

export default Navbar;
