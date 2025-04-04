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

  const handleProfileClick = () => {
    navigate("/profile");
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
            </ul>
          </div>

          <div className="ms-auto d-flex align-items-center">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-light dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src="https://picsum.photos/40"
                    alt="Profile"
                    className="rounded-circle me-2"
                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                  />
                  {user.username}
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <button className="dropdown-item" onClick={handleProfileClick}>
                      Profile
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-dark mx-2">Login</Link>
                <Link to="/signup" className="btn btn-primary">Join</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="navbar-curve"></div>
    </div>
  );
};

export default Navbar;
