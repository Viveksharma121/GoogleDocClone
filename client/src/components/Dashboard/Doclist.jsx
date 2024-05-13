import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import "./Doclist.css";
function Doclist({ docId }) {
  const BackendUrl = process.env.REACT_APP_BASE_URL;
  docId = docId;
  console.log(docId);
  const user = sessionStorage.getItem("email");
  const level = "owner";
  const handleGiveAccess = async () => {
    console.log("handle give access called");
    const response = await axios.post(
      `${BackendUrl}api/share/access-levels/${docId}`,
      {
        accessLevels: [
          {
            userEmail: user,
            accessLevel: level,
          },
        ],
      }
    );
    console.log("Access levels updated in the database");
    console.log(response);
  };

  return (
    <div className="doclist">
      <div className="content">
        <div className="header">
          <h4 style={{ font: "caption" }}>Start a new document</h4>
          <h4 className="sort" style={{ font: "caption" }}>
            Sort
          </h4>
          <MoreVertIcon
            style={{
              marginRight: "auto",
              marginTop: "auto",
              marginBottom: "auto",
              marginLeft: "1rem",
            }}
          />
        </div>
        <div className="alldocs">
          <Link to={`/doc/${docId}`}>
            <div className="eachdoc" onClick={handleGiveAccess}></div>
          </Link>
          <h2
            style={{
              font: "caption",
              marginTop: "2.5rem",
              marginLeft: "-50rem",
            }}
          >
            {" "}
            Blank Document
          </h2>
          {/* list of all docs here */}
        </div>
      </div>
    </div>
  );
}

export default Doclist;
