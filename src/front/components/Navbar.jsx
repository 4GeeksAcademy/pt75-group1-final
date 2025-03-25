import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import useGlobalReducer from "../hooks/useGlobalReducer";
import "../Navbar.css"; 

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const userProfilePhoto = "https://loremflickr.com/320/240"; 
 
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
    navigate("/login");
  };
  

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
