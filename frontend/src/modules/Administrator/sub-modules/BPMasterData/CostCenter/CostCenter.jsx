import React, { useEffect, useState } from "react";
import Sidebar from "../../../../Sidebar/sidebar";
import "../../../../../assets/global/style.css";
import "../../../../styles/react-style.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import swal from "sweetalert";
import BASE_URL from "../../../../../assets/global/url";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

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

import * as $ from "jquery";
import Header from "../../../../../partials/header";

function CostCenter() {
  const [CostCenter, setCostCenter] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [rotatedIcons, setRotatedIcons] = useState(
    Array(CostCenter.length).fill(false)
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
      setRotatedIcons(Array(CostCenter.length).fill(false));
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

  // Fetch Data
  useEffect(() => {
    axios
      .get(BASE_URL + "/costCenter/getCostCenter")
      .then((res) => setCostCenter(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Artifitial data
  const [showModal, setShowModal] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setShowModal(false);
  };

  const handleShow = () => setShowModal(true);

  const handleModalToggle = () => {
    setUpdateModalShow(!updateModalShow);
  };

  const handleDelete = async (id) => {
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
            BASE_URL + `/costCenter/delete/${id}`
          );

          if (response.status === 200) {
            swal({
              title: "Cost Center Delete Successful!",
              text: "The Cost Center has been Deleted Successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              setCostCenter((prev) => prev.filter((data) => data.id !== id));
            });
          } else if (response.status === 202) {
            swal({
              icon: "error",
              title: "Delete Prohibited",
              text: "You cannot delete Cost Center that is used",
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
          text: "Cost Center not Deleted!",
          icon: "warning",
        });
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

  //search
  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($("#order-listing").length > 0 && CostCenter.length > 0) {
      $("#order-listing").DataTable();
    }
  }, [CostCenter]);

  //date format
  function formatDatetime(datetime) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(datetime).toLocaleString("en-US", options);
  }

  return (
    <div className="main-of-containers">
      {/* <div className="left-of-main-containers">
            <Sidebar/>
        </div> */}
      <div className="right-of-main-containers">
        <div className="right-body-contents">
          {/* <div className="settings-search-master">

                <div className="dropdown-and-iconics">
                    <div className="dropdown-side">

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
                          <h3>User Name</h3>
                        </div>
                    </div>
                </div>

                </div> */}
          <div className="Employeetext-button">
            <div className="employee-and-button">
              <div className="emp-text-side">
                <p>Cost Center</p>
              </div>

              <div className="button-create-side">
                <div className="Buttonmodal-new">
                  <Link
                    to="/createCostCenter"
                    onClick={handleShow}
                    className="button">
                    <span style={{}}>
                      <Plus size={25} />
                    </span>
                    Create New
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="table-containss">
            <div className="main-of-all-tables">
              <table className="table-hover" id="order-listing">
                <thead>
                  <tr>
                    <th className="tableh">ID</th>
                    <th className="tableh">Name</th>
                    <th className="tableh">Assigned User</th>
                    <th className="tableh">Contact #</th>
                    <th className="tableh">Status</th>
                    <th className="tableh">Date Created</th>
                    <th className="tableh">Date Modified</th>
                    <th className="tableh">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* <CostContext.Provider value={costData}> */}
                  {CostCenter.map((data, i) => (
                    <tr key={i}>
                      <td
                        onClick={() => navigate(`/viewCostCenter/${data.id}`)}>
                        {data.id}
                      </td>
                      <td
                        onClick={() => navigate(`/viewCostCenter/${data.id}`)}>
                        {data.name}
                      </td>
                      <td
                        onClick={() => navigate(`/viewCostCenter/${data.id}`)}>
                        {data.masterlist.col_Fname}
                      </td>
                      <td
                        onClick={() => navigate(`/viewCostCenter/${data.id}`)}>
                        {data.masterlist.col_phone}
                      </td>
                      <td
                        onClick={() => navigate(`/viewCostCenter/${data.id}`)}>
                        {data.status}
                      </td>
                      <td
                        onClick={() => navigate(`/viewCostCenter/${data.id}`)}>
                        {formatDatetime(data.createdAt)}
                      </td>
                      <td
                        onClick={() => navigate(`/viewCostCenter/${data.id}`)}>
                        {formatDatetime(data.updatedAt)}
                      </td>
                      <td>
                        {isVertical[data.id] ? (
                          <DotsThreeCircleVertical
                            size={32}
                            className="dots-icon"
                            onClick={() => {
                              toggleButtons(data.id);
                            }}
                          />
                        ) : (
                          <DotsThreeCircle
                            size={32}
                            className="dots-icon"
                            onClick={() => {
                              toggleButtons(data.id);
                            }}
                          />
                        )}
                        <div>
                          {setButtonVisibles(data.id) && (
                            <div
                              className="choices"
                              style={{ position: "absolute" }}>
                              <Link
                                to={`/initUpdateCostCenter/${data.id}`}
                                onClick={() => {
                                  handleModalToggle(data);
                                  closeVisibleButtons();
                                }}
                                style={{ fontSize: "12px" }}
                                className="btn">
                                Update
                              </Link>
                              <button
                                onClick={() => {
                                  handleDelete(data.id);
                                  closeVisibleButtons();
                                }}
                                className="btn">
                                Delete
                              </button>
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

export default CostCenter;
