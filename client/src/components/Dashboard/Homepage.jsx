import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Homepage.css";

function Homepage() {
  const BackendUrl = process.env.REACT_APP_BASE_URL;
  const userEmail = sessionStorage.getItem("email");
  const [doc, setdoc] = useState([]);
  useEffect(() => {
    const fetchAndStore = async () => {
      const response = await axios.get(
        `${BackendUrl}api/share/user-docs/${userEmail}`
      );
      console.log(response.data.userDocs);
      setdoc(response.data.userDocs);
    };
    fetchAndStore();
  }, [userEmail]);

  const renderDocuments = () => {
    const documentsPerRow = 5;
    const rows = [];

    for (let i = 0; i < doc.length; i += documentsPerRow) {
      const rowDocs = doc.slice(i, i + documentsPerRow);
      const row = (
        <div className="row" key={`row-${i}`}>
          {rowDocs.map((document) => (
            <div className="onedoc" key={document.docId}>
              <div className="Add-doc"></div>
              <h3 className="text">{document.docId}</h3>
            </div>
          ))}
        </div>
      );

      rows.push(row);
    }

    return rows;
  };

  return (
    <div className="homepage">
      <div className="head">
        <h3>Start new document</h3>
        <h3 className="doctitle">Documents</h3>
      </div>
      <div className="allcards">{renderDocuments()}</div>
    </div>
  );
}

export default Homepage;
