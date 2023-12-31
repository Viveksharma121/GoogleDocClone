import Brightness2Icon from "@mui/icons-material/Brightness2";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useState } from "react";
import Avatar from "react-avatar";
import "./searchbar.css";

const Searchbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const username = sessionStorage.getItem("name");

  //when user clicks on search drop downs what to do
  const handleResultClick = (result) => {
    console.log(`Clicked ${result}`);
  };

  //Whenever something is typed the search list will appear
  const handleInputChange = (e) => {
    //item typed in search bar
    const searchTerm = e.target.value.trim();
    setSearchTerm(searchTerm);
    // Hamara Api call
    //hardcoded
    const result = ["10", "20", "30"];
    const filteredResults = result.filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResult(filteredResults);
  };

  return (
    <div className="search-bar-container">
      <div
        className="left-div"
        style={{ display: "flex", alignItems: "center", marginBottom: "1px" }}
      >
        <MenuIcon style={{ color: "grey", marginRight: "4px" }} />
        <img
          width="40"
          height="40"
          src="https://img.icons8.com/color/48/google-docs--v1.png"
          alt="google-docs--v1"
          style={{ marginRight: "4px" }}
        />
        <h2>Docs</h2>
      </div>
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleInputChange}
        className="search-input"
      />
      <button className="search-button">Search</button>

      {/* Search result */}
      {searchTerm && searchResult.length > 0 && (
        <div className="search-results-dropdown">
          <ul className="search-results-list">
            {searchResult.map((result, index) => (
              <li
                key={index}
                onClick={() => handleResultClick(result)}
                className="search-result-item"
              >
                {result}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Avatar and Brightness icon */}
      <div className="right-div">
        <Brightness2Icon style={{ fontSize: "2rem", marginRight: "0.5rem" }} />
        <Avatar className="avatar-image" name={username} size="40" round />
      </div>
    </div>
  );
};

export default Searchbar;
