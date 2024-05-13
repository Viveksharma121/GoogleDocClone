// DocumentPage.js

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./DocAccess.css";

const DocumentPage = () => {
  const BackendUrl = process.env.REACT_APP_BASE_URL;
  const [hasAccess, setHasAccess] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [email, setemail] = useState("vivek@gmail.com");
  const [selectedAccess, setSelectedAccess] = useState("read"); // Assuming you have a state to track the selected access level
  const [accessControl, setAccessControl] = useState([]);
  const docId1 = useParams();
  const docId = docId1.docId;
  const sessionEmail = sessionStorage.getItem("email");
  useEffect(() => {
    setemail(sessionEmail);
  }, [sessionEmail]);

  const handleRequestAccess = async () => {
    setRequestSent(true);
    try {
      console.log(email + "    " + selectedAccess);
      const response = await axios.post(
        `${BackendUrl}api/access/access-request`,
        {
          docId: docId,
          accessLevels: [
            {
              userEmail: email,
              accessLevel: selectedAccess,
            },
          ],
        }
      );
      console.log(response);
      // Now, do any further processing after the API call if needed
    } catch (error) {
      console.log(error);
    }
  };

  const imagesrc = "https://icons8.com/icon/30464/google-docs";
  return (
    <div className="document-page-container">
      {hasAccess ? (
        <div>
          {/* Document content goes here */}
          <h1 className="title">Your Document Content</h1>
        </div>
      ) : (
        <div>
          {/* <img src={imagesrc} alt="Mui Doc Logo" className="logo" /> */}
          <div className="image-text">
            {" "}
            <img
              width="48"
              height="48"
              src="https://img.icons8.com/color/48/google-docs--v1.png"
              alt="google-docs--v1"
            />
            <h1 className="google">Google </h1>
            <h1 className="title">Docs</h1>
          </div>

          {!requestSent ? (
            <div>
              <p className="message">
                You need access to view this document. Request access, or switch
                to an account with access.
              </p>
              <select onChange={(e) => setSelectedAccess(e.target.value)}>
                <option value="null">Select</option>
                <option value="read">Read</option>
                <option value="Edit">Edit</option>
              </select>
              <input
                type="text"
                className="message"
                placeholder="Message (optional)"
              />
              <button
                onClick={handleRequestAccess}
                className="request-access-btn"
              >
                Request Access
              </button>
            </div>
          ) : (
            <p className="message">
              Access request sent. Waiting for approval...
            </p>
          )}

          <p className="signed-in">
            You're signed in as <strong className="email-box">{email}</strong>.
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentPage;
