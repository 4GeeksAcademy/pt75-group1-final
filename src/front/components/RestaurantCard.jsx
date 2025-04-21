import React from "react";


const RestaurantCard = ({ restaurant, isFavorite, onToggleFavorite, onViewDetails }) => {
  return (
    <div className="col-md-4 mb-3">
      <div className="card h-100 shadow-sm hover-float" style={{ position: 'relative', zIndex: 10 }}>
        <img
          src={restaurant.photo?.images?.medium?.url || restaurant.image_url || restaurant.images?.[0] || "https://via.placeholder.com/400x200?text=Restaurant"}
          className="card-img-top"
          alt={restaurant.name}
          style={{ height: "200px", objectFit: "cover" }}
        />
        <div className="card-body">
          <h5 className="card-title">
            {restaurant.website ? (
              <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-dark">
                {restaurant.name}
              </a>
            ) : (
              <span className="text-dark">{restaurant.name}</span>
            )}
          </h5>
          <p className="card-text">
            {(restaurant.address || restaurant.location) && <span>{restaurant.address || restaurant.location} • </span>}
            {(restaurant.cuisine?.[0]?.name || restaurant.cuisine || "Various")} • ⭐ {restaurant.normalizedRating || restaurant.rating || "N/A"}
            {restaurant.normalizedPrice && <span> • {restaurant.normalizedPrice}</span>}
            {restaurant.normalizedOpenNow && <span className="text-success"> • Open Now</span>}
            {restaurant.normalizedDelivery && <span className="text-primary"> • Delivers</span>}
          </p>
          <div className="d-flex justify-content-between">
            <button className="btn btn-sm btn-dark" onClick={() => onViewDetails(restaurant)}>Details</button>
            <button className="btn btn-sm btn-outline-dark">Reviews</button>
            <button
              className={`btn btn-sm ${isFavorite ? 'btn-danger' : 'btn-outline-danger'}`}

              onClick={() => onToggleFavorite(restaurant)}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <i className="fas fa-heart"></i>
            </button>
            {restaurant.website && (
              <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-secondary">
                Website
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
