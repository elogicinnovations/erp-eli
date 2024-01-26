import React, { useEffect, useState } from "react";
import Sidebar from "../../../../../Sidebar/sidebar";
import "../../../../../../assets/global/style.css";
import "../../../../styles/react-style.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../../../../assets/global/url";
import Button from "react-bootstrap/Button";
import swal from "sweetalert";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import {
  Plus,
  DotsThreeCircle,
  DotsThreeCircleVertical,
  ArrowsClockwise
} from "@phosphor-icons/react";
import deleteSubpart from "../../../../../Archiving Delete/subpart_delete";
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
  const navigate = useNavigate();
  const [subParts, setSubParts] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Active");
  const [show, setShow] = useState(false);
  const [showChangeStatusButton, setShowChangeStatusButton] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [Dropdownstatus, setDropdownstatus] = useState(['Active', 'Inactive']);
  const [rotatedIcons, setRotatedIcons] = useState(
    Array(subParts.length).fill(false)
  );
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const [historypricemodal, sethistorypricemodal] = useState([]);
  const [showhistorical, setshowhistorical] = useState(false);
  const handlehistoricalClose = () => setshowhistorical(false);
  const handlehistoricalShow = () => setshowhistorical(true);

  const handlepricehistory = (id) => {
    axios
    .get(BASE_URL + "/subpricehistory/fetchsubpricehistory", {
      params: {
        id
      }
    })
    .then((res) => {
      sethistorypricemodal(res.data);
      handlehistoricalShow();
    })
    .catch((err) => console.log(err));
  }

  const handledropdownstatus = (event) => {
    const value = event.target.value;
    if (value === 'All Status') {
      setDropdownstatus(['Active', 'Inactive', 'Archive']);
    } else {
      setDropdownstatus([value]);
    }
  }
  

  const clearFilter = () => {
    setDropdownstatus(['Active', 'Inactive']);
  }

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
    deleteSubpart();
    reloadTable();
  }, []);

//   const reloadSubpart = () => {
//     axios
//         .post(`${BASE_URL}/subpart/deleteOldArchivedSubParts`)
//         .then((res) => {
//             if (res.status === 200) {
//                 console.log("Successfully deleted archive");
//             } else if (res.status === 201) {
//                 console.log(res.data.message);
//             } else {
//                 console.log("There seems to be an error");
//             }
//             reloadTable();
//         })
//         .catch((err) => console.log(err));
// };

