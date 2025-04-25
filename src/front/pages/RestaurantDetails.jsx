import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { restaurantData } from "./restaurantData";
import useGlobalReducer from "../hooks/useGlobalReducer";
import ReviewModal from "../components/ReviewModal";
import PageWrapper from "../components/PageWrapper";
import HoursTable from "../components/restaurant/HoursTable";
import LocationMap from "../components/restaurant/LocationMap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export const RestaurantDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { store } = useGlobalReducer();

  // State for API data
  const [apiRestaurant, setApiRestaurant] = useState(null);
  const [isApiData, setIsApiData] = useState(false);
  const [additionalPhotos, setAdditionalPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize other states
  const [showGallery, setShowGallery] = useState(false);
  const [showHours, setShowHours] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isReturningFromDetails, setIsReturningFromDetails] = useState(false);

  const [reservationDate, setReservationDate] = useState(new Date());
  const handleReservation = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("You must be logged in to make a reservation.");
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reservation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        restaurant_id: restaurant.location_id || restaurant.id,
        restaurant_name: restaurant.name,
        reservation_time: reservationDate.toISOString()
      })
      
      
    });

    const result = await response.json();
    if (response.ok) {
      alert("Reservation confirmed!");
    } else {
      alert("Reservation failed: " + (result.msg || "Unknown error"));
    }
  };


  // Get the restaurant data - either from static data or from API
  // In the useEffect section that handles API data loading
  useEffect(() => {
    // Check if coming from the Restaurants page with API data
    if (location.state?.isApiData) {
      setLoading(true);
      setError(null);

      try {
        // Try to get the API restaurant data from sessionStorage
        const storedData = sessionStorage.getItem('apiRestaurantDetails');
        if (storedData) {
          const parsedData = JSON.parse(storedData);

          // Enhance the parsedData with default values to prevent errors
          const enhancedData = {
            ...parsedData,
            photos: parsedData.photos || [],
            photo: parsedData.photo || {
              images: {
                large: { url: "https://via.placeholder.com/800x600?text=No+Image+Available" },
                medium: { url: "https://via.placeholder.com/400x300?text=No+Image+Available" }
              }
            },
            description: parsedData.description || "No description available",
            hours_str: parsedData.hours_str || "Hours information not available",
            address: parsedData.address || "Address information not available"
          };

          setApiRestaurant(enhancedData);
          setIsApiData(true);
          setLoading(false);
          console.log("Loaded API restaurant data:", enhancedData);
        } else {
          throw new Error("No restaurant data found in session storage");
        }
      } catch (error) {
        console.error("Error loading API restaurant data:", error);
        setError(error.message);
        setLoading(false);
      }
    } else {
      // Check if this is an API restaurant ID even without location state
      // This helps when navigating back from a review or refresh
      try {
        // If the ID starts with "api-" or looks like a location_id number, try to load from storage
        if ((id && (id.startsWith('api-') || !isNaN(id))) ||
          sessionStorage.getItem('apiRestaurantDetails')) {
          const storedData = sessionStorage.getItem('apiRestaurantDetails');

          if (storedData) {
            const parsedData = JSON.parse(storedData);
            // Only set as API data if the IDs match or if it's the only stored restaurant
            if (!id || id === parsedData.location_id || id === `api-${parsedData.location_id}`) {
              setApiRestaurant(parsedData);
              setIsApiData(true);
            } else {
              setIsApiData(false);
            }
          }
        } else {
          setIsApiData(false);
        }
      } catch (err) {
        console.error("Error checking for API restaurant:", err);
        setIsApiData(false);
      }
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

  // Function to fetch additional photos for the restaurant
  const fetchAdditionalPhotos = async (locationId) => {
    try {
      console.log("Fetching additional photos for restaurant ID:", locationId);

      // Direct call to RapidAPI
      const response = await fetch('https://restaurants222.p.rapidapi.com/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-RapidAPI-Key': '6523447ffdmshf6ff1c4acbf3f3dp109302jsnd9877b7e20f0',
          'X-RapidAPI-Host': 'restaurants222.p.rapidapi.com'
        },
        body: new URLSearchParams({
          location_id: locationId,
          language: 'en_US',
          currency: 'USD',
          offset: '0'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch photos: ${response.status}`);
      }

      const data = await response.json();
      console.log("Photos API response:", data);

      // Extract photo URLs
      let photoUrls = [];

      if (data.data && Array.isArray(data.data)) {
        photoUrls = data.data
          .filter(photo => photo.images && (photo.images.large || photo.images.medium))
          .map(photo => photo.images.large?.url || photo.images.medium?.url)
          .filter(url => url);

        console.log("Extracted photo URLs:", photoUrls);
      }

      // Return the photo URLs or fallback images if none found
      if (photoUrls.length > 0) {
        return photoUrls;
      } else {
        return [
          "https://via.placeholder.com/800x600?text=No+Image+Available",
          "https://via.placeholder.com/800x600?text=No+Image+Available",
          "https://via.placeholder.com/800x600?text=No+Image+Available"
        ];
      }
    } catch (error) {
      console.error("Error fetching additional photos:", error);
      return [
        "https://placehold.co/800x600/gray/white?text=Fallback+Photo+1",
        "https://placehold.co/800x600/gray/white?text=Fallback+Photo+2",
        "https://placehold.co/800x600/gray/white?text=Fallback+Photo+3"
      ];
    }
  };

  // Fetch additional photos when the component loads
  useEffect(() => {
    // Only fetch additional photos if we have a restaurant from API data
    if (isApiData && apiRestaurant) {
      setLoading(true);
      const locationId = apiRestaurant.location_id || id;

      // Fetch additional photos
      fetchAdditionalPhotos(locationId)
        .then(photos => {
          if (photos && photos.length > 0) {
            // Store the fetched photos in state
            setAdditionalPhotos(photos);
            console.log("Additional photos loaded:", photos);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error("Failed to load additional photos:", error);
          setLoading(false);
        });
    }
  }, [isApiData, apiRestaurant, id]);


  // Add this updated useEffect to handle returning from restaurant details
  useEffect(() => {
    // Check if we're returning from restaurant details
    const wasViewingDetails = sessionStorage.getItem('viewingRestaurantDetails');

    if (wasViewingDetails || location.state?.returnedFromDetails) {
      // Clear the flag to prevent reloading on further navigation
      sessionStorage.removeItem('viewingRestaurantDetails');
      setIsReturningFromDetails(true); // Set this flag to true

      // Try to load previous search results but don't try to set city query or restaurants
      // This should be handled in the Restaurants component instead
      const storedSearch = sessionStorage.getItem('lastSearchResults');
      if (storedSearch) {
        try {
          console.log("Found stored search results, but they will be handled in Restaurants component");
          // Don't try to use setCityQuery or setRestaurants here
        } catch (err) {
          console.error("Error accessing stored search:", err);
        }
      }
    }
  }, []);  // Empty dependency array to run only once on mount

  const ReviewItem = ({ review }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <>
        <div
          className="list-group-item mb-3 shadow-sm border rounded p-3"
          style={{
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onClick={() => setExpanded(true)}
        >
          <div className="mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`fa-star me-1 ${review.rating >= star ? "fas text-warning" : "far text-muted"}`}
              />
            ))}
          </div>
          <div
            className="mb-2"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              wordWrap: "break-word",
            }}
          >
            {review.review}
          </div>
          <div>
            <small className="text-muted">
              Posted on {new Date(review.date).toLocaleDateString()}
            </small>
          </div>
        </div>

        {expanded && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              zIndex: 1050,
              cursor: "pointer"
            }}
            onClick={() => setExpanded(false)}
          >
            <div
              className="bg-white rounded-3 p-4 mx-3"
              style={{
                maxWidth: "500px",
                width: "90%",
                height: "auto",
                overflowY: "visible",
                transform: "scale(1)",
                animation: "popIn 0.3s ease-out",
                cursor: "default"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 fw-bold">Review</h5>
                <button
                  className="btn-close"
                  onClick={() => setExpanded(false)}
                  aria-label="Close"
                ></button>
              </div>

              <div className="mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`fa-star fa-lg me-1 ${review.rating >= star ? "fas text-warning" : "far text-muted"}`}
                  />
                ))}
              </div>

              <div className="review-content mb-4" style={{
                whiteSpace: "normal",
                wordWrap: "break-word",
                hyphens: "auto",
                lineHeight: "1.6"
              }}>
                {review.review}
              </div>

              <div className="text-end text-muted">
                <small>Posted on {new Date(review.date).toLocaleDateString()}</small>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  // Custom RestaurantMealTypes component with specific buttons removed
  const CustomRestaurantMealTypes = ({ restaurant, isApiData }) => {
    // Define meal types, excluding the ones to be removed
    const mealTypes = [
      { name: "Breakfast", icon: "coffee" },
      { name: "Lunch", icon: "utensils" },
      { name: "Dinner", icon: "utensils" },
      { name: "Dessert", icon: "ice-cream" },
      { name: "Takeout", icon: "shopping-bag" },
      { name: "Delivery", icon: "truck" },
      { name: "Outdoor Seating", icon: "umbrella-beach" },
      { name: "Vegetarian", icon: "seedling" },
      { name: "Reservations", icon: "calendar-check" },
      { name: "Wine & Beer", icon: "wine-glass-alt" }
      // "Burgers", "Cards Accepted", and "Family Friendly" are intentionally excluded
    ];

    return (
      <section className="container py-4">
        <div className="d-flex justify-content-center flex-wrap gap-3">
          {mealTypes.map((type, idx) => (
            <div
              key={idx}
              className="text-center"
              style={{ width: "80px" }}
            >
              <div
                className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-2"
                style={{
                  width: "60px",
                  height: "60px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                }}
              >
                <i className={`fas fa-${type.icon} text-dark`}></i>
              </div>
              <div className="small">{type.name}</div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Get static restaurant data
  const staticRestaurant = restaurantData[id];

  // Show loading state
  if (loading) {
    return (
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            padding: "20px",
            textAlign: "center",
            background: "white"
          }}
        >
          <div className="spinner-border mb-4" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h3 className="mb-2">Loading restaurant details...</h3>
          <p className="text-muted">Please wait while we get the latest information</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div>
        <Navbar />
        <PageWrapper>
          <div className="text-center mt-5">
            <div className="alert alert-danger">
              <h3>Error loading restaurant</h3>
              <p>{error}</p>
            </div>
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

  // If we don't have a restaurant from either source, show an error
  if (!staticRestaurant && !apiRestaurant) {
    return (
      <div>
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

  // Get restaurant reviews for both static and API data
  const restaurantReviews = store.reviews ? store.reviews.filter((r) => {
    if (isApiData) {
      // For API data, match by location_id or any other identifier
      return r.restaurantId === (restaurant.location_id || id);
    } else {
      // For static data, use the existing logic
      return r.restaurantId === id;
    }
  }) : [];

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
        try {
          // Check if photo is a string (direct URL)
          if (typeof photo === 'string') {
            images.push(photo);
          }
          // Check if photo is an object with images property
          else if (photo.images?.large?.url) {
            images.push(photo.images.large.url);
          } else if (photo.images?.medium?.url) {
            images.push(photo.images.medium.url);
          }
          // Check if photo has a direct URL property
          else if (photo.url) {
            images.push(photo.url);
          }
        } catch (err) {
          console.error("Error processing photo:", err);
        }
      });
    }

    // Add any additional photos fetched separately
    if (additionalPhotos && additionalPhotos.length > 0) {
      additionalPhotos.forEach(photoUrl => {
        if (!images.includes(photoUrl)) {
          images.push(photoUrl);
        }
      });
    }

    // If we still don't have images, add a placeholder
    if (images.length === 0) {
      images.push("https://via.placeholder.com/800x600?text=No+Image+Available");
    }

    console.log("Final restaurant images array:", images);

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
      <PageWrapper style={{ padding: 0, margin: 0 }}>
        <p className="text-center mt-3">
          {isApiData ? "API Restaurant Details" : `Viewing restaurant ID: ${id}`}
        </p>


        {/* -----------------------Header Slideshow----------------------- */}
        <section
          className="position-relative"
          style={{
            height: "550px",
            margin: 0,
            padding: 0,
            overflow: "hidden",
          }}
        >
          <Slider
            autoplay
            infinite
            dots={false}
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
                    cursor: "zoom-in"
                  }}
                  onClick={() => setActiveImage(img)}
                ></div>
              </div>
            ))}
          </Slider>

          {/* -----------------------Overlay----------------------- */}

          <div
            className="position-absolute top-50 start-50 translate-middle text-center text-white"
            style={{
              zIndex: 2,
              padding: "20px 30px",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              borderRadius: "12px",
              maxWidth: "90%",
              backdropFilter: "blur(3px)"
            }}
          >
            <h1 className="fw-bold">{details.name}</h1>
            <p className="mb-1">
              {details.price} • {details.cuisine} • ⭐ {details.rating}
            </p>
            <p className="mb-3">{details.isOpen ? "🟢 Open Now" : "🔴 Closed"}</p>
            <div className="d-flex justify-content-center flex-wrap gap-2">
              <button className="btn btn-light btn-sm" onClick={() => setShowHours(true)}>
                See Hours
              </button>
              <button className="btn btn-outline-light btn-sm" onClick={() => setShowGallery(true)}>
                View All Photos
              </button>
            </div>
          </div>


        </section>

       {/* -----------------------Action Buttons----------------------- */}
<section className="container py-3">
  <div className="d-flex flex-column align-items-center gap-3">
    <div>
      <h5>Select Reservation Date & Time:</h5>

      {(() => {
        const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc
        const openRanges = restaurant?.hours?.week_ranges?.[today];

        // Helper to convert minutes into a Date object
        const minutesToDate = (minutes) => {
          const date = new Date();
          date.setHours(Math.floor(minutes / 60));
          date.setMinutes(minutes % 60);
          date.setSeconds(0);
          date.setMilliseconds(0);
          return date;
        };

        // Set default times based on open hours if available
        const minTime = openRanges?.[0]
          ? minutesToDate(openRanges[0].open_time)
          : new Date(new Date().setHours(10, 0)); // fallback 10:00 AM

        const maxTime = openRanges?.[0]
          ? minutesToDate(openRanges[0].close_time)
          : new Date(new Date().setHours(22, 0)); // fallback 10:00 PM

        return (
          <DatePicker
            selected={reservationDate}
            onChange={(date) => setReservationDate(date)}
            showTimeSelect
            inline
            minDate={new Date()}
            minTime={minTime}
            maxTime={maxTime}
            dateFormat="Pp"
            className="form-control"
          />
        );
      })()}
    </div>

    <button className="btn btn-dark" onClick={handleReservation}>
      Confirm Reservation
    </button>
  </div>
</section>




        {/* -----------------------Meal Type Icons - Circular Bubbles----------------------- */}
        <CustomRestaurantMealTypes restaurant={restaurant} isApiData={isApiData} />


        {/* -----------------------Location & Hours Section with Side-by-Side Layout----------------------- */}
        <section className="container py-4">
          <h3 className="fw-bold mb-3">Location & Hours</h3>

          <div className="row">
            {/* Hours Table */}
            <div className="col-md-6 mb-3">
              <HoursTable restaurant={restaurant} isApiData={isApiData} />
            </div>

            {/* Map */}
            <div className="col-md-6 mb-3">
              <LocationMap restaurant={restaurant} details={details} isApiData={isApiData} />
            </div>
          </div>
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

        {/* 📝 User Reviews Section - Now works for both static and API data */}
        <section className="container py-5">
          <h3 className="fw-bold mb-4">User Reviews</h3>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <span>{restaurantReviews.length} {restaurantReviews.length === 1 ? 'review' : 'reviews'}</span>
            <button
              className="btn btn-dark"
              onClick={() => {
                // For API data, we need to store the restaurant info before navigating
                if (isApiData) {
                  // Store minimal restaurant info for the review
                  const restaurantInfo = {
                    id: restaurant.location_id || id,
                    name: restaurant.name,
                    isApiData: true
                  };
                  sessionStorage.setItem('reviewingRestaurant', JSON.stringify(restaurantInfo));
                }
                // Navigate to review form with the restaurant ID
                navigate(`/write-review/${isApiData ? (restaurant.location_id || id) : id}`);
              }}
            >
              Write a Review
            </button>
          </div>

          {restaurantReviews.length === 0 ? (
            <p className="text-muted">No reviews yet. Be the first to leave one!</p>
          ) : (
            <div className="list-group">
              {restaurantReviews.slice(0, showAllReviews ? restaurantReviews.length : 3).map((r, index) => (
                <ReviewItem key={index} review={r} />
              ))}

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


        {/* Back Button */}
        <section className="container py-3 mb-5">
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              // Set the flag for returning to search page
              sessionStorage.setItem('viewingRestaurantDetails', 'true');
              navigate('/restaurants', {
                state: {
                  returnedFromDetails: true,
                  isApiData: isApiData
                }
              });
            }}
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
    </div>
  );
};