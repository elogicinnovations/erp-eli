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
import { IconButton, TextField, TablePagination, } from '@mui/material';

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
  const [role, setRole] = useState([]);
  const [searchRole, setSearchRole] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [Fname, setFname] = useState('');
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userId, setuserId] = useState('');
  const [rotatedIcons, setRotatedIcons] = useState(Array(role.length).fill(false));
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(role.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, role.length);
  const currentItems = role.slice(startIndex, endIndex);

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
        setSearchRole(res.data);
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

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredData = searchRole.filter((data) => {
      return (
        data.col_rolename.toLowerCase().includes(searchTerm) ||
        (typeof data.col_authorization === 'string' && data.col_authorization.toLowerCase().includes(searchTerm)) ||
        formatDate(data.createdAt).toLowerCase().includes(searchTerm) ||
        formatDate(data.updatedAt).toLowerCase().includes(searchTerm) ||
        data.col_desc.toLowerCase().includes(searchTerm)
      );
    });
  
    setRole(filteredData);
  };
  


  function formatDate(datetime) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(datetime).toLocaleString("en-US", options);
  }

  const handleDelete = async (param_id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data.",
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
              title: "User Access Role Deleted Successfully!",
            text: "The user access role has been deleted successfully.",
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
      }
    });
  };

  // useEffect(() => {
  //   // Initialize DataTable when role data is available
  //   if ($("#order-listing").length > 0 && role.length > 0) {
  //     $("#order-listing").DataTable();
  //   }
  // }, [$("#order-listing"), role]);


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
            <TextField
              label="Search"
              variant="outlined"
              style={{ marginBottom: '10px', 
              float: 'right',
              }}
              InputLabelProps={{
                style: { fontSize: '14px'},
              }}
              InputProps={{
                style: { fontSize: '14px', width: '250px', height: '50px' },
              }}
              onChange={handleSearch}/>
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
                  {currentItems.map((data, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "even-row" : "odd-row"}>
                      <td>{data.col_rolename}</td>
                      <td className="autho">{data.col_authorization}</td>
                      <td>{data.col_desc}</td>
                      <td>{formatDate(data.createdAt)}</td>
                      <td>{formatDate(data.updatedAt)}</td>
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
          <nav style={{marginTop: '15px'}}>
            <ul className="pagination" style={{ float: "right" }}>
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button
                type="button"
                style={{fontSize: '14px',
                cursor: 'pointer',
                color: '#000000',
                textTransform: 'capitalize',
              }}
                className="page-link" 
                onClick={() => setCurrentPage((prevPage) => prevPage - 1)}>Previous</button>
              </li>
              {[...Array(totalPages).keys()].map((num) => (
                <li key={num} className={`page-item ${currentPage === num + 1 ? "active" : ""}`}>
                  <button 
                  style={{
                    fontSize: '14px',
                    width: '25px',
                    background: currentPage === num + 1 ? '#FFA500' : 'white',
                    color: currentPage === num + 1 ? '#FFFFFF' : '#000000', 
                    border: 'none',
                    height: '28px',
                  }}
                  className={`page-link ${currentPage === num + 1 ? "gold-bg" : ""}`} onClick={() => setCurrentPage(num + 1)}>{num + 1}</button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button
                style={{fontSize: '14px',
                cursor: 'pointer',
                color: '#000000',
                textTransform: 'capitalize'}}
                className="page-link" onClick={() => setCurrentPage((prevPage) => prevPage + 1)}>Next</button>
              </li>
            </ul>
          </nav>
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
