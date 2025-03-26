import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const restaurantMap = {
  r1: "COTE Miami",
  r2: "Agliolio",
  r3: "1000 NORTH",
  r4: "Common Grounds Brew & Roastery",
  r5: "City Oyster & Sushi Bar",
};

const ReviewForm = () => {
  const { id } = useParams();
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();
  const restaurantName = restaurantMap[id] || "Unknown Restaurant";

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReview = {
      id: uuidv4(),
      restaurantId: id,
      rating,
      review,
      date: new Date().toISOString(),
    };

    dispatch({ type: "ADD_REVIEW", payload: newReview });

    // Navigate to restaurants first
    navigate("/restaurants", {
      state: { reviewId: newReview.id },
    });

    // Show green toast
    setTimeout(() => {
      toast.success(
        <div>
          Your review was posted!{" "}
          <span
            onClick={() =>
              navigate(`/restaurant/${id}`, {
                state: { reviewId: newReview.id },
              })
            }
            style={{
              textDecoration: "underline",
              cursor: "pointer",
              color: "#0c684f",
              fontWeight: "bold",
              marginLeft: "8px",
            }}
          >
            View
          </span>
        </div>,
        { autoClose: 3000 }
      );
    }, 100); // Delay just enough to let navigation finish
  };

  return (
    <>
      <Navbar />

      <div className="container py-5" style={{ maxWidth: "600px" }}>
        <h1 className="mb-4 fw-bold">Write a Review</h1>
        <p>
          You're writing a review for: <strong>{restaurantName}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label d-block fw-semibold mb-2">Rating</label>
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`fa-star fa-xl me-2 ${
                  (hover || rating) >= star ? "fas text-warning" : "far text-muted"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                style={{ cursor: "pointer" }}
              />
            ))}
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Your Review</label>
            <textarea
              className="form-control"
              rows="5"
              minLength={85}
              required
              placeholder="Tell us about your experience..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
            ></textarea>
            <small className="form-text text-muted">Must be at least 85 characters</small>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-success">
              Post Review
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default ReviewForm;