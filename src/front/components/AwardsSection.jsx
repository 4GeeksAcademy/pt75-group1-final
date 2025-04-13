import React from 'react';
import webbyLogo from "../assets/awards/webby.jpg";
import tripAdvisorLogo from "../assets/awards/tripadvisor.png";
import openTableLogo from "../assets/awards/opentable.png";
import goodFoodGuideLogo from "../assets/awards/goodfoodguide.png";
import squareMealLogo from "../assets/awards/squaremeal.png";

const awards = [
  {
    id: 1,
    name: 'Best Food Discovery App',
    description: 'Awarded by The Webby Awards for innovation in culinary technology.',
    year: '2023',
    logo: webbyLogo,
  },
  {
    id: 2,
    name: "Traveler's Choice",
    description: 'Recognized by TripAdvisor for enhancing travel-based dining experiences.',
    year: '2023',
    logo: tripAdvisorLogo,
  },
  {
    id: 3,
    name: "Diners' Favorite App",
    description: 'Voted top dining reservation platform by OpenTable users.',
    year: '2022',
    logo: openTableLogo,
  },
  {
    id: 4,
    name: "Excellence in Food Innovation",
    description: 'Honored by the Good Food Guide for revolutionizing local dining.',
    year: '2022',
    logo: goodFoodGuideLogo,
  },
  {
    id: 5,
    name: "Top Urban Food Platform",
    description: 'Recognized by SquareMeal for excellence in city-based restaurant curation.',
    year: '2024',
    logo: squareMealLogo,
  },
  {
    id: 6,
    name: "Editor's Choice Award",
    description: 'Selected by Eater as one of the most influential food platforms.',
    year: '2024',
    isTextLogo: true,
    logoText: "EATER"
  },
];

const AwardsSection = () => {
  return (
    <section className="py-5 border-top border-bottom" style={{ backgroundColor: "#f9f9f9" }}>
      <div className="container">
        <h2 className="fw-bold text-center mb-4">BiteFinder Awards & Recognition</h2>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {awards.map((award) => (
            <div key={award.id} className="col">
              <div 
                className="card h-100 border-0 shadow-sm" 
                style={{ 
                  transition: "all 0.3s ease-in-out",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = "0 12px 20px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 .125rem .25rem rgba(0,0,0,.075)";
                }}
              >
                <div className="card-body p-3">
                  <div className="d-flex align-items-center mb-3">
                    <div 
                      className="me-3 d-flex justify-content-center align-items-center" 
                      style={{ 
                        height: "50px", 
                        width: "50px", 
                        backgroundColor: award.isTextLogo ? "#2d2d2d" : "#fff",
                        borderRadius: "4px",
                        padding: "5px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                      }}
                    >
                      {award.isTextLogo ? (
                        <span style={{
                          color: "#fff",
                          fontSize: "11px",
                          fontWeight: "bold",
                          letterSpacing: "1px"
                        }}>
                          {award.logoText}
                        </span>
                      ) : (
                        <img
                          src={award.logo}
                          alt={award.name}
                          style={{ 
                            maxHeight: "40px", 
                            maxWidth: "40px", 
                            objectFit: "contain"
                          }}
                        />
                      )}
                    </div>
                    <div>
                      <h5 className="card-title mb-0 fw-bold">{award.name}</h5>
                      <small className="text-muted">{award.year}</small>
                    </div>
                  </div>
                  <p className="card-text small mb-0">{award.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;