import React, { useState } from 'react';
import axios from 'axios';
import '../../assets/global/style.css';
import './styles/login.css';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../../assets/global/url';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
// import { useAuth } from '../authorize/AuthContext';
import { FaEye, FaEyeSlash, FaEnvelope } from 'react-icons/fa'; // Import icons

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();
  // const { login } = useAuth();

  const handleLogin = () => {
    axios
      .post(BASE_URL + '/masterList/login', { username, password })
      .then((response) => {
        if (response.status === 200) {
          swal({
            title: 'Login Successful',
            text: '',
            icon: 'success',
            button: 'OK',
          }).then(() => {
            // login();
            navigate('/admin/masterList');
          });
        } else if (response.status === 202) {
          swal({
            title: 'Login Denied',
            text: 'Please check your username and password',
            icon: 'error',
            button: 'OK',
          });
        }
      })
      .catch((error) => {
        console.error(error.response.data);
        swal({
          title: 'Something Went Wrong',
          text: 'Please contact our support team',
          icon: 'error',
        }).then(() => {
          window.location.reload();
        });
      });
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-form-without-credentials-jWZ">
      <div className="rectangle-1-rLH"></div>
      <p className="slashtech-solution-NpR">SLASHTECH SOLUTION</p>
      <p className="corporation-Tqs">CORPORATION</p>
      <div className="frame-1-mbf">
        <div className="auto-group-imnr-Cgy">
          <span className="auto-group-imnr-Cgy-sub-0">Welcome back</span>
          <span className="auto-group-imnr-Cgy-sub-1"> </span>
          <span className="auto-group-imnr-Cgy-sub-2"></span>
        </div>
        <div className="auto-group-vebk-NNV">
          <div className="login-VT7">
            <p className="email-address-3Dj">Email address</p>
            <div className="input-icon-container">
              <input
                className="inputext"
                type="text"
                name="username"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                maxLength={50} // Set the character limit to 50 characters
              />
              <FaEnvelope className="input-icon envelope-icon" />
            </div>
            <br />
            <p className="password-8Y1">Password</p>
            <div className="input-icon-container">
              <input
                className="inputext"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                maxLength={50} // Set the character limit to 50 characters
              />
              {showPassword ? (
                <FaEyeSlash className="password-toggle-icon fa-eye-slash" onClick={togglePasswordVisibility} />
              ) : (
                <FaEye className="password-toggle-icon fa-eye" onClick={togglePasswordVisibility} />
              )}
            </div>
            <Link to="/forgotPass" style={{display: 'contents'}}>
              <p className="forgot-password-oGm">Forgot Password?</p>
            </Link>
            <button className="LoginBtn loginiconbtn" type="submit" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
        <div className="title-9ms">
          <div className="auto-group-qf1s-qeh">
            <p className="infinity-9vH" style={{fontSize: 24}}>SBF Philippines </p>
            <p className="eight-TRB" style={{fontSize: 20}}>Drilling Resources</p>
          </div>
          <div className="line-1-NY9"></div>
          <p className="cms-iM7">CMS</p>
        </div>
        <div className="frame-3-Frq">English (UK)</div>
      </div>
      <p className="copyright-2023-slashtech-all-rights-reserved-wUm">
        Copyright © 2023 Slashtech, All Rights Reserved.
        <br />
      </p>
    </div>
  );
};

export default Login;
