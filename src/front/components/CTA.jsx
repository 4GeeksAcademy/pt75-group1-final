import React from "react";
import communityImg from "../assets/img/community.png";

const CTA = () => {
  return (
    <section className="container my-5 py-5"> {/* ✅ Equal vertical spacing */}
      <div
        className="row align-items-center p-5 shadow border rounded-4 transition cta-box"
        style={{
          backgroundColor: "#f8f9fa", // subtle background tint
        }}
      >
        {/* Left Side - Text & Buttons */}
        <div className="col-md-6 mb-4 mb-md-0">
          <h2 className="fw-bold mb-3">Join the BiteFinder Community</h2>
          <p className="mb-4">
            Sign up now to save your favorite restaurants and share your dining
            experiences with others!
          </p>
          <div className="d-flex gap-3">
            <button className="btn btn-dark px-4 py-2">Sign Up</button>
            <button className="btn btn-outline-dark px-4 py-2">Learn More</button>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="col-md-6">
          <img
            src={communityImg}
            alt="BiteFinder Community"
            className="img-fluid rounded"
          />
        </div>
      </div>
    </section>
  );
};

export default CTA;
