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
import { ArrowCircleLeft, Note, Smiley, Plus } from "@phosphor-icons/react";
import axios from "axios";
import BASE_URL from "../../../assets/global/url";
import swal from "sweetalert";
import { jwtDecode } from "jwt-decode";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

function PurchaseRequestPreview({ authrztn }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [prNum, setPrNum] = useState("");
  const [status, setStatus] = useState("");
  const [dateCreated, setDateCreated] = useState("");
  const [dateNeed, setDateNeed] = useState(null);
  const [useFor, setUseFor] = useState("");
  const [requestor, setRequestor] = useState("");
  const [remarks, setRemarks] = useState("");
  const [product, setProduct] = useState([]); //para pag fetch ng mga registered products

  const [productSelectedFetch, setProductSelectedFetch] = useState([]); //para pag display sa product na selected sa pag create patungong table
  const [assemblySelectedFetch, setAssemblySelectedFetch] = useState([]); //para pag display sa assembly na selected sa pag create patungong table
  const [spareSelectedFetch, setSpareSelectedFetch] = useState([]); //para pag display sa spare na selected sa pag create
  const [subPartSelectedFetch, setSubPartSelectedFetch] = useState([]); //para pag display sa subpart na selected sa pag create patungong table

  const [validated, setValidated] = useState(false);
  const [isReadOnly, setReadOnly] = useState(false);

  const [showModal_reject, setShowModal_reject] = useState(false);
  const [showModal_remarks, setShowModal_remarks] = useState(false);
  const [rejectRemarks, setRejectRemarks] = useState("");
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [rejustifyHistory, setRejustifyHistory] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  // const [files, setFiles] = useState([]);
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

  // const handleFileChange = (e) => {
  //   setFiles(e.target.files);
  // };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleEditClick = () => {
    // for clicking the button can be editted not readonly
    setReadOnly(true);
  };

  const handleCancelEdit = () => {
    // for clicking the button can be editted not readonly
    setReadOnly(false);
  };
  const displayDropdown = () => {
    setShowDropdown(true);
  };
  const [fetchProduct, setFetchProduct] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [mergeOptions, setMergeOptions] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    axios
      .get(BASE_URL + "/product/fetchTable")
      .then((res) => setFetchProduct(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleInputChangeSearch = (inputValue) => {
    setSearchInput(inputValue);
  };

  const filteredOptions = fetchProduct
    .map((prod) => ({
      value: `${prod.product_id}_${prod.product_code}_Product`,
      label: `(${prod.product_code}) - ${prod.product_name}`,
      type: "Product",
      values: prod.product_id,
      code: prod.product_code,
      name: prod.product_name,
      created: prod.createdAt,
    }))
    .filter((option) => {
      const searchString = `${option.code.toLowerCase()} ${option.name.toLowerCase()}`;
      return searchString.includes(searchInput.toLowerCase());
    })
    .slice(0, 5);

  const selectProduct = (selectedOptions) => {
    setSelectedProducts(selectedOptions);

    const newInputValues = {};
    selectedOptions.forEach((selectedOption) => {
      const { value } = selectedOption;
      newInputValues[value] = {
        quantity: inputValues[value]?.quantity || "", // Retain existing quantity
        desc: inputValues[value]?.desc || "", // Retain existing description
      };
    });

    setInputValues({ ...inputValues, ...newInputValues });
  };

  const handleInputChange = (value, productValue, inputType) => {
    setInputValues((prevInputs) => ({
      ...prevInputs,
      [productValue]: {
        ...prevInputs[productValue],
        [inputType]: value,
      },
    }));
  };

  useEffect(() => {
    axios
      .get(BASE_URL + "/PR_product/fetchPrProduct", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        const data = res.data;
        console.log(data);

        const selectedProducts = data.map((row) => ({
          value: `${row.product.product_id}_${row.product.product_code}_Product`,
          label: `(${row.product.product_code}) - ${row.product.product_name}`,
          type: "Product",
          values: row.product.product_id,
          code: row.product.product_code,
          name: row.product.product_name,
          uom: row.product.product_unitMeasurement,
          quantity: row.quantity,
          description: row.description,
        }));

        setSelectedProducts(selectedProducts);

        const initialInputValues = {};
        selectedProducts.forEach((product) => {
          initialInputValues[product.value] = {
            quantity: product.quantity,
            desc: product.description,
          };
        });

        setInputValues(initialInputValues);
      })
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    const selectedProductValues = new Set(selectedProducts.map((p) => p.value));
    const filteredOptions = fetchProduct
      .map((prod) => ({
        value: `${prod.product_id}_${prod.product_code}_Product`,
        label: `(${prod.product_code}) - ${prod.product_name}`,
        type: "Product",
        values: prod.product_id,
        code: prod.product_code,
        name: prod.product_name,
        uom: prod.product_unitMeasurement,
        created: prod.createdAt,
      }))
      .filter((option) => {
        const searchString = `${option.code.toLowerCase()} ${option.name.toLowerCase()}`;
        return (
          searchString.includes(searchInput.toLowerCase()) &&
          !selectedProductValues.has(option.value)
        );
      })
      .slice(0, 5);

    setMergeOptions(filteredOptions);
  }, [fetchProduct, selectedProducts, searchInput]);

  const saveEdit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      swal({
        icon: "error",
        title: "Fields are required",
        text: "Please fill the red text fields",
      });
    } else {
      try {
        const updatedProducts = selectedProducts.map((product) => ({
          product_id: product.values,
          product_code: product.code,
          product_name: product.name,
          quantity: inputValues[product.value]?.quantity || "",
          description: inputValues[product.value]?.desc || "",
        }));

        // console.log(`dsad`);
        // console.log(updatedProducts);
        const response = await axios.post(`${BASE_URL}/PR/pr_update`, {
          dateNeed,
          useFor,
          remarks,
          updatedProducts,
          id,
          userId,
        });

        // console.log(response);

        if (response.status === 200) {
          swal({
            title: "Purchase Request Successfully Updated!",
            text: "Your request for purchase has been successfully updated.",
            icon: "success",
            button: "OK",
          }).then(() => {
            navigate("/purchaseRequest");
          });
        } else {
          swal({
            icon: "error",
            title: "Something went wrong",
            text: "Please contact our support",
          });
        }
      } catch (error) {
        console.error(error);

        swal({
          icon: "error",
          title: "Request failed",
          text:
            error.response?.data?.error ||
            "Please select a Product to request!",
        });
      }
    }

    setValidated(true); // for validations
  };

  const handleApproveClick = () => {
    swal({
      title: "Confirm Approval",
      text: "Are you sure you want to approve this purchase request?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (approve) => {
      if (approve) {
        try {
          axios
            .post(`${BASE_URL}/PR/approve`, null, {
              params: {
                id: id,
                userId,
              },
            })
            .then((res) => {
              if (res.status === 200) {
                swal({
                  title: "Purchase Request Approved",
                  text: "The purchase request has been successfully approved.",
                  icon: "success",
                  button: "OK",
                }).then(() => {
                  navigate("/purchaseRequest");
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
      formData.append("id", id);

      const response = await axios.post(
        BASE_URL + `/PR_rejustify/rejustify`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          params: {
            userId: userId,
          },
        }
      );

      if (response.status === 200) {
        swal({
          title: "Rejustification Successful",
          text: "The purchase request has been successfully rejustified.",
          icon: "success",
          button: "OK",
        }).then(() => {
          navigate("/purchaseRequest");
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

  //Where clause ng assembly
  useEffect(() => {
    axios
      .get(BASE_URL + "/PR_assembly/fetchViewAssembly", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        const data = res.data;
        setAssemblySelectedFetch(data);
        // const selectedPRAssembly = data.map((row) => ({
        //   value: row.id,
        //   label: `Assembly Code: ${row.assembly.assembly_code} / Name: ${row.assembly.assembly_name}`,
        // }));
        // setvaluePRassembly(selectedPRAssembly);
      })
      .catch((err) => console.log(err));
  }, [id]);

  //Where clause sa spare parts
  useEffect(() => {
    axios
      .get(BASE_URL + "/PR_spare/fetchViewSpare", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        const data = res.data;
        setSpareSelectedFetch(data);
        //   const selectedPRspare = data.map((row) => ({
        //     value: row.id,
        //     label: `Spare Code: ${row.sparePart.spareParts_code} / Name: ${row.sparePart.spareParts_name}`,
        //   }));
        //   setvalueSpare(selectedPRspare);
      })
      .catch((err) => console.log(err));
  }, [id]);

  //Where clause sa sub parts
  useEffect(() => {
    axios
      .get(BASE_URL + "/PR_subpart/fetchViewSubpart", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        const data = res.data;
        setSubPartSelectedFetch(data);
        // const selectedPRsub = data.map((row) => ({
        //   value: row.id,
        //   label: `SubPart Code: ${row.subPart.subPart_code} / Name: ${row.subPart.subPart_name}`,
        // }));
        // setvaluePRsub(selectedPRsub);
      })
      .catch((err) => console.log(err));
  }, [id]);

  useEffect(() => {
    axios
      .get(BASE_URL + "/PR/fetchView", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setPrNum(res.data.pr_num);
        setStatus(res.data.status);
        setDateCreated(res.data.createdAt);
        setRequestor(res.data.masterlist_id);
        const parsedDate = new Date(res.data.date_needed);
        setDateNeed(parsedDate);
        setUseFor(res.data.used_for);
        setRemarks(res.data.remarks);
        setProduct(res.data.product_id);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);

  const handleClose = () => {
    setShowModal(false);
    setShowModal_reject(false);
    setShowModal_remarks(false);
  };
  // const handleReject = () => {
  //   swal({
  //     title: "Confirm Reject",
  //     text: "Are you sure you want to reject this purchase request?",
  //     icon: "warning",
  //     buttons: true,
  //     dangerMode: true,
  //   }).then(async (approve) => {
  //     if (approve) {
  //       try {
  //         axios.post(`${BASE_URL}/PR/reject`, null, {
  //           params: {
  //             id: id,
  //             userId,
  //           }
  //         })
  //           .then((res) => {
  //             console.log(res);
  //             if (res.status === 200) {
  //               swal({
  //                 title: "Purchase Request Rejected",
  //                 text: "The purchase request has been successfully rejected.",
  //                 icon: 'success',
  //                 button: 'OK'
  //               })
  //                 .then(() => {
  //                   navigate('/purchaseRequest')
  //                 });
  //             } else {
  //               swal({
  //                 icon: 'error',
  //                 title: 'Something went wrong',
  //                 text: 'Please contact our support'
  //               });
  //             }
  //           })

  //       } catch (err) {
  //         console.log(err);
  //       }
  //     } else {
  //       swal({
  //         title: "Cancelled Successfully",
  //         icon: "warning",
  //       });
  //     }
  //   });
  // }

  const handleReject_history = () => {
    setShowModal_remarks(true);
    axios
      .get(BASE_URL + "/pr/fetchRejectHistory", {
        params: {
          pr_id: id,
        },
      })
      .then((res) => {
        setRejustifyHistory(res.data);
      })
      .catch((err) => console.log(err));
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

  const handleRejected = async () => {
    try {
      axios
        .post(`${BASE_URL}/PR/reject`, null, {
          params: {
            id: id,
            userId,
            rejectRemarks,
          },
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            swal({
              title: "Purchase Request Rejected",
              text: "The purchase request has been successfully rejected.",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate("/purchaseRequest");
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

  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
        <div className="right-body-contents-a">
          <Row>
            <Col>
              <div
                className="create-head-back"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Link style={{ fontSize: "1.5rem" }} to="/purchaseRequest">
                  <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                </Link>
                <h1>Purchase Request Preview</h1>
              </div>
              <p1>
                Purchasing please purchase the following item enumerated below{" "}
              </p1>
            </Col>
            <Col>
              <div
                className="Status"
                style={{ display: "flex", alignItems: "center" }}
              >
                <h4>
                  <div className="row">
                    Status:{" "}
                    {status === "For-Rejustify" ? "Rejustified" : status}
                  </div>
                  <div className="row">
                    Date Created: {formatDatetime(dateCreated)}
                  </div>
                </h4>
              </div>
            </Col>
          </Row>
          <Form noValidate onSubmit={saveEdit} validated={validated}>
            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "20px",
                fontFamily: "Poppins, Source Sans Pro",
              }}
            >
              Purchase Information
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
                    readOnly={!isReadOnly}
                    selected={dateNeed}
                    onChange={(date) => setDateNeed(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Start Date"
                    className="form-control"
                  />
                </Form.Group>
              </div>

              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    To be used for:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={useFor}
                    readOnly={!isReadOnly}
                    onChange={(e) => setUseFor(e.target.value)}
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
                <table id="">
                  <thead>
                    <tr>
                      <th className="tableh">Product Code</th>
                      <th className="tableh">Product Name</th>
                      <th className="tableh">Quantity</th>
                      <th className="tableh">U/M</th>
                      <th className="tableh">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProducts.map((product, i) => (
                      <tr key={i}>
                        <td>{product.code}</td>
                        <td>{product.name}</td>
                        <td>
                          <div className="d-flex flex-direction-row align-items-center">
                            <Form.Control
                              type="number"
                              readOnly={!isReadOnly}
                              required
                              value={inputValues[product.value]?.quantity || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  e.target.value,
                                  product.value,
                                  "quantity"
                                )
                              }
                              onInput={(e) => {
                                e.preventDefault();
                                const validInput = e.target.value.replace(
                                  /[^0-9]/g,
                                  ""
                                ); // Replace non-numeric characters
                                e.target.value = validInput;
                              }}
                              placeholder="Input quantity"
                              style={{
                                height: "40px",
                                width: "120px",
                                fontSize: "15px",
                              }}
                            />
                          </div>
                        </td>
                        <td>{product.uom}</td>
                        <td>
                          <Form.Control
                            type="text"
                            readOnly={!isReadOnly}
                            value={inputValues[product.value]?.desc || ""}
                            onChange={(e) =>
                              handleInputChange(
                                e.target.value,
                                product.value,
                                "desc"
                              )
                            }
                            placeholder="Input description"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  {showDropdown && isReadOnly && (
                    <div className="dropdown mt-3">
                      <Select
                        isMulti
                        options={mergeOptions}
                        value={selectedProducts}
                        onChange={selectProduct}
                        onInputChange={handleInputChangeSearch}
                      />
                    </div>
                  )}

                  {isReadOnly && (
                    <div className="item">
                      <div className="new_item">
                        <button type="button" onClick={displayDropdown}>
                          <span style={{ marginRight: "4px" }}></span>
                          <Plus size={20} /> New Item
                        </button>
                      </div>
                    </div>
                  )}
                </table>
              </div>
            </div>

            <div className="save-cancel">
              {requestor === userId &&
                !isReadOnly &&
                (status === "For-Approval" || status === "Rejected") && (
                  <Button
                    type="button"
                    variant="outline-warning"
                    size="md"
                    onClick={handleEditClick}
                    style={{ fontSize: "20px", margin: "0px 5px" }}
                  >
                    Edit Request
                  </Button>
                )}

              {isReadOnly && (
                <Button
                  type="submit"
                  variant="outline-warning"
                  size="md"
                  style={{ fontSize: "20px", margin: "0px 5px" }}
                >
                  Save
                </Button>
              )}
              {isReadOnly && (
                <Button
                  type="button"
                  onClick={handleCancelEdit}
                  variant="outline-secondary"
                  size="md"
                  style={{ fontSize: "20px", margin: "0px 5px" }}
                >
                  Cancel Edit
                </Button>
              )}

              {status === "For-Approval" || status === "Rejustified" ? (
                <>
                  {authrztn.includes("PR - Approval") && !isReadOnly && (
                    <Button
                      type="button"
                      onClick={handleApproveClick}
                      className="btn btn-warning"
                      size="md"
                      style={{ fontSize: "20px", margin: "0px 5px" }}
                    >
                      Approve
                    </Button>
                  )}
                  {authrztn.includes("PR - Reject") && !isReadOnly && (
                    <Button
                      onClick={handleReject}
                      className="btn btn-danger btn-md"
                      size="md"
                      style={{ fontSize: "20px", margin: "0px 5px" }}
                    >
                      Reject
                    </Button>
                  )}
                </>
              ) : (
                <></>
              )}

              {status !== "For-Approval" && status !== "Cancelled" ? (
                <>
                  <Button
                    onClick={handleReject_history}
                    className="btn btn-secondary btn-md"
                    size="md"
                    style={{ fontSize: "20px", margin: "0px 5px" }}
                  >
                    Reject History
                  </Button>
                  {/* <Button
                        onClick={handleShow}
                        className='btn btn-secondary btn-md'
                        size="md"
                        style={{ fontSize: '20px', margin: '0px 5px' }}
                      >
                        Rejustify 
                      </Button> */}
                </>
              ) : (
                <></>
              )}
            </div>
          </Form>
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
                        selected={dateNeed}
                        onChange={(date) => setDateNeed(date)}
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
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label style={{ fontSize: "20px" }}>
                        Attach File:{" "}
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
                        selected={dateNeed}
                        onChange={(date) => setDateNeed(date)}
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
      </div>
    </div>
  );
}

export default PurchaseRequestPreview;
