import React from "react";
import Slider from "react-slick";
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
  };

  return (
    <section
      className="bg-light"
      style={{
        paddingTop: "7rem",
        paddingBottom: "9rem",
        borderBottom: "1px solid #dee2e6",
      }}
    >
      <div className="container text-center mb-5">
        <h1 className="display-4 fw-bold mb-4">
          Discover Your Next Favorite<br /> Restaurant Today
        </h1>
        <p
          className="lead text-muted mx-auto"
          style={{ maxWidth: "720px", marginBottom: "2rem" }}
        >
          Welcome to BiteFinder, your ultimate restaurant discovery platform.
          Explore, review, and share your dining experiences with a vibrant
          community of food lovers.
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <button className="btn btn-dark px-4 py-2 rounded-0">Search</button>
          <button className="btn btn-outline-dark px-4 py-2 rounded-0">Learn More</button>
        </div>
      </div>

      <div className="container rounded overflow-hidden shadow">
        <Slider {...settings}>
          {slideImages.map((img, idx) => (
            <div key={idx}>
              <img
                src={img}
                alt={`Slide ${idx + 1}`}
                className="img-fluid w-100"
                style={{ height: "520px", objectFit: "cover" }}
              />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Hero;
