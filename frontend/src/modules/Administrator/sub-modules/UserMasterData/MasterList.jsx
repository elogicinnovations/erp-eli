import React, { useEffect, useState } from "react";
import ReactLoading from 'react-loading';
import axios from "axios";
import "../../../../assets/global/style.css";
import "../../../styles/react-style.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
// import Sidebar from "../../../Sidebar/sidebar";
// import Header from "../../../../partials/header";
import NoData from '../../../../assets/image/NoData.png';
import NoAccess from '../../../../assets/image/NoAccess.png';
import swal from "sweetalert";
import BASE_URL from "../../../../assets/global/url";
// import 'bootstrap/dist/css/bootstrap.min.css'
import Form from "react-bootstrap/Form";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import {
  Plus,
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

import { jwtDecode } from "jwt-decode";

function MasterList({ authrztn }) {
  const [masterListt, setmasterListt] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [rotatedIcons, setRotatedIcons] = useState(
    Array(masterListt.length).fill(false)
  );
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
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
      setRotatedIcons(Array(masterListt.length).fill(false));
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

  const [formData, setFormData] = useState({
    cname: "",
    caddress: "",
    cnum: "",
    cemail: "",
    cuname: "",
    crole: "",
    cdept: "",
    cpass: "",
    cpass2: "",
    cstatus: false,
  });

  const [updateFormData, setUpdateFormData] = useState({
    // uarole: '',
    // uaname: '',
    // uaemail: '',
    // uapass: '',
    // ustatus: false,

    uaname: "",
    uaaddress: "",
    uanum: "",
    uaemail: "",
    uauname: "",
    uarole: "",
    uadept: "",
    uapass: "",
    ustatus: false,
    updateId: null,
  });

  const [authorization, setAuthorization] = useState([]);

  const addAuthorization = () => {
    var decoded = jwtDecode(localStorage.getItem("accessToken"));

    axios
      .get(BASE_URL + "/masterList/viewAuthorization/" + decoded.id)
      .then((res) => {
        if (res.status === 200) {

          setAuthorization(res.data.authorization);
        }
      })
      .catch((err) => {
        console.error(err);
      });

    // console.log("ln 120: ",authorization);
    // console.log("authorized? ", findAuthorization(authorization === null ? [] : authorization, 'Master List - Add'));
  };

  useEffect(() => {
    addAuthorization();

    // console.log("ln 128: ", authorization); // []
  }, []);

  // const verifyAuthorization = (target) => {
  //   var decoded = jwtDecode(localStorage.getItem("accessToken"));

  //   console.log(decoded.authorization);
  //   console.log(decoded.authorization.includes(target));
  //   return decoded.authorization.includes(target);
  // };

  const reloadTable = () => {
    const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/masterList/masterTable")
      .then((res) => {
        setmasterListt(res.data)
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
    reloadTable();
  }, []);

  const handleClose = () => {
    setShowModal(false);
    // Clear the form fields
    setFormData({
      cname: "",
      caddress: "",
      cnum: "",
      cemail: "",
      cuname: "",
      crole: "",
      cdept: "",
      cpass: "",
      cpass2: "",
      cstatus: false,
    });
  };

  const handleShow = () => setShowModal(true);

  const handleModalToggle = (updateData = null) => {
    setUpdateModalShow(!updateModalShow);
    if (updateData) {
      setUpdateFormData({
        uaname: updateData.col_Fname,
        uaaddress: updateData.col_address,
        uanum: updateData.col_phone,
        uaemail: updateData.col_email,
        uauname: updateData.col_username,
        uarole: updateData.col_roleID,
        uadept: updateData.department_id,
        uapass: updateData.col_Pass,
        ustatus: updateData.col_status === "Active",
        updateId: updateData.col_id,
      });
    } else {
      setUpdateFormData({
        uaname: "",
        uaaddress: "",
        uanum: "",
        uaemail: "",
        uauname: "",
        uarole: "",
        uadept: "",
        uapass: "",
        ustatus: false,
        updateId: null,
      });
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else if (name === "cnum") {
      // Check if the value contains only numbers, '+', and '-'
      const isValid = /^[0-9+\\-]*$/.test(value);

      if (isValid) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else if (name === "cname") {
      // Check if the value contains invalid characters
      const isValid = /^[a-zA-Z\s',.\-]*$/.test(value);

      if (name === "cpass" || name === "cpass2") {
        // For password and confirm password fields
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }

      if (isValid) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };


  const handleUpdateFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Define regex patterns
    const nameRegex = /^[a-zA-Z\s',.\-]*$/;
    const contactRegex = /^[0-9+\\-]*$/;

    // Validate input based on type
    let isValidInput = true;
    if (type === "text" && name === "uaname") {
      isValidInput = nameRegex.test(value);
    } else if (type === "text" && name === "uanum") {
      isValidInput = contactRegex.test(value);
    }

    // Update form data only if the input is valid
    if (isValidInput) {
      if (type === "checkbox") {
        setUpdateFormData((prevData) => ({
          ...prevData,
          [name]: checked,
        }));
      } else {
        setUpdateFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }
  };

    const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const updaemasterID = updateFormData.updateId;
      const response = await axios.put(
        BASE_URL + `/masterList/updateMaster/${updateFormData.updateId}?userId=${userId}`,
        {
          col_Fname: updateFormData.uaname,
          col_address: updateFormData.uaaddress,
          col_phone: updateFormData.uanum,
          col_email: updateFormData.uaemail,
          col_username: updateFormData.uauname,
          col_roleID: updateFormData.uarole,
          department_id: updateFormData.uadept,
          col_Pass: updateFormData.uapass,
          col_status: updateFormData.ustatus ? "Active" : "Inactive",
        }
      );

      if (response.status === 200) {
        swal({
          title: "User Update Successful!",
          text: "The User has been Updated Successfully.",
          icon: "success",
          button: "OK",
        }).then(() => {
          window.location.reload();
          handleModalToggle();
          setmasterListt((prevStudent) =>
            prevStudent.map((data) =>
              data.col_ID === updateFormData.updateId
                ? {
                    ...data,
                    col_Fname: updateFormData.uaname,
                    col_address: updateFormData.uaaddress,
                    col_phone: updateFormData.uanum,
                    col_email: updateFormData.uaemail,
                    col_username: updateFormData.uauname,
                    col_roleID: updateFormData.uarole,
                    department_id: updateFormData.uadept,
                    col_Pass: updateFormData.uapass,
                    col_status: updateFormData.ustatus ? "Active" : "Inactive",
                  }
                : data
            )
          );

          // Reset the form fields
          setUpdateFormData({
            uaname: "",
            uaaddress: "",
            uanum: "",
            uaemail: "",
            uauname: "",
            uarole: "",
            uadept: "",
            uapass: "",
            ustatus: false,
            updateId: null,
          });
        });
      } else if (response.status === 202) {
        swal({
          icon: "error",
          title: "Email already exists",
          text: "Please input another Email",
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

  // Validation for PhoneNumber and Email
  function isValidPhoneNumber(phone) {
    const phoneRegex = /^09\d{9}$/;
    return phoneRegex.test(phone);
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.cname === "") {
        swal({
          title: "Required Field",
          text: "Name is Required",
          icon: "error",
          button: "OK",
        });
      }
      if (formData.caddress === "") {
        swal({
          title: "Required Field",
          text: "Address is Required",
          icon: "error",
          button: "OK",
        });
      }
      if (formData.cnum === "") {
        swal({
          title: "Required Field",
          text: "Contact is Required",
          icon: "error",
          button: "OK",
        });
      }
      if (!isValidPhoneNumber(formData.cnum)) {
        swal({
          title: "Invalid Phone Number Format",
          text: "Please enter a valid number",
          icon: "error",
          button: "OK",
        });
      }
      if (formData.cemail === "") {
        swal({
          title: "Required Field",
          text: "Email is Required",
          icon: "error",
          button: "OK",
        });
      }
      if (!isValidEmail(formData.cemail)) {
        swal({
          title: "Invalid Email Format",
          text: "Please enter a valid email address",
          icon: "error",
          button: "OK",
        });
      }
      if (formData.cuname === "") {
        swal({
          title: "Required Field",
          text: "Username is Required",
          icon: "error",
          button: "OK",
        });
      }
      if (formData.crole === "") {
        swal({
          title: "Required Field",
          text: "Access Role is Required",
          icon: "error",
          button: "OK",
        });
      }
      if (formData.cpass === "") {
        swal({
          title: "Required Field",
          text: "Password is Required",
          icon: "error",
          button: "OK",
        });
      } else if (!/[A-Z]/.test(formData.cpass)) {
        swal({
          title: "Password Validation",
          text: "Add at least one capital letter",
          icon: "error",
          button: "OK",
        });
      } else if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(formData.cpass)) {
        swal({
          title: "Password Validation",
          text: "Add at least one special character",
          icon: "error",
          button: "OK",
        });
      } else if (!/\d/.test(formData.cpass)) {
        swal({
          title: "Password Validation",
          text: "Add at least one number",
          icon: "error",
          button: "OK",
        });
      } else if (formData.cpass.length < 8) {
        swal({
          title: "Password Validation",
          text: "Password must be at least 8 characters",
          icon: "error",
          button: "OK",
        });
      }
      if (formData.cpass != formData.cpass2) {
        swal({
          title: "Password error",
          text: "Please confirm your password",
          icon: "error",
          button: "OK",
        });
      } else {
        formData.userId = userId;
        const status = formData.cstatus ? "Active" : "Inactive";
        const response = await axios.post(
          BASE_URL + "/masterList/createMaster",
          formData
        );
        setShowModal(false);

        if (response.status === 200) {
          swal({
            title: "User Add Successful!",
            text: "The User has been Added Successfully.",
            icon: "success",
            button: "OK",
          }).then(() => {
            reloadTable();
            setFormData({
              cname: "",
              caddress: "",
              cnum: "",
              cemail: "",
              cuname: "",
              crole: "",
              cdept: "",
              cpass: "",
              cpass2: "",
              cstatus: false,
            });
          });
        } else if (response.status === 202) {
          swal({
            icon: "error",
            title: "Email already exists",
            text: "Please input another Email",
          });
        } else {
          swal({
            icon: "error",
            title: "Something went wrong",
            text: "Please contact our support",
          });
        }
      }
    } catch (err) {
    }
  };



  const handleDelete = async (param_id) => {
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
            `${BASE_URL}/masterlist/deleteMaster/${param_id}?userId=${userId}`
          );
          if (response.data.success) {
            swal({
              title: "User Delete Successful!",
              text: "The User has been Deleted Successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              reloadTable();
            });
            // Add any additional logic you want to perform after successful deletion
          } else {
            swal("Oops! Something went wrong.", {
              icon: "error",
            });
            // Handle the case where deletion was not successful
          }
        } catch (error) {
          console.error("Error during delete:", error);
          swal("Oops! Something went wrong.", {
            icon: "error",
          });
          // Handle other errors, such as network issues
        }
      }
    });
  };

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    axios
      .get(BASE_URL + "/userRole/fetchuserrole")
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  const [department, setDepartment] = useState([]);

  useEffect(() => {
   
    axios
            .get(BASE_URL + "/department/fetchtableDepartment")
            .then((res) => {
              setDepartment(res.data);
              setIsLoading(false);
            })
            .catch((err) => {
              console.log(err);
              setIsLoading(false);
            });
  }, []);

  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($("#order-listing").length > 0 && masterListt.length > 0) {
      $("#order-listing").DataTable();
    }
  }, [masterListt]);

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

  // const [authrztn, setauthrztn] = useState([]);
  // useEffect(() => {
  //   var decoded = jwtDecode(localStorage.getItem("accessToken"));
  //   axios
  //     .get(BASE_URL + "/masterList/viewAuthorization/" + decoded.id)
  //     .then((res) => {
  //       if (res.status === 200) {
  //         setauthrztn(res.data.col_authorization);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }, []);

  // console.log("ln 128: ", authorization); // []

  const [changePass, setChangePass] = useState(false);

  const handleToggleChangePass = () => {
    setChangePass(!changePass);
  };

  return (
    <div className="main-of-containers">
      {/* <div className="left-of-main-containers">
        <Sidebar />
      </div> */}
      <div className="right-of-main-containers">
              {isLoading ? (
                <div className="loading-container">
                  <ReactLoading className="react-loading" type={'bubbles'}/>
                  Loading Data...
                </div>
              ) : (
        authrztn.includes('Master List - View') ? (
        <div className="right-body-contents">
          <div className="Employeetext-button">
            <div className="employee-and-button">
              <div className="emp-text-side">
                <p>User Master Data</p>
              </div>

              <div className="button-create-side">
                <div className="Buttonmodal-new">
                  {authrztn?.includes("Master List - Add") && (
                    <button onClick={handleShow}>
                      <span>
                        <Plus size={25} />
                      </span>
                      New User
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="table-containss">
            <div className="main-of-all-tables">
              <table id="order-listing" className="hover-table">
                <thead>
                  <tr>
                    <th className="tableh">ID</th>
                    <th className="tableh">Role Type</th>
                    <th className="tableh">Name</th>
                    <th className="tableh">Email</th>
                    <th className="tableh">Department</th>
                    <th className="tableh">Status</th>
                    <th className="tableh">Action</th>
                  </tr>
                </thead>
                {masterListt.length > 0 ? (
                <tbody>
                  {masterListt.map((data, i) => (
                    <tr
                      key={i}
                      className={i % 2 === 0 ? "even-row" : "odd-row"}>
                      <td>{data.col_id}</td>
                      <td>{data.userRole.col_rolename}</td>
                      <td>{data.col_Fname}</td>
                      <td>{data.col_email}</td>
                      <td>{data.department.department_name}</td>
                      <td>
                      <div
                          className="colorstatus"
                          style={{
                            backgroundColor:
                              data.col_status === "Active"
                                ? "green"
                                : "red",
                            color: "white",
                            padding: "5px",
                            borderRadius: "5px",
                            textAlign: "center",
                            width: "80px",
                          }}>
                        {data.col_status}
                        </div>
                      </td>
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
                                {authrztn?.includes("Master List - Edit") && (
                                  <button
                                    className="btn"
                                    onClick={() => {
                                      handleModalToggle(data);
                                      closeVisibleButtons();
                                    }}
                                  >
                                    Update
                                  </button>
                                )}

                                {authrztn?.includes("Master List - Delete") && (
                                  <button
                                    className="btn"
                                    onClick={() => {
                                      handleDelete(data.col_id);
                                      closeVisibleButtons();
                                    }}
                                  >
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
                          <div className="float" style={{ position: 'absolute', left: '-125px', top: '0' }}>
                            {setButtonVisibles(data.col_id) && (
                              <div className="choices">
                                {authrztn?.includes("Master List - Edit") && (
                                  <button
                                    className="btn"
                                    onClick={() => {
                                      handleModalToggle(data);
                                      closeVisibleButtons();
                                    }}
                                  >
                                    Update
                                  </button>
                                )}

                                {authrztn?.includes("Master List - Delete") && (
                                  <button
                                    className="btn"
                                    onClick={() => {
                                      handleDelete(data.col_id);
                                      closeVisibleButtons();
                                    }}
                                  >
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

      {/* Add User */}
      <Modal show={showModal} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "24px" }}>New User</Modal.Title>
          <div className="form-group d-flex flex-row ">
            <React.Fragment>
              <label className="userstatus">User Status</label>
              <input
                type="checkbox"
                name="cstatus"
                className="toggle-switch" // Add the custom class
                onChange={handleFormChange}
                defaultChecked={FormData.ustatus} // Set defaultChecked based on ustatus
              />
            </React.Fragment>
          </div>
        </Modal.Header>
        <form onSubmit={handleFormSubmit}>
          <Modal.Body>
            <div
              className="gen-info"
              style={{ fontSize: "20px", position: "relative" }}>
              General Information
              <span className="gene-info"
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "78%",
                  background: "#FFA500",
                  top: "65%",
                  left: "18rem",
                  transform: "translateY(-50%)",
                }}></span>
            </div>
            <Form>
              <div className="row mt-3">
                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: "20px" }}>Name: </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      maxLength={50}
                      style={{ height: "40px", fontSize: "15px" }}
                      value={formData.cname}
                      onChange={handleFormChange}
                      name="cname"
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Address:{" "}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Slashtech, Valenzuela City 164"
                      style={{ height: "40px", fontSize: "15px" }}
                      value={formData.caddress}
                      onChange={handleFormChange}
                      name="caddress"
                      required
                    />
                  </Form.Group>
                </div>
              </div>
            </Form>

            <Form>
              <div className="row">
                <div className="col-4">
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Contact:{" "}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your contact number"
                      style={{ height: "40px", fontSize: "15px" }}
                      value={formData.cnum}
                      onChange={handleFormChange}
                      name="cnum"
                      maxLength={11}
                      required
                    />
                  </Form.Group>
                </div>
                <div className="col-4">
                  <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Email:{" "}
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="email@example.com"
                      value={formData.cemail}
                      onChange={handleFormChange}
                      required
                      name="cemail"
                      pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                      style={{ height: "40px", fontSize: "15px" }}
                    />
                  </Form.Group>
                </div>
                <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Department:{" "}
                    </Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      name="cdept"
                      value={formData.cdept}
                      onChange={handleFormChange}
                      required
                      style={{ height: "40px", fontSize: "15px" }}>
                      <option disabled value="">
                        Department
                      </option>
                      {department.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.department_name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
              </div>
            </Form>

            <div
              className="gen-info"
              style={{ fontSize: "20px", position: "relative" }}>
              Account Access
              <span className="acc-acc"
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "82%",
                  background: "#FFA500",
                  top: "65%",
                  left: "14rem",
                  transform: "translateY(-50%)",
                }}></span>
            </div>
            <Form>
              <div className="row mt-3">
                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Username:{" "}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your username"
                      style={{ height: "40px", fontSize: "15px" }}
                      value={formData.cuname}
                      onChange={handleFormChange}
                      name="cuname"
                      required
                    />
                    {/* <input type="text" style={{height: '40px', fontSize: '15px'}} placeholder="Complete Name" className="form-control" value={formData.cname} onChange={handleFormChange} name="cname" required /> */}
                  </Form.Group>
                </div>
                <div className="col-6">

                <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Role Type:{" "}
                    </Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      name="crole"
                      value={formData.crole}
                      onChange={handleFormChange}
                      required
                      style={{ height: "40px", fontSize: "15px" }}>
                      <option disabled value="">
                        Role
                      </option>
                      {roles.map((role) => (
                        <option key={role.col_id} value={role.col_id}>
                          {role.col_rolename}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
              </div>
            </Form>

            <Form>
              <div className="row">
                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Password:{" "}
                    </Form.Label>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      value={formData.cpass}
                      onChange={handleFormChange}
                      required
                      name="cpass"
                      placeholder="Enter your password"
                      style={{ height: "40px", fontSize: "15px" }}
                    />
                    <div className="show">
                      {showPassword ? (
                        <FaEyeSlash
                          className="eye"
                          onClick={togglePasswordVisibility}
                        />
                      ) : (
                        <FaEye
                          className="eye"
                          onClick={togglePasswordVisibility}
                        />
                      )}
                    </div>
                  </Form.Group>
                </div>
                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Confirm Password:{" "}
                    </Form.Label>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.cpass2}
                      onChange={handleFormChange}
                      required
                      name="cpass2"
                      placeholder="Confirm your password"
                      style={{ height: "40px", fontSize: "15px" }}
                    />
                    <div className="show">
                      {showConfirmPassword ? (
                        <FaEyeSlash
                          className="eye"
                          onClick={toggleConfirmPasswordVisibility}
                        />
                      ) : (
                        <FaEye
                          className="eye"
                          onClick={toggleConfirmPasswordVisibility}
                        />
                      )}
                    </div>
                  </Form.Group>
                </div>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="submit"
              variant="warning"
              size="md"
              style={{ fontSize: "20px" }}>
              Add
            </Button>
            <Button
              variant="secondary"
              size="md"
              onClick={handleClose}
              style={{ fontSize: "20px" }}>
              Cancel
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      <Modal
        show={updateModalShow}
        onHide={() => handleModalToggle()}
        size="xl">
        <form onSubmit={handleUpdateSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="modal-titles" style={{ fontSize: "24px" }}>
              Update User
            </Modal.Title>

            <div className="form-group d-flex flex-row ">
              <React.Fragment>
                <label className="userstatus">User Status</label>
                <input
                  type="checkbox"
                  name="ustatus"
                  className="toggle-switch" 
                  onChange={handleUpdateFormChange}
                  defaultChecked={updateFormData.ustatus}
                />
              </React.Fragment>
            </div>
          </Modal.Header>
          <Modal.Body>
            <div
              className="gen-info"
              style={{ fontSize: "20px", position: "relative" }}>
              General Information
              <span className="gene-info"
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "78%",
                  background: "#FFA500",
                  top: "65%",
                  left: "18rem",
                  transform: "translateY(-50%)",
                }}></span>
            </div>
            <Form>
              <div className="row mt-3">
                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: "20px" }}>Name: </Form.Label>
                    <Form.Control
                      type="text"
                      value={updateFormData.uaname}
                      onChange={handleUpdateFormChange}
                      maxLength={50}
                      name="uaname"
                      placeholder="Enter your name"
                      style={{ height: "40px", fontSize: "15px" }}
                    />
                  </Form.Group>
                </div>
                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Address:{" "}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={updateFormData.uaaddress}
                      onChange={handleUpdateFormChange}
                      name="uaaddress"
                      placeholder="Slashtech, Valenzuela City 164"
                      style={{ height: "40px", fontSize: "15px" }}
                    />
                  </Form.Group>
                </div>
              </div>
            </Form>

            <Form>
              <div className="row">
                <div className="col-4">
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Contact:{" "}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={updateFormData.uanum}
                      maxLength={15}
                      onChange={handleUpdateFormChange}
                      name="uanum"
                      placeholder="Enter your contact number"
                      style={{ height: "40px", fontSize: "15px" }}
                    />
                  </Form.Group>
                </div>
                <div className="col-4">
                  <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Email:{" "}
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
                      value={updateFormData.uaemail}
                      onChange={handleUpdateFormChange}
                      name="uaemail"
                      style={{ height: "40px", fontSize: "15px" }}
                    />
                  </Form.Group>
                </div>

                <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Role Type:{" "}
                    </Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      name="uadept"
                      value={updateFormData.uadept}
                      onChange={handleUpdateFormChange}
                      required
                      style={{ height: "40px", fontSize: "15px" }}>
                      <option disabled value="">
                        Department
                      </option>
                      {department.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.department_name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
              </div>
            </Form>

            <div
              className="gen-info"
              style={{ fontSize: "20px", position: "relative" }}>
              Account Access
              <span className="acc-acc"
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "82%",
                  background: "#FFA500",
                  top: "65%",
                  left: "14rem",
                  transform: "translateY(-50%)",
                }}></span>
            </div>
            <Form>
              <div className="row mt-3">
                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Username:{" "}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={updateFormData.uauname}
                      onChange={handleUpdateFormChange}
                      name="uauname"
                      placeholder="Enter your name"
                      style={{ height: "40px", fontSize: "15px" }}
                    />
                  </Form.Group>
                </div>
                <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Role Type:{" "}
                    </Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      name="uarole"
                      value={updateFormData.uarole}
                      onChange={handleUpdateFormChange}
                      required
                      style={{ height: "40px", fontSize: "15px" }}>
                      <option disabled value="">
                        Role
                      </option>
                      {roles.map((role) => (
                        <option key={role.col_roleID} value={role.col_id}>
                          {role.col_rolename}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
              </div>
            </Form>

          {!changePass && (
            <div className="change-pass">
              <button className="change-password" type="button" onClick={handleToggleChangePass}>
                Change Password
              </button>
            </div>
          )}

          {changePass && (
            <Form>
              <div className="row">
                <div className="col-6">
                  {/* <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Current Password:{" "}
                    </Form.Label>
                    <Form.Control
                      type={showCurrentPassword ? "text" : "password"}
                      value={updateFormData.uapass}
                      disabled
                      style={{ height: "40px", fontSize: "15px" }}
                    />
                    <div className="show">
                      {showCurrentPassword ? (
                        <FaEyeSlash
                          className="eye"
                          onClick={toggleCurrentPasswordVisibility}
                        />
                      ) : (
                        <FaEye
                          className="eye"
                          onClick={toggleCurrentPasswordVisibility}
                        />
                      )}
                    </div>
                  </Form.Group> */}
                </div>

                <div className="col-6"></div>

                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: "20px" }}>
                      New Password:{" "}
                    </Form.Label>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      onChange={handleUpdateFormChange}
                      required
                      placeholder="Enter your password"
                      style={{ height: "40px", fontSize: "15px" }}
                    />
                    <div className="show">
                      {showPassword ? (
                        <FaEyeSlash
                          className="eye"
                          onClick={togglePasswordVisibility}
                        />
                      ) : (
                        <FaEye
                          className="eye"
                          onClick={togglePasswordVisibility}
                        />
                      )}
                    </div>
                  </Form.Group>
                </div>
                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Confirm Password:{" "}
                    </Form.Label>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      onChange={handleUpdateFormChange}
                      required
                      name="uapass"
                      placeholder="Confirm your password"
                      style={{ height: "40px", fontSize: "15px" }}
                    />
                    <div className="show">
                      {showConfirmPassword ? (
                        <FaEyeSlash
                          className="eye"
                          onClick={toggleConfirmPasswordVisibility}
                        />
                      ) : (
                        <FaEye
                          className="eye"
                          onClick={toggleConfirmPasswordVisibility}
                        />
                      )}
                    </div>
                  </Form.Group>
                </div>
              </div>
            </Form>
          )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="submit"
              variant="warning"
              className=""
              style={{ fontSize: "20px" }}>
              Update
            </Button>
            <Button
              variant="secondary"
              onClick={() => setUpdateModalShow(!updateModalShow)}
              style={{ fontSize: "20px" }}>
              Close
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}
export default MasterList;
