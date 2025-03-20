import React from "react";
import communityImg from "../assets/img/community.png"; // ✅ Update with your image file

const CTA = () => {
  return (
    <section className="container my-5">
      <div className="row align-items-center p-4 shadow-sm border rounded">
        {/* Left Side - Text & Buttons */}
        <div className="col-md-6">
          <h2 className="fw-bold">Join the BiteFinder Community</h2>
          <p>Sign up now to save your favorite restaurants and share your dining experiences with others!</p>
          <div className="d-flex gap-3">
            <button className="btn btn-dark">Sign Up</button>
            <button className="btn btn-outline-dark">Learn More</button>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="col-md-6">
          <img src={communityImg} alt="BiteFinder Community" className="img-fluid cta-img" />
        </div>
      </div>
    </section>
  );
};

export default CTA;
