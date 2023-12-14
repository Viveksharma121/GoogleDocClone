import React from "react";
import "./Homepage.css";
function Homepage() {
  return (
    <div className="homepage">
      <div className="head">
        <h3>Start new document</h3>
        <h3 className="doctitle">Documents</h3>
      </div>
      <div className="allcards">
        <div className="onedoc">
          <div className="Add-doc"></div>
          <h3 className="text">Blank</h3>
        </div>
        <div className="onedoc">
          <div className="Add-doc"></div>
          <h3 className="text">Blank</h3>
        </div>
        <div className="onedoc">
          <div className="Add-doc"></div>
          <h3 className="text">Blank</h3>
        </div>
        <div className="onedoc">
          <div className="Add-doc"></div>
          <h3 className="text">Blank</h3>
        </div>
        <div className="onedoc">
          <div className="Add-doc"></div>
          <h3 className="text">Blank</h3>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
