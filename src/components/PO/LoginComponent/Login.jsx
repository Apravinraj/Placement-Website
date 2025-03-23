import { useNavigate } from "react-router-dom";
import SocialLogin from "./SocialLogin";
import InputField from "./InputField";
import "./login.css";

const Login = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <div className="logg">
      <div className="login-container">
        <h2 className="form-title">Log in with</h2>
        <SocialLogin />

        <p className="separator">
          <span>or</span>
        </p>

        <form action="#" className="login-form">
          <InputField type="email" placeholder="Email address" icon="mail" />
          <InputField type="password" placeholder="Password" icon="lock" />

          <a href="#" className="forgot-password-link">
            Forgot password?
          </a>
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>

        <p className="signup-prompt">
          Are you an Admin?{" "}
          <a href="/Placement-Website/AdminLogin" className="signup-link">
            Admin login
          </a>
        </p>

        {/* ✅ Go Back to Home Button */}
        <button className="go-back-button" onClick={() => navigate("/")}>
          ← Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default Login;
