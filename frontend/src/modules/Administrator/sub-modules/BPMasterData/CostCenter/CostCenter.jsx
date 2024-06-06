import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import NoData from "../../../../../assets/image/NoData.png";
import NoAccess from "../../../../../assets/image/NoAccess.png";
// import Sidebar from "../../../../Sidebar/sidebar";
import "../../../../../assets/global/style.css";
import "../../../../styles/react-style.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import swal from "sweetalert";
import BASE_URL from "../../../../../assets/global/url";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/esm/Button";
import {
  Plus,
  DotsThreeCircle,
  DotsThreeCircleVertical,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import * as $ from "jquery";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { jwtDecode } from "jwt-decode";
import { IconButton, TextField, TablePagination } from "@mui/material";

function CostCenter({ authrztn }) {
  const [CostCenter, setCostCenter] = useState([]);
  const [searchCostCenter, setSearchCostcenter] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const [select_masterlist, setSelect_Masterlist] = useState([]);
  const [description, setDescription] = useState("");
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [showChangeStatusButton, setShowChangeStatusButton] = useState(false);
  const [showStatusmodal, setShowStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Active");
  const [status, setStatus] = useState("Active");
  const [validated, setValidated] = useState(false);

  const [visibleButtons, setVisibleButtons] = useState({});
  const [isVertical, setIsVertical] = useState({});
  const [userId, setuserId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(CostCenter.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, CostCenter.length);
  const currentItems = CostCenter.slice(startIndex, endIndex);
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
      pages.unshift("...");
    }
    if (endPage < totalPages) {
      pages.push("...");
    }

    return pages;
  };

  //pagination end

  const handlePageClick = (page) => {
    if (page === "...") return;
    setCurrentPage(page);
  };

  const decodeToken = () => {
    var token = localStorage.getItem("accessToken");
    if (typeof token === "string") {
      var decoded = jwtDecode(token);
      setuserId(decoded.id);
    }
  };

  useEffect(() => {
    decodeToken();
  }, []);

  const reloadTable = () => {
    const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/costCenter/getCostCenter")
        .then((res) => {
          setCostCenter(res.data);
          setSearchCostcenter(res.data);
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
    const filteredData = searchCostCenter.filter((data) => {
      return (
        data.name.toLowerCase().includes(searchTerm) ||
        // data.masterlist.col_Fname.toLowerCase().includes(searchTerm) ||
        formatDatetime(data.createdAt).toLowerCase().includes(searchTerm) ||
        // data.masterlist.col_phone.toLowerCase().includes(searchTerm) ||
        data.status.toLowerCase().includes(searchTerm)
      );
    });

    setCostCenter(filteredData);
  };

  const add = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      swal({
        icon: "error",
        title: "Fields are required",
        text: "Please fill in the Required fields",
      });
    } else {
      axios
        .post(BASE_URL + "/costCenter/create", {
          name,
          masterList,
          description,
          status,
          userId,
        })
        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Cost Center Added Successfully!",
              text: "The new cost center has been added successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              reloadTable();
              handleClose();
            });
          } else if (res.status === 201) {
            swal({
              title: "Cost Center is Already Exists",
              text: "Please enter a different cost center ",
              icon: "error",
            });
          } else {
            swal({
              title: "Something went wrong",
              text: "Please Contact our Support",
              icon: "error",
              button: "OK",
            });
          }
        });
    }
    setValidated(true); //for validations
  };

  const [showModal, setShowModal] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    uname: "",
    ucol_id: "",
    udescription: "",
    ustatus: false,
    updateId: null,
  });

  const navigate = useNavigate();

  const handleClose = () => {
    setShowModal(false);
  };

  const handleShow = () => setShowModal(true);

  const handleModalToggle = (updateData) => {
    setUpdateModalShow(!updateModalShow);
    if (updateData) {
      setUpdateFormData({
        updateId: updateData.id,
        uname: updateData.name,
        ucol_id: updateData.col_id,
        udescription: updateData.description,
        ustatus: updateData.status,
      });
    } else {
      setUpdateFormData({
        uname: "",
        ucol_id: "",
        udescription: "",
        ustatus: false,
        updateId: null,
      });
    }
  };

  const handleUpdateFormChange = (e) => {
    // const { name, value,  } = e.target;
    const { name, value, type, checked } = e.target;

    // setUpdateFormData((prevData) => ({
    //   ...prevData,
    //   [name]: value,
    // }));
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
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const updaemasterID = updateFormData.updateId;
      const response = await axios.put(
        BASE_URL +
          `/costCenter/update/${updateFormData.updateId}?userId=${userId}`,
        {
          name: updateFormData.uname,
          // col_id: updateFormData.ucol_id,
          description: updateFormData.udescription,
          status: updateFormData.ustatus ? "Active" : "Inactive",
        }
      );

      if (response.status === 200) {
        swal({
          title: "Cost Center Update Successful!",
          text: "The Cost Center has been successfully updated.",
          icon: "success",
          button: "OK",
        }).then(() => {
          handleModalToggle();
          reloadTable();
          setUpdateFormData({
            uname: "",
            ucol_id: "",
            udescription: "",
            ustatus: "",
          });
        });
      } else if (response.status === 202) {
        swal({
          icon: "error",
          title: "Cost Center Already Exists",
          text: "Please input a new Cost Center.",
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

  const handleDelete = async (id) => {
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
            BASE_URL + `/costCenter/delete/${id}?userId=${userId}`
          );

          if (response.status === 200) {
            swal({
              title: "Cost Center Delete Successful!",
              text: "The Cost Center has been successfully deleted.",
              icon: "success",
              button: "OK",
            }).then(() => {
              setCostCenter((prev) => prev.filter((data) => data.id !== id));
            });
          } else if (response.status === 202) {
            swal({
              icon: "error",
              title: "Delete Prohibited",
              text: "You cannot delete a Cost Center that is in use.",
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
      } else {
        swal({
          title: "Cancelled Successfully",
          text: "Cost Center not Deleted!",
          icon: "warning",
        });
      }
    });
  };

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

  // ----------------------------------Start Get  Master List------------------------------//
  const [masterList, setMasteList] = useState([]);
  useEffect(() => {
    axios
      .get(BASE_URL + "/masterList/masterTable")
      .then((response) => {
        setMasteList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching master list:", error);
      });
  }, []);

  // const handleFormChangeMasterList = (event) => {
  //   setSelect_Masterlist(event.target.value);
  // };

  const handleActiveStatus = (e) => {
    if (status === "Active") {
      setStatus("Inactive");
    } else {
      setStatus("Active");
    }
  };

  const handleCheckboxChange = (costCenterId) => {
    const updatedCheckboxes = [...selectedCheckboxes];

    if (updatedCheckboxes.includes(costCenterId)) {
      updatedCheckboxes.splice(updatedCheckboxes.indexOf(costCenterId), 1);
    } else {
      updatedCheckboxes.push(costCenterId);
    }

    setSelectedCheckboxes(updatedCheckboxes);
    setShowChangeStatusButton(updatedCheckboxes.length > 0);
  };

  const handleSelectAllChange = () => {
    const allCostCenterId = CostCenter.map((data) => data.id);

    if (allCostCenterId.length === 0) {
      // No data, disable the checkbox
      return;
    }

    if (selectedCheckboxes.length === allCostCenterId.length) {
      setSelectedCheckboxes([]);
      setShowChangeStatusButton(false);
    } else {
      setSelectedCheckboxes(allCostCenterId);
      setShowChangeStatusButton(true);
    }

    setSelectAllChecked(selectedCheckboxes.length !== allCostCenterId.length);

    $("input[type='checkbox']").prop(
      "checked",
      selectedCheckboxes.length !== allCostCenterId.length
    );
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleCloseStatus = () => setShowStatus(false);
  const handleShowStatus = () => setShowStatus(true);

  const handleSave = () => {
    axios
      .put(BASE_URL + "/costCenter/statusupdate", {
        costCenterId: selectedCheckboxes,
        status: selectedStatus,
        userId,
      })
      .then((res) => {
        if (res.status === 200) {
          swal({
            title: "Cost Center Status Update",
            text: "The status has been updated successfully.",
            icon: "success",
            button: "OK",
          }).then(() => {
            handleCloseStatus();
            reloadTable();
            setSelectAllChecked(false);
            setSelectedCheckboxes([]);
            setShowChangeStatusButton(false);
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
        {isLoading ? (
          <div className="loading-container">
            <ReactLoading className="react-loading" type={"bubbles"} />
            Loading Data...
          </div>
        ) : authrztn.includes("Cost Centre - View") ? (
          <div className="right-body-contents">
            <div className="Employeetext-button">
              <div className="employee-and-button">
                <div className="emp-text-side">
                  <p>Cost Center</p>
                </div>

                {/* <div className="button-create-side">
                  {authrztn?.includes("Cost Centre - Add") &&
                    (showChangeStatusButton ? (
                      <div className="Buttonmodal-change">
                        <button
                          className="buttonchanges"
                          onClick={handleShowStatus}
                        >
                          <span style={{}}>
                            <ArrowsClockwise size={25} />
                          </span>
                          Change Status
                        </button>
                      </div>
                    ) : (
                      <div className="Buttonmodal-new">
                        <button onClick={handleShow}>
                          <span style={{}}>
                            <Plus size={25} />
                          </span>
                          Create New
                        </button>
                      </div>
                    ))}
                </div> */}
              </div>
            </div>

            <div className="btn-and-search">
              {authrztn?.includes("Cost Centre - Add") &&
                (showChangeStatusButton ? (
                  <div className="Buttonmodal-change">
                    <button
                      className="buttonchanges"
                      onClick={handleShowStatus}
                    >
                      <span style={{}}>
                        <ArrowsClockwise size={25} />
                      </span>
                      Change Status
                    </button>
                  </div>
                ) : (
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
                ))}

              <div className="main-table-search">
                <TextField
                  label="Search"
                  variant="outlined"
                  className="main-search act-search cus-btm"
                  style={{ marginBottom: "10px", float: "right" }}
                  InputLabelProps={{
                    style: { fontSize: "14px" },
                  }}
                  InputProps={{
                    style: {
                      fontSize: "14px",
                      // width: "250px",
                      height: "50px",
                    },
                  }}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="table-containss">
              <div className="main-of-all-tables">
                <table className="table-hover">
                  <thead>
                    <tr>
                      {/* <th className="tableh">ID</th> */}
                      <th className="tableh" id="check">
                        <input
                          type="checkbox"
                          checked={selectAllChecked}
                          onChange={handleSelectAllChange}
                          disabled={CostCenter.length === 0}
                        />
                      </th>
                      <th className="tableh">Name</th>
                      <th className="tableh">Description</th>
                      <th className="tableh">Status</th>
                      <th className="tableh">Date Created</th>
                      <th className="tableh">Date Modified</th>
                      <th className="tableh">Action</th>
                    </tr>
                  </thead>
                  {CostCenter.length > 0 ? (
                    <tbody>
                      {/* <CostContext.Provider value={costData}> */}
                      {currentItems.map((data, i) =>
                        data.col_Fname !== null ? (
                          <tr key={i}>
                            {/* <td
                        onClick={() => navigate(`/viewCostCenter/${data.id}`)}>
                        {data.id}
                      </td> */}
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedCheckboxes.includes(data.id)}
                                onChange={() => handleCheckboxChange(data.id)}
                              />
                            </td>
                            <td
                              onClick={() =>
                                navigate(`/viewCostCenter/${data.id}`)
                              }
                            >
                              {data.name}
                            </td>
                            <td
                              onClick={() =>
                                navigate(`/viewCostCenter/${data.id}`)
                              }
                            >
                              {data.description}
                            </td>
                            <td
                              onClick={() =>
                                navigate(`/viewCostCenter/${data.id}`)
                              }
                            >
                              <div
                                className="colorstatus"
                                style={{
                                  backgroundColor:
                                    data.status === "Active" ? "green" : "red",
                                  color: "white",
                                  padding: "5px",
                                  borderRadius: "5px",
                                  textAlign: "center",
                                  width: "80px",
                                }}
                              >
                                {data.status}
                              </div>
                            </td>
                            <td
                              onClick={() =>
                                navigate(`/viewCostCenter/${data.id}`)
                              }
                            >
                              {formatDatetime(data.createdAt)}
                            </td>
                            <td
                              onClick={() =>
                                navigate(`/viewCostCenter/${data.id}`)
                              }
                            >
                              {formatDatetime(data.updatedAt)}
                            </td>
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
                                          "Cost Centre - Edit"
                                        ) && (
                                          <button
                                            onClick={() => {
                                              handleModalToggle(data);
                                              closeVisibleButtons();
                                            }}
                                            style={{
                                              fontSize: "15px",
                                              fontWeight: "700",
                                            }}
                                            className="btn"
                                          >
                                            Update
                                          </button>
                                        )}

                                        {authrztn?.includes(
                                          "Cost Centre - Delete"
                                        ) && (
                                          <button
                                            onClick={() => {
                                              handleDelete(data.id);
                                              closeVisibleButtons();
                                            }}
                                            className="btn"
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
                                          "Master List - Edit"
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
                                          "Master List - Delete"
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
                        ) : null
                      )}
                    </tbody>
                  ) : (
                    <div className="no-data">
                      <img src={NoData} alt="NoData" className="no-data-img" />
                      <h3>No Data Found</h3>
                    </div>
                  )}
                </table>
              </div>
            </div>
            <nav style={{ marginTop: "15px" }}>
              <ul className="pagination" style={{ float: "right" }}>
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    type="button"
                    style={{
                      fontSize: "14px",
                      cursor: "pointer",
                      color: "#000000",
                      textTransform: "capitalize",
                    }}
                    className="page-link"
                    onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
                  >
                    Previous
                  </button>
                </li>
                {generatePages().map((page, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    <button
                      style={{
                        fontSize: "14px",
                        width: "25px",
                        background: currentPage === page ? "#FFA500" : "white",
                        color: currentPage === page ? "#FFFFFF" : "#000000",
                        border: "none",
                        height: "28px",
                      }}
                      className={`page-link ${
                        currentPage === page ? "gold-bg" : ""
                      }`}
                      onClick={() => handlePageClick(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    style={{
                      fontSize: "14px",
                      cursor: "pointer",
                      color: "#000000",
                      textTransform: "capitalize",
                    }}
                    className="page-link"
                    onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        ) : (
          <div className="no-access">
            <img src={NoAccess} alt="NoAccess" className="no-access-img" />
            <h3>You don't have access to this function.</h3>
          </div>
        )}
      </div>

      <Modal
        size="md"
        show={showStatusmodal}
        onHide={handleCloseStatus}
        backdrop="static"
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title
            style={{ fontSize: "24px", fontFamily: "Poppins, Source Sans Pro" }}
          >
            Change Status
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="exampleForm.ControlInput2">
            <Form.Label
              style={{
                fontSize: "20px",
                fontFamily: "Poppins, Source Sans Pro",
              }}
            >
              Status
            </Form.Label>
            <Form.Select
              style={{ height: "40px", fontSize: "15px" }}
              onChange={handleStatusChange}
              value={selectedStatus}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              {/* <option value="Archive">Archive</option> */}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-warning"
            onClick={handleSave}
            style={{ fontSize: "20px" }}
          >
            Save
          </Button>
          <Button
            variant="outline-secondary"
            onClick={handleCloseStatus}
            style={{ fontSize: "20px" }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <Modal.Header>
          <Modal.Title
            style={{ fontSize: "24px", fontFamily: "Poppins, Source Sans Pro" }}
          >
            <div className="costtoggleandtitle">
              <h1>Create Cost Center</h1>

              <div className="toggleStats">
                <label style={{ fontSize: 15 }}>Active Status</label>
                <input
                  type="checkbox"
                  name="cstatus"
                  className="toggle-switch" // Add the custom class
                  onChange={handleActiveStatus}
                  defaultChecked={status}
                />
              </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={add}>
            <div className="row mt-3">
              <div className="col-12">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label
                    style={{
                      fontSize: "20px",
                      fontFamily: "Poppins, Source Sans Pro",
                    }}
                  >
                    Cost Center:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    style={{
                      height: "40px",
                      fontSize: "15px",
                      fontFamily: "Poppins, Source Sans Pro",
                    }}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>
              </div>
              {/* <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Assign User:
                  </Form.Label>
                  <Form.Select
                    aria-label=""
                    onChange={handleFormChangeMasterList}
                    required
                    style={{
                      height: "40px",
                      fontSize: "15px",
                      fontFamily: "Poppins, Source Sans Pro",
                    }}
                    defaultValue=""
                  >
                    <option disabled value="">
                      Select User
                    </option>
                    {masterList.map((masterList) => (
                      <option key={masterList.col_id} value={masterList.col_id}>
                        {masterList.col_Fname}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div> */}
            </div>
            <div className="row">
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label style={{ fontSize: "20px" }}>
                  Description:{" "}
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
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
            </div>

            <div className="save-cancel">
              <Button
                type="submit"
                className="btn btn-warning"
                size="md"
                style={{
                  fontSize: "20px",
                  fontFamily: "Poppins, Source Sans Pro",
                  margin: "0px 5px",
                }}
              >
                Save
              </Button>
              <Button
                onClick={() => {
                  handleClose();
                }}
                className="btn btn-secondary btn-md"
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
        show={updateModalShow}
        onHide={() => handleModalToggle()}
        backdrop="static"
        keyboard={false}
        size="lg"
      >
        <form onSubmit={handleUpdateSubmit}>
          <Modal.Header>
            <Modal.Title
              style={{
                fontSize: "24px",
                fontFamily: "Poppins, Source Sans Pro",
              }}
            >
              <div className="costtoggleandtitle">
                <h1>Update Cost Center</h1>

                <div className="toggleStats">
                  <label style={{ fontSize: 15 }}>Active Status</label>
                  <input
                    type="checkbox"
                    name="ustatus"
                    className="toggle-switch" // Add the custom class
                    onClick={handleUpdateFormChange}
                    defaultChecked={updateFormData.ustatus === "Active"}
                  />
                </div>
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row mt-3">
              <div className="col-12">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label
                    style={{
                      fontSize: "20px",
                      fontFamily: "Poppins, Source Sans Pro",
                    }}
                  >
                    Cost Center:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    style={{
                      height: "40px",
                      fontSize: "15px",
                      fontFamily: "Poppins, Source Sans Pro",
                    }}
                    onChange={handleUpdateFormChange}
                    value={updateFormData.uname}
                    required
                    name="uname"
                  />
                </Form.Group>
              </div>
              {/* <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Assign User:
                  </Form.Label>
                  <Form.Select
                    aria-label=""
                    onChange={handleUpdateFormChange}
                    value={updateFormData.ucol_id}
                    name="ucol_id"
                    required
                    style={{
                      height: "40px",
                      fontSize: "15px",
                      fontFamily: "Poppins, Source Sans Pro",
                    }}
                    defaultValue=""
                  >
                    <option disabled value="">
                      Select User
                    </option>
                    {masterList.map((masterList) => (
                      <option key={masterList.col_id} value={masterList.col_id}>
                        {masterList.col_Fname}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div> */}
            </div>
            <div className="row">
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label style={{ fontSize: "20px" }}>
                  Description:{" "}
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
                  onChange={handleUpdateFormChange}
                  value={updateFormData.udescription}
                  name="udescription"
                />
              </Form.Group>
            </div>

            <div className="save-cancel">
              <Button
                type="submit"
                className="btn btn-warning"
                size="md"
                style={{
                  fontSize: "20px",
                  fontFamily: "Poppins, Source Sans Pro",
                  margin: "0px 5px",
                }}
              >
                Update
              </Button>
              <Button
                onClick={() => setUpdateModalShow(!updateModalShow)}
                className="btn btn-secondary btn-md"
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
          </Modal.Body>
        </form>
      </Modal>
    </div>
  );
}

export default CostCenter;
