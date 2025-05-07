import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SocialLogin from "./SocialLogin";
import "./login.css";

const AdminLogin = () => {
  const navigate = useNavigate();

  const ADMIN_CREDENTIALS = {
    email: "admin@example.com",
    password: "admin123",
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (
      email.trim().toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase() &&
      password.trim() === ADMIN_CREDENTIALS.password
    ) {
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("adminAuthenticated", "true");
      navigate("/dashboard"); // Use navigate instead of href
    } else {
      setError("Invalid admin credentials");
    }
  };

  return (
    <div className="logg">
      <div className="login-container">
        <h2 className="form-title">Admin Login</h2>
        <SocialLogin />
        <p className="separator">
          <span>or</span>
        </p>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
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
            <i className="input-icon fa fa-lock"></i>
          </div>
          
          <button type="submit" className="login-button">
            Log In
          </button>
          
          <div className="login-links">
            <p className="signup-prompt">
              Are you a Student?{" "}
              <span 
                className="signup-link" 
                onClick={() => navigate("/login")}
                style={{ cursor: "pointer" }}
              >
                Student Login
              </span>
            </p>
            <button 
              className="go-back-button" 
              onClick={() => navigate("/dashboard")}
            >
              ← Go Back to Home
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;