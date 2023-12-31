import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "../store/AuthProvider";
import "./Reg.css";

const RegistrationPage = () => {
  // const { login, user } = useAuth();
  const history = useNavigate();
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
    // console.log("Backend");
    console.log(formData);
    localStorage.setItem("username", formData.username);

    try {
      const response = await axios.post(
        "http://localhost:9000/api/user/register",
        formData
      );
      // const response1=await axios.post("http://localhost:9000/api/user/register",formData.username);
      console.log("Registration successful:", response.data);
      console.log(response.data);
      if (response.status === 201) {
        localStorage.setItem("user", formData.email);
        // await login(formData.email);
        // console.log(login);
        // console.log(user.email);
        history("/login");
      }
      // console.log(response1);
      // Redirect or show success message
    } catch (error) {
      console.error("Registration failed:", error.response.data);
      // Handle errors, e.g., display error messages
    }
  };

  return (
    <div>
      <h2>Registration Page</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit" onClick={handleSubmit}>
          Register
        </button>
      </form>
    </div>
  );
};

export default RegistrationPage;
