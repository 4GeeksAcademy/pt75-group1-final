import React from "react";

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
              <li className="mb-1"><a href="#" className="text-decoration-none">Home</a></li>
              <li className="mb-1"><a href="#" className="text-decoration-none">Search</a></li>
              <li className="mb-1"><a href="#" className="text-decoration-none">Write Review</a></li>
              <li className="mb-1"><a href="#" className="text-decoration-none">About Us</a></li>
              <li className="mb-1"><a href="#" className="text-decoration-none">Contact Us</a></li>
              <li className="mb-1"><a href="#" className="text-decoration-none">Login</a></li>
              <li className="mb-1"><a href="#" className="text-decoration-none">Sign Up</a></li>
              <li className="mb-1"><a href="#" className="text-decoration-none">Forgot Password</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-3">
          <p className="small mb-1">&copy; 2025 BiteFinder. All rights reserved.</p>
          <div className="small">
            <a href="#" className="text-decoration-none me-2">Privacy Policy</a>
            <a href="#" className="text-decoration-none me-2">Terms of Service</a>
            <a href="#" className="text-decoration-none">Cookies Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
