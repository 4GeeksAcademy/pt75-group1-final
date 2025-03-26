import React from "react";
import searchImg from "../assets/img/search.png";
import reservationsImg from "../assets/img/reservations.png";
import reviewsImg from "../assets/img/reviews.png";

const services = [
  {
    id: 1,
    title: "Effortlessly Search for Restaurants That Match Your Taste and Preferences",
    description: "Find the perfect dining spot tailored to your cravings.",
    image: searchImg,
    alt: "Search Feature",
    linkText: "Explore",
  },
  {
    id: 2,
    title: "Make Reservations with Ease and Enjoy Hassle-Free Dining Experiences",
    description: "Secure your table at your favorite restaurants in seconds.",
    image: reservationsImg,
    alt: "Reservations Feature",
    linkText: "Reserve",
  },
  {
    id: 3,
    title: "Read Real Reviews from Fellow Food Enthusiasts for Informed Choices",
    description: "Gain insights from the community to enhance your dining decisions.",
    image: reviewsImg,
    alt: "Reviews Feature",
    linkText: "Reviews",
  },
];

const Services = () => {
  return (
    <section className="bg-white py-5 border-bottom">
      <div className="container">
        <div className="row mb-5 gy-4 text-center text-md-start">
          <div className="col-md-6">
            <h2 className="fw-bold fs-3">
              Discover Your Next Favorite Restaurant with BiteFinder's Comprehensive Services
            </h2>
          </div>
          <div className="col-md-6">
            <p className="text-muted fs-6">
              BiteFinder connects food lovers with the best dining experiences. Easily search for restaurants based on your preferences,
              read authentic reviews, and make reservations in just a few clicks. Join our community to share your culinary adventures
              and discover hidden gems.
            </p>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-md-3 g-4">
          {services.map((service) => (
            <div key={service.id} className="col d-flex align-items-stretch">
              <div className="card p-3 shadow-sm border-0 transition hover-float text-start">
                <img
                  src={service.image}
                  alt={service.alt}
                  className="img-fluid w-100"
                  style={{
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <div className="card-body px-0 pt-3">
                  <h6 className="fw-bold fs-6">{service.title}</h6>
                  <p className="fs-6">{service.description}</p>
                  <a href="#" className="fw-bold text-dark">
                    {service.linkText} →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
