import CancelIcon from "@mui/icons-material/Cancel";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AccessRequestsModal = ({ isOpen, onClose, usersReq }) => {
  console.log(onClose);
  // Sample array of users (replace with your data)
  const docId1 = useParams();
  const docId = docId1.docId;
  console.log(usersReq);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (usersReq.length > 0) {
      setUsers(usersReq);
    }
  }, [usersReq]);

  const handleDeleteUser = (userId) => {
    // Filter out the user with the given userId
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
  };

  const handleAccessChange = (userEmail, accessLevel) => {
    // Update the access level for the user with the given userId
    const updatedUsers = users.map((user) =>
      user.userEmail === userEmail
        ? { ...user, accessLevel: accessLevel }
        : user
    );
    setUsers(updatedUsers);
  };

  const handleGiveAccess = async () => {
    // console.log("Access granted to:", users);
    // // console.log(accessLevels);
    const response = await axios.post(
      `http://localhost:9000/api/share/access-levels/${docId}`,
      {
        accessLevels: users.map((user) => ({
          userEmail: user.userEmail,
          accessLevel: user.accessLevel,
        })),
      }
    );
    console.log("Access levels updated in the database");
    console.log(response);
    if (response.status === 200) {
      console.log("hahah");
      const response = await axios.delete(
        `http://localhost:9000/api/access/delete-access/${docId}`
      );
      console.log(response);
      setUsers([]);
    }
    onClose();
  };

  const handleClose = async () => {
    const response = await axios.get("http://localhost:9000/api/access");
    console.log(response);
    await onClose();
  };

  const userAccess = ["read"];
  console.log(users);
  return (
    <div>
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle style={{ fontWeight: "bold" }}>
          Access Requests
          <IconButton
            color="primary"
            onClick={handleClose}
            style={{ float: "right" }}
          >
            <CancelIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {users.length > 0
            ? users.map((user) => (
                <div
                  key={user.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "400px",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    margin: "8px 0",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                  }}
                >
                  <div style={{ flex: 1 }}>{user.userEmail}</div>
                  <Select
                    value={user.accessLevel}
                    onChange={(e) =>
                      handleAccessChange(user.userEmail, e.target.value)
                    }
                  >
                    <MenuItem value="read">Read</MenuItem>
                    <MenuItem value="Edit">Edit</MenuItem>
                  </Select>
                  <IconButton onClick={() => handleDeleteUser(user.id)}>
                    <CancelIcon />
                  </IconButton>
                </div>
              ))
            : "No Access Requests"}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleGiveAccess}
            variant="contained"
            color="primary"
          >
            Give Access
          </Button>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AccessRequestsModal;
