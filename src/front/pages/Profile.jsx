import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../Profile.css";

export const Profile = () => {
  const { store } = useGlobalReducer();
  const user = store.user;

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>{user.username}'s Profile</h1>
        <p>{user.city || "Austin, Texas"}</p>
        <button className="edit-profile-btn">Edit Profile</button>
      </div>

      <div className="profile-main">
        <div className="profile-picture">
          <img src="https://via.placeholder.com/120" alt="User" />
        </div>
        <div className="description-box">
          <p>{user.description || "Food lover, world traveler, passionate reviewer."}</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-card">🍽️ Bite Finder for 9 Months</div>
        <div className="stat-card">📝 247 Reviews</div>
        <div className="stat-card">📍 363 Restaurants Visited</div>
      </div>

      <h2 className="section-title">{user.username}'s Reviews</h2>
      <div className="reviews-grid">
        {[1, 2, 3, 4].map((id) => (
          <div className="review-card" key={id}>
            <img src={`https://picsum.photos/200?random=${id}`} alt="restaurant" />
            <h4>Sample Restaurant #{id}</h4>
            <p>“Amazing food, excellent vibe.”</p>
            <p>⭐⭐⭐⭐☆</p>
          </div>
        ))}
      </div>

      <h2 className="section-title">{user.username}'s Favorites</h2>
      <div className="favorites-row">
        <div className="favorite-card">
          <img src="https://picsum.photos/300?1" alt="favorite" />
          <h4>Jersey Mike's Subs</h4>
          <p>Top-notch subs & sandwiches loved by locals.</p>
        </div>
        <div className="favorite-card">
          <img src="https://picsum.photos/300?2" alt="favorite" />
          <h4>Panera Bread</h4>
          <p>Soup, salads & bread bowls — healthy & comforting.</p>
        </div>
      </div>
    </div>
  );
};
