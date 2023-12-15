import React from 'react'
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import swal from 'sweetalert';

export default function GuestRoute({ children }) {

  const location = useLocation();
  const navigate = useNavigate();



  useEffect(() => {
    // console.log(localStorage.getItem('accessToken'));
    // console.log("Protected? ",!guestRoute.includes(location.pathname));
    const guestRoute = [
        '/',
        '/forgotpass',
        '/OTP',
        '/ConfirmPassword/:email?'
      ]

      if(localStorage.getItem('accessToken') && guestRoute.includes(location.pathname)){
        // navigate(location.pathname);
        navigate('/dashboard');
      }
    }
  , [location.pathname, navigate]);

  return <>{ children }</>
}
