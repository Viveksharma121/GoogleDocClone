import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Reg.css";

const RegistrationPage = () => {
  const BackendUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.setItem("username", formData.username);

    try {
      console.log("Form data:", formData);
      const response = await axios.post(
        `${BackendUrl}api/user/register`,
        formData
      );
      console.log("Registration successful:", response.data);
      if (response.status === 201) {
        localStorage.setItem("user", formData.email);
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        console.error("Registration failed:", error.response.data);
      } else {
        console.error("Registration failed:", error.message);
      }
    }
  };

  return (
    <div className="container">
      <h2 className="title">Registration Page</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <div className="button-container">
          <button type="submit">Register</button>
          <button type="button" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationPage;
