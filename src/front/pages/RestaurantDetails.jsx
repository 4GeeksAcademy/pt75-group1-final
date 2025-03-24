import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import { restaurantData } from "./restaurantData";

const RestaurantDetails = () => {
  const { id } = useParams();
  const restaurant = restaurantData[id];
  const [showGallery, setShowGallery] = React.useState(false);

  if (!restaurant) {
    return <div className="text-center mt-5">Restaurant not found.</div>;
  }

  return (
    <div>
      <Navbar />
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
                  }}
                ></div>
              </div>
            ))}
          </Slider>

          {/* Overlay content */}
          <div className="container position-absolute top-50 start-50 translate-middle text-center">
            <h1 className="fw-bold">{restaurant.name}</h1>
            <p className="mb-1">
              💲{restaurant.price} • {restaurant.cuisine} • ⭐ {restaurant.rating}
            </p>
            <p className="mb-3">{restaurant.openNow ? "🟢 Open Now" : "🔴 Closed"}</p>
            <div className="d-flex justify-content-center gap-3">
              <button className="btn btn-light btn-sm">See Hours</button>
              <button className="btn btn-outline-light btn-sm">View All Photos</button>
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
              style={{ height: "380px", objectFit: "cover" }}
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
                    onClick={() => setShowGallery(true)}
                  />

                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {showGallery && (
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
                    style={{ objectFit: "cover", width: "100%", height: "250px" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default RestaurantDetails;
