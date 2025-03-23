import React, { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import "../Navbar.css"; 

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const userProfilePhoto = "https://loremflickr.com/320/240"; 

  return (
    <div className="navbar">
      <h1 className="navbar-title">Bite Finder</h1>

      <div className="navbar-search">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search restaurants..."
        />
      </div>

      <img
        src={userProfilePhoto}
        alt="Profile"
        className="profile-photo"
      />
    </div>
  );
};
