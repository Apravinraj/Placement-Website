import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../../firebase";

// Must match the domain used in CreateLogin
const EMAIL_DOMAIN = "yourcollege.edu";

function Login() {
  const [loginData, setLoginData] = useState({
    username: "", // Register number
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // First try direct login with standard email format
      const authEmail = `${loginData.username}@${EMAIL_DOMAIN}`;
      
      try {
        await signInWithEmailAndPassword(auth, authEmail, loginData.password);
        navigate(`/profile/${loginData.username}`);
        return;
      } catch (directError) {
        console.log("Direct login failed, checking Firestore...");
      }

      // If direct login fails, check Firestore for registered email
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("registerNumber", "==", loginData.username));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error("Invalid register number or password");
      }
      
      const userData = querySnapshot.docs[0].data();
      const userEmail = userData.email || authEmail;
      
      // Attempt login with found email
      await signInWithEmailAndPassword(auth, userEmail, loginData.password);
      navigate(`/profile/${loginData.username}`);
      
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.code === 'auth/invalid-credential' || 
        error.message.includes('Invalid register number') ?
        "Invalid register number or password" : 
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!loginData.username) {
      setError("Please enter your register number first");
      return;
    }
    
    try {
      const authEmail = `${loginData.username}@${EMAIL_DOMAIN}`;
      await sendPasswordResetEmail(auth, authEmail);
      alert(`Password reset email sent to ${authEmail}`);
    } catch (error) {
      setError("Failed to send reset email: " + error.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-4">Student Login</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Register Number</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={loginData.username}
              onChange={handleChange}
              placeholder={`Enter your register number`}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="text-center mt-3">
          <p className="mb-1">
            New user?{" "}
            <span 
              className="text-primary" 
              style={{ cursor: "pointer" }} 
              onClick={() => navigate("/signup")}
            >
              Sign up here
            </span>
          </p>
          <p className="mb-0">
            <span 
              className="text-primary" 
              style={{ cursor: "pointer" }} 
              onClick={handlePasswordReset}
            >
              Forgot password?
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;