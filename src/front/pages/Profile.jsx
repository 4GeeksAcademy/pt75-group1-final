import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../Profile.css";

const Profile = () => {
  const { store } = useGlobalReducer();
  const user = store.user;

  if (!user) return <p className="text-center py-5">Loading...</p>;

  return (
    <section className="profile-container py-5 mt-5">
      {/* Header Section */}
      <div className="profile-header text-center mb-5">
        <h1 className="fw-bold">{user.username}'s Profile</h1>
        <p className="text-muted">{user.city || "Austin, Texas"}</p>
        <button className="edit-profile-btn">Edit Profile</button>
      </div>

      {/* User Overview */}
      <div className="profile-main d-flex justify-content-center align-items-center mb-5">
        <div className="profile-picture">
          <img
            src="https://via.placeholder.com/150"
            alt="User"
            className="rounded-circle shadow"
          />
        </div>
        <div className="description-box">
          <p className="lead">
            {user.description || "Food lover, world traveler, passionate reviewer."}
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="profile-stats d-flex justify-content-center gap-3 mb-5">
        <div className="stat-card">🍽️ BiteFinder for 9 Months</div>
        <div className="stat-card">📝 247 Reviews</div>
        <div className="stat-card">📍 363 Restaurants Visited</div>
      </div>

      {/* Reviews Section */}
      <h2 className="section-title">{user.username}'s Reviews</h2>
      <div className="reviews-grid">
        {[1, 2, 3, 4].map((id) => (
          <div className="review-card" key={id}>
            <img
              src={`https://picsum.photos/200?random=${id}`}
              alt="restaurant"
            />
            <h4>Sample Restaurant #{id}</h4>
            <p>“Amazing food, excellent vibe.”</p>
            <p>⭐⭐⭐⭐☆</p>
          </div>
        ))}
      </div>

      {/* Favorites Section */}
      <h2 className="section-title">{user.username}'s Favorites</h2>
      <div className="favorites-row">
        {[1, 2].map((id) => (
          <div className="favorite-card" key={id}>
            <img
              src={`https://picsum.photos/300?${id}`}
              alt="favorite"
            />
            <h4>{id === 1 ? "Jersey Mike's Subs" : "Panera Bread"}</h4>
            <p>
              {id === 1
                ? "Top-notch subs & sandwiches loved by locals."
                : "Soup, salads & bread bowls — healthy & comforting."}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Profile;
