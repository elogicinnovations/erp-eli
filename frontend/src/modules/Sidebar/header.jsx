import React, { useState, useEffect, useRef } from 'react';
import { Bell, BellRinging, ChartLineDown, Files, Gear, SignOut, UserCircle, UserCircleGear, XCircle } from '@phosphor-icons/react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const notificationRef = useRef(null);
    const profileRef = useRef(null);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          (notificationRef.current && !notificationRef.current.contains(event.target)) &&
          (profileRef.current && !profileRef.current.contains(event.target))
        ) {
          setShowNotifications(false);
          setShowProfile(false);
        }
      };
  
      document.addEventListener('click', handleClickOutside);
  
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }, []);
  
    const data = [
      {
        notification: 'New Purchase Request',
        content: 'New purchase request has been requested by Regin Legaspi.',
        date: 'Today at 9:42 AM',
      },
      {
        notification: 'Low Stock Alert',
        content: '1 product(s) has low stock. Check those products to reorder them before the stock reach zero.',
        date: 'Today at 9:42 AM',
      },
      {
        notification: 'Request Rejected',
        content: 'We regret to inform you that your purchase request has been rejected due to specific reasons.You can view the...',
        date: 'Today at 9:42 AM',
      },
      {
        notification: 'Request Rejustification',
        content: 'New purchase request has been requested by Regin Legaspi.',
        date: 'Today at 9:42 AM',
      },
      {
        notification: 'Request Rejustification',
        content: 'New purchase request has been requested by Regin Legaspi.',
        date: 'Today at 9:42 AM',
      },
      {
        notification: 'Request Rejected',
        content: 'We regret to inform you that your purchase request has been rejected due to specific reasons.You can view the...',
        date: 'Today at 9:42 AM',
      },
      {
        notification: 'Low Stock Alert',
        content: '1 product(s) has low stock. Check those products to reorder them before the stock reach zero.',
        date: 'Today at 9:42 AM',
      },
      {
        notification: 'New Purchase Request',
        content: 'New purchase request has been requested by Regin Legaspi.',
        date: 'Today at 9:42 AM',
      },
      {
        notification: 'New Purchase Request',
        content: 'New purchase request has been requested by Regin Legaspi.',
        date: 'Today at 9:42 AM',
      },
    ];

    const profile = [
      {
        username: 'Jerome Nadela De Guzman',
        userrole: 'Administrator'
      },
    ];
  
    const toggleNotifications = () => {
      setShowNotifications(!showNotifications);
      setShowProfile(false);
    };
  
    const toggleProfile = () => {
      setShowProfile(!showProfile);
      setShowNotifications(false);
    };

    return (
        <div className="header-main">
          <div className="settings-search-master">
            <div className="dropdown-and-iconic">
              <div className="iconic-side">
                <Link to='/systemSettings' className="settings">
                  <Gear size={35} />
                </Link>
                <div className="notification-wrapper" ref={notificationRef}>
                  <button className="notification" onClick={toggleNotifications}>
                    <Bell size={35} />
                  </button>
                  {showNotifications && (
                    <div className="notification-drop-down">
                      <div className="notification-triangle"></div>
                      <div className="notification-header">Notifications</div>
                      <div className="notification-content">
                        {data.map((item, index) => (
                          <div key={index} className="notification-item">
                            <div className="notif-icon">
                              {item.notification === 'Low Stock Alert' ? (
                                <ChartLineDown size={32} style={{ color: 'red' }} />
                              ) : (
                                item.notification === 'Request Rejustification' || item.notification === 'Request Rejected' ? (
                                  <BellRinging size={32} style={{ color: 'red' }} />
                                ) : (
                                  <BellRinging size={32} style={{ color: 'blue' }} />
                                )
                              )}
                            </div>
                            <div className="notif-container">
                              <div className="notif" style={{ color: (item.notification === 'Request Rejustification' || item.notification === 'Request Rejected') ? 'red' : 'inherit' }}>
                                {item.notification}
                              </div>
                              <div className="notif-content">{item.content}</div>
                              <div className="notif-date">{item.date}</div>
                            </div>
                            <div className="notif-close">
                              <XCircle size={15} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="clear-all">clear all</button>
                    </div>
                  )}
                </div>
                
                <div className="profile-wrapper" ref={profileRef}>
                  <button className="profile-pic" onClick={toggleProfile}>
                  <UserCircle size={35} style={{marginRight : '2px'}}/>
                  <h3>User Name</h3>
                  </button>
                  {showProfile && (
                    <div className="profile-drop-down">
                      <div className="profile-triangle"></div>
                      <div className="profile-header">
                      {profile.map((item) => (
                        <>
                          <div className="profile-username">
                            {item.username}
                          </div>
                          <div className="user-title">
                            {item.userrole}
                          </div>
                        </>
                        ))}
                      </div>
                      <div className="profile-content">
                        <button className='profile-card'>
                        <UserCircleGear size={25} style={{ marginRight: '10px' }} />Profile
                        </button>
                        <button className='profile-card'>
                        <Files size={25} style={{ marginRight: '10px' }} />Activity Logs
                        </button>
                        <button className='profile-card'>
                        <SignOut size={25} style={{ marginRight: '10px' }} />Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };    
  
  export default Header;
  