import React from "react";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useParams, useLocation } from "react-router-dom";
import Slider from "react-slick";
import { restaurantData } from "./restaurantData";
import useGlobalReducer from "../hooks/useGlobalReducer";
import ReviewModal from "../components/ReviewModal";
import PageWrapper from "../components/PageWrapper";

export const RestaurantDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const { store } = useGlobalReducer(); // Make sure store is imported correctly

  // Use optional chaining to prevent errors if store or reviews isn't available yet.
  const restaurantReviews = store?.reviews?.filter((r) => r.restaurantId === id) || []; // <-- Fix added here

  // If store is undefined or empty, restaurantReviews will be an empty array

  React.useEffect(() => {
    if (location.state?.reviewId && store?.reviews) {  // <-- Also check if store.reviews exists
      const review = store.reviews.find((r) => r.id === location.state.reviewId);
      if (review) {
        setSelectedReview(review);
        setShowReviewModal(true);
      }
    }
  }, [location.state, store?.reviews]);

  const restaurant = restaurantData[id];
  const [showGallery, setShowGallery] = React.useState(false);
  const [showHours, setShowHours] = React.useState(false);
  const [activeImage, setActiveImage] = React.useState(null);
  const [selectedReview, setSelectedReview] = React.useState(null);
  const [showReviewModal, setShowReviewModal] = React.useState(false);

  if (!restaurant) {
    return <div className="text-center mt-5">Restaurant not found.</div>;
  }

  return (
    <div>
      <Navbar />
      <PageWrapper>
        <p className="text-center mt-3">Viewing restaurant ID: {id}</p>

        {/* Header Slideshow */}
        <section className="position-relative text-white" style={{ height: "550px", overflow: "hidden" }}>
          <div style={{ position: "relative", height: "100%" }}>
            <Slider
              autoplay
              infinite
              dots
              speed={500}
              slidesToShow={1}
              slidesToScroll={1}
              className="restaurant-slider"
            >
              {restaurant.images.map((img, idx) => (
                <div key={idx}>
                  <div
                    style={{
                      height: "550px",
                      backgroundImage: `url(${img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      transition: "transform 0.3s ease-in-out",
                      cursor: "zoom-in"
                    }}
                    onClick={() => setActiveImage(img)}
                  ></div>
                </div>
              ))}
            </Slider>

            {/* Overlay content */}
            <div className="restaurant-overlay text-white">
              <h1 className="fw-bold mb-2">{restaurant.name}</h1>
              <p className="mb-1">
                {Array(restaurant.price).fill("💲").join("")} • {restaurant.cuisine} • ⭐ {restaurant.rating}
              </p>
              <p className="mb-3">{restaurant.openNow ? "🟢 Open Now" : "🔴 Closed"}</p>
              <div className="d-flex gap-3">
                <button className="btn btn-light btn-sm rounded-0" onClick={() => setShowHours(true)}>
                  See Hours
                </button>
                <button className="btn btn-outline-light btn-sm rounded-0" onClick={() => setShowGallery(true)}>
                  View All Photos
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ... The rest of your component code remains unchanged ... */}

        {/* Feature Buttons */}
        <section className="container py-4">
          <div className="d-flex justify-content-center flex-wrap gap-3">
            <button className="btn btn-outline-dark">Share</button>
            <button className="btn btn-outline-dark">Save</button>
            <button className="btn btn-outline-dark">Reviews</button>
            <button className="btn btn-dark">Make Reservation</button>
          </div>
        </section>

        {/* Menu Section */}
        <section className="container py-4">
          <h3 className="fw-bold mb-3">Popular Dishes</h3>
          <ul className="list-group">
            {restaurant.popularDishes.map((dish, idx) => (
              <li key={idx} className="list-group-item">{dish}</li>
            ))}
          </ul>
        </section>

        {/* Location Section */}
        <section className="container py-4">
          <h3 className="fw-bold mb-3">Location & Hours</h3>
          <p>{restaurant.location}</p>
          <p>{restaurant.hours}</p>
          <div className="bg-secondary" style={{ width: "100%", height: "200px", borderRadius: "8px" }}></div>
        </section>

        {/* About Section */}
        <section className="container py-4">
          <h3 className="fw-bold mb-3">About the Restaurant</h3>
          <p>{restaurant.description}</p>
        </section>

        {/* Amenities Section */}
        <section className="container py-4">
          <h3 className="fw-bold mb-3">Amenities</h3>
          <ul className="list-group">
            {restaurant.amenities.map((item, idx) => (
              <li key={idx} className="list-group-item">{item}</li>
            ))}
          </ul>
        </section>

        {/* Gallery Section */}
        <section className="container py-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold">Photo Gallery</h3>
            <button className="btn btn-outline-dark btn-sm" onClick={() => setShowGallery(true)}>
              View All
            </button>
          </div>

          <div className="row g-3">
            {/* Large Left Image */}
            <div className="col-md-6">
              <img
                src={restaurant.images[0]}
                alt="Main Gallery"
                className="img-fluid rounded shadow-sm w-100"
                style={{ height: "380px", objectFit: "cover", cursor: "pointer" }}
                onClick={() => setActiveImage(restaurant.images[0])}
              />
            </div>

            {/* Smaller Grid Images */}
            <div className="col-md-6">
              <div className="row g-3">
                {restaurant.images.slice(1).map((img, idx) => (
                  <div key={idx} className="col-6">
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="img-fluid rounded shadow-sm w-100"
                      style={{ height: "180px", objectFit: "cover", cursor: "pointer" }}
                      onClick={() => setActiveImage(img)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 📝 User Reviews Section */}
        <section className="container py-5">
          <h3 className="fw-bold mb-4">User Reviews</h3>

          {restaurantReviews.length === 0 ? (
            <p className="text-muted">No reviews yet. Be the first to leave one!</p>
          ) : (
            <div className="list-group">
              {restaurantReviews.slice(0, showAllReviews ? restaurantReviews.length : 3).map((r, index) => {
                const isLong = r.review.length > 200;
                const [expanded, setExpanded] = React.useState(false);
                const preview = isLong && !expanded ? r.review.slice(0, 200) + "..." : r.review;

                return (
                  <div
                    key={index}
                    className="list-group-item mb-3 shadow-sm border rounded p-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedReview(r)}
                  >
                    <div className="mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`fa-star me-1 ${r.rating >= star ? "fas text-warning" : "far text-muted"
                            }`}
                        />
                      ))}
                    </div>
                    <p
                      className="mb-2 review-snippet"
                      onClick={() => setSelectedReview(r)}
                    >
                      {r.review}
                    </p>

                    <div>
                      <small className="text-muted">
                        Posted on {new Date(r.date).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                );
              })}

              {restaurantReviews.length > 3 && !showAllReviews && (
                <div className="text-center mt-3">
                  <button
                    className="btn btn-outline-dark btn-sm"
                    onClick={() => setShowAllReviews(true)}
                  >
                    Show more reviews
                  </button>
                </div>
              )}
            </div>
          )}
        </section>


        {/* Modals */}
        {
          showGallery && (
            <div
              className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center"
              style={{ zIndex: 1050 }}
              onClick={() => setShowGallery(false)}
            >
              <div className="bg-white rounded p-3" style={{ maxWidth: "90vw", maxHeight: "90vh", overflowY: "auto" }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="fw-bold mb-0">{restaurant.name} Gallery</h4>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowGallery(false)}>
                    Close
                  </button>
                </div>

                <div className="row g-3">
                  {restaurant.images.map((img, idx) => (
                    <div key={idx} className="col-12 col-md-6 col-lg-4">
                      <img
                        src={img}
                        alt={`Gallery ${idx + 1}`}
                        className="img-fluid rounded"
                        style={{ objectFit: "cover", width: "100%", height: "250px", cursor: "pointer" }}
                        onClick={() => setActiveImage(img)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        }

        {
          activeImage && (
            <div
              className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center"
              style={{ zIndex: 1060 }}
              onClick={() => setActiveImage(null)}
            >
              <img
                src={activeImage}
                alt="Full Preview"
                className="img-fluid rounded shadow"
                style={{ maxHeight: "90%", maxWidth: "90%", objectFit: "contain" }}
              />
            </div>
          )
        }

        {
          showHours && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              role="dialog"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              onClick={() => setShowHours(false)}
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Hours for {restaurant.name}</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowHours(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <p>{restaurant.hours}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        }
        {
          selectedReview && (
            <ReviewModal
              review={selectedReview}
              onClose={() => setSelectedReview(null)}
            />
          )
        }
      </PageWrapper >
      <Footer />
    </div >
  );
};
