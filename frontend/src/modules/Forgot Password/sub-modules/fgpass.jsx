// import './App.css';
// import './style.css';
import mailicon from '../../../assets/icon/mailsend.png';
import '../../styles/react-style.css'
import React, { useState } from 'react';
import BASE_URL from '../../../assets/global/url';
import Slash from '../../../assets/image/Slash.png';
import swal from 'sweetalert';
import {  useNavigate, Link   } from 'react-router-dom';
import { useDataContext } from './data/dataPost';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
// input
import Input from '@mui/material/Input';


// button

import { Button, buttonClasses } from '@mui/base/Button';
import { styled } from '@mui/system';
import Stack from '@mui/material/Stack';

const blue = {
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
};

const CustomButton = styled(Button)`
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 1.8rem;
  line-height: 1.5;
  background-color: #333;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  padding: 20px 255px;
  cursor: pointer;
  transition: all 150ms ease;
  border: none;
  

  &:hover {
    background-color: #FFA500;
  }

  &.${buttonClasses.active} {
    background-color: ${blue[700]};
  }

  &.${buttonClasses.focusVisible} {
    box-shadow: 0 4px 20px 0 rgb(61 71 82 / 0.1), 0 0 0 5px rgb(0 127 255 / 0.5);
    outline: none;
  }

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// input box

const CustomInput = React.forwardRef(function CustomInput(props, ref) {
  return <Input slots={{ input: StyledInputElement }} {...props} ref={ref} />;
});

const inputblue = {
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

const StyledInputElement = styled('input')(
  ({ theme }) => `
  width: 570px;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 2rem;
  font-weight: 400;
  padding: 18px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 2px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
 

  background-image: url(${mailicon}); /* Add the background image */
  background-position: right center; /* Position the image on the right */
  background-repeat: no-repeat; /* Prevent image repetition */
  background-size: 65px 50px;

  // &:hover {
  //   border-color: #333;
  // }

  &:focus {
    border-color: #333;
    box-shadow: #333;
  }
  

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);

function ForgotPass() {
  const [email, setEmail] = useState('');
  const navigate  = useNavigate();

  const {setEmailPOst, setVerificationCode } = useDataContext();


  const sendEmail = () => {
    axios
      .post(BASE_URL + '/masterList/emailForgotPass', { email })
      .then((response) => {
        if (response.status === 200) {
          const responseBody = response.data;
          const verificationcode = responseBody.code;
          console.log(verificationcode);
  
          swal({
            title: 'Email Sent Successfully!',
            text: 'Please check your email',
            icon: 'success',
            button: 'OK',
          }).then(() => {
            setEmailPOst(email); // Set email in the context
            setVerificationCode(verificationcode); // Set verification code in the context
            navigate(`/OTP`);
          });
        } else if (response.status === 202) {
          swal({
            title: 'Email not registered!',
            text: 'Please check the input email',
            icon: 'warning',
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
  
  // const sendEmail = () => {
  //   console.log('clicked')
  //   try {
  //     const response = post(BASE_URL + 'masterList/emailForgotPass', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json', 
  //       },
  //       body: JSON.stringify({ toEmail: email }),
  //     });

  //     if (response.status === 200) {
  //       const responseBody = response.json();
  //       const verificationcode = responseBody.code;

  //       swal({
  //         title: 'Email Sent Successfully!',
  //         text: 'Please check your email',
  //         icon: 'success',
  //         button: 'OK',
  //       }).then(() => {
  //         setEmailPOst(email); // Set email in the context
  //         setVerificationCode(verificationcode); // Set verification code in the context
  //         navigate(`/OTP`);
  //       });
  //     } else if (response.status === 202) {
  //       swal({
  //         title: 'Email not registered!',
  //         text: 'Please check the input email',
  //         icon: 'warning',
  //         button: 'OK',
  //       });
  //     } else {
  //       console.error('Email sending failed');
  //     }
  //   } catch (error) {
  //     console.error('Email sending failed', error);
  //   }
  // };
  return (

<div className="forgot-content-main">

<head>
  <meta charset="utf-8" />
  <link rel="icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <title>forgot password</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Poppins%3A300%2C400%2C500%2C600%2C700%2C900"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro%3A300%2C400%2C500%2C600%2C700%2C900"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Radio+Canada%3A600"/>
 
</head>
    <div className="blurbg-forgot">
          
    </div>
    
    <div className="fgpass-lefts">

    </div>

    <div className="fgpass-rights">
          <div className="right-fg-content">

             <div className="bglogo">
                <img className='slashlogo' src={Slash}/>
            </div>

              <div className="forgot-text-question">
                  Forgot Password?
              </div>

              <div className="emailandinput">
                    <div className="emailfonts">
                      Email
                    </div>
                     <div class="email-input">
                        <CustomInput class="" aria-label="Demo input" placeholder="Please fill in your email address"  value={email}
                          onChange={(e) => setEmail(e.target.value)} ></CustomInput>
                      </div>
                     <div className="fg-submitbutton">
                        <CustomButton className="fg-button" onClick={sendEmail} slots={{ root: 'span' }}>Submit</CustomButton>
                     </div>

                     <div class="remembered-text">
                        Remember Your Password?
                      </div>

                      <div class="back-login">
                        <Link to="/"  style={{display: 'contents', fontSize: 20, color: 'orange'}}>
                        <FontAwesomeIcon icon={faArrowLeft} /> Back to login
                        </Link>
                  </div>
              </div>
          </div>
    </div>
</div>
  );
}

export default ForgotPass;