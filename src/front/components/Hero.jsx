import React from "react";
import Slider from "react-slick";
// Import the slick CSS files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import s1 from "../assets/slides/s1.jpg";
import s2 from "../assets/slides/s2.jpg";
import s3 from "../assets/slides/s3.jpg";
import s4 from "../assets/slides/s4.jpg";
import s5 from "../assets/slides/s5.jpg";
import s6 from "../assets/slides/s6.jpg";

const Hero = () => {
  const slideImages = [s1, s2, s3, s4, s5, s6];

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
    dotsClass: "slick-dots" // Ensure proper dots class
  };

  return (
    <section
      className="bg-light"
      style={{
        paddingTop: "6rem",
        paddingBottom: "4rem",
        borderBottom: "1px solid #dee2e6",
      }}
    >
      <div className="container text-center mb-4">
        <h1 className="display-4 fw-bold mb-3">
          Discover Your Next Favorite<br /> Restaurant Today
        </h1>
        <p
          className="lead text-muted mx-auto"
          style={{ maxWidth: "720px", marginBottom: "1.5rem" }}
        >
          Welcome to BiteFinder, your ultimate restaurant discovery platform.
          Explore, review, and share your dining experiences with a vibrant
          community of food lovers.
        </p>
        <div className="d-flex justify-content-center gap-3 mb-4">
          <button className="btn btn-dark px-4 py-2">Search</button>
          <button className="btn btn-outline-dark px-4 py-2">Learn More</button>
        </div>
      </div>

      <div className="container rounded overflow-hidden shadow">
        <div className="restaurant-slider">
          <Slider {...settings}>
            {slideImages.map((img, idx) => (
              <div key={idx}>
                <img
                  src={img}
                  alt={`Slide ${idx + 1}`}
                  className="img-fluid w-100"
                  style={{ 
                    height: "480px", // Increased height from 400px to 480px
                    objectFit: "cover",
                    display: "block"
                  }}
                />
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Hero;