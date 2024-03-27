import React, { useEffect, useState } from "react";
import ReactLoading from 'react-loading';
import Sidebar from "../../../Sidebar/sidebar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "../../../../assets/global/style.css";
import NoData from '../../../../assets/image/NoData.png';
import NoAccess from '../../../../assets/image/NoAccess.png';
import axios from "axios";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import BASE_URL from "../../../../assets/global/url";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import {
  Plus,
  DotsThreeCircle,
  DotsThreeCircleVertical,
} from "@phosphor-icons/react";
import { jwtDecode } from "jwt-decode";

import "../../../../assets/skydash/vendors/feather/feather.css";
import "../../../../assets/skydash/vendors/css/vendor.bundle.base.css";
import "../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css";
import "../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
import "../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css";
import "../../../../assets/skydash/css/vertical-layout-light/style.css";
import "../../../../assets/skydash/vendors/js/vendor.bundle.base";
import "../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
import "../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4";
import "../../../../assets/skydash/js/off-canvas";

import * as $ from "jquery";
import Header from "../../../../partials/header";

function UserRole({ authrztn }) {
  function formatDate(isoDate) {
    const date = new Date(isoDate);
    return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(
      date.getDate()
    )} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(
      date.getSeconds()
    )}`;
  }

  function padZero(num) {
    return num.toString().padStart(2, "0");
  }

  const [role, setRole] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [Fname, setFname] = useState('');
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userId, setuserId] = useState('');
  const [rotatedIcons, setRotatedIcons] = useState(
    Array(role.length).fill(false)
  );


  const decodeToken = () => {
    var token = localStorage.getItem('accessToken');
    if(typeof token === 'string'){
    var decoded = jwtDecode(token);
    setUsername(decoded.username);
    setFname(decoded.Fname);
    setUserRole(decoded.userrole);
    setuserId(decoded.id);
    }
  }

  useEffect(() => {
    decodeToken();
  }, [])

  const toggleDropdown = (event, index) => {
    // Check if the clicked icon is already open, close it
    if (index === openDropdownIndex) {
      setRotatedIcons((prevRotatedIcons) => {
        const newRotatedIcons = [...prevRotatedIcons];
        newRotatedIcons[index] = !newRotatedIcons[index];
        return newRotatedIcons;
      });
      setShowDropdown(false);
      setOpenDropdownIndex(null);
    } else {
      // If a different icon is clicked, close the currently open dropdown and open the new one
      setRotatedIcons(Array(role.length).fill(false));
      const iconPosition = event.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: iconPosition.bottom + window.scrollY,
        left: iconPosition.left + window.scrollX,
      });
      setRotatedIcons((prevRotatedIcons) => {
        const newRotatedIcons = [...prevRotatedIcons];
        newRotatedIcons[index] = true;
        return newRotatedIcons;
      });
      setShowDropdown(true);
      setOpenDropdownIndex(index);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/userRole/fetchuserrole")
      .then((res) => {
        setRole(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err)
        setIsLoading(false);
      });
    }, 1000);

    return () => clearTimeout(delay);
  }, []);

  const fetch = () => {
    axios
      .get(BASE_URL + "/userRole/fetchuserrole")
      .then((res) => {
        setRole(res.data);
      })
      .catch((err) => console.log(err));
  };
  console.log(role);

  const handleDelete = async (param_id) => {
    console.log("Deleting role with ID:", param_id);
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this role!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await axios.delete(
            `${BASE_URL}/userRole/deleteRoleById/${param_id}?userId=${userId}`
          );

          if (response.status === 200) {
            swal({
              title: "User Role Delete Successful!",
              text: "The User Role has been Deleted Successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              fetch();
            });
          } else if (response.status === 202) {
            swal({
              icon: "error",
              title: "Delete Prohibited",
              text: "You cannot delete User Role that is used",
            });
          } else {
            swal({
              icon: "error",
              title: "Something went wrong",
              text: "Please contact our support",
            });
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        swal({
          title: "Cancelled Successfully",
          text: "Role is Safe",
          icon: "success",
        });
      }
    });
  };

  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($("#order-listing").length > 0 && role.length > 0) {
      $("#order-listing").DataTable();
    }
  }, [$("#order-listing"), role]);
  const [visibleButtons, setVisibleButtons] = useState({}); // Initialize as an empty object
  const [isVertical, setIsVertical] = useState({}); // Initialize as an empty object

  const toggleButtons = (userId) => {
    setVisibleButtons((prevVisibleButtons) => {
      const updatedVisibleButtons = { ...prevVisibleButtons };

      // Close buttons for other items
      Object.keys(updatedVisibleButtons).forEach((key) => {
        if (key !== userId) {
          updatedVisibleButtons[key] = false;
        }
      });

      // Toggle buttons for the clicked item
      updatedVisibleButtons[userId] = !prevVisibleButtons[userId];

      return updatedVisibleButtons;
    });

    setIsVertical((prevIsVertical) => {
      const updateVertical = { ...prevIsVertical };

      Object.keys(updateVertical).forEach((key) => {
        if (key !== userId) {
          updateVertical[key] = false;
        }
      });

      // Toggle buttons for the clicked item
      updateVertical[userId] = !prevIsVertical[userId];

      return updateVertical;
    });
  };

  const closeVisibleButtons = () => {
    setVisibleButtons({});
    setIsVertical({});
  };
  const setButtonVisibles = (userId) => {
    return visibleButtons[userId] || false; // Return false if undefined (closed by default)
  };

  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
              {isLoading ? (
                <div className="loading-container">
                  <ReactLoading className="react-loading" type={'bubbles'}/>
                  Loading Data...
                </div>
              ) : (
                authrztn.includes('User Access Role - View') ? (
        <div className="right-body-contents">
          {/*Setting search*/}
          <div className="Employeetext-button">
            <div className="employee-and-button">
              <div className="emp-text-side">
                <p>User Role</p>
              </div>

              { authrztn.includes('User Access Role - Add') && (
              <div className="button-create-side">
                <div className="Buttonmodal-new">
                  <Link to="/createRole" className="button">
                    <span style={{}}>
                      <Plus size={25} />
                    </span>
                    Create New
                  </Link>
                </div>
              </div>
              )}
            </div>
          </div>{" "}
          {/*Employeetext-button*/}
          <div className="table-containss">
            <div className="main-of-all-tables">
              <table id="order-listing">
                <thead>
                  <tr>
                    <th className="tableh">Role Name</th>
                    <th className="tableh">Features</th>
                    <th className="tableh"> Description</th>
                    <th className="tableh">Date Created</th>
                    <th className="tableh">Date Modified</th>
                    <th className="tableh">Action</th>
                  </tr>
                </thead>
                {role.length > 0 ? (
                <tbody>
                  {role.map((data, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "even-row" : "odd-row"}>
                      <td>{data?.col_rolename}</td>
                      <td className="autho">{data?.col_authorization}</td>
                      <td>{data?.col_desc}</td>
                      <td>{formatDate(data?.createdAt)}</td>
                      <td>{formatDate(data?.updatedAt)}</td>
                      <td>
                      {isVertical[data.col_id] ? (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <DotsThreeCircleVertical
                            size={32}
                            className="dots-icon"
                            onClick={() => {
                              toggleButtons(data.col_id);
                            }}
                          />
                          <div className="float" style={{ position: 'absolute', left: '-125px', top: '0' }}>
                            {setButtonVisibles(data.col_id) && (
                              <div className="choices">
                                  <button>
                                  { authrztn.includes('User Access Role - Edit') && (
                                  <Link
                                    to={`/editRole/${data.col_id}`}
                                    style={{
                                      color: "black",
                                      textDecoration: "none",
                                    }}>
                                    Update
                                  </Link>
                                   )}
                                  </button>
                                  { authrztn?.includes('User Access Role - Delete') && (
                                  <button
                                    className="btn"
                                    onClick={() => {
                                      handleDelete(data.col_id);
                                      closeVisibleButtons();
                                    }}>
                                    Delete
                                  </button>
                                  )}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <DotsThreeCircle
                            size={32}
                            className="dots-icon"
                            onClick={() => {
                              toggleButtons(data.col_id);
                            }}
                          />
                          <div className="float" style={{ position: 'absolute', left: '-50px', top: '0' }}>
                            {setButtonVisibles(data.col_id) && (
                              <div className="choices">
                                  <button>
                                  { authrztn.includes('User Access Role - Edit') && (
                                  <Link
                                    to={`/editRole/${data.col_id}`}
                                    style={{
                                      color: "black",
                                      textDecoration: "none",
                                    }}>
                                    Update
                                  </Link>
                                   )}
                                  </button>
                                  {authrztn.includes('User Access Role - Delete') && (
                                  <button
                                  className="btn"
                                  onClick={() => {
                                    handleDelete(data.col_id);
                                    closeVisibleButtons();
                                  }}>
                                    Delete
                                  </button>
                                   )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                  ) : (
                    <div className="no-data">
                      <img src={NoData} alt="NoData" className="no-data-img" />
                      <h3>
                        No Data Found
                      </h3>
                    </div>
                )}
              </table>
            </div>
          </div>
          <div className="pagination-contains"></div>
        </div>
            ) : (
              <div className="no-access">
                <img src={NoAccess} alt="NoAccess" className="no-access-img"/>
                <h3>
                  You don't have access to this function.
                </h3>
              </div>
            )
          )}
      </div>
    </div>
  );
}

export default UserRole;
