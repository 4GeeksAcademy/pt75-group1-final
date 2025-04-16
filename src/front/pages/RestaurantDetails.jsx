import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { restaurantData } from "./restaurantData";
import useGlobalReducer from "../hooks/useGlobalReducer";
import ReviewModal from "../components/ReviewModal";
import PageWrapper from "../components/PageWrapper";

export const RestaurantDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { store } = useGlobalReducer();
  
  // State for API data
  const [apiRestaurant, setApiRestaurant] = useState(null);
  const [isApiData, setIsApiData] = useState(false);

  // Initialize other states
  const [showGallery, setShowGallery] = useState(false);
  const [showHours, setShowHours] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Get the restaurant data - either from static data or from API
  useEffect(() => {
    // Check if coming from the Restaurants page with API data
    if (location.state?.isApiData) {
      try {
        // Try to get the API restaurant data from sessionStorage
        const storedData = sessionStorage.getItem('apiRestaurantDetails');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setApiRestaurant(parsedData);
          setIsApiData(true);
          console.log("Loaded API restaurant data:", parsedData);
        }
      } catch (error) {
        console.error("Error loading API restaurant data:", error);
        navigate('/restaurants', { state: { message: "Error loading restaurant details" } });
      }
    } else {
      // Using static data
      setIsApiData(false);
    }
  }, [id, location.state, navigate]);

  // Handle review functionality
  useEffect(() => {
    if (location.state?.reviewId) {
      const review = store.reviews.find((r) => r.id === location.state.reviewId);
      if (review) {
        setSelectedReview(review);
      }
    }
  }, [location.state, store.reviews]);

  // Get static restaurant data
  const staticRestaurant = restaurantData[id];
  
  // If we don't have a restaurant from either source, show an error
  if (!staticRestaurant && !apiRestaurant) {
    return (
      <div>
        <Navbar />
        <PageWrapper>
          <div className="text-center mt-5">
            <h3>Restaurant not found.</h3>
            <p>The restaurant you're looking for doesn't exist or was removed.</p>
            <button 
              className="btn btn-dark mt-3" 
              onClick={() => navigate('/restaurants')}
            >
              Back to Restaurants
            </button>
          </div>
        </PageWrapper>
        <Footer />
      </div>
    );
  }

  // Use the appropriate restaurant data based on source
  const restaurant = isApiData ? apiRestaurant : staticRestaurant;
  
  // Get restaurant reviews if using static data
  const restaurantReviews = isApiData ? [] : store.reviews.filter((r) => r.restaurantId === id);

  // Helper function to prepare images for the API restaurant
  const getRestaurantImages = () => {
    if (!isApiData) {
      // For static data, return the images array directly
      return restaurant.images || [];
    }
    
    // For API data, construct an array of images
    const images = [];
    
    // Add the main photo if available
    if (restaurant.photo?.images?.large?.url) {
      images.push(restaurant.photo.images.large.url);
    } else if (restaurant.photo?.images?.medium?.url) {
      images.push(restaurant.photo.images.medium.url);
    }
    
    // Add photos from the photos array if available
    if (restaurant.photos && Array.isArray(restaurant.photos)) {
      restaurant.photos.forEach(photo => {
        if (photo.images?.large?.url) {
          images.push(photo.images.large.url);
        } else if (photo.images?.medium?.url) {
          images.push(photo.images.medium.url);
        }
      });
    }
    
    // If we still don't have images, add a placeholder
    if (images.length === 0) {
      images.push("https://via.placeholder.com/800x600?text=No+Image+Available");
    }
    
    return images;
  };

  // Get the images to display
  const restaurantImages = getRestaurantImages();
  
  // Helper function to format restaurant details from API data
  const getRestaurantDetails = () => {
    if (!isApiData) {
      // For static data, return the data directly
      return {
        name: restaurant.name,
        price: restaurant.price || "$",
        cuisine: restaurant.cuisine || "Various",
        rating: restaurant.rating || "N/A",
        isOpen: restaurant.openNow,
        description: restaurant.description || "No description available.",
        location: restaurant.location || "Address not available",
        hours: restaurant.hours || "Hours not available",
        amenities: restaurant.amenities || [],
        popularDishes: restaurant.popularDishes || []
      };
    }
    
    // For API data, normalize the fields
    return {
      name: restaurant.name,
      price: restaurant.normalizedPrice || restaurant.price || "$",
      cuisine: restaurant.cuisine_type || 
               (restaurant.cuisine && restaurant.cuisine[0]?.name) || 
               "Various",
      rating: restaurant.normalizedRating || restaurant.rating || "N/A",
      isOpen: restaurant.normalizedOpenNow,
      description: restaurant.description || "No description available for this restaurant.",
      location: restaurant.address || 
                (restaurant.location && restaurant.location.address) || 
                "Address not available",
      hours: restaurant.hours_str || 
             (restaurant.hours && restaurant.hours.weekday_text?.join(", ")) || 
             "Hours not available",
      amenities: restaurant.amenities || 
                 restaurant.features || 
                 restaurant.offerings || 
                 [],
      popularDishes: restaurant.signature_dishes || 
                     restaurant.popular_dishes || 
                     restaurant.dish_highlights || 
                     ["Information not available"]
    };
  };

  // Get formatted restaurant details
  const details = getRestaurantDetails();

  return (
    <div>
      <Navbar />
      <PageWrapper>
        <p className="text-center mt-3">
          {isApiData ? "API Restaurant Details" : `Viewing restaurant ID: ${id}`}
        </p>

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
              {restaurantImages.map((img, idx) => (
                <div key={idx}>
                  <div
                    style={{
                      height: "550px",
                      backgroundImage: `url(${img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      transition: "transform 0.3s ease-in-out",
                      cursor: "zoom-in",
                    }}
                    onClick={() => setActiveImage(img)}
                  ></div>
                </div>
              ))}
            </Slider>

            {/* Overlay content */}
            <div
              className="position-absolute bottom-0 start-0 text-white p-4"
              style={{ zIndex: 1, background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}
            >
              <h1 className="fw-bold">{details.name}</h1>
              <p className="mb-1">
                💲{details.price} • {details.cuisine} • ⭐ {details.rating}
              </p>
              <p className="mb-3">{details.isOpen ? "🟢 Open Now" : "🔴 Closed"}</p>
              <div className="d-flex gap-3">
                <button className="btn btn-light btn-sm" onClick={() => setShowHours(true)}>
                  See Hours
                </button>

                <button className="btn btn-outline-light btn-sm" onClick={() => setShowGallery(true)}>
                  View All Photos
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Buttons */}
        <section className="container py-4">
          <div className="d-flex justify-content-center flex-wrap gap-3">
            <button className="btn btn-outline-dark">Share</button>
            <button className="btn btn-outline-dark">Save</button>
            <button className="btn btn-outline-dark">Reviews</button>
            <button className="btn btn-dark">Make Reservation</button>
          </div>
        </section>

        {/* Menu Section - Only show for non-API data or if we have popular dishes */}
        {(!isApiData || (isApiData && details.popularDishes.length > 0)) && (
          <section className="container py-4">
            <h3 className="fw-bold mb-3">Popular Dishes</h3>
            <ul className="list-group">
              {details.popularDishes.map((dish, idx) => (
                <li key={idx} className="list-group-item">{dish}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Location Section */}
        <section className="container py-4">
          <h3 className="fw-bold mb-3">Location & Hours</h3>
          <p>{details.location}</p>
          <p>{details.hours}</p>
          <div className="bg-secondary" style={{ width: "100%", height: "200px", borderRadius: "8px" }}></div>
        </section>

        {/* About Section */}
        <section className="container py-4">
          <h3 className="fw-bold mb-3">About the Restaurant</h3>
          <p>{details.description}</p>
        </section>

        {/* Amenities Section - Only show if we have amenities */}
        {details.amenities && details.amenities.length > 0 && (
          <section className="container py-4">
            <h3 className="fw-bold mb-3">Amenities</h3>
            <ul className="list-group">
              {details.amenities.map((item, idx) => (
                <li key={idx} className="list-group-item">{item}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Gallery Section */}
        <section className="container py-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold">Photo Gallery</h3>
            <button className="btn btn-outline-dark btn-sm" onClick={() => setShowGallery(true)}>
              View All
            </button>
          </div>

          <div className="row g-3">
            {/* Large Left Image - Only if we have at least one image */}
            {restaurantImages.length > 0 && (
              <div className="col-md-6">
                <img
                  src={restaurantImages[0]}
                  alt="Main Gallery"
                  className="img-fluid rounded shadow-sm w-100"
                  style={{ height: "380px", objectFit: "cover", cursor: "pointer" }}
                  onClick={() => setActiveImage(restaurantImages[0])}
                />
              </div>
            )}

            {/* Smaller Grid Images - Only if we have more than one image */}
            {restaurantImages.length > 1 && (
              <div className="col-md-6">
                <div className="row g-3">
                  {restaurantImages.slice(1).map((img, idx) => (
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
            )}
          </div>
        </section>

        {/* 📝 User Reviews Section - Only show for non-API restaurants */}
        {!isApiData && (
          <section className="container py-5">
            <h3 className="fw-bold mb-4">User Reviews</h3>

            {restaurantReviews.length === 0 ? (
              <p className="text-muted">No reviews yet. Be the first to leave one!</p>
            ) : (
              <div className="list-group">
                {restaurantReviews.slice(0, showAllReviews ? restaurantReviews.length : 3).map((r, index) => {
                  const isLong = r.review.length > 200;
                  const [expanded, setExpanded] = useState(false);
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
                            className={`fa-star me-1 ${
                              r.rating >= star ? "fas text-warning" : "far text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mb-2">{preview}</p>
                      {isLong && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpanded(!expanded);
                          }}
                          className="btn btn-link btn-sm p-0"
                        >
                          {expanded ? "Show less" : "Read more"}
                        </button>
                      )}
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
        )}

        {/* Back Button */}
        <section className="container py-3 mb-5">
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate('/restaurants')}
          >
            Back to Restaurants
          </button>
        </section>

        {/* Modals */}
        {showGallery && restaurantImages.length > 0 && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center"
            style={{ zIndex: 1050 }}
            onClick={() => setShowGallery(false)}
          >
            <div className="bg-white rounded p-3" style={{ maxWidth: "90vw", maxHeight: "90vh", overflowY: "auto" }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold mb-0">{details.name} Gallery</h4>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowGallery(false)}>
                  Close
                </button>
              </div>

              <div className="row g-3">
                {restaurantImages.map((img, idx) => (
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
        )}

        {activeImage && (
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
        )}

        {showHours && (
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
                  <h5 className="modal-title">Hours for {details.name}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowHours(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>{details.hours}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {selectedReview && (
          <ReviewModal
            review={selectedReview}
            onClose={() => setSelectedReview(null)}
          />
        )}
      </PageWrapper>
      <Footer />
    </div>
  );
};