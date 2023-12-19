import React, { useState, useEffect, useRef } from 'react';
import { Bell,  
  ChartLineDown, 
  Files, 
  Gear, 
  SignOut, 
  UserCircle, 
  UserCircleGear,   
  UserList,
  BookOpenText,
  ClipboardText,
  Moped,
  AlignLeft   } from '@phosphor-icons/react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../assets/global/url';
import '../styles/react-style.css'

const Header = () => {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const notificationRef = useRef(null);
    const profileRef = useRef(null);
    const [prhistory, setprhistory] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);


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
  
    useEffect(() => {
      axios.get(BASE_URL + '/PR_history/fetchPRhistory')
        .then(res => {
          setprhistory(res.data);
          const unreadCount = res.data.filter(notification => !notification.isRead).length;
          setUnreadNotifications(unreadCount);
        })
        .catch(err => console.log(err));
    }, []);


    
    const getStatusNotification = (status) => {
      switch (status) {
        case 'Low Stock':
          return {
            icon: <ChartLineDown size={32} style={{ color: 'blue' }} />,
            notification: 'Low Stock Level',
            content: 'The stock is low',
          };
        case 'For-Approval':
          return {
            icon: <ClipboardText size={32} style={{ color: 'blue' }} />,
            notification: 'New Purchase Request',
            content: 'New purchase request has been requested',
          };
        case 'For-Canvassing':
          return {
            icon: <BookOpenText size={32} style={{ color: 'blue' }} />,
            notification: 'New For Canvassing',
            content: 'The Purchase Request is Moved into For-Canvassing',
          };
        case 'For-Approval (PO)':
          return {
            icon: <UserList size={32} style={{ color: 'blue' }} />,
            notification: 'New Purchase Order Request',
            content: 'New Purchase Order Request has been requested',
          };
        // case 'To-Receive':
        //   return {
        //     icon: <Moped size={32} style={{ color: 'blue' }} />,
        //     notification: 'Product to be Received',
        //     content: 'The Product is about to Receive',
        //   };
          case 'For-Rejustify':
            return {
              icon: <AlignLeft size={32} style={{ color: 'blue' }} />,
              notification: 'Product For-Rejustify',
              content: 'The Product is about to Rejustify',
            };
        default:
          return null;
      }
    };
    

    const formatCreatedAt = (createdAt) => {
      const createdDate = new Date(createdAt);
      const now = new Date();
    
      // Check if the date is today
      if (
        createdDate.getDate() === now.getDate() &&
        createdDate.getMonth() === now.getMonth() &&
        createdDate.getFullYear() === now.getFullYear()
      ) {
        // Format time as "hh:mm A"
        const hours = createdDate.getHours();
        const minutes = createdDate.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
    
        return `(Today, ${formattedTime})`;
      }
    
      // Check if the date is yesterday
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
    
      if (
        createdDate.getDate() === yesterday.getDate() &&
        createdDate.getMonth() === yesterday.getMonth() &&
        createdDate.getFullYear() === yesterday.getFullYear()
      ) {
        return '(Yesterday)';
      }
    
      // Calculate the difference in days
      const timeDifference = now.getTime() - createdDate.getTime();
      const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    
      return `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`;
    };

    const formatDate = (createdAt) => {
      return formatCreatedAt(createdAt);
    };
    
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

    const handleNotificationClick = (pr_id) => {
      axios.put(BASE_URL + `/PR_history/markAsRead/${pr_id}`)
        .then(() => {
          // Update the local state to mark the notification as read
          setprhistory(prevNotifications => prevNotifications.map(notification =>
            notification.pr_id === pr_id ? { ...notification, isRead: true } : notification
          ));
          setUnreadNotifications(prevUnreadNotifications => Math.max(0, prevUnreadNotifications - 1));
        })
        .catch(err => console.error(err));
    };

    return (
        <div className="header-main">
          <div className="settings-search-master">
            <div className="dropdown-and-iconic">
              <div className="iconic-side">
                <button onClick={() => navigate(`/SettingView/1`)} className="settings">
                  <Gear size={35} />
                </button>
                <div className="notification-wrapper" ref={notificationRef}>
                      <button className="notification" onClick={toggleNotifications}>
                        <Bell size={35} />
                        {unreadNotifications > 0 && <div className="notification-indicator"></div>}
                      </button>
                      {showNotifications && (
                        <div className="notification-drop-down">
                          <div className="notification-triangle"></div>
                          <div className="notification-header">Notifications</div>
                          <div className="notification-content">
                            {prhistory.map((item, index) => {
                              const statusNotification = getStatusNotification(item.status);
                              if (statusNotification) {
                                return (
                                  <div key={index} className="notification-item"  
                                  onClick={() => {
                                    navigate(`/PRredirect/${item.pr_id}`);
                                    handleNotificationClick(item.pr_id);
                                  }}
                                  style={{cursor: 'pointer'}}>
                                    <div className="notif-icon">
                                      {statusNotification.icon}
                                    </div>

                                    <div className="notif-container">
                                      <div className="notif" style={{ color: (statusNotification.notification === 'Request Rejustification' || statusNotification.notification === 'Request Rejected') ? 'red' : 'inherit' }}>
                                        {statusNotification.notification}
                                      </div>
                                      <div className="notif-content">{statusNotification.content}</div>
                                      <div className="notif-date">{formatDate(item.createdAt)}</div>
                                    </div>
                                    <div className="notif-close">
                                      {/* <XCircle size={20} /> */}
                                    </div>
                                  </div>
                                );
                              } else {
                                return null;
                              }
                            })}
                          </div>
                          {/* <button className="clear-all">clear all</button> */}
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
                        <Link to='/profileSettings' className='profile-card'>
                        <UserCircleGear size={25} style={{ marginRight: '10px' }} />Profile
                        </Link>
                        <button className='profile-card'>
                        <Files size={25} style={{ marginRight: '10px' }} />Activity Logs
                        </button>
                        <Link to={'/'} className='profile-card' onClick={() => { localStorage.removeItem('accessToken') }}>
                        <SignOut size={25} style={{ marginRight: '10px' }} />Logout
                        </Link>
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
  