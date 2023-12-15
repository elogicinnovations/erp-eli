import React, { useEffect, useState } from 'react'
import {
    Gear,
    Bell,
    UserCircle,
  } from "@phosphor-icons/react";
import { jwtDecode } from 'jwt-decode';

export default function Header() {


    const [username, setUsername] = useState('');

    const decodeToken = () => {
      var token = localStorage.getItem('accessToken');
      var decoded = jwtDecode(token);

      setUsername(decoded.username);
      console.log(decoded);
    }
    // const navigate = useNavigate()
    useEffect(() => {
      decodeToken();
    }, [])

  return (
        <div className="settings-search-master">
            <div className="dropdown-and-iconic">
              <div className="dropdown-side">
                  <div className="emp-text-side">
                  </div>
              </div>
                <div className="iconic-side">
                    <div className="gearsides">
                      <Gear size={35}/>
                    </div>
                    <div className="bellsides">
                      <Bell size={35}/>
                    </div>
                    <div className="usersides">
                       <UserCircle size={35}/>
                   </div>
                   <div className="username">
                       <h3>{username}</h3>
                    </div>
                </div>
            </div>
        </div>
  )
}
