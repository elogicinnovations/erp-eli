import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  WarningCircle,
  Files,
  Gear,
  SignOut,
  UserCircle,
  UserCircleGear,
  UserList,
  BookOpenText,
  ClipboardText,
  Moped,
  AlignLeft,
  ShoppingCart,
  Scales  
} from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../assets/global/url";
import "../styles/react-style.css";
import { jwtDecode } from "jwt-decode";
import swal from "sweetalert";

const Header = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const [prhistory, setprhistory] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadLowStockNotifications, setunreadLowStockNotifications] = useState(0);
  const [lowStocknotif, setlowStocknotif] = useState([]);
  const [noMovementStatus, setNoMovementStatus] = useState([]);
  //code for fetching the user login info

  const [Fname, setFname] = useState("");
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setuserId] = useState("");

  const decodeToken = () => {
    var token = localStorage.getItem("accessToken");
    if (typeof token === "string") {
      var decoded = jwtDecode(token);
      setUsername(decoded.username);
      setFname(decoded.Fname);
      setUserRole(decoded.userrole);
      setuserId(decoded.id);
    }
  };
  // const navigate = useNavigate()
  useEffect(() => {
    decodeToken();
  }, []);

  const handleLogout = async () => {
    swal({
      title: "Are you sure?",
      text: "Once you log out, you will redirect on login",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        localStorage.removeItem("accessToken");
        await axios
          .post(`${BASE_URL}/masterList/logout`, {
            userId,
          })
          .then((res) => {
            if (res.status === 200) {
              swal({
                text: "Log out Success!",
                icon: "success",
                button: "OK",
              }).then(() => {
                navigate("/");
              });
            } else if (res.status === 201) {
              swal({
                title: "Log out Denied",
                text: "Try to log out again",
                icon: "error",
                button: "OK",
              });
            }
          })
          .catch((error) => {
            console.error(error.response.data);
            swal({
              title: "Something Went Wrong",
              text: "Please contact our support team",
              icon: "error",
            }).then(() => {});
          });
      }
    });
  };

  //end code for fetching the user login info

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
        setShowProfile(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/PR_history/fetchPRhistory")
      .then((res) => {
        setprhistory(res.data);
        const unreadCount = res.data.filter(
          (notification) => !notification.isRead
        ).length;
        setUnreadNotifications(unreadCount);
      })
      .catch((err) => console.log(err));
  }, []);
  
  useEffect(() => {
    axios
      .get(BASE_URL + "/PR_history/LowOnstockProduct")
      .then((res) => {
        setlowStocknotif(res.data);
        // const unreadCount = res.data.filter(
        //   (notification) => !notification.isRead
        // ).length;
        // setunreadLowStockNotifications(unreadCount);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/PR_history/NomovementNotification")
      .then((res) => {
        setNoMovementStatus(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const getStatusNotification = (status) => {
    switch (status) {
      case "For-Approval":
        return {
          icon: <ClipboardText size={32} style={{ color: "blue" }} />,
          notification: "New Purchase Request",
          content: "New purchase request has been requested",
        };
      case "For-Canvassing":
        return {
          icon: <BookOpenText size={32} style={{ color: "blue" }} />,
          notification: "New For Canvassing",
          content: "The Purchase Request is Moved into For-Canvassing",
        };
      case "On-Canvass":
      return {
        icon: <ShoppingCart size={32} style={{ color: "blue" }} />,
        notification: "Product On-Canvass",
        content: "The Purchase Request is Moved into On-Canvass",
      };
      case "For-Approval (PO)":
        return {
          icon: <UserList size={32} style={{ color: "blue" }} />,
          notification: "New Purchase Order",
          content: "New Purchase Order Request has been requested",
        };
      case "For-Rejustify (PO)":
        return {
          icon: <Scales size={32} style={{ color: "blue" }} />,
          notification: "Purchase Order For-Rejustify",
          content: "The Purchase Order is about to Rejustify",
        };
      case "For-Rejustify":
        return {
          icon: <AlignLeft size={32} style={{ color: "blue" }} />,
          notification: "Product For-Rejustify",
          content: "The Product is about to Rejustify",
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
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedTime = `${hours % 12 || 12}:${
        minutes < 10 ? "0" : ""
      }${minutes} ${ampm}`;

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
      return "(Yesterday)";
    }

    // Calculate the difference in days
    const timeDifference = now.getTime() - createdDate.getTime();
    const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return `${daysAgo} ${daysAgo === 1 ? "day" : "days"} ago`;
  };

  const formatDate = (createdAt) => {
    return formatCreatedAt(createdAt);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowNotifications(false);
  };

  const handleNotificationClick = (pr_id) => {
    axios
      .put(BASE_URL + `/PR_history/markAsRead/${pr_id}`)
      .then(() => {
        // Update the local state to mark the notification as read
        setprhistory((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.pr_id === pr_id
              ? { ...notification, isRead: true }
              : notification
          )
        );
        setUnreadNotifications((prevUnreadNotifications) =>
          Math.max(0, prevUnreadNotifications - 1)
        );
      })
      .catch((err) => console.error(err));
  };

  const handleLowstockNotification = (invId, type) => {
    const inventoryID = invId;
    const typeofProduct = type;
    // axios
    //   .put(BASE_URL + `/PR_history/markLowStockAsRead/${inventoryID}`, { typeofProduct })
    //   .then(() => {
    //     // Update the local state to mark the notification as read
    //     setlowStocknotif((prevNotifications) =>
    //       prevNotifications.map((notification) =>
    //         notification.invId === invId
    //           ? { ...notification, isRead: true }
    //           : notification
    //       )
    //     );
    //     setunreadLowStockNotifications((prevUnreadNotifications) =>
    //       Math.max(0, prevUnreadNotifications - 1)
    //     );

        // Navigate based on typeofProduct
        switch (typeofProduct) {
          case 'product':
            navigate(`/viewInventory/${invId}`);
            break;
          case 'assembly':
            navigate(`/viewAssembly/${invId}`);
            break;
          case 'spare':
            navigate(`/viewSpare/${invId}`);
            break;
          case 'subpart':
            navigate(`/viewSubpart/${invId}`);
            break;
          default:
            break;
        }
      // })
      // .catch((err) => console.error(err));
  };
  
  return (
    <div className="header-main">
      <div className="settings-search-master">
        <div className="dropdown-and-iconic">
          <div className="iconic-side">
            <button
              onClick={() => navigate(`/SettingView/1`)}
              className="settings"
            >
              <Gear size={35} />
            </button>
            <div className="notification-wrapper" ref={notificationRef}>
            <button className="notification" onClick={toggleNotifications}>
              <Bell size={35} />
              {/* {(unreadNotifications > 0 || unreadLowStockNotifications > 0) && (
                <div className="notification-indicator">
                </div>
              )} */}
              {(unreadNotifications > 0 && (
              <div className="notification-indicator">
              </div>  
            ))}
            </button>
              {showNotifications && (
                <div className="notification-drop-down">
                  <div className="notification-triangle"></div>
                  <div className="notification-header">Notifications</div>
                  <div className="notification-content">
                    {prhistory.length === 0 && lowStocknotif.length === 0 && noMovementStatus.length === 0 ? (
                      <div className="empty-notification" style={{ fontSize: "16px" }}>
                        No Notifications Yet
                      </div>
                    ) : (
                      <>
                        {prhistory.map((item, index) => {
                          const statusNotification = getStatusNotification(item.status);
                          if (statusNotification) {
                            return (
                              <div
                                key={index}
                                className="notification-item"
                                onClick={() => {
                                  navigate(`/PRredirect/${item.pr_id}`);
                                  handleNotificationClick(item.pr_id);
                                }}
                                style={{ cursor: "pointer" }}
                              >
                                <div className="notif-icon">{statusNotification.icon}</div>
                                <div className="notif-container">
                                  <div
                                    className="notif"
                                    style={{
                                      color:
                                        statusNotification.notification === "Request Rejustification" ||
                                        statusNotification.notification === "Request Rejected"
                                          ? "red"
                                          : "inherit",
                                    }}
                                  >
                                    {statusNotification.notification}
                                  </div>
                                  <div className="notif-content">{statusNotification.content}</div>
                                  <div className="notif-date">{formatDate(item.createdAt)}</div>
                                </div>
                                <div className="notif-close"></div>
                              </div>
                            );
                          } else {
                            return null;
                          }
                        })}
                        {lowStocknotif.map((item, index) => (
                          <div
                            key={index}
                            className="notification-item"
                            onClick={() => {
                              handleLowstockNotification(item.invId, item.type);
                            }}
                            style={{ cursor: "pointer" }}>
                            <div className="notif-icon">
                              <WarningCircle size={32} color="#ff0000" />
                            </div>
                            <div className="notif-container">
                              <div className="notif">Low Stock Level</div>
                              <div className="notif-content">{`The stock for ${item.name} is low`}</div>
                              <div className="notif-date">{formatDate(new Date())}</div>
                            </div>
                            <div className="notif-close"></div>
                          </div>
                        ))}

                          {noMovementStatus.map((item, index) => (
                          <div
                            key={index}
                            className="notification-item"
                            onClick={() => {
                              // handleLowstockNotification(item.id);
                              navigate(`/PRredirect/${item.id}`);
                            }}
                            style={{ cursor: "pointer" }}>
                            <div className="notif-icon">
                              <WarningCircle size={32} color="#ff0000" />
                            </div>
                            <div className="notif-container">
                              <div className="notif">This Purchase Request has no update</div>
                              <div className="notif-content">{`The purchase request number ${item.pr_num} is no movement`}</div>
                              <div className="notif-date">{formatDate(item.createdAt)}</div>
                            </div>
                            <div className="notif-close"></div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="profile-wrapper" ref={profileRef}>
              <button className="profile-pic" onClick={toggleProfile}>
                <UserCircle size={35} style={{ marginRight: "2px" }} />
                <h3>
                  {username.length > 10
                    ? `${username.substring(0, 10)}...`
                    : username}
                </h3>
              </button>
              {showProfile && (
                <div className="profile-drop-down">
                  <div className="profile-triangle"></div>
                  <div className="profile-header">
                    <>
                      <div className="profile-username">
                        {Fname.length > 30
                          ? `${Fname.substring(0, 30)}...`
                          : Fname}
                      </div>
                      <div className="user-title">{userRole}</div>
                    </>
                  </div>
                  <div className="profile-content">
                    <Link to="/profileSettings" className="profile-card">
                      <UserCircleGear
                        size={25}
                        style={{ marginRight: "10px" }}
                      />
                      Profile
                    </Link>
                    <Link to="/activityLogs" className="profile-card">
                      <Files size={25} style={{ marginRight: "10px" }} />
                      Activity Logs
                    </Link>
                    <button className="profile-card" onClick={handleLogout}>
                      <SignOut size={25} style={{ marginRight: "10px" }} />
                      Logout
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
