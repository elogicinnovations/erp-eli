import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from '../../../assets/global/url';
import { useParams, useNavigate, Link } from 'react-router-dom';
import swal from 'sweetalert';


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
    width: 90rem;
    height: 80px;
    
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


const [isLengthValid, setIsLengthValid] = useState(false); // State to track password length validation
const [hasCapitalLetter, setHasCapitalLetter] = useState(false); // State to track capital letter presence
const [hasSmallLetter, setHasSmallLetter] = useState(false); // State to track small letter presence
const [hasNumber, setHasNumber] = useState(false); // State to track small letter presence

const [passwordMatch, setPasswordMatch] = useState(false); // State to track password matching
const [passwordinput, setpass] = useState('');
const [Cpasswordinput, setCpass] = useState('');


const { email } = useParams();
const navigate = useNavigate();




const handlePasswordChangeIcon = (prop) => (event) => {
  const newPassword = event.target.value;
  setPasswordValues({ ...passwordValues, [prop]: newPassword });

  // Check if the password meets the 8-character length requirement
  setIsLengthValid(newPassword.length >= 8); // Update isLengthValid

  // Check if the password contains at least one capital letter
  setHasCapitalLetter(/[A-Z]/.test(newPassword));

  // Check if the password contains at least one small letter
  setHasSmallLetter(/[a-z]/.test(newPassword));

   // Check if the password contains at least one number
   setHasNumber(/[0-9]/.test(newPassword));
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
  
    axios
    .post(BASE_URL + '/masterList/resetPass', { password, email })
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

    <div class="container">

<head>
  <meta charset="utf-8" />
  <link rel="icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <title>forgot password</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Radio+Canada%3A600"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins%3A300%2C400%2C500%2C600%2C700%2C900"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro%3A300%2C400%2C500%2C600%2C700%2C900"/>
  <link rel="stylesheet" href="./styles/forgot-password-dXo.css"/>


  <link rel="stylesheet" href= "https://demo.bootstrapdash.com/skydash/template/vendors/feather/feather.css"/>
  <link rel="stylesheet" href= "https://demo.bootstrapdash.com/skydash/template/vendors/ti-icons/css/themify-icons.css"/>
  <link rel="stylesheet" href= "https://demo.bootstrapdash.com/skydash/template/vendors/css/vendor.bundle.base.css"/>
  <link rel="stylesheet" href= "https://demo.bootstrapdash.com/skydash/template/vendors/jquery-toast-plugin/jquery.toast.min.css"/>
</head>




<div class="forgot-password-8Uq">
  <div class="rectangle-1-Tn1">
  </div>
  <p class="copyright-2023-slashtech-all-rights-reserved-CDo">
  Copyright © 2023 Slashtech, All Rights Reserved.
  <br/>
  
  </p>
  <div class="rectangle-7-TfX">
  </div>
  <img class="undrawmypasswordreydq7-1-1-NnV" src="./assets/undrawmypasswordreydq7-1-1-Z9T.png"/>
  <p class="important-information-please-read-the-information-below-and-then-kindly-share-the-requested-information-do-not-reveal-your-password-to-anybody-do-not-reuse-passwords-use-alphanumeric-passwords-your-login-id-and-security-answer-are-required-login-ids-are-case-sensitive-u1j">
    <span class="important-information-please-read-the-information-below-and-then-kindly-share-the-requested-information-do-not-reveal-your-password-to-anybody-do-not-reuse-passwords-use-alphanumeric-passwords-your-login-id-and-security-answer-are-required-login-ids-are-case-sensitive-u1j-sub-0">
    Important Information
    <br/>
    
    </span>
    <span class="important-information-please-read-the-information-below-and-then-kindly-share-the-requested-information-do-not-reveal-your-password-to-anybody-do-not-reuse-passwords-use-alphanumeric-passwords-your-login-id-and-security-answer-are-required-login-ids-are-case-sensitive-u1j-sub-1">Please </span>
    <span class="important-information-please-read-the-information-below-and-then-kindly-share-the-requested-information-do-not-reveal-your-password-to-anybody-do-not-reuse-passwords-use-alphanumeric-passwords-your-login-id-and-security-answer-are-required-login-ids-are-case-sensitive-u1j-sub-2">read</span>
    <span class="important-information-please-read-the-information-below-and-then-kindly-share-the-requested-information-do-not-reveal-your-password-to-anybody-do-not-reuse-passwords-use-alphanumeric-passwords-your-login-id-and-security-answer-are-required-login-ids-are-case-sensitive-u1j-sub-3">
     the information below and then
    <br/>
    kindly 
    </span>
    <span class="important-information-please-read-the-information-below-and-then-kindly-share-the-requested-information-do-not-reveal-your-password-to-anybody-do-not-reuse-passwords-use-alphanumeric-passwords-your-login-id-and-security-answer-are-required-login-ids-are-case-sensitive-u1j-sub-4">share</span>
    <span class="important-information-please-read-the-information-below-and-then-kindly-share-the-requested-information-do-not-reveal-your-password-to-anybody-do-not-reuse-passwords-use-alphanumeric-passwords-your-login-id-and-security-answer-are-required-login-ids-are-case-sensitive-u1j-sub-5">
     the requested information. 
    <br/>
    
    </span>
    <span class="important-information-please-read-the-information-below-and-then-kindly-share-the-requested-information-do-not-reveal-your-password-to-anybody-do-not-reuse-passwords-use-alphanumeric-passwords-your-login-id-and-security-answer-are-required-login-ids-are-case-sensitive-u1j-sub-6">
    
    <br/>
    
    </span>
    <span class="important-information-please-read-the-information-below-and-then-kindly-share-the-requested-information-do-not-reveal-your-password-to-anybody-do-not-reuse-passwords-use-alphanumeric-passwords-your-login-id-and-security-answer-are-required-login-ids-are-case-sensitive-u1j-sub-7">Do </span>
    <span class="important-information-please-read-the-information-below-and-then-kindly-share-the-requested-information-do-not-reveal-your-password-to-anybody-do-not-reuse-passwords-use-alphanumeric-passwords-your-login-id-and-security-answer-are-required-login-ids-are-case-sensitive-u1j-sub-8">not</span>
    <span class="important-information-please-read-the-information-below-and-then-kindly-share-the-requested-information-do-not-reveal-your-password-to-anybody-do-not-reuse-passwords-use-alphanumeric-passwords-your-login-id-and-security-answer-are-required-login-ids-are-case-sensitive-u1j-sub-9">
     reveal your password to anybody
    <br/>
    Do 
    </span>
    <span class="important-information-please-read-the-information-below-and-then-kindly-share-the-requested-information-do-not-reveal-your-password-to-anybody-do-not-reuse-passwords-use-alphanumeric-passwords-your-login-id-and-security-answer-are-required-login-ids-are-case-sensitive-u1j-sub-10">not</span>
    <span class="important-information-please-read-the-information-below-and-then-kindly-share-the-requested-information-do-not-reveal-your-password-to-anybody-do-not-reuse-passwords-use-alphanumeric-passwords-your-login-id-and-security-answer-are-required-login-ids-are-case-sensitive-u1j-sub-11">
     reuse passwords
    <br/>
    Use Alphanumeric passwords
    <br/>
    Your Login ID. and security answer are required
    <br/>
    Login IDs are case sensitive
    </span>
  </p>
  
  <div class="sign-in-hxV">
    <p class="set-new-password-dbF">Set new password</p>
    <p class="enter-your-new-password-below-and-check-the-hint-while-setting-it-isb">Enter your new password below and check the hint while setting it.</p>
    <div class="auto-group-58ch-ou3">
      <div class="auto-group-bp2q-Xa9">

        {/* INPUT PASSWORD */}
        <div class="rectangle-3-Gnd">
        <Box
          sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
      }}
    >
       <CustomInput
            placeholder="Password"
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
      </div>  

      {/* Confirm PASSWORD */}
        <div class="rectangle-6-SqX">
        <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
      }}
    >
     
        <CustomInput placeholder="Confirm Password"
          id="outlined-adornment-password"
          type={passwordValues.showConfirmPassword ? 'text' : 'password'}
          value={passwordValues.confirmPassword}
          onInput={handlePasswordChangeIconCpass('confirmPassword')}
          onChange={(e) => setCpass(e.target.value)}
          disabled={!isLengthValid || !hasCapitalLetter || !hasSmallLetter || !hasNumber}
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
    
        </div>
    
       

      </div>
      {passwordValues.password !== '' && passwordValues.confirmPassword !== '' && (
      passwordMatch ? (
        <p style={{ color: 'white', background: 'green', fontSize: 20 }}>
          Passwords match.
        </p>
      ) : (
        <p style={{ color: 'red', background: '#03071e', fontSize: 20 }}>
          Passwords do not match.
        </p>
      )
    )}

        {!isLengthValid && (
          <p style={{ color: 'red', background: '#03071e', fontSize: 15 }}>
            * Password must be exactly 8 characters long.
          </p>
        )}

    {/* Display a message about the capital letter requirement */}
      {!hasCapitalLetter && (
        <p style={{ color: 'red', background: '#03071e', fontSize: 15 }}>
          * Password must contain at least one capital letter.
        </p>
      )}

       {/* Display a message about the capital letter requirement */}
       {!hasSmallLetter && (
        <p style={{ color: 'red', background: '#03071e', fontSize: 15 }}>
          * Password must contain at least one small letter.
        </p>
      )}
      

      {!hasNumber && (
        <p style={{ color: 'red', background: '#03071e', fontSize: 15 }}>
          * Password must contain at least one number.
        </p>
      )}

    </div>



    <div class="auto-group-qad7-KH3">
      <p class="rememberd-your-password-back-to-login-2x9">
        <span class="rememberd-your-password-back-to-login-2x9-sub-0">
        Remember your password?
        <br/>
        
        </span>
        <Link to="/">
        <span class="rememberd-your-password-back-to-login-2x9-sub-1">Back to </span>
        <span class="rememberd-your-password-back-to-login-2x9-sub-1">login</span>
        </Link>
      </p>
      <button
        disabled={!passwordMatch} // Disable button if passwords don't match
        onClick={handleSubmit}
        class="auto-group-9xht-FyK"
      >
        Submit
      </button>
     
    </div>
  </div>
  <div class="group-5-WuF">
    <p class="slashtech-solution-TJh">SLASHTECH SOLUTION</p>
   
    <p class="corporation-AU1">CORPORATION</p>
  </div>
</div>
</div>

  );
}

export default ConfirmPassword;