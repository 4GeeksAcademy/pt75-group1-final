import React from "react";
import "../SearchPage.css";

export const SearchPage = () => {
  return (
    <div className="search-page-container">
      <h2 className="search-page-title">Search Nearby Cuisine</h2>
      <input 
        className="search-page-input" 
        type="text" 
        placeholder="Search restaurants by name, cuisine, or location..." 
      />
      <a href="#advanced" className="advanced-search-link">Advanced Search</a>
    </div>
  );
};
