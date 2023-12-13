import React, { useEffect, useState } from "react";
import Sidebar from "../../../Sidebar/sidebar";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
// import Header from '../../../Sidebar/header';
import "../../../../assets/global/style.css";
import axios from "axios";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import BASE_URL from "../../../../assets/global/url";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faMagnifyingGlass, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'
// import Pagination from 'react-bootstrap/Pagination';
import {
  Gear,
  Bell,
  UserCircle,
  Plus,
  Trash,
  NotePencil,
  DotsThreeCircle,
  DotsThreeCircleVertical,
} from "@phosphor-icons/react";
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

function UserRole() {
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

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [rotatedIcons, setRotatedIcons] = useState(
    Array(role.length).fill(false)
  );
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

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
    axios
      .get(BASE_URL + "/userRole/fetchuserrole")
      .then((res) => {
        setRole(res.data);
      })
      .catch((err) => console.log(err));
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
            `${BASE_URL}/userRole/deleteRoleById/${param_id}`
          );

          if (response.status === 200) {
            swal({
              title: "The User Role has been deleted!",
              text: "The User Role has been updated successfully.",
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
    setVisibleButtons((prevVisibleButtons) => ({
      ...prevVisibleButtons,
      [userId]: !prevVisibleButtons[userId],
    }));
    setIsVertical((prevIsVertical) => ({
      ...prevIsVertical,
      [userId]: !prevIsVertical[userId],
    }));
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
      {/* <div className="left-of-main-containers">
        <Sidebar />
      </div> */}
      <div className="right-of-main-containers">
        <div className="right-body-contents">
          <div className="settings-search-master">
            <div className="dropdown-and-iconics">
              <div className="dropdown-side"></div>
              <div className="iconic-side">
                <div className="gearsides">
                  <Gear size={35} />
                </div>
                <div className="bellsides">
                  <Bell size={35} />
                </div>
                <div className="usersides">
                  <UserCircle size={35} />
                </div>
                <h3>User Name</h3>
              </div>
            </div>
          </div>{" "}
          {/*Setting search*/}
          <div className="Employeetext-button">
            <div className="employee-and-button">
              <div className="emp-text-side">
                <p>User Role</p>
              </div>

              <div className="button-create-side">
                <div className="Buttonmodal-new">
                  <Link
                    to="/createRole"
                    className="button">
                    <span style={{}}>
                      <Plus size={25} />
                    </span>
                    Create New
                  </Link>
                </div>
              </div>
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
                <tbody>
                  {role.map((data, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "even-row" : "odd-row"}>
                      <td>{data.col_rolename}</td>
                      <td className="autho">{data.col_authorization}</td>
                      <td>{data.col_desc}</td>
                      <td>{formatDate(data.createdAt)}</td>
                      <td>{formatDate(data.updatedAt)}</td>
                      <td>
                        {/* Render the icon based on the state */}
                        {/* Render the icon based on the state */}
                        {isVertical[data.col_id] ? (
                          <DotsThreeCircle
                            size={32}
                            className="dots-icon"
                            onClick={() => {
                              toggleButtons(data.col_id);
                            }}
                            style={{
                              transition:
                                "transform 0.3s ease-in-out, color 0.3s ease-in-out",
                            }}
                          />
                        ) : (
                          <DotsThreeCircleVertical
                            size={32}
                            className="dots-icon"
                            onClick={() => {
                              toggleButtons(data.col_id);
                            }}
                            style={{
                              transition:
                                "transform 0.3s ease-in-out, color 0.3s ease-in-out",
                            }}
                          />
                        )}

                        <div>
                          {setButtonVisibles(data.col_id) && (
                            <div
                              className="choices"
                              style={{ position: "absolute" }}>
                              <button>
                                <Link
                                  to={`/editRole/${data.col_id}`}
                                  style={{
                                    color: "black",
                                    textDecoration: "none",
                                  }}>
                                  Update
                                </Link>
                              </button>
                              <button
                                className="btn"
                                onClick={() => {
                                  handleDelete(data.col_id);
                                  closeVisibleButtons();
                                }}>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                        {/* <DotsThreeCircle
                          size={32}
                          className="dots-icon"
                          style={{
                            cursor: "pointer",
                            transform: `rotate(${
                              rotatedIcons[i] ? "90deg" : "0deg"
                            })`,
                            color: rotatedIcons[i] ? "#666" : "#000",
                            transition:
                              "transform 0.3s ease-in-out, color 0.3s ease-in-out",
                          }}
                          onClick={(event) => toggleDropdown(event, i)}
                        />
                        <div
                          className="choices"
                          style={{
                            position: "fixed",
                            top: dropdownPosition.top - 30 + "px",
                            left: dropdownPosition.left - 100 + "px",
                            opacity: showDropdown ? 1 : 0,
                            visibility: showDropdown ? "visible" : "hidden",
                            transition:
                              "opacity 0.3s ease-in-out, visibility 0.3s ease-in-out",
                            boxShadow: "0 3px 5px rgba(0, 0, 0, 0.2)",
                          }}>
                          <button>
                            <Link
                              to={`/editRole/${data.col_id}`}
                              style={{
                                color: "black",
                                textDecoration: "none",
                              }}>
                              Update
                            </Link>
                          </button>
                          <button
                            className="btn"
                            onClick={() => {
                              handleDelete(data.col_id);
                            }}>
                            Delete
                          </button>
                        </div> */}
                      </td>
                      {/* <td>
                                  <button className='btn'>
                                    <Link to={`/editRole/${data.col_id}`} style={{ color: "black" }}><NotePencil size={25} /></Link>
                                  </button>
                                  <button className='btn' onClick={() => handleDelete(data.col_id)}><Trash size={25} color="#e60000" /></button>
                                </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="pagination-contains"></div>
        </div>
      </div>
    </div>
  );
}

export default UserRole;
