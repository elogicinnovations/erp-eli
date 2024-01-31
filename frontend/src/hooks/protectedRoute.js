

import React from 'react'
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';



export default function ProtectedRoutes({ children }) {

    const location = useLocation();
    const navigate = useNavigate()

    useEffect(() => {
      const guestRoute = [
        '/',
        'forgotPass',
        'forgotpass'
      ]
      if(localStorage.getItem('accessToken') === null && guestRoute.includes(location.pathname)){
        navigate('/');
      }
    }, [navigate])

    return <>{ children }</>
}
