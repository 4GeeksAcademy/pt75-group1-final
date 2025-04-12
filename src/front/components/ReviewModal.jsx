import React, { useState, useRef } from "react";
import "../index.css"; 
import confetti from "canvas-confetti"; // npm install canvas-confetti

const ReviewModal = ({ review, onClose }) => {
  // State for the togglable buttons
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);
  const [markedUseful, setMarkedUseful] = useState(false);
  
  // Refs for the buttons to get their positions
  const likeButtonRef = useRef(null);
  const shareButtonRef = useRef(null);
  const usefulButtonRef = useRef(null);

  // calculate button position for confetti
  const getButtonPosition = (buttonRef) => {
    if (!buttonRef.current) return { x: 0.5, y: 0.5 };
    
    const rect = buttonRef.current.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;
    
    return {
      x: buttonCenterX / window.innerWidth,
      y: buttonCenterY / window.innerHeight
    };
  };

  // functions for each button
  const triggerLikeConfetti = () => {
    const { x, y } = getButtonPosition(likeButtonRef);
    
    // canvas element for confetti
    const myCanvas = document.createElement('canvas');
    myCanvas.style.position = 'fixed';
    myCanvas.style.inset = '0';
    myCanvas.style.width = '100vw';
    myCanvas.style.height = '100vh';
    myCanvas.style.pointerEvents = 'none';
    myCanvas.style.zIndex = '3000'; 
    document.body.appendChild(myCanvas);
    
    const myConfetti = confetti.create(myCanvas, { resize: true });
    
    myConfetti({
      particleCount: 30,
      spread: 70,
      origin: { x, y },
      colors: ['#ff0000', '#ff69b4'], // Red and pink colors for like
      shapes: ['circle'],
    });
    
    // Remove canvas after animation completes
    setTimeout(() => {
      document.body.removeChild(myCanvas);
    }, 3000);
  };

  const triggerShareConfetti = () => {
    const { x, y } = getButtonPosition(shareButtonRef);
    
    // new canvas element for this confetti
    const myCanvas = document.createElement('canvas');
    myCanvas.style.position = 'fixed';
    myCanvas.style.inset = '0';
    myCanvas.style.width = '100vw';
    myCanvas.style.height = '100vh';
    myCanvas.style.pointerEvents = 'none';
    myCanvas.style.zIndex = '3000'; 
    document.body.appendChild(myCanvas);
    
    const myConfetti = confetti.create(myCanvas, { resize: true });
    
    myConfetti({
      particleCount: 30,
      spread: 70,
      origin: { x, y },
      colors: ['#4267B2', '#1DA1F2'], // facebook blue and twitter blue
      shapes: ['circle'],
    });
    
    // Remove canvas after animation completes
    setTimeout(() => {
      document.body.removeChild(myCanvas);
    }, 3000);
  };

  const triggerUsefulConfetti = () => {
    const { x, y } = getButtonPosition(usefulButtonRef);
    
    // canvas element for confetti
    const myCanvas = document.createElement('canvas');
    myCanvas.style.position = 'fixed';
    myCanvas.style.inset = '0';
    myCanvas.style.width = '100vw';
    myCanvas.style.height = '100vh';
    myCanvas.style.pointerEvents = 'none';
    myCanvas.style.zIndex = '3000'; 
    document.body.appendChild(myCanvas);
    
    const myConfetti = confetti.create(myCanvas, { resize: true });
    
    myConfetti({
      particleCount: 30,
      spread: 70,
      origin: { x, y },
      colors: ['#28a745', '#20c997'], // Green shades
      shapes: ['circle'],
    });
    
    // Remove canvas after animation completes
    setTimeout(() => {
      document.body.removeChild(myCanvas);
    }, 3000);
  };

  // Button click handlers with confetti
  const handleLikeClick = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    if (newLiked) triggerLikeConfetti();
  };

  const handleShareClick = () => {
    const newShared = !shared;
    setShared(newShared);
    if (newShared) triggerShareConfetti();
  };

  const handleUsefulClick = () => {
    const newMarkedUseful = !markedUseful;
    setMarkedUseful(newMarkedUseful);
    if (newMarkedUseful) triggerUsefulConfetti();
  };

  if (!review) return null;

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center"
      style={{ zIndex: 2000 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded p-4 shadow"
        style={{ maxWidth: "600px", width: "90%", maxHeight: "80vh", overflowY: "auto" }}
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
          <p style={{ wordBreak: "break-word" }}>{review.review}</p>
          <small className="text-muted">
            Posted on {new Date(review.date).toLocaleDateString()}
          </small>
        </div>

        {/* Social buttons */}
        <div className="mt-4">
          <div className="d-flex gap-3 flex-wrap">
            <button 
              ref={likeButtonRef}
              className={`btn btn-sm ${liked ? 'btn-dark' : 'btn-outline-dark'}`}
              onClick={handleLikeClick}
            >
              <i className={`${liked ? 'fas' : 'far'} fa-thumbs-up me-2`} /> 
              {liked ? 'Liked' : 'Like'}
            </button>
            
            <button 
              ref={shareButtonRef}
              className={`btn btn-sm ${shared ? 'btn-dark' : 'btn-outline-dark'}`}
              onClick={handleShareClick}
            >
              <i className="fas fa-share me-2" /> 
              {shared ? 'Shared' : 'Share'}
            </button>
            
            <button 
              ref={usefulButtonRef}
              className={`btn btn-sm ${markedUseful ? 'btn-dark' : 'btn-outline-dark'}`}
              onClick={handleUsefulClick}
            >
              <i className={`${markedUseful ? 'fas' : 'far'} fa-check-circle me-2`} /> 
              {markedUseful ? 'Marked Useful' : 'Useful'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;