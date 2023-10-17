
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import { useDataContext } from './data/dataPost';
import { useNavigate, Link    } from 'react-router-dom';
import Slash from '../../../assets/image/Slash.png';
import BASE_URL from '../../../assets/global/url';
import swal from 'sweetalert';
import  '../../styles/react-style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
// input
import Input from '@mui/material/Input';


// button

import { Button, buttonClasses } from '@mui/base/Button';
import { styled } from '@mui/system';
// import Stack from '@mui/material/Stack';

const blue = {
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
};

const CustomButton = styled(Button)`
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 2rem;
  line-height: 1.5;
  background-color: #333;
  color: #ffffff;
  border-radius: 8px;
  font-weight: 600;
  padding: 15px 234px;
  cursor: pointer;
  transition: all 150ms ease;
  border: none;
  margin-left: 12rem;

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

// const CustomInput = React.forwardRef(function CustomInput(props, ref) {
//   return <Input slots={{ input: StyledInputElement }} inputmode="text" maxLength="1" {...props} ref={ref} />;
// });

const CustomInput = React.forwardRef(function CustomInput(props, ref) {
  return <StyledInputElement type="text" maxLength="1" {...props} ref={ref} />;
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
  width: 100px;
  height: 105px;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 3rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  text-align: center;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

  &:hover {
    border-color: ${inputblue[400]};
  }

  &:focus {
    border-color: ${inputblue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? inputblue[500] : inputblue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);

function OTP() {
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const inputRef4 = useRef(null);
  


  
  const navigate  = useNavigate();

  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('');
  const [value4, setValue4] = useState('');
  const [ResendCode, setResendCode] = useState(''); // Define ResendCode state


  const handleInputChange1 = (e) => {
    const inputValue1 = e.target.value;
    if (/^[0-9]*$/.test(inputValue1)) {
      setValue1(inputValue1);
      if (inputRef2.current) {
        inputRef2.current.focus();
      }
    }
  };
  
  const handleInputChange2 = (e) => {
    const inputValue2 = e.target.value;
    if (/^[0-9]*$/.test(inputValue2)) {
      setValue2(inputValue2);
      if (inputRef3.current) {
        inputRef3.current.focus();
      }
    }
  };
  
  const handleInputChange3 = (e) => {
    const inputValue3 = e.target.value;
    if (/^[0-9]*$/.test(inputValue3)) {
      setValue3(inputValue3);
      if (inputRef4.current) {
        inputRef4.current.focus();
      }
    }
  };
  
  const handleInputChange4 = (e) => {
    const inputValue4 = e.target.value;
    if (/^[0-9]*$/.test(inputValue4)) {
      setValue4(inputValue4);
      // You can perform any desired action when the fourth input changes
    }
  };
  




  const [remainingTime, setRemainingTime] = useState(120); // 2 minutes in seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true);


     // Countdown timer logic
     useEffect(() => {
      if (remainingTime > 0) {
        const timer = setTimeout(() => {
          setRemainingTime(remainingTime - 1);
        }, 1000); // Update every 1 second
        return () => clearTimeout(timer);
      } else {
        // button will disabled
        
        setIsResendDisabled(false);  // enable button
      
      }
    }, [remainingTime]);

  const handleResendCode = async () => {
    try {
      const response = await fetch(BASE_URL + '/masterList/emailResendCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toEmail: email }),
        
      });

   


      if (response.status === 200) {
        const responseBody = await response.json();
        const ResendCode = responseBody.code;
        setIsResendDisabled(true);  //disabled button
        setRemainingTime(120); //recount
        setResendCode(ResendCode); //pass to outside


        swal({
          title: 'Email Sent Successfully!',
          text: 'Please check your email',
          icon: 'success',
          button: 'OK',
        })

        
      }  else {
        swal({
          title: 'Something Went Wrong',
          text: 'Please contact our suppport team',
          icon: 'error',
          button: 'OK',
        })
        .then(() => {
          
        });
      }
    }
    catch (error) {
      console.error('Email sending failed', error);
    }

  }

  const { email, verificationcode } = useDataContext(); //post data from fillEmail.js


  let FinalVerifcationCode;


  if (ResendCode === ''){
    FinalVerifcationCode = verificationcode;
  }else{
    FinalVerifcationCode = ResendCode;
  }


  // Function to concatenated the values of entered code
  const inputVCode = value1 + value2 + value3 + value4;

  // console.log('Email:', email);
  // console.log('Verification Code:', verificationcode);
  // console.log('Resend Code:', ResendCode);
  // console.log('Entered Code:', inputVCode);

  const handlesubmitCode = () => {

    const StringInputCode = inputVCode.toString().trim();
    const StringVerificationCode = FinalVerifcationCode.toString().trim();

    if(StringVerificationCode === StringInputCode){
      // console.log("Valid");
      swal({
        title: 'Verification Successful',
        text: '',
        icon: 'success',
        button: 'OK',
      }).then(() => {
        navigate(`/ConfirmPassword/${encodeURIComponent(email)}`);
      });
    }
    else{
      // console.log("NOT Valid");
      swal({
        title: 'Verification Denied',
        text: 'Please check your verification code in your email',
        icon: 'error',
        button: 'OK',
      })
    }
  
  };


  return (

<div class="main-onetimepass">
      <div className="otpass-blurd">
      </div>

      <div className="otp-lefts">

      </div>

      <div className="right-otpass">
            <div className="otp-rightbox">
                <div className="otp-slashlogo">
                    <img className='slashlogo' src={Slash}/>
                </div>

                <div className="verificationstext">
                    <div className='otpverify-text'>
                    OTP Verification
                    </div>
                    <div className="remain-times">
                    Time Remaining: {Math.floor(remainingTime / 60)}:{remainingTime % 60}
                    </div>
                </div>

                <div className="code-box">
                        <div className="firstbox">
                        <CustomInput
                              ref={inputRef1}
                              class="rectangle-40-jLu"
                              type="text"
                              value={value1}
                              onChange={handleInputChange1}
                              placeholder="0"
                            ></CustomInput>
                        </div>

                          <div className="secondbox">
                            <CustomInput
                              ref={inputRef2}
                              class="rectangle-40-jLu"
                              aria-label="Demo input"
                              type="text"
                              value={value2}
                              onChange={handleInputChange2}
                              placeholder="0"
                            ></CustomInput>
                          </div>

                          <div className="thirdbox">
                            <CustomInput
                              ref={inputRef3}
                              class="rectangle-40-jLu"
                              aria-label="Demo input"
                              type="text"
                              value={value3}
                              onChange={handleInputChange3}
                              placeholder="0"
                              ></CustomInput>
                          </div>

                          <div className="fourthbox">
                              <CustomInput
                                ref={inputRef4}
                                class="rectangle-40-jLu"
                                aria-label="Demo input"
                                type="text"
                                value={value4}
                                onChange={handleInputChange4}
                                placeholder="0"
                              ></CustomInput>
                          </div>
                     </div> {/*codebox close div*/}
                      
                    <div className='button-otp-submit'>
                        <CustomButton onClick={handlesubmitCode} class="continue-submit">Submit</CustomButton>
                    </div>

                    <div className="resendcodes-content">
                        <p className="notreceive">
                          Didn’t receive code ? 
                        </p>
                        <button type="button" className="resendButton"  onClick={handleResendCode}  disabled={isResendDisabled}>Re-send</button>
                    </div>  

                    <div className="backtofg">
                      <Link to="/forgotpass"  style={{display: 'contents', fontSize: 15, color: 'orange'}}>
                        <FontAwesomeIcon icon={faArrowLeft} /> Back to forgot password
                      </Link>
                    </div>

            </div>
      </div>
</div> 

  );
}

export default OTP;