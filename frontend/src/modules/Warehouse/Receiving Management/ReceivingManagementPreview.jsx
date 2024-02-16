import React, { useEffect, useState } from "react";
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
import FloatingLabel from "react-bootstrap/FloatingLabel";
import {
  ArrowCircleLeft,
  Plus,
  Paperclip,
  DotsThreeCircle,
  CalendarBlank,
  PlusCircle,
  Circle,
  ArrowUUpLeft,
} from "@phosphor-icons/react";
import axios from "axios";
import BASE_URL from "../../../assets/global/url";
import swal from "sweetalert";
import { pink } from "@mui/material/colors";
import Checkbox from "@mui/material/Checkbox";

function ReceivingManagementPreview({ authrztn }) {
  const label_qa = { inputProps: { "aria-label": "Checkbox demo" } };
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();
  const [prNumber, setPrNumber] = useState();
  const [dateNeeded, setDateNeeded] = useState();
  const [usedFor, setUsedFor] = useState();
  const [remarks, setRemarks] = useState();
  const [status, setStatus] = useState();
  const [dateCreated, setDateCreated] = useState();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  // -------------------- fetch data value --------------------- //
  useEffect(() => {
    const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/PR/viewToReceive", {
          params: {
            id: id,
          },
        })
        .then((res) => {
          setPrNumber(res.data[0].pr_num);
          setDateNeeded(res.data[0].date_needed);
          setUsedFor(res.data[0].used_for);
          setRemarks(res.data[0].remarks);
          setStatus(res.data[0].status);
          setDateCreated(res.data[0].createdAt);
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
      .get(BASE_URL + "/invoice/fetchPOarray", {
        params: {
          id: id,
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

  const handleReceived = (po_number) => {
    setIsLoading(true);
    setShow(true);
    axios
      .get(BASE_URL + "/PO_Received/PO_products", {
        params: {
          pr_id: id,
          po_number,
        },
      })
      .then((res) => {
        const firstItem = res.data[0].items[0];
        //  const prodNames = res.data.map(item => item.supp_tag.name);

        setProducts_receive(res.data);
        setPo_id(res.data[0].title);
        setSupplier_code(firstItem.suppliers.supplier_code);
        setSupplier_name(firstItem.suppliers.supplier_name);
        setProd_name(res.data.items.supp_tag.name);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };
  const [checkedRows, setCheckedRows] = useState({});

  const handleCheckbox = (event, parentIndex, childIndex) => {
    const newCheckedRows = { ...checkedRows };
    newCheckedRows[parentIndex] = { ...newCheckedRows[parentIndex] };
    newCheckedRows[parentIndex][childIndex] =
      !newCheckedRows[parentIndex][childIndex];
    setCheckedRows(newCheckedRows);
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
  const handleInputChangeShipping = (value) => {
    setShippingFee(value)
  }

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

      let Received_quantity, Checked_quantity, maxReceivedQuantity;
      if (inputType === "Rquantity") {
        // item.Received_quantity = value;
        Received_quantity = value;
      } else if (inputType === "Cquantity") {
        // item.Checked_quantity = value;
        Checked_quantity = value;
      }

      if (prevInputs[productValue]?.Squantity === undefined) {
        // console.log(`Undefined Set: ${Received_quantity} * ${po_quantity}`);
        maxReceivedQuantity = po_quantity;
      } else {
        // console.log(
        //   `Defined Set: ${
        //     prevInputs[productValue]?.Squantity || 0
        //   } * ${po_quantity}`
        // );
        maxReceivedQuantity =
          (prevInputs[productValue]?.Squantity || 0) * po_quantity;
      }
      // console.log(`inputed value ${value}`);
      // console.log(`mXX_quantity ${maxReceivedQuantity}`);
      // console.log(`Checked_quantity ${Checked_quantity}`)

      if (Received_quantity > maxReceivedQuantity) {
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
              [inputType]: maxReceivedQuantity,
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

  // const handleInputChange = (value, productValue, inputType, po_quantity) => {
  //   setInputValues((prevInputs) => {
  //     const [po_id, type, code, name] = productValue.split('_');

  //     // Finding the corresponding parent object in products_receive based on the po_id
  //     const parent = products_receive.find(parent => parent.title === po_id);

  //     // Check if the parent object is defined
  //     if (!parent) {
  //       console.error(`Parent object with title ${po_id} not found.`);
  //       return prevInputs;
  //     }

  //     // Finding the corresponding item object within the parent's items array based on code and name
  //     const item = parent.items.find(item => item.supp_tag.code === code && item.supp_tag.name === name);

  //     const maxReceivedQuantity = po_quantity * (prevInputs[productValue]?.Squantity || 0);

  //     if (value > maxReceivedQuantity) {
  //       // Show SweetAlert popup message
  //       swal({
  //         title: "Error",
  //         text: "Received Quantity cannot exceed the calculated maximum.",
  //         icon: "error",
  //       }).then(() => {
  //         // Set the input value to the maximum allowed quantity
  //         setInputValues((prevInputs) => ({
  //           ...prevInputs,
  //           [productValue]: {
  //             ...prevInputs[productValue],
  //             [inputType]: maxReceivedQuantity,
  //           },
  //         }));
  //       });
  //     } else {
  //       return {
  //         ...prevInputs,
  //         [productValue]: {
  //           ...prevInputs[productValue],
  //           [inputType]: value,
  //         },
  //       };
  //     }
  //   });
  // };

  const [addReceivebackend, setReceivebackend] = useState([]);

  useEffect(() => {
    const serializedParent = products_receive.map(({ title, items }) => {
      return {
        title,
        serializedArray: items.map((child) => ({
          canvassed_ID: child.item.id,
          set_quantity:
            inputValues[
              `${po_id}_${child.type}_${child.supp_tag.code}_${child.supp_tag.name}`
            ]?.Squantity || "",
          Received_quantity:
            inputValues[
              `${po_id}_${child.type}_${child.supp_tag.code}_${child.supp_tag.name}`
            ]?.Rquantity || "",
          Checked_quantity:
            inputValues[
              `${po_id}_${child.type}_${child.supp_tag.code}_${child.supp_tag.name}`
            ]?.Cquantity || "",
          type: child.type,
          // prod_supplier: item.product.id,
        })),
      };
    });

    setReceivebackend(serializedParent);

    console.log("Selected Products:", serializedParent);
  }, [inputValues]);

  const handleSave = () => {
    // setIsLoading(true);
    const delay = setTimeout(() => {
      axios
        .post(BASE_URL + "/receiving/insertReceived", {
          addReceivebackend, shippingFee
        })
        .then((res) => {
          // setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }, 1000);

    return () => clearTimeout(delay);
  };

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
                  <h1>Receiving Management Preview</h1>
                </div>
              </Col>
            </Row>

            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "20px",
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
                  left: "22.3rem",
                  transform: "translateY(-50%)",
                }}
              ></span>
            </div>
            <div className="receivingbox mt-3">
              <div className="row" style={{ padding: "20px" }}>
                <div className="col-6">
                  <div className="ware">Destination Warehouse</div>
                  <div className="pr-no">
                    PR #: <p1>{prNumber}</p1>
                  </div>
                  <div className="res-warehouse">Agusan Del Sur</div>
                </div>
                <div className="col-4">
                  <div className="created">
                    Created date: <p1>{formatDatetime(dateCreated)}</p1>
                  </div>
                  <div className="created mt-3">
                    Created By: <p1>Jerome De Guzman</p1>
                  </div>
                </div>
                <div className="col-2">
                  <div className="status">
                    <Circle
                      weight="fill"
                      size={17}
                      color="green"
                      style={{ margin: "10px" }}
                    />{" "}
                    {status}
                  </div>
                </div>
              </div>
            </div>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontSize: "20px" }}>Remarks: </Form.Label>
              <Form.Control
                onChange={(e) => setRemarks(e.target.value)}
                as="textarea"
                placeholder="Enter details name"
                value={remarks}
                style={{ height: "100px", fontSize: "15px" }}
              />
            </Form.Group>

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
            <div className="table-containss">
              <div className="main-of-all-tables">
                {POarray.map((group) => (
                  <div
                    key={group.title}
                    className="border border-warning m-3 mb-4 p-3"
                  >
                    <h3>{`PO Number: ${group.title}`}</h3>
                    {group.items.length > 0 && (
                      <>
                        <h3>{`Supplier: ${group.items[0].suppliers.supplier_code} => ${group.items[0].suppliers.supplier_name}`}</h3>
                      </>
                    )}
                    <button
                      className="btn btn-success fs-4"
                      onClick={() => handleReceived(group.title)}
                    >
                      Receive
                    </button>
                  </div>
                ))}

                <Modal
                  show={show}
                  onHide={handleClose}
                  backdrop="static"
                  size="lg"
                >
                  <Modal.Header closeButton>
                    <Modal.Title> {`PO Number: ${po_id}`}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="row">
                      <div className="col-6">
                        <h2 className="mb-5">
                          {`Supplier: ${supplier_code} - ${supplier_name}`}
                        </h2>
                      </div>
                      <div className="col-6 ">
                        <div className="d-flex flex-direction-row justify-content-center align-items-center">
                          <Form.Label style={{ fontSize: "15px" }}>
                            Shipping Fee{" "}
                          </Form.Label>
                          <Form.Control
                            type="number"
                            style={{
                              height: "35px",
                              width: "100px",
                              fontSize: "14px",
                              fontFamily: "Poppins, Source Sans Pro",
                            }}    
                            onChange={(e) =>
                              handleInputChangeShipping(
                                e.target.value,                               
                              )
                            }               
                            onKeyDown={(e) => {
                              ["e", "E", "+", "-"].includes(e.key) &&
                                e.preventDefault();
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {products_receive.map((parent, parentIndex) =>
                      parent.items.map((child, childIndex) => (
                        <div
                          className="row"
                          style={{
                            display:
                              "d-flex flex-direction-row align-items-center",
                          }}
                          key={`${parentIndex}-${childIndex}`}
                        >
                          <div className="col-3">
                            <Form.Group controlId="exampleForm.ControlInput2">
                              <Form.Label style={{ fontSize: "15px" }}>
                                {`${child.type} : `}
                              </Form.Label>
                              <label className="fs-4">
                                {`${child.supp_tag.code} - ${child.supp_tag.name}`}
                              </label>
                            </Form.Group>
                          </div>

                          <div className="col-3 d-flex flex-direction-row">
                            <div className="row" style={{ marginTop: "-40px" }}>
                              <div className="col-4">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: "15px" }}>
                                    PR :{" "}
                                  </Form.Label>
                                  <Form.Control
                                    value={child.item.quantity}
                                    readOnly={
                                      checkedRows[parentIndex]?.[childIndex]
                                    }
                                    style={{
                                      height: "35px",
                                      width: "50px",
                                      fontSize: "14px",
                                      fontFamily: "Poppins, Source Sans Pro",
                                    }}
                                  />
                                </Form.Group>
                              </div>
                              <div className="col-4">
                                {checkedRows[parentIndex]?.[childIndex] && (
                                  <Form.Group controlId="exampleForm.ControlInput2">
                                    <Form.Label style={{ fontSize: "15px" }}>
                                      /pcs:{" "}
                                    </Form.Label>
                                    <Form.Control
                                      type="number"
                                      placeholder="Quantity"
                                      required
                                      onKeyDown={(e) => {
                                        ["e", "E", "+", "-"].includes(
                                          e.key
                                        ) && e.preventDefault();
                                      }}
                                      value={
                                        inputValues[
                                          `${po_id}_${child.type}_${child.supp_tag.code}_${child.supp_tag.name}`
                                        ]?.Squantity || ""
                                      }
                                      onChange={(e) =>
                                        handleInputChange(
                                          e.target.value,
                                          `${po_id}_${child.type}_${child.supp_tag.code}_${child.supp_tag.name}`,
                                          "Squantity",
                                          child.item.quantity
                                        )
                                      }
                                      style={{
                                        height: "35px",
                                        width: "50px",
                                        fontSize: "14px",
                                        fontFamily: "Poppins, Source Sans Pro",
                                      }}
                                    />
                                  </Form.Group>
                                )}
                              </div>
                              <div className="col-4">
                                <label
                                  className="userstatus"
                                  style={{
                                    fontSize: 15,
                                    marginRight: 10,
                                    marginTop: "10px",
                                  }}
                                >
                                  Set
                                </label>
                                <input
                                  type="checkbox"
                                  className="toggle-switch"
                                  checked={
                                    checkedRows[parentIndex]?.[childIndex]
                                  }
                                  onClick={(e) =>
                                    handleCheckbox(e, parentIndex, childIndex)
                                  }
                                  // style={{ marginTop: "25px" }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-3">
                              <Form.Group
                                // style={{ marginTop: "20px" }}
                                controlId="exampleForm.ControlInput2"
                              >
                              <Form.Label style={{ fontSize: "15px" }}>
                                Received Quantity:{" "}
                              </Form.Label>
                              <Form.Control
                                type="number"
                                placeholder="Quantity"
                                required
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
                                    child.item.quantity
                                  )
                                }
                                style={{
                                  height: "35px",
                                  width: "100px",
                                  fontSize: "14px",
                                  fontFamily: "Poppins, Source Sans Pro",
                                }}
                              />
                            </Form.Group>
                          </div>

                          <div className="col-3">
                            {/* 
                          <Form.Group
                              // style={{ marginTop: "20px" }}
                              controlId="exampleForm.ControlInput2"
                            >
                              <Form.Label style={{ fontSize: "15px" }}>
                                Price{" "}
                              </Form.Label>
                              <Form.Control
                                type="number"
                                placeholder="Quantity"
                                readOnly
                                value={
                                  shippingFee
                                }
                                // onChange={(e) =>
                                //   handleInputChange(
                                //     e.target.value,
                                //     `${po_id}_${child.type}_${child.supp_tag.code}_${child.supp_tag.name}`,
                                //     "Cquantity",
                                //     child.item.quantity
                                //   )
                                // }
                                style={{
                                  height: "35px",
                                  width: "100px",
                                  fontSize: "14px",
                                  fontFamily: "Poppins, Source Sans Pro",
                                }}
                              />
                            </Form.Group> */}
                            {/* <Form.Group
                              // style={{ marginTop: "20px" }}
                              controlId="exampleForm.ControlInput2"
                            >
                              <Form.Label style={{ fontSize: "15px" }}>
                                Checked Quantity:{" "}
                              </Form.Label>
                              <Form.Control
                                type="number"
                                placeholder="Quantity"
                                required
                                value={
                                  inputValues[
                                    `${po_id}_${child.type}_${child.supp_tag.code}_${child.supp_tag.name}`
                                  ]?.Cquantity || ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    e.target.value,
                                    `${po_id}_${child.type}_${child.supp_tag.code}_${child.supp_tag.name}`,
                                    "Cquantity",
                                    child.item.quantity
                                  )
                                }
                                style={{
                                  height: "35px",
                                  width: "100px",
                                  fontSize: "14px",
                                  fontFamily: "Poppins, Source Sans Pro",
                                }}
                              />
                            </Form.Group> */}
                          </div>
                        </div>
                      ))
                    )}
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
                    <Button variant="primary" onClick={handleSave} size="md">
                      Save
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
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

export default ReceivingManagementPreview;
