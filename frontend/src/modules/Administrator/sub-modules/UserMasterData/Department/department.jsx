import React, { useEffect, useState } from "react";
import "../../../../../assets/global/style.css";
import "../../../../styles/react-style.css";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/esm/Button";
import * as $ from "jquery";
import {
  Plus,
  DotsThreeCircle,
  DotsThreeCircleVertical,
} from "@phosphor-icons/react";
import BASE_URL from "../../../../../assets/global/url";
import ReactLoading from "react-loading";
import NoData from "../../../../../assets/image/NoData.png";
import NoAccess from "../../../../../assets/image/NoAccess.png";
import { jwtDecode } from "jwt-decode";
import { IconButton, TextField, TablePagination, } from '@mui/material';

function Warehouse({ authrztn }) {
  const [departmentname, setDepartmentname] = useState("");
  const [description, setDescription] = useState("");
  const [validated, setValidated] = useState(false);
  const [department, setDepartment] = useState([]);
  const [searchDepartment, setSearchDepartment] = useState([]);
  const [visibleButtons, setVisibleButtons] = useState({});
  const [isVertical, setIsVertical] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [Fname, setFname] = useState("");
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setuserId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(department.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, department.length);
  const currentItems = department.slice(startIndex, endIndex);
  const MAX_PAGES = 5;

  const generatePages = () => {
    const pages = [];
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > MAX_PAGES) {
      const half = Math.floor(MAX_PAGES / 2);
      if (currentPage <= half + 1) {
        endPage = MAX_PAGES;
      } else if (currentPage >= totalPages - half) {
        startPage = totalPages - MAX_PAGES + 1;
      } else {
        startPage = currentPage - half;
        endPage = currentPage + half;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (startPage > 1) {
      pages.unshift('...');
    }
    if (endPage < totalPages) {
      pages.push('...');
    }

    return pages;
  };

  const handlePageClick = (page) => {
    if (page === '...') return;
    setCurrentPage(page);
  };

  const decodeToken = () => {
    var token = localStorage.getItem("accessToken");
    if (typeof token === "string") {
      var decoded = jwtDecode(token);
      setUsername(decoded.username);
      setFname(decoded.Fname);
      setUserRole(decoded.userrole);
      setuserId(decoded.id);
    }
  };

  useEffect(() => {
    decodeToken();
  }, []);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleShow = () => setShowModal(true);

  const reloadTable = () => {
    const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/department/fetchtableDepartment")
        .then((res) => {
          setDepartment(res.data);
          setSearchDepartment(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }, 1000);

    return () => clearTimeout(delay);
  };

  useEffect(() => {
    reloadTable();
  }, []);

  const handleSearch = (event) => {
    setCurrentPage(1);
    const searchTerm = event.target.value.toLowerCase();
    const filteredData = searchDepartment.filter((data) => {
      return (
        data.department_name.toLowerCase().includes(searchTerm) ||
        data.description.toLowerCase().includes(searchTerm) ||
        formatDatetime(data.createdAt).toLowerCase().includes(searchTerm) ||
        formatDatetime(data.updatedAt).toLowerCase().includes(searchTerm)
        
      );
    });
  
    setDepartment(filteredData);
  };

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

  const handleDescriptionChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue.length <= 1000) {
      setDescription(inputValue);
    }
  };

  const add = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (departmentname.trim() === "") {
      swal({
        icon: "error",
        title: "Fields are required",
        text: "Please fill in Required fields",
      });
      setValidated(true);
      return;
    }

    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      swal({
        icon: "error",
        title: "Fields are required",
        text: "Please fill the Required text fields",
      });
    } else {
      axios
        .post(BASE_URL + "/department/createDepartment", {
          departmentname,
          description,
          userId,
        })
        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Department Added Successful!",
              text: "The Department has been added successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              handleClose();
              reloadTable();
              setValidated(false);
            });
          } else if (res.status === 201) {
            swal({
              title: "Department is Already Exist",
              text: "Please enter a different department ",
              icon: "error",
            });
          } else {
            swal({
              title: "Something went wrong",
              text: "Please contact our support team.",
              icon: "error",
              button: "OK",
            });
          }
        });
    }
    setValidated(true);
  };

  const toggleButtons = (DepartmentId) => {
    setVisibleButtons((prevVisibleButtons) => {
      const updatedVisibleButtons = { ...prevVisibleButtons };

      // Close buttons for other items
      Object.keys(updatedVisibleButtons).forEach((key) => {
        if (key !== DepartmentId) {
          updatedVisibleButtons[key] = false;
        }
      });

      // Toggle buttons for the clicked item
      updatedVisibleButtons[DepartmentId] = !prevVisibleButtons[DepartmentId];

      return updatedVisibleButtons;
    });

    setIsVertical((prevIsVertical) => {
      const updateVertical = { ...prevIsVertical };

      Object.keys(updateVertical).forEach((key) => {
        if (key !== DepartmentId) {
          updateVertical[key] = false;
        }
      });

      // Toggle buttons for the clicked item
      updateVertical[DepartmentId] = !prevIsVertical[DepartmentId];

      return updateVertical;
    });
  };

  const closeVisibleButtons = () => {
    setVisibleButtons({});
    setIsVertical({});
  };
  const setButtonVisibles = (DepartmentId) => {
    return visibleButtons[DepartmentId] || false;
  };

  //Update Department in modal
  const [updateFormData, setUpdateFormData] = useState({
    department_name: "",
    description: "",
    id: null,
  });

  const handleModalToggle = (updateData = null) => {
    setUpdateModalShow(!updateModalShow);
    if (updateData) {
      setUpdateFormData({
        department_name: updateData.department_name,
        description: updateData.description,
        id: updateData.id,
      });
    } else {
      setUpdateFormData({
        department_name: "",
        description: "",
        id: null,
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

    if (updateFormData.department_name.trim() === "") {
      // Display an error message or take any other action you want when the category name is empty
      swal({
        icon: "error",
        title: "Department Name is required",
        text: "Please enter a Department Name before updating.",
      });
      return;
    }

    try {
      const updaemasterID = updateFormData.id;
      const response = await axios.put(
        BASE_URL +
          `/department/updateDepartment/${updateFormData.id}?userId=${userId}`,
        {
            department_name: updateFormData.department_name,
            description: updateFormData.description,
        }
      );

      if (response.status === 200) {
        swal({
          title: "Department Update Successful!",
          text: "The Department has been updated successfully.",
          icon: "success",
          button: "OK",
        }).then(() => {
          handleModalToggle();
          reloadTable();
          setValidated(false);
        });
      } else if (response.status === 202) {
        swal({
          icon: "error",
          title: "Department already exists",
          text: "Please enter a different Department",
        });
      } else {
        swal({
          icon: "error",
          title: "Something went wrong",
          text: "Please contact our support team.",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  //delete Department
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
            BASE_URL +
              `/department/deleteDepartment/${table_id}?userId=${userId}`
          );

          if (response.status === 200) {
            swal({
              title: "Department Deleted Succesfully!",
              text: "The Department has been deleted successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              reloadTable();
            });
          } else if (response.status === 202) {
            swal({
              icon: "error",
              title: "Deletion Prohibited",
              text: "You cannot delete Department that is used",
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
  //   if ($("#order-listing").length > 0 && department.length > 0) {
  //     $("#order-listing").DataTable();
  //   }
  // }, [department]);
  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
        {isLoading ? (
          <div className="loading-container">
            <ReactLoading className="react-loading" type={"bubbles"} />
            Loading Data...
          </div>
        ) : authrztn.includes("Department - View") ? (
          <div className="right-body-contents">
            <div className="Employeetext-button">
              <div className="employee-and-button">
                <div className="emp-text-side">
                  <p>Department</p>
                </div>

                <div className="button-create-side">
                  <div className="Buttonmodal-new">
                    {authrztn?.includes("Department - Add") && (
                      <button onClick={handleShow}>
                        <span style={{}}>
                          <Plus size={25} />
                        </span>
                        Create New
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
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
                <table className="table-hover">
                  <thead>
                    <tr>
                      <th className="tableh">Department Name</th>
                      <th className="tableh">Description</th>
                      <th className="tableh">Date Created</th>
                      <th className="tableh">Date Modified</th>
                      <th className="tableh">Action</th>
                    </tr>
                  </thead>
                  {department.length > 0 ? (
                    <tbody>
                      {currentItems.map((data, i) => (
                        <tr key={i}>
                          <td>{data.department_name}</td>
                          <td className="autho" style={{width: "250px",  }}>{data.description}</td>
                          <td>{formatDatetime(data.createdAt)}</td>
                          <td>{formatDatetime(data.updatedAt)}</td>
                          <td>
                            {isVertical[data.id] ? (
                              <div
                                style={{
                                  position: "relative",
                                  display: "inline-block",
                                }}
                              >
                                <DotsThreeCircleVertical
                                  size={32}
                                  className="dots-icon"
                                  onClick={() => {
                                    toggleButtons(data.id);
                                  }}
                                />
                                <div
                                  className="float"
                                  style={{
                                    position: "absolute",
                                    left: "-125px",
                                    top: "0",
                                  }}
                                >
                                  {setButtonVisibles(data.id) && (
                                    <div className="choices">
                                      {authrztn?.includes(
                                        "Department - Edit"
                                      ) && (
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

                                      {authrztn?.includes(
                                        "Department - Delete"
                                      ) && (
                                        <button
                                          className="btn"
                                          onClick={() => {
                                            handleDelete(data.id);
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
                              <div
                                style={{
                                  position: "relative",
                                  display: "inline-block",
                                }}
                              >
                                <DotsThreeCircle
                                  size={32}
                                  className="dots-icon"
                                  onClick={() => {
                                    toggleButtons(data.id);
                                  }}
                                />
                                <div
                                  className="float"
                                  style={{
                                    position: "absolute",
                                    left: "-125px",
                                    top: "0",
                                  }}
                                >
                                  {setButtonVisibles(data.id) && (
                                    <div className="choices">
                                      {authrztn?.includes(
                                        "Department - Edit"
                                      ) && (
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

                                      {authrztn?.includes(
                                        "Department - Delete"
                                      ) && (
                                        <button
                                          className="btn"
                                          onClick={() => {
                                            handleDelete(data.id);
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
                      <h3>No Data Found</h3>
                    </div>
                  )}
                </table>
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

                    {generatePages().map((page, index) => (
                      <li key={index} className={`page-item ${currentPage === page ? "active" : ""}`}>
                        <button
                          style={{
                            fontSize: '14px',
                            width: '25px',
                            background: currentPage === page ? '#FFA500' : 'white',
                            color: currentPage === page ? '#FFFFFF' : '#000000',
                            border: 'none',
                            height: '28px',
                          }}
                          className={`page-link ${currentPage === page ? "gold-bg" : ""}`}
                          onClick={() => handlePageClick(page)}
                        >
                          {page}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button
                        style={{ fontSize: '14px', cursor: 'pointer', color: '#000000', textTransform: 'capitalize' }}
                        className="page-link"
                        onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
            </div>
          </div>
        ) : (
          <div className="no-access">
            <img src={NoAccess} alt="NoAccess" className="no-access-img" />
            <h3>You don't have access to this function.</h3>
          </div>
        )}
      </div>

      <Modal
        show={updateModalShow}
        onHide={() => handleModalToggle()}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title
            style={{ fontSize: "24px", fontFamily: "Poppins, Source Sans Pro" }}
          >
            Update Department
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={handleUpdateSubmit}>
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="">
                  <Form.Label
                    style={{
                      fontSize: "20px",
                      fontFamily: "Poppins, Source Sans Pro",
                    }}
                  >
                    Deparment Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    style={{
                      height: "40px",
                      fontSize: "15px",
                      fontFamily: "Poppins, Source Sans Pro",
                    }}
                    value={updateFormData.department_name}
                    onChange={handleUpdateFormChange}
                    name="department_name"
                  ></Form.Control>
                </Form.Group>
              </div>
              <div className="col-6">
                
              </div>
              <div className="mt-3">
                <Form.Group controlId="exampleForm.ControlTextarea1">
                  <Form.Label
                    style={{
                      fontSize: "20px",
                      fontFamily: "Poppins, Source Sans Pro",
                    }}
                  >
                    Description
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    style={{
                      fontFamily: "Poppins, Source Sans Pro",
                      fontSize: "16px",
                      height: "200px",
                      maxHeight: "200px",
                      resize: "none",
                      overflowY: "auto",
                    }}
                    value={updateFormData.description}
                    onChange={(e) => {
                      if (e.target.value.length <= 1000) {
                        handleUpdateFormChange(e);
                      }
                    }}
                    name="description"
                  />
                  <small>{updateFormData.description.length}/1000</small>
                </Form.Group>
              </div>
            </div>
            <div className="save-cancel">
              <Button
                variant="warning"
                size="md"
                style={{
                  fontSize: "20px",
                  fontFamily: "Poppins, Source Sans Pro",
                  margin: "0px 5px",
                }}
                type="submit"
              >
                Update
              </Button>
              <Button
                variant="secondary"
                onClick={() => setUpdateModalShow(!updateModalShow)}
                size="md"
                style={{
                  fontSize: "20px",
                  fontFamily: "Poppins, Source Sans Pro",
                  margin: "0px 5px",
                }}
              >
                Close
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title
            style={{ fontSize: "24px", fontFamily: "Poppins, Source Sans Pro" }}
          >
            Create Department
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={add}>
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="">
                  <Form.Label
                    style={{
                      fontSize: "20px",
                      fontFamily: "Poppins, Source Sans Pro",
                    }}
                  >
                    Department Name:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    style={{
                      height: "40px",
                      fontSize: "15px",
                      fontFamily: "Poppins, Source Sans Pro",
                    }}
                    onChange={(e) => setDepartmentname(e.target.value.trim())}
                    required
                  ></Form.Control>
                </Form.Group>
              </div>
              <div className="col-6"></div>
            </div>
            <div className="mt-3">
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label
                  style={{
                    fontSize: "20px",
                    fontFamily: "Poppins, Source Sans Pro",
                  }}
                >
                  Description
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  style={{
                    fontFamily: "Poppins, Source Sans Pro",
                    fontSize: "16px",
                    height: "200px",
                    maxHeight: "200px",
                    resize: "none",
                    overflowY: "auto",
                  }}
                  onChange={handleDescriptionChange}
                  maxLength={1000}
                />
                 <small>{description.length}/1000</small>
              </Form.Group>
            </div>
            <div className="save-cancel">
              <Button
                variant="warning"
                size="md"
                style={{
                  fontSize: "20px",
                  fontFamily: "Poppins, Source Sans Pro",
                  margin: "0px 5px",
                }}
                type="submit"
              >
                Save
              </Button>
              <Button
                variant="secondary"
                onClick={handleClose}
                size="md"
                style={{
                  fontSize: "20px",
                  fontFamily: "Poppins, Source Sans Pro",
                  margin: "0px 5px",
                }}
              >
                Close
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Warehouse;
