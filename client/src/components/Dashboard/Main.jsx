import React from "react";
import Doclist from "./Doclist";
import Homepage from "./Homepage";
import Searchbar from "./Searchbar";

function Main({ docId }) {
  console.log(docId);
  return (
    <div style={{ backgroundColor: "white" }}>
      <Searchbar />
      <Doclist docId={docId} />
      <Homepage />
    </div>
  );
}

export default Main;
