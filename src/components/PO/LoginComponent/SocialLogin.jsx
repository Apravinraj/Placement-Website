import google1 from "../../../assets/google.svg";
import github from "../../../assets/github.svg";


const SocialLogin = () => {
    return (
      <div className="social-login">
        <button className="social-button">
          <img src={google1} alt="Google" className="social-icon" />
          Google
        </button>
        <button className="social-button">
          <img src={github} alt="Apple" className="social-icon" />
          Github
        </button>
      </div>
    )
  }
  
  export default SocialLogin;