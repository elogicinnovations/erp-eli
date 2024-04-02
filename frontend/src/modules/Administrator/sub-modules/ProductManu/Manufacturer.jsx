import React, { useEffect, useState } from "react";
import ReactLoading from 'react-loading';
import axios from "axios";
import "../../../../assets/global/style.css";
import "../../../styles/react-style.css";
import Button from "react-bootstrap/Button";
import NoData from '../../../../assets/image/NoData.png';
import NoAccess from '../../../../assets/image/NoAccess.png';
import Modal from "react-bootstrap/Modal";
import Sidebar from "../../../Sidebar/sidebar";
import swal from "sweetalert";
import BASE_URL from "../../../../assets/global/url";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import { jwtDecode } from "jwt-decode";
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
import Header from "../../../../partials/header";

function Productvariants({ authrztn }) {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false)
    setName("");
    setDescription("");
    setValidated(false);
  };
  const handleShow = () => setShow(true);

  const [updateModalShow, setUpdateModalShow] = useState(false);

  const [Manufacturer, setManufacturer] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [rotatedIcons, setRotatedIcons] = useState(
    Array(Manufacturer.length).fill(false)
  );
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [validated, setValidated] = useState(false);
  const [code, setCode] = useState("");
  const [nameManu, setName] = useState();
  const [descManu, setDescription] = useState();
  const [nextCode, setNextCode] = useState("");
  const [Fname, setFname] = useState('');
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userId, setuserId] = useState('');
  
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

  // const toggleDropdown = (event, index) => {
  //   // Check if the clicked icon is already open, close it
  //   if (index === openDropdownIndex) {
  //     setRotatedIcons((prevRotatedIcons) => {
  //       const newRotatedIcons = [...prevRotatedIcons];
  //       newRotatedIcons[index] = !newRotatedIcons[index];
  //       return newRotatedIcons;
  //     });
  //     setShowDropdown(false);
  //     setOpenDropdownIndex(null);
  //   } else {
  //     // If a different icon is clicked, close the currently open dropdown and open the new one
  //     setRotatedIcons(Array(Manufacturer.length).fill(false));
  //     const iconPosition = event.currentTarget.getBoundingClientRect();
  //     setDropdownPosition({
  //       top: iconPosition.bottom + window.scrollY,
  //       left: iconPosition.left + window.scrollX,
  //     });
  //     setRotatedIcons((prevRotatedIcons) => {
  //       const newRotatedIcons = [...prevRotatedIcons];
  //       newRotatedIcons[index] = true;
  //       return newRotatedIcons;
  //     });
  //     setShowDropdown(true);
  //     setOpenDropdownIndex(index);
  //   }
  // };
  const reloadTable = () => {
    const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/manufacturer/retrieve")
      .then((res) => {
        setManufacturer(res.data)
      setIsLoading(false);
    })
    .catch((err) => {
      console.log(err)
      setIsLoading(false);
    });
  }, 1000);

  return () => clearTimeout(delay);
};

  useEffect(() => {
    reloadTable()
  }, []);

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


  
  useEffect(() => {
    // Fetch the next code when the modal is opened
    if (show) {
      fetchNextCode();
    }
  }, [show]);

  const fetchNextCode = () => {
    // Make a request to the server to get the next available code
    // You need to implement a corresponding server endpoint for this
    axios.get(BASE_URL + "/manufacturer/nextcode").then((res) => {
      setCode(res.data.nextCode); // Assuming the server sends the next code in the response
    });
  };

  const addManufacturer = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      swal({
        icon: "error",
        title: "Fields are Required",
        text: "Please fill in all required fields.",
      });
    } else {
      axios
        .post(`${BASE_URL}/manufacturer/add`, {
          codeManu: code,
          nameManufacturer: nameManu,
          descriptManufacturer: descManu,
          userId,
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            swal({
              title: "Manufacturer Added Successfully!",
              text: "The new manufacturer has been added successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              reloadTable()
              handleClose();

            });
          } else if (res.status === 201) {
            swal({
              title: "Manufacturer Already Exists",
              text: "Please enter a different manufacturer.",
              icon: "error",
            });;
          } else {
            swal({
              title: "Oops! Something Went Wrong",
              text: "Please contact our support team for assistance.",
              icon: "error",
              button: "OK",
            });
          }
        });
    }

    setValidated(true); //for validations
  };

  const handleDelete = async (table_id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await axios.delete(
            BASE_URL + `/manufacturer/delete/${table_id}?userId=${userId}`
          );

          if (response.status === 200) {
            swal({
              title: "Product Manufacturer Deleted Successfully!",
              text: "The product manufacturer has been deleted successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
             reloadTable()
            });
          } else if (response.status === 202) {
            swal({
              icon: "error",
              title: "Deletion Prohibited",
              text: "You cannot delete a manufacturer that is currently in use.",
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
          title: "Oops! Something Went Wrong",
          text: "Please contact our support team for assistance.",
          icon: "warning",
        });
      }
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
        BASE_URL + `/manufacturer/update/${updaemasterID}?userId=${userId}`,
        {
          manufacturer_name: updateFormData.manufacturer_name,
          manufacturer_remarks: updateFormData.manufacturer_remarks,
        }
      );

      if (response.status === 200) {
        swal({
          title: "Product Manufacturer Updated Successfully!",
          text: "The product manufacturer has been updated successfully.",
          icon: "success",
          button: "OK",
        }).then(() => {
          handleModalToggle();
          reloadTable()
        });
      } else if (response.status === 202) {
        swal({
          title: "Product Manufacturer Already Exists",
          text: "Please enter a different product manufacturer.",
          icon: "error",
        });
      } else {
        swal({
          icon: "error",
          title: "Oops! Something Went Wrong",
          text: "Please contact our support team for assistance.",
        });
      }
    } catch (err) {
      console.log(err);
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
    setVisibleButtons("");
    setIsVertical("");
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

  // const [authrztn, setauthrztn] = useState([]);
  // useEffect(() => {

  //   var decoded = jwtDecode(localStorage.getItem('accessToken'));
  //   axios.get(BASE_URL + '/masterList/viewAuthorization/'+ decoded.id)
  //     .then((res) => {
  //       if(res.status === 200){
  //         setauthrztn(res.data.authorization);
  //       }
  //   })
  //     .catch((err) => {
  //       console.error(err);
  //   });

  // }, []);

  return (
    <div className="main-of-containers">

      <div className="right-of-main-containers">
              {isLoading ? (
                <div className="loading-container">
                  <ReactLoading className="react-loading" type={'bubbles'}/>
                  Loading Data...
                </div>
              ) : (
        authrztn.includes('Product Manufacturer - View') ? (
        <div className="right-body-contents">
          <div className="Employeetext-button">
            <div className="employee-and-button">
              <div className="emp-text-side">
                <p>Manufacturer</p>
              </div>

              <div className="button-create-side">
                <div className="Buttonmodal-new">

                  { authrztn.includes('Product Manufacturer - Add') && (
                    <button onClick={handleShow}>
                      <span style={{}}>
                        <Plus size={25} />
                      </span>
                      Create New
                    </button>
                  ) }

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
                    <th className="tableh">DATE CREATED</th>
                    <th className="tableh">DATE UPDATED</th>
                    <th className="tableh">ACTION</th>
                  </tr>
                </thead>
                {Manufacturer.length > 0 ? (
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
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <DotsThreeCircleVertical
                            size={32}
                            className="dots-icon"
                            onClick={() => {
                              toggleButtons(data.manufacturer_code);
                            }}
                          />
                          <div className="float" style={{ position: 'absolute', left: '-125px', top: '0' }}>
                            {setButtonVisibles(data.manufacturer_code) && (
                              <div className="choices">
                              { authrztn.includes('Product Manufacturer - Edit') && (
                              <button
                                className="btn"
                                onClick={() => {
                                  handleModalToggle(data);
                                  closeVisibleButtons();
                                }}>
                                Update
                              </button>
                              )}

                              { authrztn.includes('Product Manufacturer - Delete') && (
                              <button
                                className="btn"
                                onClick={() => {
                                  handleDelete(data.manufacturer_code);
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
                              toggleButtons(data.manufacturer_code);
                            }}
                          />
                          <div className="float" style={{ position: 'absolute', left: '-125px', top: '0' }}>
                            {setButtonVisibles(data.manufacturer_code) && (
                              <div className="choices">
                              { authrztn.includes('Product Manufacturer - Edit') && (
                              <button
                                className="btn"
                                onClick={() => {
                                  handleModalToggle(data);
                                  closeVisibleButtons();
                                }}>
                                Update
                              </button>
                              )}

                              { authrztn.includes('Product Manufacturer - Delete') && (
                              <button
                                className="btn"
                                onClick={() => {
                                  handleDelete(data.manufacturer_code);
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

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg">
        <Form noValidate validated={validated} onSubmit={addManufacturer}>
          <Modal.Header closeButton>
            <Modal.Title style={{fontSize: '24px',
                fontFamily: 'Poppins, Source Sans Pro'}}>
              Create Manufacturer
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-6">
                <Form.Group
                  controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px",
                              fontFamily: 'Poppins, Source Sans Pro'}}>
                          Manufacturer Code
                  </Form.Label>
                  <Form.Control
                    type="text"
                    disabled
                    value={code || nextCode}
                    onChange={(e) => setCode(e.target.value)}
                    style={{ height: "40px", 
                            fontSize: "15px", 
                            fontFamily: 'Poppins, Source Sans Pro' }}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group
                  controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px",
                          fontFamily: 'Poppins, Source Sans Pro'}}>
                           Manufacturer Name
                    </Form.Label>
                  <Form.Control
                    type="text"
                    value={nameManu}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ height: "40px", 
                            fontSize: "15px", 
                            fontFamily: 'Poppins, Source Sans Pro' }}
                  />
                </Form.Group>
              </div>
            </div>
            

            <div className="mt-3">
              <Form.Group
                controlId="exampleForm.ControlTextarea1">
                <Form.Label style={{ fontSize: "20px", 
                            fontFamily: 'Poppins, Source Sans Pro' }}>
                          Description
                </Form.Label>
                <Form.Control
                  value={descManu}
                  onChange={(e) => setDescription(e.target.value)}
                  as="textarea"
                  rows={3}
                  style={{
                    fontFamily: 'Poppins, Source Sans Pro',
                    fontSize: "16px",
                    height: "200px",
                    maxHeight: "200px",
                    resize: "none",
                    overflowY: "auto",
                  }}
                />
              </Form.Group>
            </div>
          <div className="save-cancel">
              <Button
                type="submit"
                variant="warning"
                size="md"
                style={{ fontSize: "20px",
                    fontFamily: 'Poppins, Source Sans Pro',
                    margin: "0px 5px"}}>
                Save
              </Button>
              <Button
                variant="secondary"
                size="md"
                style={{ fontSize: "20px",
                    fontFamily: 'Poppins, Source Sans Pro',
                    margin: "0px 5px"}}
                onClick={handleClose}>
                Close
              </Button>
          </div>
          </Modal.Body>
        </Form>
      </Modal>

      <Modal
        show={updateModalShow}
        onHide={() => handleModalToggle()}
        backdrop="static"
        keyboard={false}
        size="lg">
          <Modal.Header closeButton>
            <Modal.Title style={{fontSize: '24px',
                fontFamily: 'Poppins, Source Sans Pro'}}>
              Update Manufacturer
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form noValidate validated={validated} onSubmit={handleUpdateSubmit}>
              <div className="row">
                <div className="col-6">
                  <Form.Group
                    controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: "20px",
                            fontFamily: 'Poppins, Source Sans Pro'}}>
                      Manufacturer Code
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter code"
                      value={updateFormData.manufacturer_code}
                      readOnly
                      onChange={handleUpdateFormChange}
                      name="manufacturer_code"
                      style={{ height: "40px", 
                            fontSize: "15px", 
                            fontFamily: 'Poppins, Source Sans Pro' }}
                    />
                  </Form.Group>
                </div>
                <div className="col-6">
                  <Form.Group
                    controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: "20px",
                            fontFamily: 'Poppins, Source Sans Pro'}}>
                              Manufacturer Name 
                      </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      value={updateFormData.manufacturer_name}
                      onChange={handleUpdateFormChange}
                      name="manufacturer_name"
                      required
                      style={{ height: "40px", 
                            fontSize: "15px", 
                            fontFamily: 'Poppins, Source Sans Pro' }}
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="mt-3">
              <Form.Group
                controlId="exampleForm.ControlTextarea1">
                <Form.Label style={{ fontSize: "20px",
                          fontFamily: 'Poppins, Source Sans Pro'}}>
                  Description
                </Form.Label>
                <Form.Control
                  value={updateFormData.manufacturer_remarks}
                  onChange={handleUpdateFormChange}
                  name="manufacturer_remarks"
                  as="textarea"
                    rows={3}
                    style={{
                    fontFamily: 'Poppins, Source Sans Pro',
                    fontSize: "16px",
                    height: "200px",
                    maxHeight: "200px",
                    resize: "none",
                    overflowY: "auto",
                    }}
                />
              </Form.Group>
              </div>
            <div className="save-cancel">
              <Button
                type="submit"
                variant="warning"
                size="md"
                    style={{ fontSize: "20px",
                    fontFamily: 'Poppins, Source Sans Pro',
                    margin: "0px 5px"}}>
                Update
              </Button>
              <Button
                variant="secondary"
                size="md"
                    style={{ fontSize: "20px",
                    fontFamily: 'Poppins, Source Sans Pro',
                    margin: "0px 5px"}}
                onClick={() => setUpdateModalShow(!updateModalShow)}>
                Close
              </Button>
            </div>
            </Form>
          </Modal.Body>
      </Modal>
    </div>
  );
}
export default Productvariants;
