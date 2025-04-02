import React from "react";
import AboutHeader from "../components/about/AboutHeader";
import AboutMission from "../components/about/AboutMission"
import TimeLine from "../components/about/TimeLine"
import TeamSection from "../components/about/TeamSection";
import ContactSection from "../components/about/ContactSection";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import PageWrapper from "../components/PageWrapper";

const About = () => {
  return (
    <main>
      <Navbar />
      <PageWrapper />
        <AboutHeader />
        <AboutMission />
        <TimeLine />
        <TeamSection />
        <ContactSection />
      <PageWrapper />
      <Footer />
    </main>
  );
};

export default About;