//   useEffect(() =>{
//     reloadSubpart();
//   }, []);


  //Main table
  function formatDate(isoDate) {
    const date = new Date(isoDate);
    return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(
      date.getDate()
    )} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(
      date.getSeconds()
    )}`;
  }

  //Table date modal
  function ModalformatDate(isoDate) {
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

  // const handleDelete = async (table_id) => {
  //   swal({
  //     title: "Are you sure?",
  //     text: "Once deleted, you will not be able to recover this user file!",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then(async (willDelete) => {
  //     if (willDelete) {
  //       try {
  //         const response = await axios.delete(
  //           BASE_URL + `/subPart/delete/${table_id}`
  //         );
  //         if (response.status === 200) {
  //           swal({
  //             title: "Product Sub-Parts Delete Successful!",
  //             text: "The Product Sub-Parts has been Deleted Successfully.",
  //             icon: "success",
  //             button: "OK",
  //           }).then(() => {
  //             reloadTable();
  //           });
  //         } else if (response.status === 202) {
  //           swal({
  //             icon: "error",
  //             title: "Delete Prohibited",
  //             text: "You cannot delete Sub Part that is used",
  //           });
  //         } else {
  //           swal({
  //             icon: "error",
  //             title: "Something went wrong",
  //             text: "Please contact our support",
  //           });
  //         }
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     }
  //   });
  // };

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

  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($("#order-listing1").length > 0 && historypricemodal.length > 0) {
      $("#order-listing1").DataTable();
    }
  }, [historypricemodal]);

  //this section is for updating of Active and Inactive status
  const handleCheckboxChange = (subpartID) => {
    const updatedCheckboxes = [...selectedCheckboxes];

    if (updatedCheckboxes.includes(subpartID)) {
      updatedCheckboxes.splice(updatedCheckboxes.indexOf(subpartID), 1);
    } else {
      updatedCheckboxes.push(subpartID);
    }

    setSelectedCheckboxes(updatedCheckboxes);
    setShowChangeStatusButton(updatedCheckboxes.length > 0);
  };

  const handleSelectAllChange = () => {
    const allSubpartID = subParts.map((data) => data.id);
    setSelectedCheckboxes(selectAllChecked ? [] : allSubpartID);
    setShowChangeStatusButton(!selectAllChecked);
    $("input[type='checkbox']").prop("checked", !selectAllChecked);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = () => {
    axios
      .put(BASE_URL + "/subPart/statusupdate", {
        subpartIDs: selectedCheckboxes,
        status: selectedStatus,
      })
      .then((res) => {
        if (res.status === 200) {
          swal({
            title: "Status Updating!",
            text: "The status has been updated successfully.",
            icon: "success",
            button: "OK",
          }).then(() => {
            handleClose();
            reloadTable();
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
 //end of updating status 
 
  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
        <div className="right-body-contents">
          <div className="Employeetext-button">
            <div className="employee-and-button">
              <div className="emp-text-side">
                <p>Sub Parts</p>
              </div>


                <div className="button-create-side">
                  <Form.Select aria-label="item status"
                    style={{height: '40px', fontSize: '15px', marginBottom: '15px', fontFamily: 'Poppins, Source Sans Pro', cursor: 'pointer', width: '500px'}}
                    onChange={handledropdownstatus}
                    value={Dropdownstatus.length === 1 ? Dropdownstatus[0] : ''}>
                      <option value="" disabled>
                        Select Status
                      </option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Archive">Archive</option>
                    </Form.Select>  
                    <button className='Filterclear'
                    style={{ width: '150px'}}
                    onClick={clearFilter}>
                          Clear Filter
                    </button>
                  {authrztn?.includes('Sub-Part - Add') && (
                    showChangeStatusButton ? (
                      <div className="Buttonmodal-change">
                        <button className="buttonchanges" onClick={handleShow}>
                          <span style={{}}>
                          <ArrowsClockwise size={25} />
                          </span>
                          Change Status
                        </button>
                      </div>
                    ) : (
                    <div className="Buttonmodal-new">
                      <Link to="/createsubParts" className="button">
                        <span style={{}}>
                          <Plus size={25} />
                        </span>
                        New Product
                      </Link>
                    </div>
                    )
                    )}
                  </div>


            </div>
          </div>
          <div className="table-containss">
            <div className="main-of-all-tables">
              <table className="table-hover" title="View Information" id="order-listing">
                <thead>
                  <tr>
                  <th className="tableh" id="check">
                      <input
                        type="checkbox"
                        checked={selectAllChecked}
                        onChange={handleSelectAllChange}
                      />
                    </th>
                    <th className="tableh">Code</th>
                    <th className="tableh">Sub Parts Name</th>
                    <th className="tableh">Details</th>
                    <th className="tableh">Status</th>
                    <th className="tableh">Date Created</th>
                    <th className="tableh">Date Modified</th>
                    <th className="tableh">Action</th>
                  </tr>
                </thead>
                <tbody>
                {subParts
                  .filter((data) => Dropdownstatus.includes('All Status') || Dropdownstatus.includes(data.subPart_status))
                  .map((data, i) => (
                    <tr key={i}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedCheckboxes.includes(data.id)}
                          onChange={() => handleCheckboxChange(data.id)}
                        />
                      </td>
                      <td
                      onClick={() => navigate(`/viewsubParts/${data.id}`)}>
                        {data.subPart_code}
                      </td>
                      <td
                      onClick={() => navigate(`/viewsubParts/${data.id}`)}>
                        {data.subPart_name}
                      </td>
                      <td
                      onClick={() => navigate(`/viewsubParts/${data.id}`)}>
                        {data.subPart_desc}
                      </td>
                      <td
                      onClick={() => navigate(`/viewsubParts/${data.id}`)}>
                        <div
                          className="colorstatus"
                          style={{
                            backgroundColor:
                              data.subPart_status === "Active"
                                ? "green"
                                : data.subPart_status === "Archive"
                                ? "gray"
                                : "red",
                            color: "white",
                            padding: "5px",
                            borderRadius: "5px",
                            textAlign: "center",
                            width: "80px",
                          }}
                        >
                          {data.subPart_status}
                        </div>
                      </td>
                      <td
                      onClick={() => navigate(`/viewsubParts/${data.id}`)}>{formatDate(data.createdAt)}</td>
                      <td
                      onClick={() => navigate(`/viewsubParts/${data.id}`)}>{formatDate(data.updatedAt)}</td>
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

                              {/* { authrztn?.includes('Sub-Part - Delete') && (
                              <button
                                onClick={() => {
                                  handleDelete(data.id);
                                  closeVisibleButtons();
                                }}
                                className="btn">
                                Delete
                              </button>
                              )} */}

                              { authrztn?.includes('Sub-Part - View') && (
                              <button
                                className="btn"
                                onClick={() => {
                                  handlepricehistory(data.id);
                                  closeVisibleButtons();
                                }}>
                                Price History
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
      {/*Modal for updating status*/}
      <Modal
        size="md"
        show={show}
        onHide={handleClose}
        backdrop="static"
        animation={false}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "24px" }}>Change Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="exampleForm.ControlInput2">
            <Form.Label style={{ fontSize: "20px" }}>Status</Form.Label>
            <Form.Select
              style={{ height: "40px", fontSize: "15px" }}
              onChange={handleStatusChange}
              value={selectedStatus}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Archive">Archive</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-warning"
            onClick={handleSave}
            style={{ fontSize: "20px" }}>
            Save
          </Button>
          <Button
            variant="outline-secondary"
            onClick={handleClose}
            style={{ fontSize: "20px" }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/*Modal Price history */}
      <Modal
        size="xl"
        show={showhistorical}
        onHide={handlehistoricalClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title 
          style={{ fontSize: "26px", fontFamily: "Poppins, Source Sans Pro" }}
          >Historical Price</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <table responsive="xl" id="order-listing1">
              <thead className="priceHH">
                <tr>
                  <th className="priceHH">Subpart Name</th>
                  <th className="priceHH">Price</th>
                  <th className="priceHH">Date Created</th>
                </tr>
              </thead>
              <tbody>
                {historypricemodal.map((pricehistory, i) => (
                  <tr>
                    <td className="priceHB">{pricehistory.subPart.subPart_name}</td>
                    <td className="priceHB">{pricehistory.supplier_price}</td>
                    <td className="priceHB">{ModalformatDate(pricehistory.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>                        
        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default SubParts;
