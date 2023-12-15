import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../../../assets/global/style.css";
import "../../../styles/react-style.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Sidebar from "../../../Sidebar/sidebar";
import swal from "sweetalert";
import BASE_URL from "../../../../assets/global/url";
import "bootstrap/dist/css/bootstrap.min.css";
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

function Productvariants() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [updateModalShow, setUpdateModalShow] = useState(false);

  const [Manufacturer, setManufacturer] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [rotatedIcons, setRotatedIcons] = useState(
    Array(Manufacturer.length).fill(false)
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
      setRotatedIcons(Array(Manufacturer.length).fill(false));
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
      .get(BASE_URL + "/manufacturer/retrieve")
      .then((res) => setManufacturer(res.data))
      .catch((err) => console.log(err));
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
  //  function formatDate(isoDate) {
  //     const date = new Date(isoDate);
  //     return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;
  //   }

  //   function padZero(num) {
  //     return num.toString().padStart(2, '0');
  //   }

  const [validated, setValidated] = useState(false);
  const [code, setCode] = useState();
  const [nameManu, setName] = useState();
  const [descManu, setDescription] = useState();

  const addManufacturer = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      // if required fields has NO value
      //    console.log('requried')
      swal({
        icon: "error",
        title: "Fields are required",
        text: "Please fill the red text fields",
      });
    } else {
      axios
        .post(`${BASE_URL}/manufacturer/add`, {
          codeManu: code,
          nameManufacturer: nameManu,
          descriptManufacturer: descManu,
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            SuccessInserted(res);
          } else if (res.status === 201) {
            Duplicate_Message();
          } else {
            ErrorInserted();
          }
        });
      // .catch((err) => {
      //   console.error(err);
      //   // ErrorInserted();
      // });
    }

    setValidated(true); //for validations
  };

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
            BASE_URL + `/manufacturer/delete/${table_id}`
          );

          if (response.status === 200) {
            swal({
              title: "The Manufacturer has been deleted!",
              text: "The Manufacturer has been updated successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              setManufacturer((prev) =>
                prev.filter((data) => data.manufacturer_code !== table_id)
              );
            });
          } else if (response.status === 202) {
            swal({
              icon: "error",
              title: "Delete Prohibited",
              text: "You cannot delete Manufacturer that is used",
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
          text: "Manufacturer not Deleted!",
          icon: "warning",
        });
      }
    });
  };

  const SuccessInserted = (res) => {
    swal({
      title: "Manufacturer Created",
      text: "The manufacturer has been added successfully",
      icon: "success",
      button: "OK",
    }).then(() => {
      const newId = res.data.manufacturer_code;
      // console.log(newId)
      setManufacturer((prev) => [
        ...prev,
        {
          manufacturer_code: newId,
          manufacturer_name: res.data.manufacturer_name,
          manufacturer_remarks: res.data.manufacturer_remarks,
          createdAt: res.data.createdAt,
          updatedAt: res.data.updatedAt,
        },
      ]);

      setCode(""); // Clear the code input field
      setName(""); // Clear the nameManu input field
      setDescription(""); // Clear the descManu input field

      setShow(false);
    });
  };
  const Duplicate_Message = () => {
    swal({
      title: "Manufacturer Already Exist",
      text: "The input other manufacturer",
      icon: "error",
      button: "OK",
    });
  };

  const ErrorInserted = () => {
    swal({
      title: "Something went wrong",
      text: "Please Contact our Support",
      icon: "error",
      button: "OK",
    });
  };

  const [updateFormData, setUpdateFormData] = useState({
    manufacturer_name: "",
    manufacturer_remarks: "",
    manufacturer_code: null,
  });

  const handleModalToggle = (updateData = null) => {
    setUpdateModalShow(!updateModalShow);
    if (updateData) {
      setUpdateFormData({
        manufacturer_code: updateData.manufacturer_code,
        manufacturer_name: updateData.manufacturer_name,
        manufacturer_remarks: updateData.manufacturer_remarks,
      });
    } else {
      setUpdateFormData({
        manufacturer_code: "",
        manufacturer_name: "",
        manufacturer_remarks: "",
      });
    }
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;

    setUpdateFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!updateFormData.manufacturer_name) {
      swal({
        icon: "error",
        title: "Name is required",
        text: "Please enter a name before updating.",
      });
      return; // Prevent submission if the name is empty
    }

    try {
      const updaemasterID = updateFormData.manufacturer_code;
      const response = await axios.put(
        BASE_URL + `/manufacturer/update/${updaemasterID}`,
        {
          manufacturer_name: updateFormData.manufacturer_name,
          manufacturer_remarks: updateFormData.manufacturer_remarks,
        }
      );

      if (response.status === 200) {
        swal({
          title: "Update successful!",
          text: "The Manufacturer has been updated successfully.",
          icon: "success",
          button: "OK",
        }).then(() => {
          handleModalToggle();
          setManufacturer((prev) =>
            prev.map((data) =>
              data.manufacturer_code === updateFormData.manufacturer_code
                ? {
                    ...data,
                    manufacturer_name: updateFormData.manufacturer_name,
                    manufacturer_remarks: updateFormData.manufacturer_remarks,
                  }
                : data
            )
          );

          // Reset the form fields
          setUpdateFormData({
            manufacturer_name: "",
            manufacturer_remarks: "",
            manufacturer_code: null,
          });
        });
      } else if (response.status === 202) {
        swal({
          icon: "error",
          title: "Manufacturer already exists",
          text: "Please input another Manufacturer",
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
  };
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
  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($("#order-listing").length > 0 && Manufacturer.length > 0) {
      $("#order-listing").DataTable();
    }
  }, [Manufacturer]);

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
                <h3>User Name</h3>
              </div>
            </div>
          </div> */}

          <div className="Employeetext-button">
            <div className="employee-and-button">
              <div className="emp-text-side">
                <p>Manufacturer</p>
              </div>

              <div className="button-create-side">
                <div className="Buttonmodal-new">
                  <button onClick={handleShow}>
                    <span style={{}}>
                      <Plus size={25} />
                    </span>
                    Create New
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="table-containss">
            <div className="main-of-all-tables">
              <table id="order-listing">
                <thead>
                  <tr>
                    <th className="tableh">CODE</th>
                    <th className="tableh">NAME</th>
                    <th className="tableh">REMARKS</th>
                    <th className="tableh">DATE CREATE</th>
                    <th className="tableh">DATE UPDATED</th>
                    <th className="tableh">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {Manufacturer.map((data, i) => (
                    <tr key={i}>
                      <td>{data.manufacturer_code}</td>
                      <td>{data.manufacturer_name}</td>
                      <td>{data.manufacturer_remarks}</td>
                      <td>{formatDate(data.createdAt)}</td>
                      <td>{formatDate(data.updatedAt)}</td>
                      <td>
                        {isVertical[data.manufacturer_code] ? (
                          <DotsThreeCircleVertical
                            size={32}
                            className="dots-icon"
                            onClick={() => {
                              toggleButtons(data.manufacturer_code);
                            }}
                          />
                        ) : (
                          <DotsThreeCircle
                            size={32}
                            className="dots-icon"
                            onClick={() => {
                              toggleButtons(data.manufacturer_code);
                            }}
                          />
                        )}
                        <div>
                          {setButtonVisibles(data.manufacturer_code) && (
                            <div
                              className="choices"
                              style={{ position: "absolute" }}>
                              <button
                                className="btn"
                                onClick={() => {
                                  handleModalToggle(data);
                                  closeVisibleButtons();
                                }}>
                                Update
                              </button>
                              <button
                                className="btn"
                                onClick={() => {
                                  handleDelete(data.manufacturer_code);
                                  closeVisibleButtons();
                                }}>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                      {/* <td>
                                  <button className="btn" onClick={() => handleModalToggle(data)}>
                                    <NotePencil size={32} />
                                  </button>
                                  <button className="btn"  onClick={() => handleDelete(data.manufacturer_code)}>
                                    <Trash size={32} color="#e60000" />
                                  </button>
                                </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg">
        <Form
          noValidate
          validated={validated}
          onSubmit={addManufacturer}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "24px" }}>
              Create Manufacturer
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              className="gen-info"
              style={{ fontSize: "20px", position: "relative" }}>
              Manufacturer Info
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "75%",
                  background: "#FFA500",
                  top: "64%",
                  left: "18rem",
                  transform: "translateY(-50%)",
                }}></span>
            </div>

            <div className="row">
              <div className="col-6">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "18px" }}>Code: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter code"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "18px" }}>Name: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={nameManu}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1">
              <Form.Label style={{ fontSize: "18px" }}>Description</Form.Label>
              <Form.Control
                value={descManu}
                onChange={(e) => setDescription(e.target.value)}
                as="textarea"
                rows={3}
                style={{
                  fontSize: "16px",
                  height: "200px",
                  maxHeight: "200px",
                  resize: "none",
                  overflowY: "auto",
                }}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="submit"
              variant="warning"
              size="md"
              style={{ fontSize: "20px" }}>
              Save
            </Button>
            <Button
              variant="secondary"
              size="md"
              style={{ fontSize: "20px" }}
              onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal
        show={updateModalShow}
        onHide={() => handleModalToggle()}
        backdrop="static"
        keyboard={false}
        size="lg">
        <Form
          noValidate
          validated={validated}
          onSubmit={handleUpdateSubmit}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "24px" }}>
              Update Manufacturer
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              className="gen-info"
              style={{ fontSize: "20px", position: "relative" }}>
              Manufacturer Info
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "75%",
                  background: "#FFA500",
                  top: "64%",
                  left: "18rem",
                  transform: "translateY(-50%)",
                }}></span>
            </div>
            <Form style={{ marginLeft: "10px", marginTop: "10px" }}>
              <div className="row">
                <div className="col-6">
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: "18px" }}>Code: </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter code"
                      value={updateFormData.manufacturer_code}
                      readOnly
                      onChange={handleUpdateFormChange}
                      name="manufacturer_code"
                      style={{ height: "40px", fontSize: "15px" }}
                    />
                  </Form.Group>
                </div>
                <div className="col-6">
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: "18px" }}>Name: </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      value={updateFormData.manufacturer_name}
                      onChange={handleUpdateFormChange}
                      name="manufacturer_name"
                      required
                      style={{ height: "40px", fontSize: "15px" }}
                    />
                  </Form.Group>
                </div>
              </div>
            </Form>

            <Form style={{ marginLeft: "10px", marginTop: "10px" }}>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1">
                <Form.Label style={{ fontSize: "18px" }}>
                  Description
                </Form.Label>
                <Form.Control
                  value={updateFormData.manufacturer_remarks}
                  onChange={handleUpdateFormChange}
                  name="manufacturer_remarks"
                  as="textarea"
                  rows={3}
                  style={{
                    fontSize: "16px",
                    height: "200px",
                    maxHeight: "200px",
                    resize: "none",
                    overflowY: "auto",
                  }}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="submit"
              variant="warning"
              size="md"
              style={{ fontSize: "20px" }}>
              Save
            </Button>
            <Button
              variant="secondary"
              size="md"
              style={{ fontSize: "20px" }}
              onClick={() => setUpdateModalShow(!updateModalShow)}>
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}
export default Productvariants;
