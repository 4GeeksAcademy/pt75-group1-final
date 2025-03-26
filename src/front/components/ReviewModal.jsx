import React from "react";
import "../index.css"; // for any global styling

const ReviewModal = ({ review, onClose }) => {
  if (!review) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center"
      style={{ zIndex: 2000 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded p-4 shadow"
        style={{ maxWidth: "600px", width: "90%" }}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Full Review</h5>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        {/* Review content */}
        <div className="mb-3">
          <div className="mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`fa-star me-1 ${
                  review.rating >= star ? "fas text-warning" : "far text-muted"
                }`}
              />
            ))}
          </div>
          <p>{review.review}</p>
          <small className="text-muted">
            Posted on {new Date(review.date).toLocaleDateString()}
          </small>
        </div>

        {/* Social buttons */}
        <div className="mt-4">
        <div className="d-flex gap-3">
            <button className="btn btn-sm btn-outline-dark">
            <i className="fas fa-thumbs-up me-2" /> Like
            </button>
            <button className="btn btn-sm btn-outline-dark">
            <i className="fas fa-share me-2" /> Share
            </button>
            <button className="btn btn-sm btn-outline-dark">
            <i className="fas fa-check me-2" /> Useful
            </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
