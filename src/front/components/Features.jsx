import React from "react";
import searchImg from "../assets/img/search.png";
import reservationsImg from "../assets/img/reservations.png";
import reviewsImg from "../assets/img/reviews.png";

const features = [
  {
    id: 1,
    title: "Effortless Restaurant Search at Your Fingertips",
    description: "Find restaurants based on cuisine, location, and ratings.",
    image: searchImg,
    alt: "Search Feature",
  },
  {
    id: 2,
    title: "Make Reservations with Just a Few Clicks",
    description: "Secure your table instantly and avoid long waits.",
    image: reservationsImg,
    alt: "Reservations Feature",
  },
  {
    id: 3,
    title: "Share Your Dining Experiences with the Community",
    description: "Post reviews and photos to help others discover.",
    image: reviewsImg,
    alt: "Reviews Feature",
  },
];

const Features = () => {
  return (
    <section className="container my-5">
      <h2 className="text-center fw-bold mb-4">Explore the Best Dining Experiences Near You</h2>
      <p className="text-center text-muted">
        BiteFinder connects food lovers with their next favorite restaurant. From reviews to reservations, we make dining out effortless.
      </p>
      <div className="row row-cols-1 row-cols-md-3 g-4 mt-4">
        {features.map((feature) => (
          <div key={feature.id} className="col d-flex align-items-stretch">
            <div className="card shadow-sm p-3 border-0">
              <img src={feature.image} alt={feature.alt} className="card-img-top feature-img img-fluid" />
              <div className="card-body">
                <h5 className="fw-bold">{feature.title}</h5>
                <p>{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
