import React, { useState } from "react";
import SocialLogin from "./SocialLogin";
import "./login.css";
import { useNavigate } from "react-router-dom";
const AdminLogin = () => {

  const navigate = useNavigate();

  const ADMIN_CREDENTIALS = {
    email: "admin@example.com",
    password: "admin123",
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      email.trim().toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() &&
      password.trim() === ADMIN_CREDENTIALS.password
    ) {
      localStorage.setItem("isAdmin", "true");
      alert("Admin Login Successful");
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }    console.log("Submitted:", { email, password });
  };

  return (
    <div className="logg">
      <div className="login-container">
        <h2 className="form-title">Admin Login</h2>
        <SocialLogin />
        <p className="separator">
          <span>or</span>
        </p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-wrapper">
            <input
              type="email"
              className="input-field"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {/* You can add an icon here if needed */}
            <i className="input-icon fa fa-envelope"></i>
          </div>
          <div className="input-wrapper">
            <input
              type="password"
              className="input-field"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {/* You can add an icon here if needed */}
            <i className="input-icon fa fa-lock"></i>
          </div>
          <a href="#" className="forgot-password-link">
            Forgot password?
          </a>
          <button type="submit" className="login-button">
            Log In
          </button>
          <p className="signup-prompt">
          Are you a Student?{" "}
          <a href="/Login" className="signup-link">
            Student Login
          </a>
        </p>
        <button className="go-back-button" onClick={() => navigate("/dashboard")}>
          ← Go Back to Home
        </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
