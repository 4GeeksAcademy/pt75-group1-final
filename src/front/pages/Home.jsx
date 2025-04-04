import React from "react";
import Navbar from "../components/Navbar"; // ✅ Keeps Navbar at the top
import Hero from "../components/Hero"; // ✅ Now using a separate Hero component
import Features from "../components/Features"; // ✅ Now using a separate Features component
import Services from "../components/Services"
import CTA from "../components/CTA";
import Testimonial from "../components/Testimonial";
import AwardsSection from "../components/AwardsSection";
import { Footer } from "../components/Footer";

export const Home = () => {
  return (
    <div>
      {/* <Navbar /> */}
      <Hero />
      <Features />
      <Services />
      <CTA />
      <Testimonial />
      <AwardsSection />
      {/* <Footer /> */}
    </div>
  );
};