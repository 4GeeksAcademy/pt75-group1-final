// Function to determine if link is internal or external
const isExternalLink = (restaurant) => {
  return !Array.isArray(restaurant);
};import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import "../Profile.css";

const Profile = () => {
const { store, dispatch } = useGlobalReducer();
const [loading, setLoading] = useState(true);
const [localUser, setLocalUser] = useState(null);
const [editModalOpen, setEditModalOpen] = useState(false);
const [changeModalOpen, setChangeModalOpen] = useState(false);
const [profilePic, setProfilePic] = useState(null);
const [userReviews, setUserReviews] = useState([]);
const navigate = useNavigate();

const favorites = store.favorites || [];

useEffect(() => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    setLoading(false);
    return;
  }

  fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      if (!data?.profile?.id) throw new Error("Invalid profile data");
      dispatch({ type: "LOGIN_SUCCESS", payload: data.profile });
      setLocalUser(data.profile);
      setLoading(false);
    })
    .catch(err => {
      console.error("❌ Fetch error:", err);
      localStorage.removeItem("access_token");
      setLoading(false);
    });
    
  // Load user reviews from localStorage
  const savedReviews = localStorage.getItem("user_reviews");
  if (savedReviews) {
    try {
      setUserReviews(JSON.parse(savedReviews));
    } catch (err) {
      console.error("Error loading reviews:", err);
      localStorage.removeItem("user_reviews");
    }
  }
}, []);

// Get initials from either localUser or store.user
const getInitials = () => {
  if (localUser) return (localUser.first_name?.[0] || "") + (localUser.last_name?.[0] || "");
  if (store.user) return (store.user.first_name?.[0] || "") + (store.user.last_name?.[0] || "");
  return "";
};

const initials = getInitials();
const bgColor = stringToColor((localUser?.username || store.user?.username || "U"));

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}

const handleProfilePicChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePic(reader.result); // base64
    };
    reader.readAsDataURL(file);
  }
};

const handleEditProfile = async (e) => {
  e.preventDefault();
  const form = e.target;
  const token = localStorage.getItem("access_token");

  const updatedData = {
    first_name: form.first_name.value,
    last_name: form.last_name.value,
    email: form.email.value,
    username: user.username,
    is_active: true,
  };

  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (!res.ok) throw new Error("Update failed");

    const updatedUser = await res.json();
    setLocalUser(updatedUser);
    dispatch({ type: "LOGIN_SUCCESS", payload: updatedUser });
    setEditModalOpen(false);
  } catch (err) {
    alert("Update failed");
  }
};

const handleChangePassword = async (e) => {
  e.preventDefault();
  const form = e.target;
  const token = localStorage.getItem("access_token");

  const body = {
    current_password: form.current_password.value,
    new_password: form.new_password.value
  };

  if (form.new_password.value !== form.confirm_password.value) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error("Change password failed");

    setChangeModalOpen(false);
    form.reset();
    alert("Password changed successfully.");
  } catch (err) {
    alert("Failed to change password.");
  }
};

const handleDeleteAccount = async () => {
  if (!confirm("Are you sure you want to delete your account?")) return;
  const token = localStorage.getItem("access_token");

  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/${user.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to delete account");

    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("access_token");
    window.location.href = "/";
  } catch (err) {
    alert("Could not delete account.");
  }
};

// Remove a restaurant from favorites
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
// Handle deleting a review
const handleDeleteReview = (reviewId) => {
  if (!confirm("Are you sure you want to delete this review?")) return;
  
  const updatedReviews = userReviews.filter(review => review.id !== reviewId);
  setUserReviews(updatedReviews);
  localStorage.setItem("user_reviews", JSON.stringify(updatedReviews));
};

// Handle editing a review - Navigate to edit page
const handleEditReview = (reviewId) => {
  // Navigate to edit page
  navigate(`/edit-review/${reviewId}`);
};

// Check for login
if (loading) return <p className="text-center py-5">Loading...</p>;
if (!localUser && !store.user) return <p className="text-center py-5">You must be logged in.</p>;

// Use either localUser from API or user from store
const user = localUser || store.user;

