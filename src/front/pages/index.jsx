import React from "react";
import { useOutletContext } from "react-router-dom";

const Home = () => {
  const { setShowSearch } = useOutletContext(); // Get state from Layout

  React.useEffect(() => {
    setShowSearch(true); // Show search bar on home page
    return () => setShowSearch(false); // Hide it when leaving
  }, []);

  return (
    <div className="container text-center mt-5">
      <h1>Welcome to BiteFinder</h1>
      <p>Find the best restaurants near you!</p>
    </div>
  );
};

export default Home;
