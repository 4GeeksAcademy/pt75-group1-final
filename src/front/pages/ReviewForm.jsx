import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { v4 as uuidv4 } from "uuid";
import PageWrapper from "../components/PageWrapper";

const ReviewForm = () => {
  const { id } = useParams();
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  // States for restaurant data
  const [restaurantData, setRestaurantData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // States for review form
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");

  // Static restaurant map for non-API restaurants
  const staticRestaurantMap = {
    r1: "COTE Miami",
    r2: "Agliolio",
    r3: "1000 NORTH",
    r4: "Common Grounds Brew & Roastery",
    r5: "City Oyster & Sushi Bar",
  };

  // Get restaurant data on component mount
  useEffect(() => {
    const getRestaurantData = () => {
      // Check if this is an API restaurant from sessionStorage
      const storedData = sessionStorage.getItem('reviewingRestaurant');

      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setRestaurantData({
            id: parsedData.id,
            name: parsedData.name,
            isApiData: true
          });
          setIsLoading(false);
        } catch (error) {
          console.error("Error parsing restaurant data:", error);
          // Fallback to static data
          setRestaurantData({
            id: id,
            name: staticRestaurantMap[id] || "Unknown Restaurant",
            isApiData: false
          });
          setIsLoading(false);
        }
      } else {
        // Check if this is a static restaurant
        setRestaurantData({
          id: id,
          name: staticRestaurantMap[id] || "Unknown Restaurant",
          isApiData: false
        });
        setIsLoading(false);
      }
    };

    getRestaurantData();

    // Clean up session storage on component unmount
    return () => {
      // Don't remove on unmount as we need it for navigation back
      // sessionStorage.removeItem('reviewingRestaurant');
    };
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }

    if (!restaurantData) {
      alert("Error: Restaurant data not found.");
      return;
    }

    const newReview = {
      id: uuidv4(),
      restaurantId: restaurantData.id,
      restaurantName: restaurantData.name,
      isApiData: restaurantData.isApiData,
      rating,
      review,
      date: new Date().toISOString(),
    };

    // Add review to store
    dispatch({ type: "ADD_REVIEW", payload: newReview });

    // Navigate to restaurants page with review info
    navigate("/restaurants", {
      state: {
        message: "Your review was posted successfully!",
        reviewId: newReview.id,
        restaurantId: restaurantData.id,
        isApiData: restaurantData.isApiData
      },
    });
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <PageWrapper>
          <div className="container text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading restaurant information...</p>
          </div>
        </PageWrapper>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageWrapper>
        <div className="container py-5" style={{ maxWidth: "600px" }}>
          <h1 className="mb-4 fw-bold">Write a Review</h1>
          <p>
            You're writing a review for: <strong>{restaurantData.name}</strong>
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label d-block fw-semibold mb-2">Rating</label>
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`fa-star fa-xl me-2 ${(hover || rating) >= star ? "fas text-warning" : "far text-muted"}`}
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
      </PageWrapper>
      <Footer />
    </>
  );
};

export default ReviewForm;