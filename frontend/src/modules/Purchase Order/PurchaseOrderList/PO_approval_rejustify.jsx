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
import Col from "react-bootstrap/Col";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowCircleLeft, CalendarBlank } from "@phosphor-icons/react";
import axios from "axios";
import BASE_URL from "../../../assets/global/url";
import swal from "sweetalert";
import SBFLOGO from "../../../assets/image/sbflogo-noback.png";
import * as $ from "jquery";
import { jwtDecode } from "jwt-decode";
import html2canvas from "html2canvas";
import ReactLoading from 'react-loading';
import NoAccess from '../../../assets/image/NoAccess.png';
import ESignature from '../../../assets/image/e-signature.png';

function POApprovalRejustify({ authrztn }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dateNeeded, setDateNeeded] = useState(null);
  const [prNum, setPRnum] = useState("");
  const [useFor, setUseFor] = useState("");
  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState("");

  //   const [validated, setValidated] = useState(false);
  const [products, setProducts] = useState([]);
  const [assembly, setAssembly] = useState([]);
  const [spare, setSpare] = useState([]);
  const [subpart, setSubpart] = useState([]);
  // for remarks
  const [files, setFiles] = useState([]);
  const [rejustifyRemarks, setRejustifyRemarks] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showModalPreview, setShowModalPreview] = useState(false);
  const [userId, setuserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadAprrove, setLoadAprrove] = useState(false);
  const [POdepartmentUser, setDepartmentPO] = useState("");
  const [date, setDate] = useState(new Date());
  const [dateApproved, setDateApproved] = useState(new Date());
  const [showSignature, setShowSignature] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const offset = 8 * 60;
      // Adjust the time to Manila's time zone
      const manilaTime = new Date(now.getTime() + offset * 60000); // add offset in milliseconds
      // Update the state with Manila's time
      setDate(manilaTime);
    }, 1000); // update every second

    // Cleanup function to clear the interval
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const offset = 8 * 60;
      const manilaTime = new Date(now.getTime() + offset * 60000);
      setDateApproved(manilaTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedDateApproved = dateApproved.toISOString().slice(0, 19).replace('T', ' ');

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

  const handleShow = () => setShowModal(true);

  const handleClose = () => {
    setShowModal(false);
    setShowModalPreview(false);
  };

  const [POarray, setPOarray] = useState([]);
  useEffect(() => {
    axios
      .get(BASE_URL + "/invoice/fetchPOarray", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setPOarray(res.data)
        setIsLoading(false)
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    console.log("arrayss", JSON.stringify(POarray, null, 2));
  }, [POarray]);

  useEffect(() => {
    axios
      .get(BASE_URL + "/PR_product/fetchPrProduct", {
        params: {
          id: id,
        },
      })
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/PR_assembly/fetchViewAssembly", {
        params: {
          id: id,
        },
      })
      .then((res) => setAssembly(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/PR_spare/fetchViewSpare", {
        params: { id: id },
      })
      .then((res) => setSpare(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/PR_subpart/fetchViewSubpart", {
        params: { id: id },
      })
      .then((res) => setSubpart(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/PR/fetchView", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setPRnum(res.data.pr_num);
        const parsedDate = new Date(res.data.date_needed);
        setDateNeeded(parsedDate);

        setUseFor(res.data.used_for);
        setRemarks(res.data.remarks);
        setStatus(res.data.status);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(BASE_URL + "/PR/fetchDepartment", {
        params: {
          id: id,
        },
      })
      .then((res) => setDepartmentPO(res.data))
      .catch((err) => console.log(err));
  }, []);


  const handleCancel = async (id) => {
    swal({
      title: "Are you sure?",
      text: "You are about to set as re-canvass. This cannot be recover",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (cancel) => {
      if (cancel) {
        try {
          const response = await axios.put(BASE_URL + `/PR/cancel_PO`, {
            row_id: id,
            userId
          });

          if (response.status === 200) {
            swal({
              title: "Updated Successfully",
              text: "The Request is set to re-canvass successfully",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate("/purchaseOrderList");
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

  const handleApprove = async () => {
    swal({
      title: "Are you sure want to approve this purchase Order?",
      text: "This action cannot be undone.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (approve) => {
      if (approve) {
        // setsignatureTriggered(true);
        setLoadAprrove(true)
        try {
          const updatedPOarray = [];
          for (const group of POarray) {
            let supp_code = group.items[0].suppliers.supplier_code;
            let supp_name = group.items[0].suppliers.supplier_name;
            const div = document.getElementById(`content-to-capture-${group.title}-${supp_code}-${supp_name}`);

            // const span = document.createElement('span');
            // span.innerText = approvalTriggered ? dateApproved.toLocaleDateString('en-PH') : '';
            // div.appendChild(span);
            
            // console.log(div.appendChild(span))
            
            const canvas = await html2canvas(div);
            const imageData = canvas.toDataURL("image/png");

            const updatedGroup = {
              ...group,
              imageData: imageData,
            };

            updatedPOarray.push(updatedGroup);
          }

          const response = await axios.post(BASE_URL + `/invoice/approve_PO`, {
            id,
            POarray: updatedPOarray,
            prNum,
            userId,
            formattedDateApproved
          });

          if (response.status === 200) {
            swal({
              title: "Approved Successfully",
              text: "The Requested P.O has been approved successfully",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate("/purchaseOrderList");
              // setIsLoading(false)
              setLoadAprrove(false)
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

  const handleUploadRejustify = async () => {
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      formData.append("remarks", rejustifyRemarks);
      formData.append("id", id);
      formData.append("userId", userId);

      const response = await axios.post(
        BASE_URL + `/PR_rejustify/rejustify_for_PO`,
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
          text: "The Requested PO has been successfully rejustified",
          icon: "success",
          button: "OK",
        }).then(() => {
          navigate("/purchaseOrderList");
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
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const [POPreview, setPOPreview] = useState([]);
  const handlePreview = async (po_num) => {
    const po_number = po_num;
    setShowModalPreview(true);
    axios
      .get(BASE_URL + "/invoice/fetchPOPreview", {
        params: {
          id: id,
          po_number,
        },
      })
      .then((res) => setPOPreview(res.data))
      .catch((err) => console.log(err));
  };

  const [showes, setShow] = useState(false);

  const handleCloseses = () => setShow(false);
  const handleShowses = () => setShow(true);

  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
        {isLoading ? (
          <div className="loading-container">
            <ReactLoading className="react-loading" type={"bubbles"} />
            Please Wait...
          </div>
        ) : authrztn.includes("PO - View") ? (
          <div className="right-body-contents-a">
            <Row>
              <Col>
                <div
                  className="create-head-back"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Link style={{ fontSize: "1.5rem" }} to="/purchaseOrderList">
                    <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                  </Link>
                  <h1>Purchase Order List Approval</h1>
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
              Purchase Request Details
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "81%",
                  left: "26rem",
                  transform: "translateY(-50%)",
                }}
              ></span>
            </div>
            <div className="row mt-3">
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>PR #: </Form.Label>
                  <Form.Control
                    type="text"
                    value={prNum}
                    readOnly
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-4">
                <Form.Group
                  controlId="exampleForm.ControlInput2"
                  className="datepick"
                >
                  <Form.Label style={{ fontSize: "20px" }}>
                    Date Needed:{" "}
                  </Form.Label>
                  <DatePicker
                    readOnly
                    selected={dateNeeded}
                    onChange={(date) => setDateNeeded(date)}
                    dateFormat="MM/dd/yyyy"
                    placeholderText="Start Date"
                    className="form-control"
                  />
                  <CalendarBlank
                    size={20}
                    style={{
                      position: "absolute",
                      left: "440px",
                      top: "73%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  />
                </Form.Group>
              </div>
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    To be used for:{" "}
                  </Form.Label>
                  <Form.Control
                    readOnly
                    value={useFor}
                    type="text"
                    style={{ height: "40px", fontSize: "15px" }}
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
              Requested Product
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "81%",
                  left: "20rem",
                  transform: "translateY(-50%)",
                }}
              ></span>
            </div>
            <div className="table-containss">
              <div className="main-of-all-tables">
                <table id="">
                  <thead>
                    <tr>
                      <th className="tableh">Product Code</th>
                      <th className="tableh">Needed Quantity</th>
                      <th className="tableh">Product Name</th>
                      <th className="tableh">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((data, i) => (
                      <tr key={i}>
                        <td>{data.product.product_code}</td>
                        <td>{data.quantity}</td>
                        <td>{data.product.product_name}</td>
                        <td>{data.description}</td>
                      </tr>
                    ))}

                    {assembly.map((data, i) => (
                      <tr key={i}>
                        <td>{data.assembly.assembly_code}</td>
                        <td>{data.quantity}</td>
                        <td>{data.assembly.assembly_name}</td>
                        <td>{data.description}</td>
                      </tr>
                    ))}

                    {spare.map((data, i) => (
                      <tr key={i}>
                        <td>{data.sparePart.spareParts_code}</td>
                        <td>{data.quantity}</td>
                        <td>{data.sparePart.spareParts_name}</td>
                        <td>{data.description}</td>
                      </tr>
                    ))}

                    {subpart.map((data, i) => (
                      <tr key={i}>
                        <td>{data.subPart.subPart_code}</td>
                        <td>{data.quantity}</td>
                        <td>{data.subPart.subPart_name}</td>
                        <td>{data.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
              Canvassed Item
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "81%",
                  left: "17rem",
                  transform: "translateY(-50%)",
                }}
              ></span>
            </div>

            <div className="table-contains">
              <div className="canvass-main-container">
                {POarray.map((group) => (
                  <div key={group.title} className="canvass-supplier-container">
                    <div className="canvass-supplier-content">
                      {/* <h3>{`PO Number: ${group.title}`}</h3> */}
                      <div className="PO-num">
                        <p>{`PO #: ${group.title}`}</p>
                      </div>
                      {group.items.length > 0 && (
                        <div className="canvass-title">
                          <div className="supplier-info">
                            <p>{`Supplier: ${group.items[0].suppliers.supplier_code} - ${group.items[0].suppliers.supplier_name}`}</p>
                          </div>
                        </div>
                      )}
                      {group.items.map((item, index) => (
                        <div className="canvass-data-container" key={index}>
                          <div
                            className="col-4"
                            style={{
                              fontFamily: "Poppins, Source Sans Pro",
                              fontSize: "14px",
                            }}
                          >
                            {`Product Code: `}
                            <strong>{`${item.supp_tag.code}`}</strong>
                          </div>
                          <div
                            className="col-4"
                            style={{
                              fontFamily: "Poppins, Source Sans Pro",
                              fontSize: "14px",
                            }}
                          >
                            {`Product Name: `}
                            <strong>{`${item.supp_tag.name}`}</strong>
                          </div>
                          <div
                            className="col-4"
                            style={{
                              fontFamily: "Poppins, Source Sans Pro",
                              fontSize: "14px",
                            }}
                          >
                            {`Quantity: `}
                            <strong>{`${item.item.quantity}`}</strong>
                          </div>
                          {/* <p className='fs-5 fw-bold'>
                                          {`Product Code: ${item.supp_tag.code} Product Name: ${item.supp_tag.name}`}
                                        </p>
                                        <p className='fs-5 fw-bold'>
                                          {`Quantity: ${item.item.quantity}`}
                                        </p>                                */}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="save-cancel">
              <Button
                type="button"
                className="btn btn-warning"
                size="md"
                style={{ fontSize: "20px", margin: "0px 5px" }}
                // onClick={() => handleCancel(id)}
                onClick={handleShowses}
              >
                Preview
              </Button>
              <Button
                type="button"
                className="btn btn-danger"
                size="md"
                style={{ fontSize: "20px", margin: "0px 5px" }}
                onClick={() => handleCancel(id)}
              >
                Re-Canvass
              </Button>

              {/* <Button
              onClick={handleShow}
              className="btn btn-secondary btn-md"
              size="md"
              style={{ fontSize: "20px", margin: "0px 5px" }}
            >
              Rejustify
            </Button>

            
            <Button
              type="button"
              className="btn btn-success"
              size="md"
              style={{ fontSize: "20px", margin: "0px 5px" }}
              onClick={() => handleApprove(id)}
              // onClick={handleShowses}
            >
              Approve
            </Button> */}
            </div>

            <Modal
              show={showes}
              onHide={handleCloseses}
              backdrop="static"
              keyboard={false}
              size="xl"
            >
              <Modal.Header closeButton>
                <Modal.Title 
                style={{fontSize: '25px'}}>DEPARTMENT: <strong>{POdepartmentUser?.masterlist?.department?.department_name}</strong></Modal.Title>
              </Modal.Header>
              {POarray.map((group) => {
                let totalSum = 0;
                let TotalAmount = 0;
                let vatTotal = 0;
                let vatAmount = 0;
                let currency = group.items[0].suppliers.supplier_currency;
                let supp_code = group.items[0].suppliers.supplier_code;
                let supp_name = group.items[0].suppliers.supplier_name;
                let vat = group.items[0].suppliers.supplier_vat;

                group.items.forEach((item, index) => {
                  totalSum += item.suppPrice.price * item.item.quantity;                
                });

                vatAmount = totalSum * (vat / 100);
                TotalAmount = vatAmount + totalSum;

                vatAmount = vatAmount.toFixed(2);
                totalSum = totalSum.toFixed(2);

                TotalAmount = parseFloat(TotalAmount).toLocaleString('en-US', { minimumFractionDigits: 2 });
                vatAmount = parseFloat(vatAmount).toLocaleString('en-US', { minimumFractionDigits: 2 });
                totalSum = parseFloat(totalSum).toLocaleString('en-US', { minimumFractionDigits: 2 });
            
                return (
                  <Modal.Body
                    id={`content-to-capture-${group.title}-${supp_code}-${supp_name}`}
                  >
                    <div key={group.title} className="receipt-main-container">
                      <div className="receipt-content">
                        <div className="receipt-header">
                          <div className="sbflogoes">
                            <img src={SBFLOGO} alt="" />
                          </div>
                          <div className="sbftexts">
                            <span>SBF PHILIPPINES DRILLING </span>
                            <span>RESOURCES CORPORATION</span>
                            <span>
                              Padigusan, Sta.Cruz, Rosario, Agusan del sur
                            </span>
                            <span>Landline No. 0920-949-3373</span>
                            <span>Email Address: sbfpdrc@gmail.com</span>
                          </div>
                          <div className="spacesbf"></div>
                        </div>

                        <div className="po-number-container">
                          <div className="shippedto">
                            {/* <span>SHIPPED TO:</span> */}
                          </div>
                          <div className="blank"></div>
                          <div className="po-content">
                            <span>PURCHASE ORDER</span>
                            <span>
                              P.O-NO.{" "}
                              <label style={{ fontSize: 14, color: "red" }}>
                                {group.title}
                              </label>
                            </span>
                          </div>
                        </div>

                        <div className="secondrowes">
                          <div className="leftsecondrows">
                            {/* <span>FOB</span>
                            <span>VIA</span> */}
                          </div>

                          <div className="midsecondrows">
                            <span>VENDOR</span>
                            <span>
                              {group.items[0].suppliers.supplier_name}
                            </span>
                          </div>

                          <div className="rightsecondrows">
                            <span>
                              PR NO.
                              <label style={{ fontSize: 14, color: "red" }}>
                                {prNum}
                              </label>
                            </span>
                            <span>DATE PREPARED: <strong>{`${date.toLocaleDateString('en-PH')}`}</strong></span>
                          </div>
                        </div>

                        <div className="thirdrowes">
                          <div className="thirdleftrows">
                            <span>ITEM NO.</span>
                            <span>QUANTITY</span>
                            <span>UNIT</span>
                          </div>

                          <div className="thirdmidrows">
                            <span>DESCRIPTION</span>
                          </div>

                          <div className="thirdrightrows">
                            <span>{`UNIT PRICE`}</span>
                            <span>TOTAL</span>
                          </div>
                        </div>

                        <div className="fourthrowes">
                          <div className="leftfourthrows">
                            {/* for product code */}
                            <span>
                              {group.items.map((item, index) => (
                                <div key={index}>
                                  <label>{`${item.supp_tag.code}`}</label>
                                  <br />
                                </div>
                              ))}
                            </span>
                            {/* for product quantity */}
                            <span>
                              {" "}
                              {group.items.map((item, index) => (
                                <div key={index}>
                                  <label>{`${item.item.quantity}`}</label>
                                  <br />
                                </div>
                              ))}
                            </span>

                            {/* for product unit of measurement */}
                            <span>
                              {group.items.map((item, index) => (
                                <div key={index}>
                                  <label>{`${item.supp_tag.uom}`}</label>
                                  <br />
                                </div>
                              ))}
                            </span>
                          </div>

                          <div className="midfourthrows">
                            {/* for product name */}
                            {group.items.map((item, index) => (
                              <div key={index}>
                                <span>{`${item.supp_tag.name}`}</span>
                                <br />
                              </div>
                            ))}
                          </div>

                          <div className="rightfourthrows">
                            {/* for unit price */}
                            <span>
                              {" "}
                              {group.items.map((item, index) => (
                                <div key={index}>
                                  <label>{`${
                                    item.suppPrice.price
                                  }`}</label>
                                  {/* <label>{`${item.suppPrice.price}`}</label> */}
                                  <br />
                                </div>
                              ))}
                            </span>

                            {/* for unit price total */}
                            <span>
                              {" "}
                              {group.items.map((item, index) => (
                                <div key={index}>
                                  {/* <label>{(item.suppPrice.price * item.item.quantity).toLocaleString()}</label> */}
                                  <label>{(item.suppPrice.price * item.item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</label>

                                  <br />
                                </div>
                              ))}
                            </span>
                          </div>
                        </div>

                        <div className="fifthrowes">
                          <div className="fifthleftrows">
                            <div className="received-section">
                              <span>P.O RECEIVED BY: </span>
                              
                            </div>
                            <div className="deliverydate">
                              <span>DELIVERY DATE: </span>
                              <span></span>
                            </div>
                            <div className="terms">
                              <span>TERMS: </span>
                              <span>{`${group.items[0].suppliers.supplier_terms} days`}</span>
                            </div>
                            <div className="preparedby">
                              <span>PREPARED BY: </span>
                              <span>{POdepartmentUser?.masterlist?.col_Fname}</span>
                            </div>
                          </div>

                          <div className="fifthmidrows">
                            <div className="conditionsection">
                              <div className="tobeUsed">
                                <span>To be used for: <strong>{`${useFor}`}</strong></span>
                              </div>
                              <span>TERMS AND CONDITIONS: </span>
                              <span>
                                1. Acceptance of this order is an acceptance of
                                all conditions herein.
                              </span>
                              <span>
                                2. Make all deliveries to receiving, However
                                subject to count, weight and specification
                                approval of SBF Philippines Drilling Resources
                                Corporation.
                              </span>
                              <span>
                                3. The original purchase order copy and
                                suppliers original invoice must accompany
                                delivery.
                              </span>
                              <span>
                                4. In case the supplier fails to deliver goods
                                on delivery date specified herein, SBF
                                Philippines Drilling Resources Corporation has
                                the right to cancel this order or demand penalty
                                charged as stated.
                              </span>
                              <span>
                                5. Problems encountered related to your supply
                                should immediately brought to the attention of
                                the purchasing manager.
                              </span>
                            </div>
                            <div className="checkedsection">
                              <div className="notedby">
                                <span>Checked by: </span>
                                <span><img src={ESignature} alt="ESignature" className="signature-image" /></span>
                                <span>ALLAN JUEN</span>
                              </div>
                              <div className="recommending">
                                {/* <span>RECOMMENDING APPROVAL</span> */}
                                <span></span>
                              </div>
                            </div>
                          </div>

                          <div className="fifthrightrows">
                            <div className="totalamount">
                              <div className="vatandAmounttotal">
                                  <div className="vatamounts">
                                    <span>VAT ({`${vat}%`})</span>
                                    <span><strong>{`${vatAmount}`}</strong></span>
                                  </div>
                                  <div className="totalAmounts">
                                    <span>Total Amount</span>
                                    <span><strong>{`${totalSum}`}</strong></span>
                                  </div>
                              </div>
                              
                                <div className="overallTotal">
                                   <span>Overall Total: <strong>{`${currency} ${TotalAmount}`}</strong></span>
                                </div>

                            </div>

                            <div className="codesection">
                              <span>Date Approved:</span>
                                  <span>{dateApproved.toLocaleDateString('en-PH')}</span>
                            </div>
                            <div className="approvedsby">
                              <span>Approved By: </span>
                              {showSignature && <span><img src={ESignature} alt="ESignature" className="signature-image" /></span>}
                              <span>Daniel Byron S. Afdal</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                );
              })}

              <Modal.Footer>
                <>
                  {!loadAprrove ? (
                     <div className="save-cancel">
                     <Button
                       onClick={handleShow}
                       className="btn btn-secondary btn-md"
                       size="md"
                       style={{ fontSize: "20px", margin: "0px 5px" }}
                     >
                       Rejustify
                     </Button>
   
                     <Button
                       type="button"
                       className="btn btn-success"
                       size="md"
                       style={{ fontSize: "20px", margin: "0px 5px" }}
                      //  onClick={() => handleApprove()}
                      onClick={() => {handleApprove(); setShowSignature(true)}}
                     >
                       Approve
                     </Button>
                   </div>
                  ) : (
                    <>
                      <div className="loading-container">
                        <ReactLoading className="react-loading" type={"bubbles"} />
                          Sending Email Invoice Please Wait...
                      </div>
                    </>
                  )}
                </>
               
              </Modal.Footer>
            </Modal>

            <Modal show={showModal} onHide={handleClose}>
              <Form>
                <Modal.Header closeButton>
                  <Modal.Title style={{ fontSize: "24px" }}>
                    For Rejustification
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="row mt-3">
                    <div className="col-6">
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label style={{ fontSize: "20px" }}>
                          PR No.:{" "}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={prNum}
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
                          Date Needed:{" "}
                        </Form.Label>
                        <DatePicker
                          readOnly
                          selected={dateNeeded}
                          onChange={(date) => setDateNeeded(date)}
                          dateFormat="MM/dd/yyyy"
                          placeholderText="Start Date"
                          className="form-control"
                        />
                      </Form.Group>
                    </div>
                  </div>

                  <div className="row">
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label style={{ fontSize: "20px" }}>
                        Remarks:{" "}
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        onChange={(e) => setRejustifyRemarks(e.target.value)}
                        placeholder="Enter details"
                        style={{ height: "100px", fontSize: "15px" }}
                      />
                    </Form.Group>
                    <div className="col-6">
                      {/* <Link variant="secondary" size="md" style={{ fontSize: '15px' }}>
                                                  <Paperclip size={20} />Upload Attachment
                                              </Link> */}

                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label style={{ fontSize: "20px" }}>
                          Attach File:{" "}
                        </Form.Label>
                        {/* <Form.Control as="textarea"placeholder="Enter details name" style={{height: '100px', fontSize: '15px'}}/> */}
                        <input type="file" onChange={handleFileChange} />
                      </Form.Group>
                    </div>
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

export default POApprovalRejustify;
