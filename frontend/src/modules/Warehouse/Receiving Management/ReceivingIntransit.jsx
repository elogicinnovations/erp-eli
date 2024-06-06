import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../../Sidebar/sidebar";
import "../../../assets/global/style.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactLoading from "react-loading";
import NoData from "../../../assets/image/NoData.png";
import NoAccess from "../../../assets/image/NoAccess.png";
import "../../styles/react-style.css";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import warehouse from "../../../assets/global/warehouse";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {
  ArrowCircleLeft,
  Upload,
  Circle,
  ArrowUUpLeft,
} from "@phosphor-icons/react";
import * as $ from "jquery";
import axios from "axios";
import BASE_URL from "../../../assets/global/url";
import swal from "sweetalert";
import { pink } from "@mui/material/colors";
import Checkbox from "@mui/material/Checkbox";
import { fontStyle } from "@mui/system";
import Carousel from "react-bootstrap/Carousel";
import { jwtDecode } from "jwt-decode";

function ReceivingIntransit({ authrztn }) {
  const label_qa = { inputProps: { "aria-label": "Checkbox demo" } };
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();
  const [prNumber, setPrNumber] = useState();
  const [poID, setpoID] = useState("");
  const [prID, setprID] = useState("");
  const [dateNeeded, setDateNeeded] = useState();
  const [usedFor, setUsedFor] = useState();
  const [department, setDepartment] = useState();
  const [requestedBy, setRequestedBy] = useState();
  const [remarks, setRemarks] = useState();
  const [status, setStatus] = useState();
  const [dateCreated, setDateCreated] = useState();

  const [Transaction_prd, setTransaction_prd] = useState([]);
  const [Transaction_asm, setTransaction_asm] = useState([]);
  const [Transaction_spr, setTransaction_spr] = useState([]);
  const [Transaction_sbp, setTransaction_sbp] = useState([]);

  const [Transaction_prd_dv, setTransaction_prd_dv] = useState([]);
  const [Transaction_asm_dv, setTransaction_asm_dv] = useState([]);
  const [Transaction_spr_dv, setTransaction_spr_dv] = useState([]);
  const [Transaction_sbp_dv, setTransaction_sbp_dv] = useState([]);

  const [filteredPRD, setFilteredPRD] = useState([]);
  const [filteredASM, setFilteredASM] = useState([]);
  const [filteredSPR, setFilteredSPR] = useState([]);
  const [filteredSBP, setFilteredSBP] = useState([]);

  const handleViewTransaction = (po_number) => {
    setIsLoading(true);
    setShowTransaction(true);
    const po_num = po_number;

    axios
      .get(BASE_URL + "/receiving/fetchTransaction", {
        params: {
          po_num,
          pr_id: prID,
        },
      })
      .then((res) => {
        setFilteredPRD(res.data.prd);
        setTransaction_prd(res.data.prd);
        setTransaction_prd_dv(res.data.prd_dv);

        setFilteredASM(res.data.asm);
        setTransaction_asm(res.data.asm);
        setTransaction_asm_dv(res.data.asm_dv);

        setFilteredSPR(res.data.spr);
        setTransaction_spr(res.data.spr);
        setTransaction_spr_dv(res.data.spr_dv);

        setFilteredSBP(res.data.sbp);
        setTransaction_sbp(res.data.sbp);
        setTransaction_sbp_dv(res.data.sbp_dv);

        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });

    // return () => clearTimeout(delay);
  };

  console.log(Transaction_prd_dv);

  const [show, setShow] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);
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

  const handleClose = () => {
    setInputValues({});
    setCheckedRows({});
    setValidated(false);
    setShow(false);
    setShowTransaction(false);
    setcustomFee("");
    setShippingFee("");
  };
  // const handleShow = () => setShow(true);

  // -------------------- fetch data value --------------------- //
  useEffect(() => {
    const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/receiving/viewToReceiveIntransit", {
          params: {
            id,
          },
        })
        .then((res) => {
          setprID(res.data[0].pr_id);
          setpoID(res.data[0].po_id);
          setPrNumber(res.data[0].purchase_req.pr_num);
          setDateNeeded(res.data[0].purchase_req.date_needed);
          setUsedFor(res.data[0].purchase_req.used_for);
          setRemarks(res.data[0].purchase_req.remarks);
          setDepartment(
            res.data[0].purchase_req.masterlist.department.department_name
          );
          setRequestedBy(res.data[0].purchase_req.masterlist.col_Fname);
          setStatus(res.data[0].status);
          setDateCreated(res.data[0].createdAt); // kung kelan na received sa davao
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }, 1000);

    return () => clearTimeout(delay);
  }, []);
  // -------------------- end fetch data value --------------------- //

  const [POarray, setPOarray] = useState([]);
  useEffect(() => {
    axios
      .post(BASE_URL + "/receiving/fetchPOarray", null, {
        params: {
          po_id: id,
        },
      })
      .then((res) => setPOarray(res.data))
      .catch((err) => console.log(err));
  }, []);

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

  const [products_receive, setProducts_receive] = useState([]);
  const [po_id, setPo_id] = useState("");
  const [supplier_name, setSupplier_name] = useState("");
  const [supplier_code, setSupplier_code] = useState("");
  const [prod_name, setProd_name] = useState([]);
  const [refCodes, setRefCodes] = useState("");

  const handleReceived = () => {
    setIsLoading(true);
    setShow(true);
    axios
      .get(BASE_URL + "/receiving/PO_products", {
        params: {
          pr_id: prID,
          po_number: poID,
          id,
        },
      })
      .then((res) => {
        const firstItem = res.data.consolidatedArray[0].items[0];
        //  const prodNames = res.data.map(item => item.supp_tag.name);

        // console.log(`dsadas ${res.data.consolidatedArray[0].items[0].item.receiving_po.ref_code}`)
        setRefCodes(firstItem.item.receiving_po.ref_code);
        setProducts_receive(res.data.consolidatedArray);
        setproductImages(res.data.image_receiving);
        setPo_id(res.data.consolidatedArray[0].title);
        setSupplier_code(firstItem.suppliers.supplier_code);
        setSupplier_name(firstItem.suppliers.supplier_name);
        setProd_name(res.data.consolidatedArray.items.supp_tag.name);

        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  //   useEffect(() => {
  //     console.log(`refCodes ${refCodes}`);
  // }, [refCodes]);

  const [checkedRows, setCheckedRows] = useState({});

  // const handleCheckbox = (event, parentIndex, childIndex) => {
  //   const newCheckedRows = { ...checkedRows };
  //   newCheckedRows[parentIndex] = { ...newCheckedRows[parentIndex] };
  //   newCheckedRows[parentIndex][childIndex] =
  //     !newCheckedRows[parentIndex][childIndex];
  //     setInputValues({})
  //   setCheckedRows(newCheckedRows);

  // };
  const handleCheckbox = (event, parentIndex, childIndex) => {
    const newCheckedRows = { ...checkedRows };
    newCheckedRows[parentIndex] = { ...newCheckedRows[parentIndex] };
    newCheckedRows[parentIndex][childIndex] =
      !newCheckedRows[parentIndex][childIndex];

    // If the checkbox is unchecked, reset input values for the specific row
    if (!newCheckedRows[parentIndex][childIndex]) {
      const updatedInputValues = { ...inputValues };
      delete updatedInputValues[
        `${po_id}_${products_receive[parentIndex].items[childIndex].type}_${products_receive[parentIndex].items[childIndex].supp_tag.code}_${products_receive[parentIndex].items[childIndex].supp_tag.name}`
      ];
      setInputValues(updatedInputValues);
    }

    setCheckedRows(newCheckedRows);
    setValidated(false);
  };

  console.log(products_receive);

  const [inputValues, setInputValues] = useState({});

  // const handleInputChange = (value, productValue, inputType) => {
  //   setInputValues((prevInputs) => ({
  //     ...prevInputs,
  //     [productValue]: {
  //       ...prevInputs[productValue],
  //       [inputType]: value,
  //     },
  //   }));
  // };

  const [shippingFee, setShippingFee] = useState("");
  const [customFee, setcustomFee] = useState("");
  const [isSF_applicable, setIsSF_applicable] = useState(true);
  const [isD_C_applicable, setIsD_C_applicable] = useState(true);
  const handleDutiesChange = () => {
    setIsD_C_applicable((prevState) => {
      const newApplicable = !prevState;
      setcustomFee(newApplicable ? "" : "0");
      return newApplicable;
    });
  };

  const handleShippingChange = () => {
    setIsSF_applicable((prevState) => {
      const newApplicable = !prevState;
      setShippingFee(newApplicable ? "" : "0");
      return newApplicable;
    });
  };

  const handleInputChange = (value, productValue, inputType, po_quantity) => {
    setInputValues((prevInputs) => {
      // Extracting the necessary details from productValue
      const [po_id, type, code, name] = productValue.split("_");

      // Need para sa uniqueness ng row sa array
      const parent = products_receive.find((parent) => parent.title === po_id);
      const item = parent.items.find(
        (item) => item.supp_tag.code === code && item.supp_tag.name === name
      );

      // Constructing the new input values object
      const newInputValues = {
        ...prevInputs,
        [productValue]: {
          ...prevInputs[productValue],
          [inputType]: value,
        },
      };

      // If inputType is "Rquantity" or "Cquantity", update corresponding fields in item

      let Received_quantity, Remaining_quantity, maxReceivedQuantity;
      if (inputType === "Rquantity") {
        // item.Received_quantity = value;
        Received_quantity = value;
      } else if (inputType === "Tquantity") {
        // item.Checked_quantity = value;
        Remaining_quantity = value;
      }

      // if (prevInputs[productValue]?.Squantity === undefined) {
      //   // console.log(`Undefined Set: ${Received_quantity} * ${po_quantity}`);
      //   maxReceivedQuantity = po_quantity;
      // } else {
      //   // console.log(
      //   //   `Defined Set: ${
      //   //     prevInputs[productValue]?.Squantity || 0
      //   //   } * ${po_quantity}`
      //   // );
      //   maxReceivedQuantity =
      //     (prevInputs[productValue]?.Squantity || 0) * po_quantity;
      // }
      // console.log(`inputed value ${value}`);
      // console.log(`mXX_quantity ${maxReceivedQuantity}`);
      // console.log(`Checked_quantity ${Checked_quantity}`)

      if (Received_quantity > po_quantity) {
        // Show SweetAlert popup message
        swal({
          title: "Error",
          text: "Received Quantity cannot exceed the calculated maximum.",
          icon: "error",
        }).then(() => {
          // Set the input value to the maximum allowed quantity
          setInputValues((prevInputs) => ({
            ...prevInputs,
            [productValue]: {
              ...prevInputs[productValue],
              [inputType]: po_quantity,
            },
          }));
        });
      } else {
        return {
          ...prevInputs,
          [productValue]: {
            ...prevInputs[productValue],
            [inputType]: value,
          },
        };
      }

      return newInputValues;
    });
  };

  const [suppReceving, setsuppReceving] = useState("Agusan Del Sur");

  const [addReceivebackend, setReceivebackend] = useState([]);

  useEffect(() => {
    const serializedParent = products_receive.map(({ title, items }) => {
      return {
        title,
        serializedArray: items.map((child) => ({
          initialTB_id: child.item.id,
          canvassed_ID: child.item.canvassed_id,
          ordered_quantity: child.item.received_quantity,
          type: child.type,
          set_quantity: child.item.set_quantity,
          Received_quantity:
            inputValues[
              `${po_id}_${child.type}_${child.supp_tag.code}_${child.supp_tag.name}`
            ]?.Rquantity || "",
          Remaining_quantity: child.item.set_quantity
            ? child.item.set_quantity * child.item.received_quantity -
              inputValues[
                `${po_id}_${child.type}_${child.supp_tag.code}_${child.supp_tag.name}`
              ]?.Rquantity *
                child.item.set_quantity
            : child.item.received_quantity -
              inputValues[
                `${po_id}_${child.type}_${child.supp_tag.code}_${child.supp_tag.name}`
              ]?.Rquantity,
        })),
      };
    });

    setReceivebackend(serializedParent);

    console.log("Selected Products:", serializedParent);
  }, [inputValues]);

  const add = async (e) => {
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
      swal({
        title: `Are you sure want to received this transitted product/s?`,
        text: "This action cannot be undone.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (approve) => {
        if (approve) {
          try {
            const response = await axios.post(
              BASE_URL + "/receiving/insertReceived_Intransit",
              {
                addReceivebackend,
                productImages,
                customFee,
                shippingFee,
                isD_C_applicable,
                isSF_applicable,
                suppReceving,
                refCodes,
                poID,
                prID,
                id,
                userId,
              }
            );

            if (response.status === 200) {
              swal({
                title: "Purchase Request Add Succesful!",
                text: "The Purchase Request has been Added Successfully.",
                icon: "success",
                button: "OK",
              }).then(() => {
                handleClose();
                navigate("/receivingManagement");
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
            // Handle request error
            swal({
              icon: "error",
              title: "Something went wrong",
              text: "Please contact our support",
            });
          }
        }
      });
    }

    setValidated(true); // for validations
  };

  const [productImages, setproductImages] = useState([]);
  const fileInputRef = useRef(null);

  function selectFiles() {
    fileInputRef.current.click();
  }

  // console.log(JSON.stringify(productImages));

  function onFileSelect(event) {
    const files = event.target.files;
    if (files.length + productImages.length > 5) {
      swal({
        icon: "error",
        title: "File Limit Exceeded",
        text: "You can upload up to 5 images only.",
      });
      return;
    }

    for (let i = 0; i < files.length; i++) {
      if (!productImages.some((e) => e.name === files[i].name)) {
        const allowedFileTypes = [
          "image/jpeg",
          "image/png",
          "image/webp",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Excel
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Word
        ];

        if (!allowedFileTypes.includes(files[i].type)) {
          swal({
            icon: "error",
            title: "Invalid File Type",
            text: "Only JPEG, PNG, and WebP file types are allowed.",
          });
          return;
        }

        if (files[i].size > 5 * 1024 * 1024) {
          swal({
            icon: "error",
            title: "File Size Exceeded",
            text: "Maximum file size is 5MB.",
          });
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          setproductImages((prevImages) => [
            ...prevImages,
            {
              name: files[i].name,
              image: e.target.result.split(",")[1],
            },
          ]);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  function deleteImage(index) {
    const updatedImages = [...productImages];
    updatedImages.splice(index, 1);
    setproductImages(updatedImages);
  }

  function onDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }
  function onDragLeave(event) {
    event.preventDefault();
  }

  function onDropImages(event) {
    event.preventDefault();

    const files = event.dataTransfer.files;

    if (files.length + productImages.length > 5) {
      swal({
        icon: "error",
        title: "File Limit Exceeded",
        text: "You can upload up to 5 images only.",
      });
      return;
    }

    for (let i = 0; i < files.length; i++) {
      if (!productImages.some((e) => e.name === files[i].name)) {
        const allowedFileTypes = ["image/jpeg", "image/png", "image/webp"];

        if (!allowedFileTypes.includes(files[i].type)) {
          swal({
            icon: "error",
            title: "Invalid File Type",
            text: "Only JPEG, PNG, and WebP file types are allowed.",
          });
          return;
        }

        if (files[i].size > 5 * 1024 * 1024) {
          swal({
            icon: "error",
            title: "File Size Exceeded",
            text: "Maximum file size is 5MB.",
          });
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          setproductImages((prevImages) => [
            ...prevImages,
            {
              name: files[i].name,
              product_image: e.target.result.split(",")[1],
            },
          ]);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

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

  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($("#order-listing").length > 0 && Transaction_prd.length > 0) {
      $("#order-listing").DataTable();
    }
  }, [Transaction_prd]);

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
        ) : authrztn.includes("Receiving - View") ? (
          <div className="right-body-contents-a">
            <Row>
              <Col>
                <div
                  className="create-head-back"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Link
                    style={{ fontSize: "1.5rem" }}
                    to="/receivingManagement"
                  >
                    <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                  </Link>
                  <h1>Receiving (From Davao)</h1>
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

            <div className="row">
              <div className="col-12 ">
                <Form.Label
                  style={{
                    fontSize: "20px",
                    fontFamily: "Poppins, Source Sans Pro",
                  }}
                >
                  Information{" "}
                </Form.Label>
                <div className="receive-container">
                  <div className="row">
                    <div className="col-6">
                      <div className="receiving_list d-flex flex-direction-column">
                        <ul>
                          <li>
                            <p>{`PR #: ${prNumber}`}</p>
                          </li>
                          <li>{`Requested by: ${requestedBy}`}</li>
                          <li>{`Department: ${department}`}</li>
                          <li>{`To be used for: ${usedFor}`}</li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="receiving_list_right d-flex flex-direction-column">
                        <ul>
                          <li>
                            <p className="h4">{`Received in Davao: ${formatDatetime(
                              dateCreated
                            )}`}</p>
                          </li>
                          <li>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <Circle
                                weight="fill"
                                size={20}
                                color="green"
                                style={{ margin: "10px" }}
                              />
                              <p
                                className="h3"
                                style={{ margin: "10px", fontSize: 24 }}
                              >
                                {status}
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
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
              Purchase Order List
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

            <div className="receivemanage-main-container">
              {POarray.map((group) => (
                <div className="receive-supplier-container">
                  <div className="receive-supplier-content">
                    <div className="receivePO-num">
                      <p>{`PO #: ${group.title}`}</p>
                    </div>
                    {group.items.length > 0 && (
                      <div className="mid-receive-contents">
                        <div className="first-div-content">
                          <div className="code-supp-div">{`Supplier Code`}</div>
                          <div className="code-supp-data">
                            {group.items[0].suppliers.supplier_code}
                          </div>
                        </div>

                        <div className="second-div-content">
                          <div className="name-supp-div">{`Supplier Name`}</div>
                          <div className="name-supp-data">
                            {group.items[0].suppliers.supplier_name}
                          </div>
                        </div>

                        <div className="third-div-content">
                          <div className="button-supp-data">
                            <button
                              className="btn btn-warning"
                              onClick={() => handleReceived(group.title)}
                            >
                              Receive
                            </button>
                            <button
                              className="btn btn-success"
                              onClick={() => handleViewTransaction(group.title)}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="no-access">
            <img src={NoAccess} alt="NoAccess" className="no-access-img" />
            <h3>You don't have access to this function.</h3>
          </div>
        )}
      </div>

      <Modal show={show} onHide={handleClose} backdrop="static" size="xl">
        <Form noValidate validated={validated} onSubmit={add}>
          <Modal.Header closeButton style={{ width: "100%", padding: 0 }}>
            <Modal.Title style={{ width: "100%" }}>
              <div className="d-flex w-100">
                <div className="w-50">
                  <span className="h2">{`PO Number: ${po_id}`}</span>
                </div>
                <div className="w-50 d-flex">
                  <span className="h3">Receiving Area: </span>
                  <Form.Control
                    required
                    className="w-50 fs-3"
                    value={suppReceving}
                    readOnly
                  ></Form.Control>
                </div>
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row p-0">
              <div className="col-6 align-items-center">
                <div className="d-flex w-100">
                  <div className="d-flex flex-column w-100">
                    <span className="h2 mb-3">
                      {`Supplier: ${supplier_code} - ${supplier_name}`}
                    </span>
                    <span className="h2">
                      Reference Code:{" "}
                      <span className="text-decoration-underline">
                        {refCodes}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {suppReceving === "Agusan Del Sur" ? (
                <div className="col-6">
                  <div className="d-flex w-100">
                    <div className="w-50" style={{ float: "right" }}>
                      <div className="d-flex align-items-center">
                        <Form.Label className="h4 mb-0">
                          Duties & Custom Fee:
                        </Form.Label>
                        <Form.Check
                          type="switch"
                          className="ml-3"
                          style={{ fontSize: "15px", color: "red" }}
                          checked={isD_C_applicable}
                          onClick={handleDutiesChange}
                        />
                      </div>
                      <Form.Control
                        type="number"
                        className="w-100"
                        readOnly={!isD_C_applicable}
                        value={isD_C_applicable ? customFee : "0"}
                        style={{
                          fontFamily: "Poppins, Source Sans Pro",
                        }}
                        onChange={(e) => setcustomFee(e.target.value)}
                        onKeyDown={(e) => {
                          ["e", "E", "+", "-"].includes(e.key) &&
                            e.preventDefault();
                        }}
                      />
                    </div>
                    <div className="w-50" style={{ float: "right" }}>
                      <div className="d-flex align-items-center">
                        <Form.Label className="h4 mb-0">
                          Shipping Fee:
                        </Form.Label>
                        <Form.Check
                          type="switch"
                          className="ml-3"
                          style={{ fontSize: "15px", color: "red" }}
                          checked={isSF_applicable}
                          onClick={handleShippingChange}
                        />
                      </div>
                      <Form.Control
                        type="number"
                        className="w-100"
                        readOnly={!isSF_applicable}
                        value={isSF_applicable ? shippingFee : "0"}
                        style={{
                          fontFamily: "Poppins, Source Sans Pro",
                        }}
                        onChange={(e) => setShippingFee(e.target.value)}
                        onKeyDown={(e) => {
                          ["e", "E", "+", "-"].includes(e.key) &&
                            e.preventDefault();
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="col-6"></div>
              )}
            </div>

            <div className="row mb-5">
              {productImages.length > 0 && (
                <Carousel
                  data-bs-theme="dark"
                  interval={3000}
                  wrap={true}
                  className="custom-carousel"
                >
                  {productImages.map((image, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className=""
                        style={{
                          width: "auto",
                          height: "auto",
                          margin: "auto",
                          display: "block",
                          maxHeight: "250px",
                          minHeight: "250px",
                        }}
                        src={`data:image/png;base64,${image.image}`}
                        alt={`subpart-img-${image.id}`}
                      />
                      <Carousel.Caption>
                        {/* Caption content */}
                      </Carousel.Caption>
                    </Carousel.Item>
                  ))}
                </Carousel>
              )}
            </div>

            {products_receive.map((parent, parentIndex) =>
              parent.items.map((child, childIndex) => (
                <div
                  className="row"
                  style={{
                    // display: "d-flex flex-direction-row align-items-center",
                    border: "1px solid #DEDEDE",
                  }}
                  key={`${parentIndex}-${childIndex}`}
                >
                  <div className="col-2">
                    <Form.Group controlId="exampleForm.ControlInput2">
                      <Form.Label style={{ fontSize: "15px" }}>
                        {`${child.type} : `}
                      </Form.Label>
                      <p className="h4">
                        {`${child.supp_tag.code} - ${child.supp_tag.name}`}
                      </p>
                    </Form.Group>
                  </div>

                  <div className="col-10">
                    <div className="d-flex w-100">
                      <div className="w-25">
                        <Form.Group className="w-100">
                          <Form.Label className="h4">
                            {`Transitted ${child.supp_tag.UOM}`}
                          </Form.Label>
                          <Form.Control
                            value={child.item.received_quantity}
                            className="w-100"
                            readOnly
                            style={{
                              fontFamily: "Poppins, Source Sans Pro",
                            }}
                          />
                        </Form.Group>
                      </div>
                      <div className="w-25">
                        {/* {checkedRows[parentIndex]?.[childIndex] && ( */}
                        <Form.Group className="w-100">
                          <Form.Label className="h4">/pcs:</Form.Label>
                          <Form.Control
                            type="number"
                            readOnly
                            placeholder="Quantity"
                            required
                            onKeyDown={(e) => {
                              ["e", "E", "+", "-"].includes(e.key) &&
                                e.preventDefault();
                            }}
                            value={
                              inputValues[
                                `${po_id}_${child.type}_${child.supp_tag.code}_${child.supp_tag.name}`
                              ]?.Squantity || child.item.set_quantity
                            }
                            onChange={(e) =>
                              handleInputChange(
                                e.target.value,
                                `${po_id}_${child.type}_${child.supp_tag.code}_${child.supp_tag.name}`,
                                "Squantity",
                                child.item.received_quantity
                              )
                            }
                            className="w-100"
                            style={{
                              // height: "35px",
                              // width: "100px",
                              // fontSize: "14px",
                              fontFamily: "Poppins, Source Sans Pro",
                            }}
                          />
                        </Form.Group>
                        {/* )} */}
                      </div>

                      <div className="w-25">
                        <Form.Group className="w-100">
                          <Form.Label className="h4">
                            {`Received (${child.supp_tag.UOM})`}
                          </Form.Label>
                          <Form.Control
                            type="number"
                            required
                            readOnly={child.item.quantity === 0}
                            value={
                              inputValues[
                                `${po_id}_${child.type}_${child.supp_tag.code}_${child.supp_tag.name}`
                              ]?.Rquantity || ""
                            }
                            onChange={(e) =>
                              handleInputChange(
                                e.target.value,
                                `${po_id}_${child.type}_${child.supp_tag.code}_${child.supp_tag.name}`,
                                "Rquantity",
                                child.item.received_quantity
                              )
                            }
                            className="w-100"
                            style={{
                              // height: "35px",
                              // width: "100px",
                              // fontSize: "14px",
                              fontFamily: "Poppins, Source Sans Pro",
                            }}
                            onKeyDown={(e) => {
                              ["e", "E", "+", "-"].includes(e.key) &&
                                e.preventDefault();
                            }}
                          />
                        </Form.Group>
                      </div>
                      <div className="w-25">
                        <Form.Group className="w-100">
                          <Form.Label className="h4">
                            {`Remaining (${child.supp_tag.UOM})`}
                          </Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Quantity"
                            required
                            readOnly
                            className="w-100"
                            style={{
                              // height: "35px",
                              // width: "100px",
                              // fontSize: "14px",
                              fontFamily: "Poppins, Source Sans Pro",
                              pointerEvents: "none",
                            }}
                            onChange={(e) =>
                              handleInputChange(
                                e.target.value,
                                `${po_id}_${child.type}_${child.supp_tag.code}_${child.supp_tag.name}`,
                                "Tquantity",
                                child.item.received_quantity
                              )
                            }
                            value={
                              child.item.received_quantity -
                              (inputValues[
                                `${po_id}_${child.type}_${child.supp_tag.code}_${child.supp_tag.name}`
                              ]?.Rquantity || "")
                              // inputValues[
                              //   `${po_id}_${child.type}_${child.supp_tag.code}_${child.supp_tag.name}`
                              // ]?.Tquantity || ""
                              // (inputValues[
                              //   `${po_id}_${child.type}_${child.supp_tag.code}_${child.supp_tag.name}`
                              // ]?.Squantity
                              //   ? inputValues[
                              //       `${po_id}_${child.type}_${child.supp_tag.code}_${child.supp_tag.name}`
                              //     ]?.Squantity *
                              //       child.item.quantity -
                              //     inputValues[
                              //       `${po_id}_${child.type}_${child.supp_tag.code}_${child.supp_tag.name}`
                              //     ]?.Rquantity *
                              //       inputValues[
                              //         `${po_id}_${child.type}_${child.supp_tag.code}_${child.supp_tag.name}`
                              //       ]?.Squantity
                              //   : child.item.quantity -
                              //     inputValues[
                              //       `${po_id}_${child.type}_${child.supp_tag.code}_${child.supp_tag.name}`
                              //     ]?.Rquantity) || 0
                            }
                          />
                        </Form.Group>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            <Form.Group controlId="exampleForm.ControlInput1">
              <div
                className="card"
                style={{ border: "none", alignItems: "center" }}
              >
                <div
                  className="drag-area"
                  style={{ width: "70%" }}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={(e) => onDropImages(e)}
                >
                  <p style={{ fontSize: 11 }}>
                    Drag & Drop image here or{" "}
                    <span
                      className="select"
                      role="button"
                      onClick={() => selectFiles()}
                    >
                      <p style={{ fontSize: 11 }}>Browse</p>
                    </span>
                  </p>
                  <input
                    name="file"
                    type="file"
                    className="file"
                    multiple
                    ref={fileInputRef}
                    onChange={(e) => onFileSelect(e)}
                  />
                </div>
                <div
                  className="ccontainerss"
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {productImages.map((image, index) => (
                    <div className="mt-2">
                      <span
                        className="fs-3"
                        style={{ marginLeft: 20 }}
                        onClick={() => deleteImage(index)}
                      >
                        &times;
                      </span>
                      <img
                        style={{
                          width: 60,
                          height: 60,
                          marginLeft: 10,
                        }}
                        src={`data:image/png;base64,${image.image}`}
                        alt={`Sub Part ${image.product_id}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="fs-5 lg"
              variant="secondary"
              onClick={handleClose}
              size="md"
            >
              Close
            </Button>
            <Button
              variant="primary"
              type="submit"
              size="md"
              className="fs-5 lg"
            >
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal
        show={showTransaction}
        onHide={handleClose}
        backdrop="static"
        size="xl"
      >
        <Form noValidate validated={validated} onSubmit={add}>
          <Modal.Header closeButton>
            <Modal.Title>Receiving Transaction</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="table-containss">
              <div className="main-of-all-tables">
                <table className="table-hover" id="order-listing">
                  <thead>
                    <tr>
                      <th className="tableh">Product Code</th>
                      <th className="tableh">Product Name</th>
                      <th className="tableh">Received Quantityyy</th>
                      <th className="tableh">Set</th>
                      <th className="tableh">Freight Cost</th>
                      <th className="tableh">Duties & Custom Cost</th>
                      <th className="tableh">Reference Code</th>
                      <th className="tableh">Receiving Site</th>
                      <th className="tableh">Date Received</th>
                    </tr>
                  </thead>
                  {filteredPRD.length > 0 ||
                  filteredASM.length > 0 ||
                  filteredSPR.length > 0 ||
                  filteredSBP.length > 0 ||
                  Transaction_prd_dv.length > 0 ||
                  Transaction_asm_dv.length > 0 ||
                  Transaction_spr_dv.length > 0 ||
                  Transaction_sbp_dv.length > 0 ? (
                    <tbody>
                      {Transaction_prd.map((data, i) => (
                        <tr key={i}>
                          <td>
                            {
                              data.purchase_req_canvassed_prd
                                .product_tag_supplier.product.product_code
                            }
                          </td>
                          <td>
                            {
                              data.purchase_req_canvassed_prd
                                .product_tag_supplier.product.product_name
                            }
                          </td>
                          <td>{data.received_quantity}</td>
                          <td>{data.set_quantity}</td>
                          <td>{data.receiving_po.freight_cost}</td>
                          <td>
                            {data.receiving_po.customFee === null
                              ? "0"
                              : data.receiving_po.customFee}
                          </td>
                          <td>{data.receiving_po.ref_code}</td>
                          <td>
                            {data.receiving_po.status === "In-transit" ? (
                              "Davao"
                            ) : data.receiving_po.status === "For Approval" ? (
                              "Agusan Del Sur"
                            ) : (
                              <></>
                            )}
                          </td>
                          <td>{formatDatetime(data.createdAt)}</td>
                        </tr>
                      ))}

                      {Transaction_prd_dv.map((data, i) => (
                        <tr key={i}>
                          <td>
                            {
                              data.purchase_req_canvassed_prd
                                .product_tag_supplier.product.product_code
                            }
                          </td>
                          <td>
                            {
                              data.purchase_req_canvassed_prd
                                .product_tag_supplier.product.product_name
                            }
                          </td>
                          <td>{data.received_quantity}</td>
                          <td>{data.set_quantity}</td>
                          <td>{data.receiving_po.freight_cost}</td>
                          <td>
                            {data.receiving_po.customFee === null
                              ? "0"
                              : data.receiving_po.customFee}
                          </td>
                          <td>{data.receiving_po.ref_code}</td>
                          <td>
                            {data.receiving_po.status === "In-transit" ? (
                              "Davao"
                            ) : data.receiving_po.status === "For Approval" ? (
                              "Agusan Del Sur"
                            ) : (
                              <></>
                            )}
                          </td>
                          <td>{formatDatetime(data.createdAt)}</td>
                        </tr>
                      ))}

                      {Transaction_asm.map((data, i) => (
                        <tr key={i}>
                          <td>
                            {
                              data.purchase_req_canvassed_asmbly
                                .assembly_supplier.assembly.product_code
                            }
                          </td>
                          <td>
                            {
                              data.purchase_req_canvassed_asmbly
                                .assembly_supplier.assembly.product_name
                            }
                          </td>
                          <td>{data.received_quantity}</td>
                          <td>{data.set_quantity}</td>
                          <td>{data.receiving_po.freight_cost}</td>
                          <td>
                            {data.receiving_po.customFee === null
                              ? "0"
                              : data.receiving_po.customFee}
                          </td>
                          <td>{data.receiving_po.ref_code}</td>
                          <td>
                            {data.receiving_po.status === "In-transit" ? (
                              "Davao"
                            ) : data.receiving_po.status === "For Approval" ? (
                              "Agusan Del Sur"
                            ) : (
                              <></>
                            )}
                          </td>
                          <td>{formatDatetime(data.createdAt)}</td>
                        </tr>
                      ))}

                      {Transaction_asm_dv.map((data, i) => (
                        <tr key={i}>
                          <td>
                            {
                              data.purchase_req_canvassed_asmbly
                                .assembly_supplier.assembly.product_code
                            }
                          </td>
                          <td>
                            {
                              data.purchase_req_canvassed_asmbly
                                .assembly_supplier.assembly.product_name
                            }
                          </td>
                          <td>{data.received_quantity}</td>
                          <td>{data.set_quantity}</td>
                          <td>{data.receiving_po.freight_cost}</td>
                          <td>
                            {data.receiving_po.customFee === null
                              ? "0"
                              : data.receiving_po.customFee}
                          </td>
                          <td>{data.receiving_po.ref_code}</td>
                          <td>
                            {data.receiving_po.status === "In-transit" ? (
                              "Davao"
                            ) : data.receiving_po.status === "For Approval" ? (
                              "Agusan Del Sur"
                            ) : (
                              <></>
                            )}
                          </td>
                          <td>{formatDatetime(data.createdAt)}</td>
                        </tr>
                      ))}

                      {Transaction_spr.map((data, i) => (
                        <tr key={i}>
                          <td>
                            {
                              data.purchase_req_canvassed_spare
                                .sparepart_supplier.sparePart.product_code
                            }
                          </td>
                          <td>
                            {
                              data.purchase_req_canvassed_spare
                                .sparepart_supplier.sparePart.product_name
                            }
                          </td>
                          <td>{data.received_quantity}</td>
                          <td>{data.set_quantity}</td>
                          <td>{data.receiving_po.freight_cost}</td>
                          <td>
                            {data.receiving_po.customFee === null
                              ? "0"
                              : data.receiving_po.customFee}
                          </td>
                          <td>{data.receiving_po.ref_code}</td>
                          <td>
                            {data.receiving_po.status === "In-transit" ? (
                              "Davao"
                            ) : data.receiving_po.status === "For Approval" ? (
                              "Agusan Del Sur"
                            ) : (
                              <></>
                            )}
                          </td>
                          <td>{formatDatetime(data.createdAt)}</td>
                        </tr>
                      ))}

                      {Transaction_spr_dv.map((data, i) => (
                        <tr key={i}>
                          <td>
                            {
                              data.purchase_req_canvassed_spare
                                .sparepart_supplier.sparePart.product_code
                            }
                          </td>
                          <td>
                            {
                              data.purchase_req_canvassed_spare
                                .sparepart_supplier.sparePart.product_name
                            }
                          </td>
                          <td>{data.received_quantity}</td>
                          <td>{data.set_quantity}</td>
                          <td>{data.receiving_po.freight_cost}</td>
                          <td>
                            {data.receiving_po.customFee === null
                              ? "0"
                              : data.receiving_po.customFee}
                          </td>
                          <td>{data.receiving_po.ref_code}</td>
                          <td>
                            {data.receiving_po.status === "In-transit" ? (
                              "Davao"
                            ) : data.receiving_po.status === "For Approval" ? (
                              "Agusan Del Sur"
                            ) : (
                              <></>
                            )}
                          </td>
                          <td>{formatDatetime(data.createdAt)}</td>
                        </tr>
                      ))}

                      {Transaction_sbp.map((data, i) => (
                        <tr key={i}>
                          <td>
                            {
                              data.purchase_req_canvassed_subpart
                                .subpart_supplier.subPart.product_code
                            }
                          </td>
                          <td>
                            {
                              data.purchase_req_canvassed_subpart
                                .subpart_supplier.subPart.product_name
                            }
                          </td>
                          <td>{data.received_quantity}</td>
                          <td>{data.set_quantity}</td>
                          <td>{data.receiving_po.freight_cost}</td>
                          <td>
                            {data.receiving_po.customFee === null
                              ? "0"
                              : data.receiving_po.customFee}
                          </td>
                          <td>{data.receiving_po.ref_code}</td>
                          <td>
                            {data.receiving_po.status === "In-transit" ? (
                              "Davao"
                            ) : data.receiving_po.status === "For Approval" ? (
                              "Agusan Del Sur"
                            ) : (
                              <></>
                            )}
                          </td>
                          <td>{formatDatetime(data.createdAt)}</td>
                        </tr>
                      ))}

                      {Transaction_sbp_dv.map((data, i) => (
                        <tr key={i}>
                          <td>
                            {
                              data.purchase_req_canvassed_subpart
                                .subpart_supplier.subPart.product_code
                            }
                          </td>
                          <td>
                            {
                              data.purchase_req_canvassed_subpart
                                .subpart_supplier.subPart.product_name
                            }
                          </td>
                          <td>{data.received_quantity}</td>
                          <td>{data.set_quantity}</td>
                          <td>{data.receiving_po.freight_cost}</td>
                          <td>
                            {data.receiving_po.customFee === null
                              ? "0"
                              : data.receiving_po.customFee}
                          </td>
                          <td>{data.receiving_po.ref_code}</td>
                          <td>
                            {data.receiving_po.status === "In-transit" ? (
                              "Davao"
                            ) : data.receiving_po.status === "For Approval" ? (
                              "Agusan Del Sur"
                            ) : (
                              <></>
                            )}
                          </td>
                          <td>{formatDatetime(data.createdAt)}</td>
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
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="fs-5 lg"
              variant="secondary"
              onClick={handleClose}
              size="md"
            >
              Close
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default ReceivingIntransit;
