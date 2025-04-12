import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-light py-3">
      <div className="container">
        <div className="row row-cols-1 row-cols-md-3 g-3">
          {/* Left Section - Logo and Contact Info */}
          <div className="col">
            <h5 className="fw-bold mb-2">BiteFinder</h5>
            <p className="mb-1 small"><strong>Address:</strong> Level 1, 12 Sample St, Sydney NSW 2000</p>
            <p className="mb-2 small"><strong>Contact:</strong> <a href="mailto:info@bitefinder.com">info@bitefinder.com</a></p>

            {/* Social Media Icons */}
            <div className="d-flex gap-2 mb-3">
              <a href="#" className="text-dark"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-dark"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-dark"><i className="fab fa-x-twitter"></i></a>
              <a href="#" className="text-dark"><i className="fab fa-linkedin"></i></a>
              <a href="#" className="text-dark"><i className="fab fa-youtube"></i></a>
            </div>
          </div>

          {/* Center Section - Quick Links */}
          <div className="col">
            <h6 className="fw-bold mb-2">Quick Links</h6>
            <ul className="list-unstyled small mb-0">
              <li className="mb-1"><a href="#" className="text-decoration-none">About Us</a></li>
              <li className="mb-1"><a href="#" className="text-decoration-none">Contact Us</a></li>
              <li className="mb-1"><a href="#" className="text-decoration-none">Blog Posts</a></li>
              <li className="mb-1"><a href="#" className="text-decoration-none">Help Center</a></li>
              <li className="mb-1"><a href="#" className="text-decoration-none">User Reviews</a></li>
            </ul>
          </div>

          {/* Right Section - More Options */}
          <div className="col">
            <h6 className="fw-bold mb-2">More</h6>
            <ul className="list-unstyled small mb-0">
              <li className="mb-1"><a href="#" className="text-decoration-none">Gift Cards</a></li>
              <li className="mb-1"><a href="#" className="text-decoration-none">Careers</a></li>
              <li className="mb-1"><a href="#" className="text-decoration-none">Community Forum</a></li>
              <li className="mb-1"><a href="#" className="text-decoration-none">Press Releases</a></li>
              <li className="mb-1"><a href="#" className="text-decoration-none">Feedback Form</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section - Legal Links (removed border-top) */}
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