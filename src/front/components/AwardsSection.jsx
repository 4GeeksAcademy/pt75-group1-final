import React from 'react';
import webbyLogo from "../assets/awards/webby.jpg";
import tripAdvisorLogo from "../assets/awards/tripadvisor.png";
import openTableLogo from "../assets/awards/opentable.png";
import goodFoodGuideLogo from "../assets/awards/goodfoodguide.png";
import squareMealLogo from "../assets/awards/squaremeal.png";
import eaterLogo from "../assets/awards/eater.png";

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
    name: "Diners’ Favorite App",
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
    name: "Editor’s Choice Award",
    description: 'Selected by Eater as one of the most influential food platforms.',
    year: '2024',
    logo: eaterLogo,
  },
];

const AwardsSection = () => {
  return (
    <section className="bg-light py-5 border-top border-bottom">
      <div className="container">
        <h2 className="fw-bold text-center mb-5">BiteFinder Awards & Recognition</h2>
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {awards.map((award) => (
            <div key={award.id} className="card shadow-sm border-0 flex-fill p-3 award-hover" style={{ backgroundColor: "#f0f0f0", transition: "transform 0.3s ease" }}>
              <div className="card shadow-sm border-0 flex-fill p-3" style={{ backgroundColor: "#f0f0f0" }}>
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={award.logo}
                    alt={award.name}
                    style={{ height: "50px", marginRight: "1rem", opacity: 0.85 }}
                  />
                  <div>
                    <h5 className="fw-bold mb-1">{award.name}</h5>
                    <small className="text-muted">{award.year}</small>
                  </div>
                </div>
                <p className="mb-0">{award.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AwardsSection;
