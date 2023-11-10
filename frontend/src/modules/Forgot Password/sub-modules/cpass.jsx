import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../../assets/global/url';
import { useParams, useNavigate, Link } from 'react-router-dom';
import swal from 'sweetalert';
import '../../styles/react-style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// Hide Password
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { Button } from '@mui/base/Button';
import Input from '@mui/material/Input';
import inputClasses from '@mui/material/Input';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { styled } from '@mui/system';

const CustomInput = React.forwardRef(function CustomInput(props, ref) {
    const { slots, ...other } = props;
    
    return (
      <Input
        slots={{
          root: StyledInputRoot,
          input: StyledInputElement,
          ...slots,
        }}
        {...other}
        ref={ref}
      />
    );
  });
  
  CustomInput.propTypes = {
    /**
     * The components used for each slot inside the InputBase.
     * Either a string to use a HTML element or a component.
     * @default {}
     */
    slots: PropTypes.shape({
      input: PropTypes.elementType,
      root: PropTypes.elementType,
      textarea: PropTypes.elementType,
    }),
  };
  


  const blue = {
    100: '#DAECFF',
    200: '#80BFFF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
  };
  
  const grey = {
    50: '#F3F6F9',
    100: '#E7EBF0',
    200: '#E0E3E7',
    300: '#CDD2D7',
    400: '#B2BAC2',
    500: '#A0AAB4',
    600: '#6F7E8C',
    700: '#3E5060',
    800: '#2D3843',
    900: '#1A2027',
  };
  
  const StyledInputRoot = styled('div')(
    ({ theme }) => `
    width: 50rem;
    height: 50px;
    
    font-family: IBM Plex Sans, sans-serif;
    font-weight: 800;
    border-radius: 10px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[500]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    display: flex;
    align-items: center;
    justify-content: center;
  
  
    &.${inputClasses.focused} {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[500] : blue[200]};
    }
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
  );
  
  const StyledInputElement = styled('input')(
    ({ theme }) => `
    font-size: 1.8rem;
    font-family: inherit;
    font-weight: 400;
    line-height: 1.5;
    flex-grow: 1;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: inherit;
    border: none;
    border-radius: inherit;
    padding: 8px 12px;
    outline: 0;
  `,
  );
  
  const IconButton = styled(Button)(
    ({ theme }) => `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: inherit;
    cursor: pointer;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[700]};
    `,
  );
  
  const InputAdornment = styled('div')`
    margin: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  `;

function ConfirmPassword()
 {
// const [password, setPassword] = useState('');
const [passwordValues, setPasswordValues] = useState({
  password: '',
  confirmPassword: '',
  showPassword: false,
  showConfirmPassword: false,
});


const [isLengthValid, setIsLengthValid] = useState(true); // State to track password length validation
const [hasAlphaNumeric, setHasAlphanumeric] = useState(true); // State to track capital letter presence
const [hasUpperCase, setHasUpperCase] = useState(true);

const [passwordMatch, setPasswordMatch] = useState(false); // State to track password matching
const [passwordinput, setpass] = useState('');
const [Cpasswordinput, setCpass] = useState('');


const { email } = useParams();
const navigate = useNavigate();




const handlePasswordChangeIcon = (prop) => (event) => {
  const newPassword = event.target.value;
  setPasswordValues({ ...passwordValues, [prop]: newPassword });

  // Check if the password meets the 8-character length requirement
  const isLengthValid = newPassword.length >= 8;

  // Check if the password contains at least one number and special character
  const hasAlphaNumeric = /[0-9!@#]/.test(newPassword);

  // Check if the password contains at least one uppercase letter
  const hasUpperCase = /[A-Z]/.test(newPassword);

  setIsLengthValid(isLengthValid);
  setHasAlphanumeric(hasAlphaNumeric);
  setHasUpperCase(hasUpperCase);
};

const handlePasswordChangeIconCpass = (prop) => (event) => {
  setPasswordValues({ ...passwordValues, [prop]: event.target.value });

};


// Use useEffect to check for password matching whenever passwordinput or Cpasswordinput changes
useEffect(() => {
  if (passwordinput === Cpasswordinput) {
    setPasswordMatch(true);
  } else {
    setPasswordMatch(false);
  }
}, [passwordinput, Cpasswordinput]);

const handleClickShowPassword = (prop) => () => {
  if (prop === 'password') {
    setPasswordValues({
      ...passwordValues,
      showPassword: !passwordValues.showPassword,
    });
  } else if (prop === 'confirmPassword') {
    setPasswordValues({
      ...passwordValues,
      showConfirmPassword: !passwordValues.showConfirmPassword,
    });
  }
};

const handleMouseDownPassword = (event) => {
  event.preventDefault();
};

// Function to handle form submission
const handleSubmit = () => {
  const { password, confirmPassword } = passwordValues;

  if (password === '' || confirmPassword === '') {
    swal({
      title: 'Fields are required!',
      text: 'Please fill the blank inputs',
      icon: 'error',
      button: 'OK',
    });
  } else if (password !== confirmPassword) {
    // Passwords do not match
    setPasswordMatch(true);
  } else {
    // Passwords match, proceed with API call
  
    console.log("ito pass new" + password)
    axios
    .put(BASE_URL + '/masterList/resetPassword', { password, email })
      .then((response) => {
        if (response.status === 200) {
          swal({
            title: 'Update Successful',
            text: 'You successfully updated your password',
            icon: 'success',
          }).then(() => {
            navigate('/');
          });
        } else {
          swal({
            title: 'Something Went Wrong',
            text: 'Please contact our support team',
            icon: 'error',
          }).then(() => {
            window.location.reload();
          });
        }
      })
      .catch((error) => {
        console.error(error.response.data);
      });
  }
};
    
  
  return (

<div class="container-cpass">

<head>
  <meta charset="utf-8" />
  <link rel="icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <title>Confirm password</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Radio+Canada%3A600"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins%3A300%2C400%2C500%2C600%2C700%2C900"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro%3A300%2C400%2C500%2C600%2C700%2C900"/>
  <link rel="stylesheet" href="./styles/forgot-password-dXo.css"/>


  <link rel="stylesheet" href= "https://demo.bootstrapdash.com/skydash/template/vendors/feather/feather.css"/>
  <link rel="stylesheet" href= "https://demo.bootstrapdash.com/skydash/template/vendors/ti-icons/css/themify-icons.css"/>
  <link rel="stylesheet" href= "https://demo.bootstrapdash.com/skydash/template/vendors/css/vendor.bundle.base.css"/>
  <link rel="stylesheet" href= "https://demo.bootstrapdash.com/skydash/template/vendors/jquery-toast-plugin/jquery.toast.min.css"/>
</head>

    <div className="confirm-pass-left">
        <div className="confirm-blur-bg">
              {/* <div class="copyright-footer">
              <p class="copyright-2023-text">
              Copyright © 2023 Slashtech, All Rights Reserved.
              <br/>
              </p>
            </div> */}
        </div>
    </div>

            <div className="confirm-pass-right">
                <div className="cpass-box-container">
                    <div className="cpass-white-box">

                        <p className="setup-text">
                          Set up new Password
                        </p>

                        <p className="enternew-text">
                            Enter your new password below and check the hint while setting it.
                        </p>

                        <div className="firstinput-pass">
                          <label className="Newpass-label">New Password</label>
                        <Box>
                            <CustomInput
                                  placeholder=""
                                  id="outlined-adornment-password"
                                  type={passwordValues.showPassword ? 'text' : 'password'}
                                  value={passwordValues.password}
                                  onInput={handlePasswordChangeIcon('password')}
                                  onChange={(e) => setpass(e.target.value)}
                                  endAdornment={
                                    <InputAdornment>
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword('password')}
                                        onMouseDown={handleMouseDownPassword}
                                      >
                                        {passwordValues.showPassword ? <VisibilityOff /> : <Visibility />}
                                      </IconButton>
                                    </InputAdornment>
                                  }
                                  className={isLengthValid ? 'valid' : 'invalid'} // Apply CSS class based on length validation
                                />
                          </Box>
                            <div className="restrictions">
                              {!isLengthValid && (
                                <p style={{ color: 'red', fontSize: 11 }}>
                                  * Password must be at least 8 characters
                                </p>
                              )}
                              {!hasUpperCase && (
                                <p style={{ color: 'red', fontSize: 11, }}>
                                  * Password must contain at least one uppercase letter
                                </p>
                              )}
                              {!hasAlphaNumeric && (
                                <p style={{ color: 'red', fontSize: 11, }}>
                                  * Password must contain numbers and special characters [0-9!@#].
                                </p>
                              )}
                            </div>
                        </div>

                        <div className="secondinput-pass">
                        <label className="confirmpass-label">Confirm Password</label>
                        <Box>
                              <CustomInput placeholder=""
                                id="outlined-adornment-password"
                                type={passwordValues.showConfirmPassword ? 'text' : 'password'}
                                value={passwordValues.confirmPassword}
                                onInput={handlePasswordChangeIconCpass('confirmPassword')}
                                onChange={(e) => setCpass(e.target.value)}
                                disabled={!isLengthValid || !hasAlphaNumeric}
                                endAdornment={
                                  <InputAdornment>
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowPassword('confirmPassword')}
                                      onMouseDown={handleMouseDownPassword}
                                    >
                                      {passwordValues.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                                }
                              />
                          </Box>
                          <div className="password-match">
                            {passwordValues.password !== '' && passwordValues.confirmPassword !== '' && (
                                passwordMatch ? (
                                  <p style={{ color: 'green', fontSize: 11 }}>
                                    Passwords match.
                                  </p>
                                ) : (
                                  <p style={{ color: 'red', fontSize: 11 }}>
                                    Passwords do not match.
                                  </p>
                                )
                              )}
                          </div>
                        </div>
                          
                        <div className="submit-pass-button">
                            <button
                              disabled={!passwordMatch}
                              onClick={handleSubmit}
                              className={`button-pass ${!passwordMatch ? 'not-allowed' : ''}`} // Add a class conditionally
                            >
                              Submit
                            </button>
                          </div>
                        
                        <div className="backto-Otp">
                          <Link to="/OTP"  style={{display: 'contents', fontSize: 18, color: 'orange'}}>
                          <FontAwesomeIcon icon={faArrowLeft} /> Back to OTP
                          </Link>
                        </div>

                    </div>
                </div>
            </div>



</div>

  );
}

export default ConfirmPassword;