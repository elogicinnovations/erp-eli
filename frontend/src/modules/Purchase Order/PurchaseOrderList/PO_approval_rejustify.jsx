import React, { useEffect, useState } from "react";
import "../../../assets/global/style.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../styles/react-style.css";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { PDFDocument, rgb } from "pdf-lib";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowCircleLeft, CalendarBlank } from "@phosphor-icons/react";
import axios from "axios";
import BASE_URL from "../../../assets/global/url";
import swal from "sweetalert";
import SBFLOGO from "../../../assets/image/sbf_logoo_final.jpg";
import { jwtDecode } from "jwt-decode";
import html2canvas from "html2canvas";
import ReactLoading from "react-loading";
import NoAccess from "../../../assets/image/NoAccess.png";
import sigDan from "../../../assets/image/sirDAN.png";
import sigAllan from "../../../assets/image/sigAllan.jpg";
import {
  Note,
  Smiley,
  Trash,
  PencilSimple,
  Check,
} from "@phosphor-icons/react";
import InputGroup from "react-bootstrap/InputGroup";
// import EmojiPicker from './../../../hooks/components/EmojiPicker';
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

function POApprovalRejustify({ authrztn }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editRemarks, setEditRemarks] = useState(false);
  const [editUsedFor, setEditUsedFor] = useState(false);
  const [editPOUsedFor, setPOEditUsedFor] = useState(false);
  const [POUsedFor, setPOUsedFor] = useState("");
  const [dateNeeded, setDateNeeded] = useState(null);
  const [prID, setPrID] = useState("");
  const [prNum, setPRnum] = useState("");
  const [useFor, setUseFor] = useState("");
  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [isSendEmail, setIsSendEmail] = useState(false);

  //   const [validated, setValidated] = useState(false);
  const [rejustifyHistory, setRejustifyHistory] = useState([]);
  const [products, setProducts] = useState([]);
  const [assembly, setAssembly] = useState([]);
  const [spare, setSpare] = useState([]);
  const [subpart, setSubpart] = useState([]);
  // for remarks
  const [file, setFile] = useState(null);
  const [rejustifyRemarks, setRejustifyRemarks] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showModal_reject, setShowModal_reject] = useState(false);
  const [showModal_remarks, setShowModal_remarks] = useState(false);
  const [rejectRemarks, setRejectRemarks] = useState("");
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [showModalPreview, setShowModalPreview] = useState(false);
  const [userId, setuserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadAprrove, setLoadAprrove] = useState(false);
  const [POdepartmentUser, setDepartmentPO] = useState(""); // department ng nag request
  const [department, setDepartment] = useState(""); // department ng user na gumagamit now
  const [date, setDate] = useState(new Date());
  const [dateApproved, setDateApproved] = useState(new Date());
  const [showSignature, setShowSignature] = useState(false);
  const [po_idRejustify, setPo_idRejustify] = useState("");
  const [requestor, setRequestor] = useState("");

  //

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

  const formattedDateApproved = dateApproved
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const decodeToken = () => {
    var token = localStorage.getItem("accessToken");
    if (typeof token === "string") {
      var decoded = jwtDecode(token);
      setuserId(decoded.id);
      setDepartment(decoded.department_id);
    }
  };

  useEffect(() => {
    decodeToken();
  }, []);

  const handleShow = (po_idsss) => {
    setPo_idRejustify(po_idsss);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    // setShowModalPreview(false);
    setShowModal_reject(false);
    setShowModal_remarks(false);
  };

  const handleReject_history = () => {
    setShowModal_remarks(true);
    axios
      .get(BASE_URL + "/invoice/fetchRejectHistory", {
        params: {
          po_id: id,
          pr_id: prID,
        },
      })
      .then((res) => {
        setRejustifyHistory(res.data);
      })
      .catch((err) => console.log(err));
  };

  const reloadTable = () => {
    axios
      .get(BASE_URL + "/invoice/fetchPOarray", {
        params: {
          po_id: id,
        },
      })
      .then((res) => {
        setPOarray(res.data);
        setIsLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const [POarray, setPOarray] = useState([]);
  useEffect(() => {
    reloadTable();
  }, []);

  useEffect(() => {
    console.log("arrayss", JSON.stringify(POarray, null, 2));
  }, [POarray]);

  useEffect(() => {
    axios
      .get(BASE_URL + "/invoice/fetchView_PO", {
        params: {
          po_id: id,
        },
      })
      .then((res) => {
        setPrID(res.data.purchase_req.id);
        setPRnum(res.data.purchase_req.pr_num);
        const parsedDate = new Date(res.data.purchase_req.date_needed);
        setDateNeeded(parsedDate);
        setRequestor(res.data.purchase_req.masterlist_id);
        setUseFor(res.data.purchase_req.used_for);
        setRemarks(res.data.purchase_req.remarks);
        setStatus(res.data.status);
        setDepartmentPO(res.data);
        setSupplierName(res.data.product_tag_supplier.supplier.supplier_name);
        setIsSendEmail(res.data.isEmailSend === false ? "false" : "true");
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  // useEffect(() => {
  //   axios
  //     .get(BASE_URL + "/invoicing/fetchDepartment", {
  //       params: {
  //         id: id,
  //       },
  //     })
  //     .then((res) => setDepartmentPO(res.data))
  //     .catch((err) => console.log(err));
  // }, []);

  // const handleCancel = async (id) => {
  //   swal({
  //     title: "Are you sure?",
  //     text: "You are about to set as re-canvass. This cannot be recover",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then(async (cancel) => {
  //     if (cancel) {
  //       try {
  //         const response = await axios.put(BASE_URL + `/PR/cancel_PO`, {
  //           row_id: id,
  //           userId,
  //         });

  //         if (response.status === 200) {
  //           swal({
  //             title: "Updated Successfully",
  //             text: "The Request is set to re-canvass successfully",
  //             icon: "success",
  //             button: "OK",
  //           }).then(() => {
  //             navigate("/purchaseOrderList");
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
  const handleRejected = async () => {
    try {
      axios
        .post(`${BASE_URL}/PR/rejectPO`, null, {
          params: {
            po_id: id,
            prID,
            prNum,
            rejectRemarks,
            userId,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            swal({
              title: "Purchase Order Rejected",
              text: "The purchase order has been successfully rejected.",
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
        });
    } catch (err) {
      console.log(err);
    }
  };
  const handleReject = async (po_idss) => {
    const po_approvalID = po_idss;
    swal({
      title: "Confirm Reject",
      text: "Are you sure you want to reject this purchase order?",
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

  const handleApprove = async (po_idss) => {
    const po_idApproval = po_idss;
    swal({
      title: `Are you sure want to approve this purchase Order?`,
      text: "This action cannot be undone.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (approve) => {
      if (approve) {
        // setsignatureTriggered(true);
        setLoadAprrove(true);
        try {
          // const div = document.getElementById(
          //   `content-to-capture-${po_idApproval}`
          // );

          // const canvas = await html2canvas(div);
          // const imageData = canvas.toDataURL("image/png");
          // // Convert the image to a PDF
          // const pdfDoc = await PDFDocument.create();
          // const page = pdfDoc.addPage([canvas.width, canvas.height]);
          // const pngImage = await pdfDoc.embedPng(imageData);
          // page.drawImage(pngImage, {
          //   x: 0,
          //   y: 0,
          //   width: canvas.width,
          //   height: canvas.height,
          //   // width: 480,
          //   // height: 700,
          // });

          // const pdfBytes = await pdfDoc.save();

          // Download the PDF
          // const blob = new Blob([pdfBytes], { type: "application/pdf" });
          // const downloadLink = document.createElement("a");
          // downloadLink.href = URL.createObjectURL(blob);
          // downloadLink.download = `purchase_order_${po_idApproval}.pdf`;
          // document.body.appendChild(downloadLink);
          // downloadLink.click();
          // document.body.removeChild(downloadLink);
          const response = await axios.post(BASE_URL + `/invoice/approve_PO`, {
            prID,
            POarray,
            // imageData,
            prNum,
            userId,
            formattedDateApproved,
            isSendEmail,
            po_idApproval,
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
              setLoadAprrove(false);
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
        setShowSignature(false);
      }
    });
  };

  const handlePrint = async (po_idss) => {
    const po_idApproval = po_idss;
    swal({
      title: `Are you sure want to download this purchase Order?`,
      text: "This action cannot be undone.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (approve) => {
      if (approve) {
        try {
          const div = document.getElementById(
            `content-to-capture-${po_idApproval}`
          );

          const canvas = await html2canvas(div);
          const imageData = canvas.toDataURL("image/png");

          // Convert the image to a PDF
          const pdfDoc = await PDFDocument.create();

          // Create a portrait page by swapping width and height
          const page = pdfDoc.addPage([canvas.height, canvas.width]);

          const pngImage = await pdfDoc.embedPng(imageData);

          // Calculate scaling factors to fit the image on the portrait page
          const scaleWidth = canvas.height / canvas.width;
          const scaleHeight = canvas.width / canvas.height;
          const scale = Math.min(scaleWidth, scaleHeight);

          // Calculate new dimensions
          const newWidth = canvas.width * scale;
          const newHeight = canvas.height * scale;

          // Calculate position to center the image
          const x = (canvas.height - newWidth) / 2;
          const y = (canvas.width - newHeight) / 2;

          page.drawImage(pngImage, {
            x,
            y,
            width: newWidth,
            height: newHeight,
          });

          const pdfBytes = await pdfDoc.save();

          // Download the PDF
          const blob = new Blob([pdfBytes], { type: "application/pdf" });
          const downloadLink = document.createElement("a");
          downloadLink.href = URL.createObjectURL(blob);
          downloadLink.download = `purchase_order_${po_idApproval}.pdf`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        } catch (err) {
          swal({
            icon: "error",
            title: "Something went wrong",
            text: "Please contact our support",
          });
        }
      } else {
        setShowSignature(false);
      }
    });
  };

  const handleSend = async (po_idss) => {
    const po_idApproval = po_idss;
    let textTOEmail;
    if (isSendEmail === "true") {
      textTOEmail = `An email has already been sent. Do you still want to send it?`;
    } else {
      textTOEmail = `Are you sure want to send this purchase Order?`;
    }

    swal({
      title: textTOEmail,
      text: "This action cannot be undone.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (approve) => {
      if (approve) {
        try {
          const div = document.getElementById(
            `content-to-capture-${po_idApproval}`
          );

          const canvas = await html2canvas(div);
          const imageData = canvas.toDataURL("image/png");
          // Convert the image to a PDF
          const pdfDoc = await PDFDocument.create();
          const page = pdfDoc.addPage([canvas.width, canvas.height]);
          const pngImage = await pdfDoc.embedPng(imageData);
          page.drawImage(pngImage, {
            x: 0,
            y: 0,
            width: canvas.width,
            height: canvas.height,
            // width: 480,
            // height: 700,
          });

          const pdfBytes = await pdfDoc.save();

          // Download the PDF
          // const blob = new Blob([pdfBytes], { type: "application/pdf" });
          // const downloadLink = document.createElement("a");
          // downloadLink.href = URL.createObjectURL(blob);
          // downloadLink.download = `purchase_order_${po_idApproval}.pdf`;
          // document.body.appendChild(downloadLink);
          // downloadLink.click();
          // document.body.removeChild(downloadLink);

          const response = await axios.post(BASE_URL + `/invoice/send_PO`, {
            prID,
            POarray,
            imageData,
            prNum,
            userId,
            po_idApproval,
          });

          if (response.status === 200) {
            swal({
              title: "Sent Successfully",
              text: "The P.O has been sent successfully",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate("/purchaseOrderList");
              // setIsLoading(false)
              setLoadAprrove(false);
            });
          } else {
            swal({
              icon: "error",
              title: "Something went wrong",
              text: "Please contact our support",
            });
          }
        } catch (err) {
          swal({
            icon: "error",
            title: "Something went wrong",
            text: "Please contact our support",
          });
        }
      } else {
        setShowSignature(false);
      }
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadRejustify = async () => {
    try {
      const formData = new FormData();

      if (file) {
        formData.append("file", file);
        const mimeType = file.type;
        const fileExtension = file.name.split(".").pop();
        formData.append("mimeType", mimeType);
        formData.append("fileExtension", fileExtension);
      } else {
        // Append null or skip appending depending on your server-side logic
        // formData.append('file', null);
        // OR you can skip appending it altogether
      }

      formData.append("remarks", rejustifyRemarks);
      formData.append("pr_id", prID);
      formData.append("userId", userId);
      formData.append("po_idRejustify", id);

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

  const handleRemovePoProduct = async (PR_PO_primaryID, productName) => {
    // para if reject pwede mag remove ng prodduct

    const primary_ID = PR_PO_primaryID;
    const product_name = productName;
    swal({
      title: `Confirm removal of this product from purchase order #${id}?`,
      text: `${product_name}`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (approve) => {
      if (approve) {
        await axios
          .post(BASE_URL + `/invoice/remove_productPO`, null, {
            params: {
              primary_ID,
              po_id: id,
              userId,
              prNum,
              prID,
              product_name,
            },
          })
          .then((res) => {
            if (res.status === 200) {
              swal({
                icon: "success",
                title: `Product ${product_name} has successfully removed from PO # ${id}`,
                text: "Please contact our support",
              }).then(() => {
                reloadTable();
              });
            } else {
              swal({
                icon: "error",
                title: "Something went wrong",
                text: "Please contact our support",
              });
            }
          });
      }
    });
  };

  const handleSaveEditUsedFOrPO = () => {
    swal({
      title: `Are you sure?`,
      text: "You want to change details of 'To be Used For'",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (approve) => {
      if (approve) {
        axios
          .post(`${BASE_URL}/invoice/editUsedForPO`, {
            po_id: id,
            pr_id: prID,
            POUsedFor,
          })
          .then((res) => {
            // console.log(res);
            if (res.status === 200) {
              swal({
                title: "Success",
                text: "You successfully edit the of 'To be Used For'",
                icon: "success",
                button: "OK",
              }).then(() => {
                setPOEditUsedFor(false);
                reloadTable();
              });
            } else {
              swal({
                icon: "error",
                title: "Something went wrong",
                text: "Please contact our support",
              });
            }
          });
      }
    });
  };

  const handleSaveEditUsedFOr = () => {
    swal({
      title: `Are you sure?`,
      text: "You want to change details of 'To be Used For'",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (approve) => {
      if (approve) {
        axios
          .post(`${BASE_URL}/invoice/editUsedFor`, {
            pr_id: prID,
            id,
          })
          .then((res) => {
            // console.log(res);
            if (res.status === 200) {
              swal({
                title: "Success",
                text: "You successfully edit the of 'To be Used For'",
                icon: "success",
                button: "OK",
              }).then(() => {
                setEditUsedFor(false);
              });
            } else {
              swal({
                icon: "error",
                title: "Something went wrong",
                text: "Please contact our support",
              });
            }
          });
      }
    });
  };
  const handleSaveEditRemarks = () => {
    swal({
      title: `Are you sure?`,
      text: "You want to change details of 'Remarks'",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (approve) => {
      if (approve) {
        axios
          .post(`${BASE_URL}/invoice/editRemarks`, {
            pr_id: prID,
            remarks,
          })
          .then((res) => {
            // console.log(res);
            if (res.status === 200) {
              swal({
                title: "Success",
                text: "You successfully edit the of 'Remarks'",
                icon: "success",
                button: "OK",
              }).then(() => {
                setEditRemarks(false);
              });
            } else {
              swal({
                icon: "error",
                title: "Something went wrong",
                text: "Please contact our support",
              });
            }
          });
      }
    });
  };

  // const [POPreview, setPOPreview] = useState([]);
  // const handlePreview = async (po_num) => {
  //   const po_number = po_num;
  //   setShowModalPreview(true);
  //   axios
  //     .get(BASE_URL + "/invoice/fetchPOPreview", {
  //       params: {
  //         id: id,
  //         po_number,
  //       },
  //     })
  //     .then((res) => setPOPreview(res.data))
  //     .catch((err) => console.log(err));
  // };

  const [showes, setShow] = useState(false);

  const handleCloseses = () => {
    setShow(false);
    setShowSignature(false);
  };
  const handleShowses = () => setShow(true);

  //date format
  function formatDatetime(datetime) {
    const options = {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(datetime).toLocaleString("en-US", options);
  }

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
                  <h1>Purchase Order List Approval </h1>
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
                  <InputGroup className="mb-3">
                    <Form.Control
                      readOnly={!editUsedFor}
                      value={useFor}
                      onChange={(e) => setUseFor(e.target.value)}
                      type="text"
                      style={{ height: "40px", fontSize: "15px" }}
                    />
                    {userId === 11 ||
                      (userId === 3 && (
                        <InputGroup.Text id="basic-addon1">
                          {editUsedFor === true ? (
                            <Button
                              onClick={() => handleSaveEditUsedFOr()}
                              variant={"success"}
                            >
                              <Check size={20} />
                            </Button>
                          ) : (
                            <Button
                              onClick={() => setEditUsedFor(true)}
                              variant={"success"}
                            >
                              <PencilSimple size={20} />
                            </Button>
                          )}
                        </InputGroup.Text>
                      ))}
                  </InputGroup>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Remarks:{" "}
                  </Form.Label>

                  <InputGroup className="mb-3">
                    <Form.Control
                      readOnly={!editRemarks}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
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
                    {userId === 11 ||
                      (userId === 3 && (
                        <InputGroup.Text id="basic-addon1">
                          {editRemarks === true ? (
                            <Button
                              onClick={() => handleSaveEditRemarks()}
                              variant={"success"}
                            >
                              <Check size={20} />
                            </Button>
                          ) : (
                            <Button
                              onClick={() => setEditRemarks(true)}
                              variant={"success"}
                            >
                              <PencilSimple size={20} />
                            </Button>
                          )}
                        </InputGroup.Text>
                      ))}
                  </InputGroup>
                </Form.Group>
              </div>
              <div className="col-6"></div>
            </div>
            <div className="save-cancel">
              {status !== null ? ( // if status is equal to "Rejected", "Rejustified", "Approved" it is visible
                <Button
                  type="button"
                  className="btn btn-secondary"
                  size="md"
                  style={{ fontSize: "20px", margin: "0px 5px" }}
                  // onClick={() => handleCancel(id)}
                  onClick={() => handleReject_history()}
                >
                  Reject History
                </Button>
              ) : (
                <></>
              )}

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
              {/* {authrztn.includes("PO - Reject") && (
                <Button
                  type="button"
                  className="btn btn-danger"
                  size="md"
                  style={{ fontSize: "20px", margin: "0px 5px" }}
                  onClick={() => handleCancel(id)}
                >
                  Re-Canvass
                </Button>
              )} */}
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
            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "20px",
                fontFamily: "Poppins, Source Sans Pro",
              }}
            >
              <p className="h2"> {supplierName} </p>
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "81%",
                  left: "11rem",
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
                      <th className="tableh">Product Name</th>
                      <th className="tableh">UOM</th>
                      <th className="tableh">Needed Quantity</th>
                      {status === "Rejected" ? (
                        <>
                          <th className="tableh">Action</th>
                        </>
                      ) : (
                        <></>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {POarray.map(
                      (data, i) =>
                        data.items &&
                        data.items.map(
                          (item, j) =>
                            item.supp_tag &&
                            item.item && (
                              <tr key={`${i}-${j}`}>
                                <td>{item.supp_tag.code}</td>
                                <td>{item.supp_tag.name}</td>
                                <td>{item.supp_tag.uom}</td>
                                <td>{item.item.static_quantity}</td>
                                {status === "Rejected" ? (
                                  <>
                                    <td>
                                      <Button
                                        variant
                                        onClick={() =>
                                          handleRemovePoProduct(
                                            item.item.id,
                                            item.supp_tag.name
                                          )
                                        }
                                      >
                                        <Trash size={32} />
                                      </Button>
                                    </td>
                                  </>
                                ) : (
                                  <></>
                                )}
                              </tr>
                            )
                        )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <Modal
              show={showes}
              onHide={handleCloseses}
              backdrop="static"
              keyboard={false}
              size="xl"
            >
              <Modal.Header closeButton>
                <Modal.Title style={{ fontSize: "25px" }}>
                  DEPARTMENT:{" "}
                  <strong>
                    {
                      POdepartmentUser?.purchase_req?.masterlist?.department
                        ?.department_name
                    }
                  </strong>
                </Modal.Title>
              </Modal.Header>
              {POarray.map((group) => {
                let totalSum = 0;
                let amountWOvat = 0;
                let vatTotal = 0;
                let vatAmount = 0;
                let currency = group.items[0].suppliers.supplier_currency;
                let current_status = group.items[0].item.status;
                let supp_code = group.items[0].suppliers.supplier_code;
                let supp_name = group.items[0].suppliers.supplier_name;
                let vat = group.items[0].suppliers.supplier_vat;

                group.items.forEach((item, index) => {
                  totalSum +=
                    (item.item.purchase_price * (vat / 100 + 1)).toFixed(2) *
                    item.item.static_quantity;
                });

                // group.items.forEach((item, index) => {
                //   TotalAmount +=
                //     (item.item.purchase_price * (vat / 100 + 1)) *
                //     item.item.static_quantity;
                // });

                // (
                //   (
                //     item.item.purchase_price *
                //     (vat / 100 + 1)
                //   ).toFixed(2) *
                //   item.item.static_quantity
                // ).toLocaleString(undefined, {
                //   minimumFractionDigits: 2,
                // })

                amountWOvat = (totalSum / (1 + vat / 100)).toFixed(2);

                totalSum = totalSum.toFixed(2);
                vatAmount = (totalSum - amountWOvat).toFixed(2);

                amountWOvat = parseFloat(amountWOvat).toLocaleString("en-US");
                vatAmount = parseFloat(vatAmount).toLocaleString("en-US");
                totalSum = parseFloat(totalSum).toLocaleString("en-US");

                return (
                  <Modal.Body
                    // id={`content-to-capture-${group.title}`}
                    className="po-rece-modal"
                  >
                    <div
                      id={`content-to-capture-${group.title}`}
                      key={group.title}
                      className="receipt-main-container"
                    >
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

                        <div className="po-orders">
                          <div className="po-header">
                            <div className="vendor-info"></div>
                            <div className="plain-info">
                              <div className="text-center p-2 fw-bold fs-4 border-bottom border-white">
                                <span className="hideText">.</span>
                              </div>
                              <div className="p-1 border-bottom border-dark fs-6 d-flex flex-row">
                                <div className="text-center w-50">
                                  <span className="fs-5 fw-normal hideText">
                                    .
                                  </span>
                                </div>
                              </div>
                              <div className="p-1 fs-6 text-center border-bottom border-dark">
                                <span className="fs-5 fw-normal">Vendor</span>
                              </div>
                              <div className="p-1 fs-6 text-center">
                                <span className="fs-5 fw-normal">
                                  {group.items[0].suppliers.supplier_name}
                                </span>
                              </div>
                            </div>

                            <div className="order-info">
                              <div className="text-center p-2 fw-bold fs-4 border-bottom border-dark">
                                PURCHASE ORDER
                              </div>
                              <div className="p-1 border-bottom border-dark fs-6 d-flex flex-row">
                                <div className="text-center w-50">
                                  <span className="fs-5 fw-normal">P.O NO</span>
                                </div>
                                <div className="w-50">
                                  <span className="highlights">
                                    {group.title}
                                  </span>
                                </div>
                              </div>
                              <div className="p-1 border-bottom border-dark fs-6 d-flex flex-row">
                                <div className="text-center w-50">
                                  <span className="fs-5 fw-normal">
                                    P.R. NO
                                  </span>
                                </div>
                                <div className="w-50">
                                  <span className="highlights">{prNum}</span>
                                </div>
                              </div>
                              <div className="p-1 fs-6 d-flex flex-row">
                                <div className="text-center w-50">
                                  <span className="fs-5 fw-normal">
                                    DATE PREPARED:
                                  </span>
                                </div>
                                <div className="w-50">
                                  <span className="highlights">
                                    {formatDatetime(
                                      group.items[0].item.createdAt
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <ul className="order-list">
                            <li className="order-header">
                              <div className="firstgroup">
                                <div className="text-center fw-bold">
                                  <span className="fs-6">ITEM NO.</span>
                                </div>
                                <div className="text-center fw-bold">
                                  <span className="fs-6">QTY</span>
                                </div>
                                <div className="text-center fw-bold">
                                  <span className="fs-6">UNIT</span>
                                </div>
                              </div>
                              <div className="secondgroup">
                                <div className="fw-bold">
                                  <span className="fs-6">DESCRIPTION</span>
                                </div>
                                <div className="fw-bold">
                                  <span className="fs-6">Part Number</span>
                                </div>
                              </div>
                              <div className="thirdgroup">
                                <div className="text-center fw-bold">
                                  <span className="fs-6">UNIT PRICE</span>
                                </div>
                                <div className="text-center fw-bold">
                                  <span className="fs-6">TOTAL</span>
                                </div>
                              </div>
                            </li>
                            <div className="po-thirdline p-0">
                              <li className="order-header-item">
                                <div className="item-firstgroup">
                                  <div className="text-center">
                                    {group.items.map((item, index) => (
                                      <span className="fs-6">{`${item.supp_tag.code}`}</span>
                                    ))}
                                  </div>

                                  {/* for product quantity */}
                                  <div className="text-center">
                                    {group.items.map((item, index) => (
                                      <span className="fs-6">{`${item.item.static_quantity}`}</span>
                                    ))}
                                  </div>
                                  {/* for product unit of measurement */}
                                  <div className="text-center">
                                    {group.items.map((item, index) => (
                                      <span className="fs-6">{`${item.supp_tag.uom}`}</span>
                                    ))}
                                  </div>
                                </div>

                                <div className="item-secondgroup">
                                  {/* for product name */}
                                  <div className="fw-bold d-flex flex-column">
                                    {group.items.map((item, index) => (
                                      <span className="fs-6">{`${item.supp_tag.name}`}</span>
                                    ))}
                                  </div>

                                  <div className="fw-bold d-flex flex-column">
                                    {group.items.map((item, index) => (
                                      <span className="fs-6">
                                        {item.supp_tag.part_number === null
                                          ? "--"
                                          : item.supp_tag.part_number === ""
                                          ? "--"
                                          : item.supp_tag.part_number}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div className="item-thirdgroup">
                                  <div className="text-center fw-bold d-flex flex-column">
                                    {/* for unit price */}

                                    {group.items.map((item, index) => (
                                      <span className="fs-6">{`${(
                                        item.item.purchase_price *
                                        (vat / 100 + 1)
                                      ).toFixed(2)}`}</span>
                                    ))}
                                  </div>
                                  <div className="text-center fw-bold d-flex flex-column">
                                    {group.items.map((item, index) => (
                                      <span className="fs-6">
                                        {(
                                          (
                                            item.item.purchase_price *
                                            (vat / 100 + 1)
                                          ).toFixed(2) *
                                          item.item.static_quantity
                                        ).toLocaleString(undefined, {
                                          minimumFractionDigits: 2,
                                        })}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </li>
                            </div>
                            <div className="po-calculation">
                              <div className="po-received-by">
                                <div className="p-3 d-flex flex-column border-bottom border-dark">
                                  <span className="fs-4 fw-bold">
                                    P.O Received By:
                                  </span>
                                  <span className="fs-4 fw-normal"></span>
                                </div>
                                <div className="p-3 d-flex flex-column border-bottom border-dark">
                                  <span className="fs-4 fw-bold">
                                    Delivery Date:
                                  </span>
                                  <span className="fs-4 fw-normal"></span>
                                </div>
                                <div className="p-3 d-flex flex-column">
                                  <span className="fs-4 fw-bold">Terms:</span>
                                  <span className="fs-4 fw-normal">
                                    {`${group.items[0].suppliers.supplier_terms}`}
                                  </span>
                                </div>
                              </div>
                              <div className="po-terms-condition">
                                <div className="p-3 d-flex flex-column">
                                  <span className="fs-4 fw-bold">
                                    Used For:{" "}
                                  </span>

                                  {editPOUsedFor === true ? (
                                    <React.Fragment>
                                      <Form.Control
                                        value={POUsedFor}
                                        onChange={(e) =>
                                          setPOUsedFor(e.target.value)
                                        }
                                      />
                                    </React.Fragment>
                                  ) : (
                                    <React.Fragment>
                                      <span className="fs-4 fw-normal">
                                        {`${
                                          group.items[0].item.usedFor === null
                                            ? "--"
                                            : group.items[0].item.usedFor
                                        }`}
                                      </span>
                                    </React.Fragment>
                                  )}
                                  {editPOUsedFor === true ? (
                                    <Button
                                      onClick={() => handleSaveEditUsedFOrPO()}
                                      variant={"success"}
                                    >
                                      <Check size={10} />
                                    </Button>
                                  ) : (
                                    status === null &&
                                    (userId === 11 || userId === 3) && (
                                      <Button
                                        onClick={() => {
                                          setPOUsedFor(
                                            group.items[0].item.usedFor
                                          );
                                          setPOEditUsedFor(true);
                                        }}
                                        variant={"success"}
                                      >
                                        <PencilSimple size={10} />
                                      </Button>
                                    )
                                  )}
                                </div>
                                <div className="p-3 d-flex flex-column">
                                  <span className="fs-4 fw-bold">
                                    Terms and Condition:
                                  </span>
                                  <span className="fs-5 fw-normal">
                                    1. Acceptance of this order is an acceptance
                                    of all conditions herein.
                                  </span>
                                  <span className="fs-5 fw-normal">
                                    2. Make all deliveries to receiving, However
                                    subject to count, weight and specification
                                    approval of SBF Philippines Drilling
                                    Resources Corporation.
                                  </span>
                                  <span className="fs-5 fw-normal">
                                    3. The original purchase order copy and
                                    suppliers original invoice must accompany
                                    delivery.
                                  </span>
                                  <span className="fs-5 fw-normal">
                                    4. In case the supplier fails to deliver
                                    goods on delivery date specified herein, SBF
                                    Philippines Drilling Resources Corporation
                                    has the right to cancel this order or demand
                                    penalty charged as stated.
                                  </span>
                                  <span className="fs-5 fw-normal">
                                    5. Problems encountered related to your
                                    supply should immediately brought to the
                                    attention of the purchasing manager.
                                  </span>
                                </div>
                              </div>

                              <div className="po-overall-total">
                                <div className="p-3 d-flex flex-column border-bottom border-dark">
                                  <span className="fs-4 fw-normal">
                                    Total (w/o VAT):
                                  </span>
                                  <span className="fs-4 fw-bold">
                                    {amountWOvat}
                                  </span>
                                </div>
                                <div className="p-3 d-flex flex-column border-bottom border-dark">
                                  <span className="fs-4 fw-normal">
                                    VAT({`${vat}%`})
                                  </span>
                                  <span className="fs-4 fw-bold">
                                    {vatAmount}
                                  </span>
                                </div>
                                <div className="p-3 d-flex flex-column border-bottom border-dark">
                                  <span className="fs-4 fw-normal">
                                    Overall Total:
                                  </span>
                                  <span className="fs-4 fw-bold">
                                    {`${currency} ${totalSum}`}
                                  </span>
                                </div>
                                <div className="p-3 d-flex flex-column">
                                  <span className="fs-4 fw-normal">
                                    Date Approved:
                                  </span>
                                  <span className="fs-4 fw-bold">
                                    {dateApproved.toLocaleDateString("en-PH")}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="po-footer">
                              <div className="po-prepared-by">
                                <div className="p-3 d-flex flex-column">
                                  <span className="fs-4 fw-bold">
                                    Prepared By:
                                  </span>
                                  <span className="fs-4 fw-normal">
                                    {
                                      POdepartmentUser?.purchase_req?.masterlist
                                        ?.col_Fname
                                    }
                                  </span>
                                </div>
                              </div>
                              <div className="po-checked-by">
                                <div className="p-3 d-flex flex-column">
                                  <span className="fs-4 fw-normal">
                                    Checked By:{" "}
                                  </span>
                                  <span className="fs-4">
                                    <img
                                      src={sigAllan}
                                      alt="ESignature"
                                      style={{
                                        maxHeight: "100px",
                                        maxWidth: "100px",
                                      }}
                                      className="signature-image"
                                    />
                                  </span>

                                  <span className="fs-4 fw-bold">
                                    ALLAN JUEN
                                  </span>
                                </div>
                              </div>

                              <div className="po-approved-by">
                                <div className="p-3 d-flex flex-column">
                                  <span className="fs-4 fw-normal">
                                    Approved By:{" "}
                                  </span>

                                  {current_status === "To-Receive" ||
                                  current_status === "Received" ? (
                                    <span>
                                      <span className="fs-4 fw-bold">
                                        <img
                                          src={sigDan}
                                          alt="ESignature"
                                          className="signature-image"
                                        />
                                      </span>
                                    </span>
                                  ) : (
                                    <>
                                      {showSignature && (
                                        <span className="fs-4 fw-bold">
                                          <img
                                            src={sigDan}
                                            style={{
                                              maxHeight: "100px",
                                              maxWidth: "100px",
                                            }}
                                            alt="ESignature"
                                            className="signature-image img-fluid"
                                          />
                                        </span>
                                      )}
                                    </>
                                  )}

                                  <span className="fs-4 fw-bold">
                                    Daniel Byron S. Afdal
                                  </span>
                                </div>
                              </div>
                            </div>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {current_status === null ||
                    current_status === "Rejustified" ? (
                      <>
                        {!loadAprrove ? (
                          <div className="save-cancel po-btn-modal">
                            {authrztn.includes("PO - Reject") && (
                              <Button
                                onClick={() => {
                                  handleReject(group.title);
                                }}
                                className="btn btn-danger btn-md"
                                size="md"
                                style={{ fontSize: "20px", margin: "0px 5px" }}
                              >
                                Reject
                              </Button>
                            )}

                            {authrztn.includes("PO - Approval") && (
                              <Button
                                type="button"
                                className="btn btn-success"
                                size="md"
                                style={{ fontSize: "20px", margin: "0px 5px" }}
                                //  onClick={() => handleApprove()}
                                onClick={() => {
                                  handleApprove(group.title);
                                  setShowSignature(true);
                                }}
                              >
                                Approve
                              </Button>
                            )}
                          </div>
                        ) : (
                          <>
                            <div className="loading-container">
                              <ReactLoading
                                className="react-loading"
                                type={"bubbles"}
                              />
                              Please Wait...
                            </div>
                          </>
                        )}
                      </>
                    ) : current_status === "To-Receive" ||
                      current_status === "Received" ? (
                      <>
                        {!loadAprrove ? (
                          <div className="save-cancel po-btn-modal">
                            <Button
                              type="button"
                              className="btn btn-warning"
                              size="md"
                              style={{ fontSize: "20px", margin: "0px 5px" }}
                              onClick={() => {
                                handlePrint(group.title);
                              }}
                            >
                              Print
                            </Button>
                            {current_status === "To-Receive" && (
                              <Button
                                type="button"
                                className="btn btn-primary"
                                size="md"
                                style={{ fontSize: "20px", margin: "0px 5px" }}
                                onClick={() => {
                                  handleSend(group.title);
                                }}
                              >
                                Email to Supplier
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="loading-container">
                            <ReactLoading
                              className="react-loading"
                              type={"bubbles"}
                            />
                            Please Wait...
                          </div>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </Modal.Body>
                );
              })}

              <Modal.Footer>
                <></>
              </Modal.Footer>
            </Modal>

            <Modal show={showModal} onHide={handleClose}>
              <Form>
                <Modal.Header closeButton>
                  <Modal.Title style={{ fontSize: "24px" }}>
                    Rejustification Form
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="row mt-3">
                    <div className="col-6">
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label style={{ fontSize: "20px" }}>
                          PR No. :{" "}
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
                          PO NO. :{" "}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={id}
                          readOnly
                          style={{ height: "40px", fontSize: "15px" }}
                        />
                      </Form.Group>
                    </div>
                    <div className="">
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
                          Attach File:
                        </Form.Label>
                        {/* <Form.Control as="textarea"placeholder="Enter details name" style={{height: '100px', fontSize: '15px'}}/> */}
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
                  <Modal.Title style={{ fontSize: "24px" }}>
                    Reject Form
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
                            setRejectRemarks(
                              (prevRemarks) => prevRemarks + e.native
                            );
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
                      <span className="h2">{`${data.source}`}</span>
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

                  {department === 1 ? (
                    <>
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
                    </>
                  ) : (
                    <></>
                  )}
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
