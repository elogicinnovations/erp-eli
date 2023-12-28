import React, { useEffect, useState } from "react";
import Sidebar from "../../../../../Sidebar/sidebar";
import "../../../../../../assets/global/style.css";
import "../../../../styles/react-style.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../../../../assets/global/url";
import swal from "sweetalert";
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
import "../../../../../../assets/skydash/vendors/feather/feather.css";
import "../../../../../../assets/skydash/vendors/css/vendor.bundle.base.css";
import "../../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css";
import "../../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
import "../../../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css";
import "../../../../../../assets/skydash/css/vertical-layout-light/style.css";
import "../../../../../../assets/skydash/vendors/js/vendor.bundle.base";
import "../../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
import "../../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4";
import "../../../../../../assets/skydash/js/off-canvas";

import * as $ from "jquery";
import Header from "../../../../../../partials/header";
import { jwtDecode } from "jwt-decode";

function SpareParts({ authrztn }) {
  const [sparePart, setSparePart] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [rotatedIcons, setRotatedIcons] = useState(
    Array(sparePart.length).fill(false)
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
      setRotatedIcons(Array(sparePart.length).fill(false));
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

  const reloadTable = () => {
    axios
      .get(BASE_URL + "/sparePart/fetchTable")
      .then((res) => setSparePart(res.data))
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
  const handleDelete = async (table_id) => {
    try {
      const willDelete = await swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this product data!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });

      if (willDelete) {
        const response = await axios.delete(
          BASE_URL + `/sparePart/delete/${table_id}`
        );

        if (response.status === 200) {
          swal({
            title: "The Product Spare-Part Delete Succesful!",
            text: "The Product Spare-Part has been Deleted successfully.",
            icon: "success",
            button: "OK",
          }).then(() => {
            reloadTable();
          });
        } else if (response.status === 202) {
          swal({
            icon: "error",
            title: "Delete Prohibited",
            text: "You cannot delete a product that is in use",
          });
        } else {
          swal({
            icon: "error",
            title: "Something went wrong",
            text: "Please contact our support",
          });
        }
      } else {
        swal({
          title: "Cancelled Successfully",
          text: "Product Part not Deleted!",
          icon: "warning",
        });
      }
    } catch (error) {
      // Handle errors here
      console.error(error);
    }
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

  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($("#order-listing").length > 0 && sparePart.length > 0) {
      $("#order-listing").DataTable();
    }
  }, [sparePart]);
  const navigate = useNavigate();

  // const [authrztn, setauthrztn] = useState([]);
  // useEffect(() => {

  //   var decoded = jwtDecode(localStorage.getItem('accessToken'));
  //   console.log("Decoded: ", decoded);
  //   axios.get(BASE_URL + '/masterList/viewAuthorization/'+ decoded.id)
  //     .then((res) => {
  //       if(res.status === 200){
  //         console.log(res);
  //         setauthrztn(res.data.col_authorization);
  //       }
  //   })
  //     .catch((err) => {
  //       console.error(err);
  //   });

  // }, []);
  
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
                <p>Spare Parts</p>
              </div>

              <div className="button-create-side">
                <div className="Buttonmodal-new">

                  { authrztn.includes('Spare Part - Add') && (
                  <Link to="/createSpareParts" className="button">
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
              <table className="table-hover" id="order-listing">
                <thead>
                  <tr>
                    <th className="tableh">Code</th>
                    <th className="tableh">Spare Parts Name</th>
                    <th className="tableh">Description</th>
                    <th className="tableh">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sparePart.map((data, i) => (
                    <tr key={i}>
                      <td
                        onClick={() => navigate(`/viewSpareParts/${data.id}`)}>
                        {data.spareParts_code}
                      </td>
                      <td
                        onClick={() => navigate(`/viewSpareParts/${data.id}`)}>
                        {data.spareParts_name}
                      </td>
                      <td
                        onClick={() => navigate(`/viewSpareParts/${data.id}`)}>
                        {data.spareParts_desc}
                      </td>
                      <td>
                        {isVertical[data.spareParts_code] ? (
                          <DotsThreeCircleVertical
                            size={32}
                            className="dots-icon"
                            onClick={() => {
                              toggleButtons(data.spareParts_code);
                            }}
                          />
                        ) : (
                          <DotsThreeCircle
                            size={32}
                            className="dots-icon"
                            onClick={() => {
                              toggleButtons(data.spareParts_code);
                            }}
                          />
                        )}
                        <div>
                          {setButtonVisibles(data.spareParts_code) && (
                            <div
                              className="choices"
                              style={{ position: "absolute" }}>
                              <Link
                                to={`/updateSpareParts/${data.id}`}
                                style={{ fontSize: "12px" }}
                                // onClick={() => handleModalToggle(data)}
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

export default SpareParts;
