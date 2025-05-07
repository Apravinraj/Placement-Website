import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

// Define your domain here (use your organization's domain)
const EMAIL_DOMAIN = "yourcollege.edu";

function CreateLogin() {
  const location = useLocation();
  const { registerNumber } = location.state || {};
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      return;
    }

    try {
      // Create email from register number
      const authEmail = `${registerNumber}@${EMAIL_DOMAIN}`;
      
      // Create user with the generated email
      const userCredential = await createUserWithEmailAndPassword(auth, authEmail, password);
      const user = userCredential.user;

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        registerNumber,
        email: authEmail, // Store the auth email
        createdAt: new Date(),
        role: "student"
      });

      alert("Account created successfully! You can now login.");
      navigate("/login");
    } catch (error) {
      console.error("Error creating account:", error);
      if (error.code === "auth/email-already-in-use") {
        setError("An account already exists with this register number");
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Create Login Credentials</h2>
      <p className="mb-3">Register Number: <strong>{registerNumber}</strong></p>
      <div className="alert alert-info mb-3">
        Your login email will be: {registerNumber}@{EMAIL_DOMAIN}
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit} className="p-4 rounded shadow" style={{ background: "#f8f9fa" }}>
        <div className="mb-3">
          <label className="form-label">Register Number</label>
          <input 
            type="text" 
            className="form-control" 
            value={registerNumber} 
            readOnly 
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input 
            type="password" 
            className="form-control" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter your password (min 6 characters)"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input 
            type="password" 
            className="form-control" 
            required 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            placeholder="Confirm your password"
          />
        </div>
        <button type="submit" className="btn btn-success">Create Account</button>
      </form>
    </div>
  );
}

export default CreateLogin;