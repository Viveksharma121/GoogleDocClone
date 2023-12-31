// UserProfile.js

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import "./Profile.css";

const Profile = () => {
  const [username, setUsername] = useState();
  const [avatar, setAvatar] = useState("");
  const [isEditingBio, setEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState("This is my bio");

  useEffect(() => {
    console.log(localStorage);
    const name = localStorage.getItem("username");
    setUsername(name);
    console.log(name);
    //save name

    //fetch bio
    const fetchbio = async () => {
      console.log(username);
      const response = await axios.get(
        `http://localhost:9000/api/user/bio?username=${name}`
      );

      console.log(response.data.bio);
      setEditedBio(response.data.bio.bio);
    };
    fetchbio();
  }, []);

  const handleEditBio = () => {
    setEditingBio(true);
  };

  const handleSaveBio = async () => {
    // bio form backend fetch
    try {
      console.log(editedBio);
      const response = await axios.put(
        "http://localhost:9000/api/user/savebio",
        { username, bio: editedBio }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }

    setEditingBio(false);
    // Isave edited bio
  };

  const handleBioChange = (e) => {
    setEditedBio(e.target.value);
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <div className="avatar-container">
        <Avatar
          className="avatar-image"
          name={username}
          src={avatar || null}
          size="150"
          round
        />
        <div className="edit-avatar-icon">
          <EditIcon />
        </div>
      </div>
      <div className="profile-info">
        <div className="username">
          {username}
          <span className="edit-username-icon">
            <EditIcon />
          </span>
        </div>
        <div className="bio">
          {isEditingBio ? (
            <div>
              <textarea
                value={editedBio}
                onChange={handleBioChange}
                rows={4}
                cols={50}
              />
              <button onClick={handleSaveBio}>
                <SaveIcon /> Save
              </button>
            </div>
          ) : (
            <div>
              <div>{editedBio}</div>
              <span className="edit-bio-icon" onClick={handleEditBio}>
                <EditIcon />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
