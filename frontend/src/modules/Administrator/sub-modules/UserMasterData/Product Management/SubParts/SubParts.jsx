import React, { useEffect, useState } from "react";
import Sidebar from "../../../../../Sidebar/sidebar";
import "../../../../../../assets/global/style.css";
import "../../../../styles/react-style.css";
import { Link } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../../../../assets/global/url";
import Button from "react-bootstrap/Button";
import swal from "sweetalert";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import {
  MagnifyingGlass,
  Gear,
  Bell,
  UserCircle,
  Plus,
  Trash,
  NotePencil,
  DotsThreeCircle,
  DotsThreeCircleVertical,
} from "@phosphor-icons/react";
// import "../../../../../assets/skydash/vendors/feather/feather.css";
// import "../../../../../assets/skydash/vendors/css/vendor.bundle.base.css";
// import "../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css";
// import "../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
// import "../../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css";
// import "../../../../../assets/skydash/css/vertical-layout-light/style.css";
// import "../../../../../assets/skydash/vendors/js/vendor.bundle.base";
// import "../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
// import "../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4";
// import "../../../../../assets/skydash/js/off-canvas";

import * as $ from "jquery";
import Header from "../../../../../../partials/header";
import { jwtDecode } from "jwt-decode";

function SubParts({ authrztn }) {
  const [subParts, setSubParts] = useState([]);
  const [supplier, setSupplier] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [rotatedIcons, setRotatedIcons] = useState(
    Array(subParts.length).fill(false)
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
      setRotatedIcons(Array(subParts.length).fill(false));
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
      .get(BASE_URL + "/supplier/fetchTable")
      .then((response) => {
        setSupplier(response.data);
      })
      .catch((error) => {
        console.error("Error fetching suppliers:", error);
      });
  }, []);

  const reloadTable = () => {
    axios
      .get(BASE_URL + "/subPart/fetchTable")
      .then((res) => setSubParts(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    reloadTable();
  }, []);

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

  const [updateFormData, setUpdateFormData] = useState({
    id: null,
    subPart_name: "",
    supplier: "",
    subPart_desc: "",
    updatedAt: "",
    subPart_code: "",
  });

  const handleDelete = async (table_id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this user file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await axios.delete(
            BASE_URL + `/subPart/delete/${table_id}`
          );
          if (response.status === 200) {
            swal({
              title: "Product Sub-Parts Delete Successful!",
              text: "The Product Sub-Parts has been Deleted Successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              reloadTable();
            });
          } else if (response.status === 202) {
            swal({
              icon: "error",
              title: "Delete Prohibited",
              text: "You cannot delete Sub Part that is used",
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

  React.useEffect(() => {
    if ($("#order-listing").length > 0 && subParts.length > 0) {
      $("#order-listing").DataTable();
    }
  }, [subParts]);

  return (
    <div className="main-of-containers">
      {/* <div className="left-of-main-containers">
        <Sidebar />
      </div> */}
      <div className="right-of-main-containers">
        <div className="right-body-contents">
          {/* <div className="settings-search-master">
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
                <div className="username">
                  <h3>User Name</h3>
                </div>
              </div>
            </div>
          </div> */}
          <div className="Employeetext-button">
            <div className="employee-and-button">
              <div className="emp-text-side">
                <p>Sub Parts</p>
              </div>

              <div className="button-create-side">
                <div className="Buttonmodal-new">

                    {authrztn?.includes('Sub-Part - Add') && (
                  <Link to="/createsubParts" className="button">
                    <span style={{}}>
                      <Plus size={25} />
                    </span>
                    New Product
                  </Link>
                    )}

                </div>
              </div>
            </div>
          </div>
          <div className="table-containss">
            <div className="main-of-all-tables">
              <table id="order-listing">
                <thead>
                  <tr>
                    <th className="tableh">Code</th>
                    <th className="tableh">Sub Parts Name</th>
                    <th className="tableh">Details</th>
                    <th className="tableh">Date Created</th>
                    <th className="tableh">Date Modified</th>
                    <th className="tableh">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subParts.map((data, i) => (
                    <tr key={i}>
                      <td>{data.subPart_code}</td>
                      <td>{data.subPart_name}</td>
                      <td>{data.subPart_desc}</td>
                      <td>{formatDate(data.createdAt)}</td>
                      <td>{formatDate(data.updatedAt)}</td>
                      <td>
                        {" "}
                        {isVertical[data.subPart_code] ? (
                          <DotsThreeCircleVertical
                            size={32}
                            className="dots-icon"
                            onClick={() => {
                              toggleButtons(data.subPart_code);
                            }}
                          />
                        ) : (
                          <DotsThreeCircle
                            size={32}
                            className="dots-icon"
                            onClick={() => {
                              toggleButtons(data.subPart_code);
                            }}
                          />
                        )}
                        <div>
                          {setButtonVisibles(data.subPart_code) && (
                            <div
                              className="choices"
                              style={{ position: "absolute" }}>
                              { authrztn?.includes('Sub-Part - Edit') && (
                              <Link
                                to={`/updatesubParts/${data.id}`}
                                style={{ fontSize: "12px" }}
                                className="btn">
                                Update
                              </Link>
                              )}

                              { authrztn?.includes('Sub-Part - Delete') && (
                              <button
                                onClick={() => {
                                  handleDelete(data.id);
                                  closeVisibleButtons();
                                }}
                                className="btn">
                                Delete
                              </button>
                              )}

                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubParts;
