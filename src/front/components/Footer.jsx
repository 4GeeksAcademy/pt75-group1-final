import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-light py-4">
      <div className="container">
        <div className="row">
          {/* Left Section - Logo and Contact Info */}
          <div className="col-md-4">
            <h5 className="fw-bold">BiteFinder</h5>
            <p><strong>Address:</strong> Level 1, 12 Sample St, Sydney NSW 2000</p>
            <p><strong>Contact:</strong> <a href="mailto:info@bitefinder.com">info@bitefinder.com</a></p>

            {/* Social Media Icons */}
            <div className="d-flex gap-3">
              <a href="#"><i className="fab fa-facebook fs-4"></i></a>
              <a href="#"><i className="fab fa-instagram fs-4"></i></a>
              <a href="#"><i className="fab fa-x-twitter fs-4"></i></a>
              <a href="#"><i className="fab fa-linkedin fs-4"></i></a>
              <a href="#"><i className="fab fa-youtube fs-4"></i></a>
            </div>
          </div>

          {/* Center Section - Quick Links */}
          <div className="col-md-4">
            <h6 className="fw-bold">Quick Links</h6>
            <ul className="list-unstyled">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Blog Posts</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">User Reviews</a></li>
            </ul>
          </div>

          {/* Right Section - More Options */}
          <div className="col-md-4">
            <h6 className="fw-bold">More</h6>
            <ul className="list-unstyled">
              <li><a href="#">Gift Cards</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Community Forum</a></li>
              <li><a href="#">Press Releases</a></li>
              <li><a href="#">Feedback Form</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section - Legal Links */}
        <div className="text-center mt-4">
          <p className="small">&copy; 2025 BiteFinder. All rights reserved.</p>
          <ul className="list-inline">
            <li className="list-inline-item"><a href="#">Privacy Policy</a></li>
            <li className="list-inline-item"><a href="#">Terms of Service</a></li>
            <li className="list-inline-item"><a href="#">Cookies Settings</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};