import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const LoginPage = () => {
  const BackendUrl = process.env.REACT_APP_BASE_URL;
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    sessionStorage.setItem("name", name);
    const data = { email: email, password: password };
    console.log("Login button clicked");
    const response = await axios.post(`${BackendUrl}api/user/login`, data);
    const userdata = response.data;
    if (!userdata.user) {
      window.alert("Email does no exist or login failed. Please try again.");
      return;
    }
    sessionStorage.setItem("email", email);
    console.log(sessionStorage);
    history("/main");
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <label>Username:</label>
        <input
          type="name"
          value={name}
          onChange={(e) => setname(e.target.value)}
          required
        />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
