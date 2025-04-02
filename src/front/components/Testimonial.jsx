import React, { useEffect, useState, useRef } from "react";

const testimonials = [
  {
    text: "BiteFinder helped me discover hidden gems in my city I would've never found on my own!",
    author: "Daniel Martinez",
    title: "Restaurant Enthusiast",
  },
  {
    text: "I love how easy it is to browse by cuisine and instantly book a table!",
    author: "Sophia Green",
    title: "Frequent Diner",
  },
  {
    text: "The review system gives me honest insights before I even step foot inside.",
    author: "Tyrell Sanders",
    title: "Food Blogger",
  },
  {
    text: "My friends and I use BiteFinder weekly to plan our dinner nights out!",
    author: "Lena Thompson",
    title: "Foodie Friend Group Leader",
  },
  {
    text: "From sushi to steakhouses, I trust BiteFinder to guide my appetite.",
    author: "Kavita Patel",
    title: "Traveling Food Lover",
  },
];

const Testimonial = () => {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

  // ⏱ Clear + Restart autoplay with optional delay
  const startAutoPlay = (delay = 4000) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, delay);
  };

  // 🔁 Initial autoplay
  useEffect(() => {
    startAutoPlay();
    return () => clearTimeout(timeoutRef.current);
  }, [current]);

  // 👇 Handle click to pause autoplay
  const handleDotClick = (index) => {
    setCurrent(index);
    startAutoPlay(6000); // ⏳ Wait longer before resuming auto-cycle
  };

  return (
    <section className="container py-5 text-center">
      {/* ⭐ Rating */}
      <div className="mb-3">
        <span className="fs-3">★★★★★</span>
      </div>

      {/* 📝 Quote */}
      <blockquote className="fw-bold fs-5 mb-4">
        "{testimonials[current].text}"
      </blockquote>

      {/* 🧑 Author Info */}
      <p className="mb-0 fw-bold">{testimonials[current].author}</p>
      <p className="text-muted">{testimonials[current].title}</p>

      {/* ⏺ Progress Dots */}
      <div className="d-flex justify-content-center gap-2 mt-4">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className={`rounded-circle border ${
              current === idx ? "bg-dark" : "bg-light"
            }`}
            style={{
              width: "12px",
              height: "12px",
              borderWidth: "1px",
              padding: 0,
              transition: "background 0.3s ease",
              cursor: "pointer",
            }}
            aria-label={`Go to testimonial ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonial;
