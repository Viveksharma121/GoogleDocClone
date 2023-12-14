import React from "react";
import "./Doclist.css";
function Doclist() {
  return (
    <div>
      <div className="doclist">
        <div className="header">
          <h4>Recent documents</h4>
          <h4 className="sort">Sort</h4>
        </div>
        <div className="alldocs">
          <div className="eachdoc"></div>
          {/* list of all docs here */}
        </div>
      </div>
    </div>
  );
}

export default Doclist;
