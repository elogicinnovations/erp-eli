import React, { useEffect, useState } from "react";
import Sidebar from "../../Sidebar/sidebar";
import "../../../assets/global/style.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../styles/react-style.css";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import ReactLoading from "react-loading";
import NoData from "../../../assets/image/NoData.png";
import NoAccess from "../../../assets/image/NoAccess.png";
import Col from "react-bootstrap/Col";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import subwarehouse from "../../../assets/global/subwarehouse";
import * as $ from "jquery";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { ArrowCircleLeft, Smiley, Note } from "@phosphor-icons/react";
import axios from "axios";
import BASE_URL from "../../../assets/global/url";
import swal from "sweetalert";
import { jwtDecode } from "jwt-decode";

function StockTransferPreview({ authrztn }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  const [source, setSource] = useState([]);
  const [destination, setDestination] = useState([]);
  const [referenceCode, setReferenceCode] = useState();
  const [status, setStatus] = useState();
  const [receivedBy, setReceivedBy] = useState();
  const [remarks, setRemarks] = useState();
  const [product, setProduct] = useState([]); //para pag fetch ng mga registered products

  const [addProductbackend, setAddProductbackend] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [showModal_reject, setShowModal_reject] = useState(false);
  const [showModal_remarks, setShowModal_remarks] = useState(false);
  const [rejectRemarks, setRejectRemarks] = useState("");
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [rejustifyHistory, setRejustifyHistory] = useState([]);

  const [file, setFile] = useState(null);
  const [rejustifyRemarks, setRejustifyRemarks] = useState("");

  const [userId, setuserId] = useState("");
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleRejected = async () => {
    try {
      axios
        .post(`${BASE_URL}/StockTransfer/reject`, null, {
          params: {
            id: id,
            userId: userId,
            remarks: rejectRemarks,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            swal({
              title: "The Stock Transfer Rejected Successful!",
              text: "The request for transferring stock has been rejected.",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate("/stockManagement");
            });
          } else {
            swal({
              icon: "error",
              title: "Something went wrong",
              text: "Please contact our support",
            });
          }
        });
    } catch (err) {
      console.log(err);
    }
  };
  const handleReject = async () => {
    swal({
      title: "Confirm Reject",
      text: "Are you sure you want to reject this purchase request?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (approve) => {
      if (approve) {
        setShowModal_reject(true);
      } else {
        swal({
          title: "Cancelled Successfully",
          icon: "warning",
        });
      }
    });
  };

  const handleReject_history = () => {
    setShowModal_remarks(true);
    axios
      .get(BASE_URL + "/StockTransfer/fetchRejectHistory", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setRejustifyHistory(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleApproveClick = () => {
    swal({
      title: "Are you sure?",
      text: "You are attempting to approve this request",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (approve) => {
      if (approve) {
        try {
          axios
            .post(`${BASE_URL}/StockTransfer/approve`, null, {
              params: {
                id: id,
                userId: userId,
                remarks: remarks,
              },
            })
            .then((res) => {
              console.log(res);
              if (res.status === 200) {
                swal({
                  title: "Stock Transfer Approved Successfully!",
                  text: "The request for transferring stock has been approved.",
                  icon: "success",
                  button: "OK",
                }).then(() => {
                  navigate("/stockManagement");
                });
              } else {
                swal({
                  icon: "error",
                  title: "Something went wrong",
                  text: "Please contact our support",
                });
              }
            });
        } catch (err) {
          console.log(err);
        }
      }
    });
  };

  const handleDownloadFile = async (file, mimeType, fileExtension) => {
    try {
      if (!file) {
        console.error("No file available for download");
        return;
      }

      // Convert the array data into a Uint8Array
      const uint8Array = new Uint8Array(file.data);

      // Create a Blob object from the Uint8Array with the determined MIME type
      const blob = new Blob([uint8Array], { type: mimeType });

      // Create a URL for the Blob object
      const url = window.URL.createObjectURL(blob);

      // Set a default file name with the correct file extension
      const fileName = `RejustifyFile.${fileExtension}`;

      // Create a link element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);

      // Trigger the download
      a.click();

      // Clean up resources
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  // const handleRejectClick = () => {
  //   swal({
  //     title: "Are you sure?",
  //     text: "You are attempting to reject this request",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then(async (approve) => {
  //     if (approve) {
  //       try {
  //         axios
  //           .post(`${BASE_URL}/StockTransfer/reject`, null, {
  //             params: {
  //               id: id,
  //               userId: userId,
  //               remarks: remarks
  //             },
  //           })
  //           .then((res) => {
  //             console.log(res);
  //             if (res.status === 200) {
  //               swal({
  //                 title: "The Stock Transfer Rejected Successful!",
  //                 text: "The request for transferring stock has been rejected.",
  //                 icon: "success",
  //                 button: "OK",
  //               }).then(() => {
  //                 navigate("/stockManagement");
  //               });
  //             } else {
  //               swal({
  //                 icon: "error",
  //                 title: "Something went wrong",
  //                 text: "Please contact our support",
  //               });
  //             }
  //           });
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     }
  //   });
  // };

  const handleUploadRejustify = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("remarks", rejustifyRemarks);
      formData.append("id", id);
      formData.append("userId", userId);

      const mimeType = file.type;
      const fileExtension = file.name.split(".").pop();

      formData.append("mimeType", mimeType);
      formData.append("fileExtension", fileExtension);

      const response = await axios.post(
        BASE_URL + `/StockTransfer/rejustifystock`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        swal({
          title: "Request rejustify!",
          text: "The Requested Stock Transfer has been rejustified",
          icon: "success",
          button: "OK",
        }).then(() => {
          navigate("/stockManagement");
        });
      } else {
        swal({
          icon: "error",
          title: "Something went wrong",
          text: "Please contact our support",
        });
      }

      console.log(response.data);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const [prodFetch, setProdFetch] = useState([]);

  useEffect(() => {
    axios
      .get(BASE_URL + "/StockTransfer/fetchProdutsPreview", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        const data = res.data;
        setProdFetch(data.product_db);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);

  const handleClose = () => {
    setShowModal(false);
    setShowModal_reject(false);
    setShowModal_remarks(false);
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

  const handleFormChangeMasterList = (event) => {
    setReceivedBy(event.target.value);
  };
  const [masterList, setMasteList] = useState([]);

  useEffect(() => {
    const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/masterList/masterTable")
        .then((response) => {
          setMasteList(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching master list:", error);
          setIsLoading(false);
        });
    }, 1000);

    return () => clearTimeout(delay);
  }, []);
  // const update = async (e) => {
  //   e.preventDefault();

  //   const form = e.currentTarget;
  //   if (form.checkValidity() === false) {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     // if required fields has NO value
  //     //    console.log('requried')
  //     swal({
  //       icon: "error",
  //       title: "Fields are required",
  //       text: "Please fill the red text fields",
  //     });
  //   } else {
  //     axios
  //       .post(`${BASE_URL}/PR/update`, null, {
  //         params: {
  //           id: id,
  //           prNum,
  //           dateNeed,
  //           useFor,
  //           remarks,
  //           addProductbackend,
  //         },
  //       })
  //       .then((res) => {
  //         console.log(res);
  //         if (res.status === 200) {
  //           swal({
  //             title: "The Request sucessfully submitted!",
  //             text: "The Purchase Request has been added successfully.",
  //             icon: "success",
  //             button: "OK",
  //           }).then(() => {
  //             navigate("/purchaseRequest");
  //           });
  //         } else {
  //           swal({
  //             icon: "error",
  //             title: "Something went wrong",
  //             text: "Please contact our support",
  //           });
  //         }
  //       });
  //   }
  //   setValidated(true); //for validations
  // };
  const [dateTransfers, setDateTransfers] = useState("");
  useEffect(() => {
    axios
      .get(BASE_URL + "/StockTransfer/fetchView", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setReferenceCode(res.data[0].reference_code);
        setReceivedBy(res.data[0].col_id);
        setRemarks(res.data[0].remarks);
        setStatus(res.data[0].status);
        setDateTransfers(res.data[0].date_transfer);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(BASE_URL + "/StockTransfer/fetchWarehouseData", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        const { sourceWarehouses, destinationWarehouses } = res.data;

        // Use sourceWarehouses and destinationWarehouses in your application logic
        setSource(sourceWarehouses);
        setDestination(destinationWarehouses);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  useEffect(() => {
    if ($("#order-listing").length > 0 && prodFetch.length > 0) {
      $("#order-listing").DataTable();
    }
  }, [prodFetch]);

  return (
    <div className="main-of-containers">
      {/* <div className="left-of-main-containers">
            <Sidebar/>
        </div> */}
      <div className="right-of-main-containers">
        {isLoading ? (
          <div className="loading-container">
            <ReactLoading className="react-loading" type={"bubbles"} />
            Loading Data...
          </div>
        ) : authrztn.includes("Stock Management - View") ? (
          <div className="right-body-contents-a">
            <Row>
              <Col>
                <div
                  className="create-head-back"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Link style={{ fontSize: "1.5rem" }} to="/stockManagement">
                    <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                  </Link>
                  <h1>Stock Management Preview</h1>
                </div>
              </Col>
            </Row>

            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "20px",
                fontFamily: "Poppins, Source Sans Pro",
              }}
            >
              General Information
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "81%",
                  left: "21rem",
                  transform: "translateY(-50%)",
                }}
              ></span>
            </div>
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>Date: </Form.Label>
                  <Form.Control
                    required
                    type="date"
                    value={dateTransfers}
                    readOnly
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Received By:{" "}
                  </Form.Label>
                  <Form.Select
                    onChange={handleFormChangeMasterList}
                    required
                    disabled
                    style={{ height: "40px", fontSize: "15px" }}
                    value={receivedBy}
                  >
                    <option disabled value="">
                      Select Employee
                    </option>
                    {masterList.map((masterList) => (
                      <option key={masterList.col_id} value={masterList.col_id}>
                        {masterList.col_Fname}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Reference code:{" "}
                  </Form.Label>
                  <Form.Control
                    readOnly
                    type="text"
                    value={referenceCode}
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>Source: </Form.Label>
                  <Form.Control
                    aria-label=""
                    required
                    style={{ fontSize: "15px" }}
                    defaultValue=""
                    value={source}
                    readOnly
                  />
                </Form.Group>
              </div>
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Destination:{" "}
                  </Form.Label>
                  <Form.Control
                    aria-label=""
                    required
                    style={{ fontSize: "15px" }}
                    value={destination}
                    defaultValue=""
                    readOnly
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Remarks:{" "}
                  </Form.Label>
                  <Form.Control
                    readOnly
                    onChange={(e) => setRemarks(e.target.value)}
                    value={remarks}
                    as="textarea"
                    rows={3}
                    style={{
                      fontFamily: "Poppins, Source Sans Pro",
                      fontSize: "16px",
                      height: "150px",
                      maxHeight: "150px",
                      resize: "none",
                      overflowY: "auto",
                    }}
                  />
                </Form.Group>
              </div>
              <div className="col-6"></div>
            </div>
            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "20px",
                fontFamily: "Poppins, Source Sans Pro",
              }}
            >
              Order Items
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "81%",
                  left: "12rem",
                  transform: "translateY(-50%)",
                }}
              ></span>
            </div>

            <div className="table-containss">
              <div className="main-of-all-tables">
                <table id="order-listing">
                  <thead>
                    <tr>
                      <th className="tableh">Product Code</th>
                      <th className="tableh">Product Name</th>
                      <th className="tableh">Quantity</th>
                      <th className="tableh">U/M</th>
                    </tr>
                  </thead>
                  {prodFetch.length > 0 ? (
                    <tbody>
                      {prodFetch.map((data, i) => (
                        <tr key={i}>
                          <td>{data.product.product_code}</td>
                          <td>{data.product.product_name}</td>
                          <td>{data.quantity}</td>
                          <td>{data.product.product_unitMeasurement}</td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <tbody>
                      <tr>
                        <td colSpan="4" className="no-data">
                          <img
                            src={NoData}
                            alt="NoData"
                            className="no-data-img"
                          />
                          <h3>No Data Found</h3>
                        </td>
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
            </div>

            <div className="save-cancel">
              {status === "Pending" || status === "Rejustified" ? (
                <>
                  <Button
                    type="button"
                    onClick={handleApproveClick}
                    className="btn btn-warning"
                    size="md"
                    style={{ fontSize: "20px", margin: "0px 5px" }}
                  >
                    Approve
                  </Button>

                  <Button
                    type="button"
                    onClick={handleReject}
                    className="btn btn-danger"
                    size="md"
                    style={{ fontSize: "20px", margin: "0px 5px" }}
                  >
                    Reject
                  </Button>
                </>
              ) : (
                <></>
              )}
              {status !== "Pending" && (
                <Button
                  onClick={handleReject_history}
                  className="btn btn-secondary btn-md"
                  size="md"
                  style={{ fontSize: "20px", margin: "0px 5px" }}
                >
                  Reject History
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="no-access">
            <img src={NoAccess} alt="NoAccess" className="no-access-img" />
            <h3>You don't have access to this function.</h3>
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Form>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "24px" }}>
              For Rejustification
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row mt-3">
              <div className="col-12">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Reference
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={referenceCode}
                    readOnly
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <Form.Group
                  controlId="exampleForm.ControlInput2"
                  className="datepick"
                >
                  <Form.Label style={{ fontSize: "20px" }}>Source</Form.Label>
                  <Form.Control
                    type="text"
                    value={source}
                    readOnly
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>

              <div className="col-6">
                <Form.Group
                  controlId="exampleForm.ControlInput2"
                  className="datepick"
                >
                  <Form.Label style={{ fontSize: "20px" }}>
                    Destination
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={destination}
                    readOnly
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label style={{ fontSize: "20px" }}>Remarks: </Form.Label>
                <Form.Control
                  onChange={(e) => setRejustifyRemarks(e.target.value)}
                  placeholder="Enter details"
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
                />
              </Form.Group>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Attach File:
                  </Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    style={{ width: "405px", height: "33px" }}
                  />
                </Form.Group>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setShowModal(false);
                setShowModal_remarks(true);
              }}
              style={{ fontSize: "20px" }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUploadRejustify}
              variant="warning"
              size="md"
              style={{ fontSize: "20px" }}
            >
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showModal_reject} onHide={handleClose}>
        <Form>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "24px" }}>Reject Form</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row mt-3">
              <div className="col-12">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Reference
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={referenceCode}
                    readOnly
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <Form.Group
                  controlId="exampleForm.ControlInput2"
                  className="datepick"
                >
                  <Form.Label style={{ fontSize: "20px" }}>Source</Form.Label>
                  <Form.Control
                    type="text"
                    value={source}
                    readOnly
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>

              <div className="col-6">
                <Form.Group
                  controlId="exampleForm.ControlInput2"
                  className="datepick"
                >
                  <Form.Label style={{ fontSize: "20px" }}>
                    Destination
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={destination}
                    readOnly
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label style={{ fontSize: "20px" }}>Remarks: </Form.Label>

                <div style={{ position: "relative" }} className="">
                  <Form.Control
                    as="textarea"
                    onChange={(e) => setRejectRemarks(e.target.value)}
                    placeholder="Enter details"
                    style={{
                      height: "100px",
                      fontSize: "15px",
                      margin: 0,
                      padding: 0,
                    }}
                    value={rejectRemarks}
                  />

                  <Button
                    variant
                    style={{
                      position: "absolute",
                      bottom: "3px",
                      left: "3px",
                    }}
                    onClick={() => setIsPickerVisible(!isPickerVisible)}
                    className="border border-radius"
                  >
                    <Smiley size={20} color="#161718" />
                  </Button>
                </div>
              </Form.Group>

              {isPickerVisible === true ? (
                <>
                  <Picker
                    style={{ zIndex: 1 }}
                    data={data}
                    previewPosition="none"
                    onEmojiSelect={(e) => {
                      setRejectRemarks((prevRemarks) => prevRemarks + e.native);
                      setIsPickerVisible(!isPickerVisible);
                    }}
                  />
                </>
              ) : (
                <></>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              size="md"
              onClick={handleClose}
              style={{ fontSize: "20px" }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleRejected}
              variant="warning"
              size="md"
              style={{ fontSize: "20px" }}
            >
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal
        show={showModal_remarks}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <Form>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "24px" }}>
              Reject History
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {rejustifyHistory.map((data, index) => (
              <React.Fragment key={index}>
                <span className="h2">{`${data.source} `}</span>
                <div className="d-flex w-100 border-bottom justify-content-center align-items-center">
                  <Note size={55} className="mr-3" color="#066ff9" />

                  <div className="w-50">
                    <div
                      className="d-flex flex-column float-start"
                      style={{ maxWidth: "100%" }}
                    >
                      <span
                        className="h3 w-100"
                        style={{
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >{`"${data.remarks}"`}</span>
                      <span className="h4 text-muted">{`BY: ${data.masterlist.col_Fname}`}</span>
                    </div>
                  </div>

                  <div className="w-50">
                    <div className="d-flex flex-column float-end">
                      <span className="h3">{`(${formatDatetime(
                        data.createdAt
                      )})`}</span>
                      {data.source === "REJUSTIFICATION" &&
                      data.file !== null ? (
                        <>
                          <Button
                            onClick={() =>
                              handleDownloadFile(
                                data.file,
                                data.mimeType,
                                data.fileExtension
                              )
                            }
                            className="fs-5"
                            variant="link"
                          >
                            Download
                          </Button>
                        </>
                      ) : (
                        <>
                          <span className="h4 text-muted mt-2 text-end">{`No available file to download `}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <br />
              </React.Fragment>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              size="md"
              onClick={handleClose}
              style={{ fontSize: "20px" }}
            >
              Cancel
            </Button>

            {status === "Rejected" ? (
              <Button
                type="button"
                onClick={() => {
                  setShowModal(true);
                  setShowModal_remarks(false);
                }}
                variant="warning"
                size="md"
                style={{ fontSize: "20px" }}
              >
                Rejustify
              </Button>
            ) : (
              <></>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default StockTransferPreview;
