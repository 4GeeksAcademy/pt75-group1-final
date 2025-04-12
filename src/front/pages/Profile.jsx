import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import "../Profile.css";

const Profile = () => {
  const { store, dispatch } = useGlobalReducer();
  const user = store.user;
  const favorites = store.favorites || [];

  if (!user) return <p className="text-center py-5">Loading...</p>;

  // Remove a restaurant from favorites - FIXED VERSION
  const removeFavorite = (restaurant, index) => {
    // Create a new array without the removed favorite
    const newFavorites = [...favorites];
    newFavorites.splice(index, 1); // Remove just the item at the specified index
    
    dispatch({ type: 'SET_FAVORITES', payload: newFavorites });
  };

  // Function to get restaurant name based on data type (API or static)
  const getRestaurantName = (restaurant) => {
    if (Array.isArray(restaurant)) {
      return restaurant[1].name; // Static data
    }
    return restaurant.name; // API data
  };

  // Function to get restaurant image based on data type
  const getRestaurantImage = (restaurant) => {
    if (Array.isArray(restaurant)) {
      return restaurant[1].images?.[0] || "https://picsum.photos/300";
    }
    return restaurant.photo?.images?.medium?.url || "https://picsum.photos/300";
  };

  // Function to get restaurant location or address
  const getRestaurantLocation = (restaurant) => {
    if (Array.isArray(restaurant)) {
      return restaurant[1].location;
    }
    return restaurant.address || restaurant.location?.address || "Location not available";
  };

  // Function to get restaurant rating
  const getRestaurantRating = (restaurant) => {
    if (Array.isArray(restaurant)) {
      return restaurant[1].rating;
    }
    return restaurant.normalizedRating || restaurant.rating || "N/A";
  };

  // Function to get restaurant website or detail link
  const getRestaurantLink = (restaurant) => {
    if (Array.isArray(restaurant)) {
      return `/restaurant/${restaurant[0]}`; // Link to internal page for static data
    }
    return restaurant.website || "#"; // External website for API data
  };

  // Function to determine if link is internal or external
  const isExternalLink = (restaurant) => {
    return !Array.isArray(restaurant);
  };

  return (
    <div>
      <Navbar />
      <PageWrapper>
        <section className="py-5 bg-light">
          <div className="container">

            {/* Profile Header */}
            <div className="profile-header text-center mb-4">
              <img
                src="https://picsum.photos/150"
                alt="User"
                className="profile-picture rounded-circle shadow"
              />
              <h1 className="fw-bold">{user.username}</h1>
              <p className="text-muted">{user.city || "Austin, Texas"}</p>
              <button className="btn btn-dark mx-2">Edit Profile</button>
              <button className="btn btn-outline-secondary">Change Password</button>
            </div>

            {/* Profile Information */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="card p-3 mb-3">
                  <h5 className="card-title">Profile Information</h5>
                  <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
                  <p><strong>Address:</strong> {user.address || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Favorite Restaurants - Now showing real favorites */}
            <h2 className="section-title text-center">Favorite Restaurants</h2>
            <div className="row g-4 mb-4">
              {favorites.length > 0 ? (
                favorites.map((restaurant, index) => (
                  <div key={index} className="col-md-4">
                    <div className="card h-100 shadow-sm">
                      <img
                        src={getRestaurantImage(restaurant)}
                        className="card-img-top"
                        alt={getRestaurantName(restaurant)}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{getRestaurantName(restaurant)}</h5>
                        <p className="card-text">
                          {getRestaurantLocation(restaurant)} • ⭐ {getRestaurantRating(restaurant)}
                        </p>
                        <div className="d-flex justify-content-between mt-3">
                          {isExternalLink(restaurant) ? (
                            <a href={getRestaurantLink(restaurant)} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="btn btn-sm btn-dark">
                              Visit Website
                            </a>
                          ) : (
                            <Link to={getRestaurantLink(restaurant)} className="btn btn-sm btn-dark">
                              View Details
                            </Link>
                          )}
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeFavorite(restaurant, index)}
                          >
                            <i className="fas fa-heart-broken"></i> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-3">
                  <p>You haven't saved any favorite restaurants yet.</p>
                  <Link to="/" className="btn btn-outline-dark">
                    Discover Restaurants
                  </Link>
                </div>
              )}
            </div>

            {/* Reservations Section */}
            <h2 className="section-title text-center">Manage Reservations</h2>
            <div className="list-group mb-4">
              {[1, 2].map((id) => (
                <div key={id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>Reservation #{id} - Restaurant Name</span>
                  <div>
                    <button className="btn btn-sm btn-outline-dark mx-1">View</button>
                    <button className="btn btn-sm btn-outline-danger mx-1">Cancel</button>
                  </div>
                </div>
              ))}
            </div>

            {/* User Reviews */}
            <h2 className="section-title text-center">Your Reviews</h2>
            <div className="list-group">
              {[1, 2, 3].map((id) => (
                <div key={id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>Review #{id} - Restaurant Name</span>
                  <div>
                    <button className="btn btn-sm btn-outline-dark mx-1">Edit</button>
                    <button className="btn btn-sm btn-outline-danger mx-1">Delete</button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      </PageWrapper>
      <Footer />
    </div>
  );
};

export default Profile;