import React from "react";
import userImg from "../assets/img/user-placeholder.png"; // Placeholder user image
import webflowLogo from "../assets/img/webflow.png"; // Webflow logo (if applicable)

const Testimonial = () => {
  return (
    <section className="container my-5 text-center">
      {/* ⭐ Star Rating */}
      <div className="mb-3">
        <span className="fs-3">★★★★★</span> {/* Change className to adjust size if needed */}
      </div>

      {/* 📝 Testimonial Text */}
      <blockquote className="fw-bold fs-5">
        "BiteFinder transformed my dining experience! I love discovering new restaurants and sharing my thoughts with others."
      </blockquote>

      {/* User Info Section */}
      <div className="d-flex justify-content-center align-items-center mt-4">
        {/* 👤 User Image */}
        <img
          src={userImg}
          alt="Emily Johnson"
          className="rounded-circle me-3"
          style={{ width: "50px", height: "50px" }}
        />
        <div className="text-start">
          <p className="mb-0 fw-bold">Emily Johnson</p>
          <p className="text-muted">Food Blogger</p>
        </div>

        {/* 🏆 Brand Logo (Optional) */}
        <img
          src={webflowLogo}
          alt="Webflow"
          className="ms-3"
          style={{ height: "30px" }}
        />
      </div>
    </section>
  );
};

export default Testimonial;
