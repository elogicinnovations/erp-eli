import React, { useState } from 'react';
import axios from 'axios';
import '../../assets/global/style.css';
import '../styles/react-style.css';
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
            navigate('/dashboard');
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
    <div className="login-form-without-credentials-jWZ container-fluid d-flex flex-row justify-content-between" id="container">
      
      <div className='welcome-container'>
        <div className="rectangle-1-rLH" id='login-logo'>
          <div className='w-100 h-100 d-flex flex-column justify-content-between p-5' id='login-welcome'>
            <div className='w-100 h-50  d-flex flex-column justify-content-center align-items-center mt-5' id='welcome-company'>
              <p className=''>SLASHTECH SOLUTION</p>
              <p className="">CORPORATION</p>
            </div>
              
            <div className='w-100 d-flex justify-content-center align-items-center' id='login-footer'>
              <p className="footer-msg fs-4 d-flex justify-content-center align-items-center">Copyright © 2023 Slashtech, All Rights Reserved.</p>
            </div>      
          </div>
        </div>
           
      </div>
      

      <div className="d-flex align-items-center flex-column" id='login-credential'>
        <div className=' w-100 mt-3 d-flex justify-content-end p-3'>
            <p className='' style={{ color: 'gray', marginRight: '3em', marginTop: '1em', cursor: 'pointer' }}>English (UK)</p>
        </div>
        <div className=' h-75 d-flex flex-column justify-content-between mt-5' id='login-credential-container'>
            <div className="credential-company d-flex flex-row justify-content-between mx-auto mt-5">
                <div className="company-title h-100 p-3">
                    <div><p className='fs-3 company-name' style={{ color: 'green' }} >SBF Philippines</p></div>
                    <div><p className='fs-5 company-name2' style={{ color: 'green' }}>Drilling Resources</p></div>
                </div>
                <div className="line h-100 border">

                </div>
                <div className="cms d-flex align-item-center p-2">
                    <h1 className=''>CMS</h1>
                </div>
            </div>
            <div className='welcome-user w-100 mt-5 mb-5 d-flex justify-content-center align-items-center'> 
                <p className='fs-2'>Welcome back, Username</p>
            </div>
            <div className="credentials p-3 mx-auto">
                <div className="form-group ">
                    <label htmlFor="">Email Address</label>
                    <div className='form-group d-flex flex-row position-relative'>
                    <input
                      className="form-control w-100"
                      type="text"
                      name="username"
                      placeholder="Enter email address"
                      onChange={(e) => setUsername(e.target.value)}
                      maxLength={50} // Set the character limit to 50 characters
                      />
                      <FaEnvelope className="fa-envelope" />
                    </div>

                    <label htmlFor="">Password</label>
                    <div className='form-group d-flex flex-row position-relative'>
                      <input
                        className="form-control w-100"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        maxLength={50} // Set the character limit to 50 characters
                      />
                      {showPassword ? (
                        <FaEyeSlash className="eye" onClick={togglePasswordVisibility} />
                      ) : (
                        <FaEye className="eye" onClick={togglePasswordVisibility} />
                      )}
                    </div>

                    <div className='w-100 d-flex justify-content-end'>
                      <Link to="/forgotpass" style={{display: 'contents'}}>
                        <p className="forgot-password-oGm forgot-pass" style={{ color: 'purple', textDecoration: 'underline' }}>Forgot Password?</p>
                      </Link>
                    </div><br />

                    <div className="btn-container w-100 mt-3 d-flex justify-content-center">
                      <button className="btn btn-primary d-flex flex-row align-items-center justify-content-between p-5" style={{ fontSize: '1.8em' }} type="submit" onClick={handleLogin}>
                        Login
                        <i class="fa-solid fa-circle-arrow-right" style={{ fontSize: '2.5em' }}></i>
                      </button>
                    </div>
                    
                </div>
            </div>
        </div>
       
        {/* <div className="auto-group-vebk-NNV">
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
            <Link to="/forgotpass" style={{display: 'contents'}}>
              <p className="forgot-password-oGm">Forgot Password?</p>
            </Link>
            <button className="LoginBtn loginiconbtn" type="submit" disabled={!username || !password} onClick={handleLogin}>
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
        <div className="frame-3-Frq">English (UK)</div> */}
      </div>
     
    </div>
  );
};

export default Login;
