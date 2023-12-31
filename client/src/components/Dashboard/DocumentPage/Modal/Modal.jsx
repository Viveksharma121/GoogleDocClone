//A modal page whenever user clicks on share btn this modal will be displayed with the link of the doc to share
import CancelIcon from "@mui/icons-material/Cancel";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Modal.css";
function Modal({ isOpen, onClose, urlToShare }) {
  //Accesses the document id form the link so if link is http://localhost:3000/doc/d27284b3-e364-4a92-9b19-50d442884d91 , it accesses doc/d27284b3-e364-4a92-9b19-50d442884d91
  const docId1 = useParams();
  // to get the id from the docId1 "d27284b3-e364-4a92-9b19-50d442884d91"
  const docId = docId1.docId;
  // const { login } = useAuth();
  useEffect(() => {
    console.log(sessionStorage);
    // console.log(login);
    // Check if user exists before accessing its properties
    // if (user) {
    // console.log(user);
    console.log(sessionStorage.getItem("email"));
    if (user && user.email) {
      console.log(user.email);
      setEmailInput(user.email);
    } else {
      setEmailInput("v@gmail.com");
    }
    console.log(accessLevels);
    const fetchAcessControl = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/share/getusers/${docId}`
        );
        console.log(response);
        const data = response.data.accessControl;
        setAccessPeople(data);
        console.log(data);
      } catch (errror) {
        console.log(errror);
      }
    };
    fetchAcessControl();

    // }
  }, []);
  var user = sessionStorage.getItem("email");
  // console.log(user);
  // console.log(user.email);
  //use state if copySuccess = true than  "copied text will be displayed for a sec or 2"
  const [copySuccess, setCopySuccess] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [accessOption, setAccessOption] = useState("everyone");
  const [usersWithAccess, setUsersWithAccess] = useState([]);
  const [accessLevels, setAccessLevels] = useState({}); // State to store access levels for each user
  const [accessPeople, setAccessPeople] = useState([]);
  //to copy the url required to share
  const handleCopyLink = () => {
    console.log(urlToShare);
    //As soon as user clicks icon this func is called and content is copied on the clipboard
    navigator.clipboard.writeText(urlToShare).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };
  //if a user clicks on the link instead of copy icon he will be taken to a new window on that link
  const handleOpenLink = () => {
    window.open(urlToShare);
  };

  // const handleAccessOptionChange = (event) => {
  //   setAccessOption(event.target.value);
  // };

  // // Function to handle giving access to a specific user
  // const handleGiveAccess = () => {
  //   // Implement logic to give access based on 'emailInput' and 'accessOption'
  //   console.log(`Giving access to ${emailInput} with option ${accessOption}`);
  //   // Add your logic here to handle giving access
  //   setUsersWithAccess((prevUsers) => [...prevUsers, emailInput]);
  //   console.log(usersWithAccess);
  // };
  const users = ["viv@gmail.com", "xyz@gmail.com"];
  console.log(user);
  const handleAccessOptionChange = (event) => {
    setAccessOption(event.target.value);
  };

  const handleAddUser = () => {
    console.log(`Giving access to ${emailInput} with option ${accessOption}`);
    setUsersWithAccess((prevUsers) => [...prevUsers, emailInput]);

    setAccessLevels((prevLevels) => ({
      ...prevLevels,
      [emailInput]: accessOption,
    }));
    console.log(accessLevels);
    setEmailInput("");
  };
  const handleGiveAccess = async () => {
    console.log(accessLevels);
    const response = await axios.post(
      `http://localhost:9000/api/share/access-levels/${docId}`,
      {
        accessLevels: Object.entries(accessLevels).map(([user, level]) => ({
          userEmail: user,
          accessLevel: level,
        })),
      }
    );
    console.log("Access levels updated in the database");
    console.log(response);
  };

  console.log(usersWithAccess);
  console.log(accessPeople);
  return (
    <div>
      {/* This is basic modal from mui when modal is closed we will pass onclose ie it will be closed  */}
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle style={{ fontWeight: "bold" }}>
          Share Options
          <IconButton
            color="primary"
            onClick={onClose}
            style={{ float: "right" }}
          >
            <CancelIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {"Share Link: "}
          <Typography
            variant="body1"
            color="primary"
            style={{
              textDecoration: "underline",
              cursor: "pointer",
              fontFamily: "Ariel",
            }}
            onClick={handleOpenLink}
          >
            {urlToShare}
          </Typography>
          <IconButton color="primary" onClick={handleCopyLink}>
            <FileCopyIcon />
          </IconButton>
          {copySuccess && (
            <span style={{ marginLeft: "10px", color: "green" }}>Copied!</span>
          )}
          {/* */}
          <div>
            <input
              type="text"
              placeholder="Add people to give doc access"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
            <button onClick={handleAddUser}>Add User</button>
          </div>

          <div style={{ marginTop: "10px" }}>
            <label>People with access</label>
            <div>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {usersWithAccess.map((email, index) => (
                  <li
                    key={index}
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #ccc",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#f4f4f4";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                    }}
                  >
                    {email === user ? (
                      <strong>{email} (You)</strong>
                    ) : (
                      <>
                        {email}
                        <select
                          value={accessLevels[email] || "read"}
                          onChange={(e) =>
                            setAccessLevels((prevLevels) => ({
                              ...prevLevels,
                              [email]: e.target.value,
                            }))
                          }
                        >
                          <option value="null">Select</option>
                          <option value="read">Read</option>
                          <option value="edit">Edit</option>
                        </select>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Selector (dropdown) for access options */}
          <div style={{ marginTop: "10px" }}>
            <label>Access option:</label>
            <select value={accessOption} onChange={handleAccessOptionChange}>
              <option value="everyone">Everyone</option>
              <option value="restricted">Restricted</option>
            </select>
          </div>

          {/* Button to give access */}
          <button onClick={handleGiveAccess}>Give Access</button>
          {/* </DialogContent> */}
          {/* List of users with access */}
          {
            <div style={{ marginTop: "20px" }}>
              <h3>Users with access:</h3>
              <ul>
                {accessPeople.map((user, index) => (
                  <li key={index}>
                    {user.userEmail} {"      "} {user.accessLevel}
                  </li>
                ))}
              </ul>
            </div>
          }
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Modal;
