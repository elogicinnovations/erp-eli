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

import {
  ArrowCircleLeft,
  Plus,
  Paperclip,
  NotePencil,
  DotsThreeCircle,
  CalendarBlank,
} from "@phosphor-icons/react";
import axios from "axios";
import BASE_URL from "../../../assets/global/url";
import swal from "sweetalert";

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

  const [showDropdown, setShowDropdown] = useState(false);

  const [validated, setValidated] = useState(false);
  const [isReadOnly, setReadOnly] = useState(false);

  const [files, setFiles] = useState([]);
  const [rejustifyRemarks, setRejustifyRemarks] = useState("");

  const handleFileChange = (e) => {
    setFiles(e.target.files);
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
              },
            })
            .then((res) => {
              console.log(res);
              if (res.status === 200) {
                swal({
                  title: "The Purchase sucessfully approved!",
                  text: "The Purchase been approved successfully.",
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
      } else {
        swal({
          title: "Cancelled Successfully",
          icon: "warning",
        });
      }
    });
  };

  
  const handleRejectClick = () => {
    swal({
      title: "Are you sure?",
      text: "You are attempting to reject this request",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (approve) => {
      if (approve) {
        try {
          axios
            .post(`${BASE_URL}/StockTransfer/reject`, null, {
              params: {
                id: id,
              },
            })
            .then((res) => {
              console.log(res);
              if (res.status === 200) {
                swal({
                  title: "The Purchase sucessfully approved!",
                  text: "The Purchase been approved successfully.",
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
      } else {
        swal({
          title: "Cancelled Successfully",
          icon: "warning",
        });
      }
    });
  };


  const [prodFetch, setProdFetch] = useState([]);
  const [asmFetch, setAsmFetch] = useState([]);
  const [spareFetch, setSpareFetch] = useState([]);
  const [subpartFetch, setSubpartFetch] = useState([]);
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
        setAsmFetch(data.asm_db);
        setSpareFetch(data.spare_db);
        setSubpartFetch(data.subpart_db);

        // console.log(`ss ${data}`);
        // setvaluePRassembly(selectedPRAssembly);
      })
      .catch((err) => console.log(err));
  }, [id]);

  // //Where clause sa product PR
  // useEffect(() => {
  //   axios.get(BASE_URL + '/StockTransfer_prod/fetchStockTransferProduct', {
  //     params: {
  //       id: id
  //     }
  //   })
  //     .then(res => {
  //       const data = res.data;
  //       setProductSelectedFetch(data);
  //       const selectedPRproduct = data.map((row) => ({
  //         value: row.product_id,
  //         label: `Product Code: ${row.product.product_code} / Name: ${row.product.product_name}`,
  //       }));
  //       setvaluePRproduct(selectedPRproduct);
  //     })
  //     .catch(err => console.log(err));
  // }, [id]);

  // //Where clause ng assembly
  // useEffect(() => {
  //   axios.get(BASE_URL + '/StockTransfer_assembly/fetchStockTransferAssembly', {
  //     params: {
  //       id: id
  //     }
  //   })
  //     .then(res => {
  //       const data = res.data;
  //       setAssemblySelectedFetch(data);
  //       const selectedPRAssembly = data.map((row) => ({
  //         value: row.id,
  //         label: `Assembly Code: ${row.assembly.assembly_code} / Name: ${row.assembly.assembly_name}`,
  //       }));
  //       setvaluePRassembly(selectedPRAssembly);
  //     })
  //     .catch(err => console.log(err));
  // }, [id]);

  // //Where clause sa spare parts
  // useEffect(() => {
  //   axios.get(BASE_URL + '/StockTransfer_spare/fetchStockTransferSpare', {
  //     params: {
  //       id: id
  //     }
  //   })
  //     .then(res => {
  //       const data = res.data;
  //       setSpareSelectedFetch(data);
  //       const selectedPRspare = data.map((row) => ({
  //         value: row.id,
  //         label: `Spare Code: ${row.sparePart.spareParts_code} / Name: ${row.sparePart.spareParts_name}`,
  //       }));
  //       setvalueSpare(selectedPRspare);
  //     })
  //     .catch(err => console.log(err));
  // }, [id]);

  // //Where clause sa sub parts
  // useEffect(() => {
  //   axios.get(BASE_URL + '/StockTransfer_subpart/fetchStockTransferSubpart', {
  //     params: {
  //       id: id
  //     }
  //   })
  //     .then(res => {
  //       const data = res.data;
  //       setSubPartSelectedFetch(data);
  //       const selectedPRsub = data.map((row) => ({
  //         value: row.id,
  //         label: `SubPart Code: ${row.subPart.subPart_code} / Name: ${row.subPart.subPart_name}`,
  //       }));
  //       setvaluePRsub(selectedPRsub);
  //     })
  //     .catch(err => console.log(err));
  // }, [id]);

  // useEffect(() => {
  //   axios
  //     .get(BASE_URL + "/PR/fetchView", {
  //       params: {
  //         id: id,
  //       },
  //     })
  //     .then((res) => {
  //       setPrNum(res.data.pr_num);
  //       setStatus(res.data.status);
  //       setDateCreated(res.data.createdAt);
  //       const parsedDate = new Date(res.data.date_needed);
  //       setDateNeed(parsedDate);
  //       setUseFor(res.data.used_for);
  //       setRemarks(res.data.remarks);
  //       setProduct(res.date.product_id);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }, [id]);

  useEffect(() => {
    const serializedProducts = product.map((product) => ({
      type: product.type,
      value: product.values,
      quantity: inputValues[product.value]?.quantity || "",
      desc: inputValues[product.value]?.desc || "",
    }));

    setAddProductbackend(serializedProducts);

    // console.log("Selected Products:", serializedProducts);
  }, [inputValues, product]);

  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);

  const handleClose = () => {
    setShowModal(false);
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
    if (
      $("#order-listing").length > 0 &&
      prodFetch.length > 0 &&
      asmFetch.length > 0 &&
      spareFetch.length > 0 &&
      subpartFetch.length > 0
    ) {
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
                    readOnly={!isReadOnly}
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
                  {prodFetch.length > 0 ||
                  asmFetch.length > 0 ||
                  spareFetch.length > 0 ||
                  subpartFetch.length > 0 ? (
                    <tbody>
                      {prodFetch.map((data, i) => (
                        <tr key={i}>
                          <td>
                            {
                              data.product.product_code
                            }
                          </td>
                          <td>
                            {
                              data.product.product_name
                            }
                          </td>
                          <td>{data.quantity}</td>
                          <td>
                            {
                              data.product.product_unitMeasurement
                            }
                          </td>
                        </tr>
                      ))}
                      {asmFetch.map((data, i) => (
                        <tr key={i}>
                          <td>
                            {
                              data.assembly
                                .assembly_code
                            }
                          </td>
                          <td>
                            {
                              data.assembly
                                .assembly_name
                            }
                          </td>
                          <td>{data.quantity}</td>
                          <td>
                            {
                              data.assembly
                                .assembly_unitMeasurement
                            }
                          </td>
                        </tr>
                      ))}
                      {spareFetch.map((data, i) => (
                        <tr key={i}>
                          <td>
                            {
                              data.sparePart
                                .spareParts_code
                            }
                          </td>
                          <td>
                            {
                              data.sparePart
                                .spareParts_name
                            }
                          </td>
                          <td>{data.quantity}</td>
                          <td>
                            {
                              data.sparePart
                                .spareParts_unitMeasurement
                            }
                          </td>
                        </tr>
                      ))}
                      {subpartFetch.map((data, i) => (
                        <tr key={i}>
                          <td>
                            {
                              data.subPart
                                .subPart_code
                            }
                          </td>
                          <td>
                            {
                              data.subPart
                                .subPart_name
                            }
                          </td>
                          <td>{data.quantity}</td>
                          <td>
                            {
                              data.subPart
                                .subPart_unitMeasurement
                            }
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
            </div>

            <div className="save-cancel">
              {status === "Pending" ? (
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
                    onClick={handleRejectClick}
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
            </div>
          </div>
        ) : (
          <div className="no-access">
            <img src={NoAccess} alt="NoAccess" className="no-access-img" />
            <h3>You don't have access to this function.</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default StockTransferPreview;
