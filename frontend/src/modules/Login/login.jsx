import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../../assets/global/style.css";
import "../styles/react-style.css";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../assets/global/url";
import swal from "sweetalert";
import { Link } from "react-router-dom";
// import { useAuth } from '../authorize/AuthContext';
import { FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa"; // Import icons
import SBFLOGO from "../../assets/image/sbf_logoo_final.jpg";
import { jwtDecode } from "jwt-decode";
import { Eye, EyeSlash } from "@phosphor-icons/react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();
  // const { login } = useAuth();

  const handleKeyPress = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
    }
  };

  useEffect(() => {
    // Access the token from localStorage
    const accessToken = localStorage.getItem("accessToken");
    console.log("Token:", accessToken);
    try {
      if (accessToken) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    axios
      .post(BASE_URL + "/masterList/login", { username, password })
      .then((response) => {
        console.log("RESPONSE STATUS" + response.status);
        if (response.status === 200) {
          // console.log(response.data.accessToken);
          localStorage.setItem("accessToken", response.data.accessToken);
          swal({
            text: "Login Success!",
            icon: "success",
            button: "OK",
          }).then(() => {
            // login();
            navigate("/dashboard");
            window.location.reload();
          });
        } else if (response.status === 202) {
          swal({
            title: "Login Denied",
            text: "Please check your email or password",
            icon: "error",
            button: "OK",
          });
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          swal({
            title: "Login Denied",
            text: error.response.data.error,
            icon: "error",
            button: "OK",
          });
        } else {
          console.error(error);
          swal({
            title: "Something Went Wrong",
            text: "Please contact our support team",
            icon: "error",
            button: "OK",
          });
        }
      });
    // .catch((error) => {
    //   console.error(error.response.data);
    //   swal({
    //     title: "Something Went Wrong",
    //     text: "Please contact our support team",
    //     icon: "error",
    //   }).then(() => {});
    // });
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;

      const createRbac = async () => {
        try {
          const response = await axios.post(`${BASE_URL}/userRole/rbacautoadd`);
          if (response && response.status === 200) {
            console.error("Superadmin role already exists");
          } else if (response && response.status === 401) {
            console.error("Superadmin user not found");
          } else {
            console.error("Error creating rbac:", response);
          }
        } catch (error) {
          console.error("Error creating rbac:", error);
        }
      };
      createRbac();
    }
  }, []);

  return (
    <div className="login-main-containers">
      <div className="left-login-containers">
        <div className="Slashtext-contents">
          <div>SBF PHILIPPINES DRILLING RESOURCES</div>
          <div>CORPORATION</div>
        </div>

        <div className="slash-footer">
          <div>Copyright © 2024 ELI IT Solutions, All Rights Reserved.</div>
        </div>
      </div>

      <div className="right-login-container">
        <div className="right-content">
          <div className="Uk-english">
            {/* <div className="text-english">English (UK)</div> */}
          </div>

          <div className="welcome-text">
            <div className="logologin">
              <img src={SBFLOGO} alt="" srcset="" />
            </div>
            <div className="logintextaccount">
              Test (8080) Login to your account
            </div>
          </div>

          <form className="loginform" onSubmit={handleLogin}>
            <div className="email-pass-input">
              <div className="email-content">
                <label>EMAIL ADDRESS</label>
                <div className="emailinput">
                  <input
                    className=""
                    type="text"
                    placeholder="Enter your email address"
                    name="username"
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={50} // Set the character limit to 50 characters
                    required
                  />
                  <FaEnvelope className="fa-envelope" />
                </div>
              </div>

              <div className="password-content">
                <label>PASSWORD</label>
                <div className="password-input">
                  <input
                    className=""
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    maxLength={50} // Set the character limit to 50 characters
                    required
                  />
                  {showPassword ? (
                    <EyeSlash
                      size={32}
                      color="#1a1a1a"
                      weight="light"
                      onClick={togglePasswordVisibility}
                    />
                  ) : (
                    <Eye
                      size={32}
                      color="#1a1a1a"
                      weight="light"
                      className="eye"
                      onClick={togglePasswordVisibility}
                    />
                  )}
                </div>
              </div>

              <div className="remember-forgot">
                <div className="forgot-passcontent">
                  <Link to="/forgotpass" style={{ display: "contents" }}>
                    <div className="fpass-word">Forgot Password?</div>
                  </Link>
                </div>
              </div>

              <div onKeyDown={handleKeyPress} className="button-login">
                <button
                  className="loginnow"
                  style={{ fontSize: "1.8em" }}
                  type="submit"
                >
                  Login now
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
