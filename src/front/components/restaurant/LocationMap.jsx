import React from 'react';

const LocationMap = ({ restaurant, details, isApiData }) => {
  // Copy address to clipboard
  const copyAddress = () => {
    navigator.clipboard.writeText(details.location);
    alert('Address copied to clipboard!');
  };

  return (
    <div style={{
      background: "#f0f0f0",
      borderRadius: "12px",
      padding: "15px",
      height: "100%",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      position: "relative"
    }}>
      {/* Address Box */}
      <div style={{
        position: "absolute",
        top: "25px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "white",
        padding: "8px 15px",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        maxWidth: "90%"
      }}>
        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {details.location}
        </div>
        <button 
          className="btn btn-sm ms-2" 
          style={{ padding: "2px 5px" }}
          onClick={copyAddress}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
          </svg>
        </button>
      </div>
      
      {/* Dynamic Map using restaurant API coordinates */}
      <div style={{
        width: "100%",
        height: "300px",
        borderRadius: "8px",
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#ccc"
      }}>
        {isApiData && restaurant.latitude && restaurant.longitude ? (
          <iframe 
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(restaurant.longitude)-0.01}%2C${parseFloat(restaurant.latitude)-0.01}%2C${parseFloat(restaurant.longitude)+0.01}%2C${parseFloat(restaurant.latitude)+0.01}&layer=mapnik&marker=${restaurant.latitude}%2C${restaurant.longitude}`}
            style={{ width: "100%", height: "100%", border: "none" }}
            title="Restaurant Location"
            loading="lazy"
          ></iframe>
        ) : (
          <div className="d-flex justify-content-center align-items-center h-100">
            <p className="text-center mb-0">Map location not available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationMap;