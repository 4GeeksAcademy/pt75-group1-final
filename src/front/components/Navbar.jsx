import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import SignUpModal from "./auth/SignUpModal";
import LoginModal from "./auth/LoginModal";
import useGlobalReducer from "../hooks/useGlobalReducer";

const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const loggedIn = store.loggedInUser !== null;

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
              <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/restaurants">Explore Restaurants</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/write-review">Write a Review</Link></li>

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
                </ul>
              </li>
            </ul>
          </div>

          <div className="ms-auto d-flex align-items-center gap-2">
            {!loggedIn ? (
              <Button
                onClick={() => dispatch({ type: "SHOW_SIGNUP_MODAL" })}
                variant="primary"
                className="rounded-0"
              >
                Join
              </Button>
            ) : (
              <div className="dropdown">
                <button
                  className="btn p-0 border-0 bg-transparent d-flex flex-column align-items-center"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ boxShadow: "none" }}
                >
                  <div
                    className="rounded-circle"
                    style={{
                      width: "54px",
                      height: "54px",
                      backgroundColor: "#f4f4f4",
                      border: "2px solid #d0d0d0",
                      backgroundImage: `url("https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f464.png")`,
                      backgroundSize: "90%",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  ></div>
                  <div
                    style={{
                      marginTop: "4px",
                      fontSize: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      padding: "2px 4px",
                      background: "#f8f9fa",
                    }}
                  >
                    ▼
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end mt-2" aria-labelledby="userDropdown">
                  <li><a className="dropdown-item" href="#">About Me</a></li>
                  <li><a className="dropdown-item" href="#">Favorites</a></li>
                  <li><a className="dropdown-item" href="#">Settings</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={() => dispatch({ type: "LOGOUT" })}>
                      Log Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="navbar-curve"></div>

      {/* Modals use global state */}
      <SignUpModal
        show={store.showSignUpModal}
        handleClose={() => dispatch({ type: "HIDE_SIGNUP_MODAL" })}
        switchToLogin={() => {
          dispatch({ type: "HIDE_SIGNUP_MODAL" });
          dispatch({ type: "SHOW_LOGIN_MODAL" });
        }}
      />

      <LoginModal
        show={store.showLoginModal}
        handleClose={() => dispatch({ type: "HIDE_LOGIN_MODAL" })}
        switchToSignup={() => {
          dispatch({ type: "HIDE_LOGIN_MODAL" });
          dispatch({ type: "SHOW_SIGNUP_MODAL" });
        }}
      />
    </div>
  );
};

export default Navbar;
