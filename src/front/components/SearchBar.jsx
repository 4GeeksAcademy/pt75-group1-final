import React from "react";

const SearchBar = ({ value, onChange, placeholder = "Search Restaurants" }) => {
    return (
        <div className="input-group mb-3">
            <input
                type="text"
                className="form-control"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <div className="input-group-append">
                <span className="input-group-text">🔍</span>
            </div>
        </div>
    );
};

export default SearchBar;