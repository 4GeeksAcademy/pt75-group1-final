import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-light py-3">
      <div className="container">
        <div className="row row-cols-1 row-cols-md-2 g-3">
          {/* Left Section - Contact Info */}
          <div className="col">
            <h5 className="fw-bold mb-2">BiteFinder</h5>
            <p className="mb-1 small"><strong>Address:</strong> 300 Market Street, San Francisco, CA 94103</p>
            <p className="mb-2 small"><strong>Contact:</strong> <a href="mailto:info@bitefinder.com">info@bitefinder.com</a></p>
          </div>

          {/* Right Section - Links */}
          <div className="col">
            <h6 className="fw-bold mb-2">Quick Links</h6>
            <ul className="list-unstyled small mb-0 row row-cols-2">
              <li className="mb-1"><Link to="/" className="text-decoration-none">Home</Link></li>
              <li className="mb-1"><Link to="/restaurants" className="text-decoration-none">Search</Link></li>
              <li className="mb-1"><Link to="/write-review" className="text-decoration-none">Write Review</Link></li>
              <li className="mb-1"><Link to="/about" className="text-decoration-none">About Us</Link></li>
              <li className="mb-1"><Link to="/contact" className="text-decoration-none">Contact Us</Link></li>
              <li className="mb-1"><Link to="/login" className="text-decoration-none">Login</Link></li>
              <li className="mb-1"><Link to="/signup" className="text-decoration-none">Sign Up</Link></li>
              <li className="mb-1"><Link to="/forgot-password" className="text-decoration-none">Forgot Password</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-3">
          <p className="small mb-1">&copy; 2025 BiteFinder. All rights reserved.</p>
          <div className="small">
            <Link className="text-decoration-none me-2">Privacy Policy</Link>
            <Link className="text-decoration-none me-2">Terms of Service</Link>
            <Link className="text-decoration-none">Cookies Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};