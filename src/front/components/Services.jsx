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
    <section className="container my-5">
      <div className="row">
        <div className="col-md-6">
          <h2 className="fw-bold">Discover Your Next Favorite Restaurant with BiteFinder's Comprehensive Services</h2>
        </div>
        <div className="col-md-6">
          <p className="text-muted">
            BiteFinder connects food lovers with the best dining experiences. Easily search for restaurants based on your preferences, 
            read authentic reviews, and make reservations in just a few clicks. Join our community to share your culinary adventures 
            and discover hidden gems.
          </p>
        </div>
      </div>
      <div className="row row-cols-1 row-cols-md-3 g-4 mt-4">
        {services.map((service) => (
          <div key={service.id} className="col d-flex align-items-stretch">
            <div className="card shadow-sm p-3 border-0">
              <img src={service.image} alt={service.alt} className="card-img-top service-img img-fluid" />
              <div className="card-body">
                <h5 className="fw-bold">{service.title}</h5>
                <p>{service.description}</p>
                <a href="#" className="text-primary fw-bold">{service.linkText} ➝</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
