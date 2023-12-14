import React, { useState } from "react";
import "./searchbar.css";
const Searchbar = ({ handleSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };
  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
        className="search-input"
      />
      <button className="search-button">Search</button>
    </div>
  );
};

export default Searchbar;