return (
  <div>
    <Navbar />
    <PageWrapper>
      <section className="py-5 bg-light">
        <div className="container">

          {/* Profile Header */}
          <div className="profile-header text-center mb-4">
            <div className="position-relative d-inline-block mb-3">
              <div
                className="rounded-circle shadow d-flex align-items-center justify-content-center"
                style={{
                  width: "120px",
                  height: "120px",
                  backgroundColor: bgColor,
                  fontSize: "36px",
                  color: "white",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {profilePic ? (
                  <img src={profilePic} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  initials
                )}
                <label htmlFor="profilePicUpload" className="position-absolute bottom-0 end-0 text-dark" style={{
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}>
                  <span className="fa-stack" style={{ fontSize: "0.8rem" }}>
                    <i className="fas fa-circle fa-stack-2x text-white"></i>
                    <i className="fas fa-camera fa-stack-1x text-dark"></i>
                    <i className="fas fa-plus fa-stack-1x text-danger" style={{ fontSize: "0.5rem", top: "0", right: "0" }}></i>
                  </span>
                </label>
                <input id="profilePicUpload" type="file" accept="image/*" onChange={handleProfilePicChange} style={{ display: "none" }} />
              </div>
            </div>
            <h1 className="fw-bold">{user.username}</h1>
            <p className="text-muted">{user.city || "Austin, Texas"}</p>
            <div className="mb-4">
              <button className="btn btn-dark mx-2" onClick={() => setEditModalOpen(true)}>Edit Profile</button>
              <button className="btn btn-outline-secondary" onClick={() => setChangeModalOpen(true)}>Change Password</button>
            </div>
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

          {/* Favorite Restaurants */}
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
            <div className="list-group-item text-center py-4">
              <p className="mb-3">You don't have any reservations yet.</p>
              <Link to="/" className="btn btn-outline-dark">
                Find Restaurants
              </Link>
            </div>
          </div>

          {/* User Reviews */}
          <h2 className="section-title text-center">Your Reviews</h2>
          <div className="list-group mb-4">
            {userReviews.length > 0 ? (
              userReviews.map((review) => (
                <div key={review.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0">{review.restaurantName}</h5>
                    <div className="text-warning">
                      {Array(review.rating).fill().map((_, i) => (
                        <i key={i} className="fas fa-star"></i>
                      ))}
                    </div>
                  </div>
                  <p className="mb-2">{review.text}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">{new Date(review.date).toLocaleDateString()}</small>
                    <div>
                      <button 
                        className="btn btn-sm btn-outline-dark mx-1"
                        onClick={() => handleEditReview(review.id)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger mx-1"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="list-group-item text-center py-4">
                <p className="mb-3">You haven't written any reviews yet.</p>
                <Link to="/write-review" className="btn btn-outline-dark">
                  Write Your First Review
                </Link>
              </div>
            )}
          </div>

        </div>

        {/* Edit Profile Modal */}
        <div className={`modal fade ${editModalOpen ? "show d-block" : ""}`} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleEditProfile}>
                <div className="modal-header">
                  <h5>Edit Profile</h5>
                  <button type="button" className="btn-close" onClick={() => setEditModalOpen(false)} />
                </div>
                <div className="modal-body">
                  <input name="first_name" className="form-control mb-2" placeholder="First Name" defaultValue={user.first_name} />
                  <input name="last_name" className="form-control mb-2" placeholder="Last Name" defaultValue={user.last_name} />
                  <input name="email" type="email" className="form-control mb-2" placeholder="Email" defaultValue={user.email} />
                </div>
                <div className="modal-footer d-flex justify-content-between">
                  <button type="button" className="btn btn-danger" onClick={handleDeleteAccount}>Delete Account</button>
                  <div>
                    <button className="btn btn-dark" type="submit">Save</button>
                    <button className="btn btn-secondary ms-2" onClick={() => setEditModalOpen(false)}>Cancel</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Change Password Modal */}
        <div className={`modal fade ${changeModalOpen ? "show d-block" : ""}`} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleChangePassword}>
                <div className="modal-header">
                  <h5>Change Password</h5>
                  <button type="button" className="btn-close" onClick={() => setChangeModalOpen(false)} />
                </div>
                <div className="modal-body">
                  <input name="current_password" type="password" className="form-control mb-2" placeholder="Current Password" required />
                  <input name="new_password" type="password" className="form-control mb-2" placeholder="New Password" required />
                  <input name="confirm_password" type="password" className="form-control mb-2" placeholder="Confirm New Password" required />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-dark" type="submit">Save</button>
                  <button className="btn btn-secondary" onClick={() => setChangeModalOpen(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  </div>
);
};

export default Profile;