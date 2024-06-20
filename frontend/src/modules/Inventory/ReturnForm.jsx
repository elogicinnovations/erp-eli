import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar/sidebar";
import "../../assets/global/style.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/react-style.css";
import Form from "react-bootstrap/Form";
import ReactLoading from "react-loading";
import NoData from "../../assets/image/NoData.png";
import NoAccess from "../../assets/image/NoAccess.png";
import Select from "react-select";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import BASE_URL from "../../assets/global/url";
import swal from "sweetalert";
import { jwtDecode } from "jwt-decode";
import * as $ from "jquery";

const ReturnForm = ({ setActiveTab, authrztn }) => {
  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
  };
  const navigate = useNavigate();
  const { id } = useParams();
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [issuanceCode, setIssuanceCode] = useState("");
  const [remarks, setRemarks] = useState("");
  const [status, setStatus] = useState("To be Return");
  const [quantity, setQuantity] = useState([]);
  const [site, setSite] = useState([]);
  const [costCenter, setCostCenter] = useState("");
  const [dateReceived, setDateReceived] = useState(null);
  const [dateCreated, setDateCreated] = useState(null);

  const [issuedProduct, setIssuedProduct] = useState([]);
  const [quantityInputs, setQuantityInputs] = useState({});
  const [arrayDataProdBackend, setarrayDataProdBackend] = useState([]);

  const [issuedAssembly, setIssuedAssembly] = useState([]);
  const [quantityInputs_asm, setQuantityInputs_asm] = useState({});
  const [arrayDataAsmBackend, setarrayDataAsmBackend] = useState([]);

  const [issuedSpare, setIssuedSpare] = useState([]);
  const [quantityInputs_spare, setQuantityInputs_spare] = useState({});
  const [arrayDataSpareBackend, setarrayDataSpareBackend] = useState([]);

  const [issuedSubpart, setIssuedSubpart] = useState([]);
  const [quantityInputs_subpart, setQuantityInputs_subpart] = useState({});
  const [arrayDataSubpartBackend, setarrayDataSubpartBackend] = useState([]);
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

  // const [issuedConsolidatedData, setIssuedConsolidatedData] = useState([]);
  // const [quantityInputs, setQuantityInputs] = useState({});

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
    const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/issued_product/getProducts", {
          params: {
            id: id,
          },
        })
        .then((res) => {
          const data = res.data;
          const selectedSupplierOptions = data.map((row) => ({
            value: row.inventory_id,
            quantity: row.quantity,
            landePrice:
              row.inventory_prd.price +
              row.inventory_prd.freight_cost +
              row.inventory_prd.custom_cost,
            code: row.inventory_prd.product_tag_supplier.product.product_code,
            name: row.inventory_prd.product_tag_supplier.product.product_name,
          }));
          setIssuedProduct(selectedSupplierOptions);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }, 1000);

    return () => clearTimeout(delay);
  }, [id]);

  const handleQuantityChange = (inputValue, productValue, issued_quantity) => {
    // Remove non-numeric characters and limit length to 10
    const cleanedValue = inputValue.replace(/\D/g, "").substring(0, 10);

    // Convert cleanedValue to a number
    const numericValue = parseInt(cleanedValue, 10);

    // Create a variable to store the corrected value
    let correctedValue = cleanedValue;

    // Check if the numericValue is greater than the available quantity
    if (numericValue > issued_quantity) {
      // If greater, set the correctedValue to the maximum available quantity
      correctedValue = issued_quantity.toString();

      swal({
        icon: "error",
        title: "Input value exceed",
        text: "Please enter a quantity within the available limit.",
      });
    }

    setQuantityInputs((prevInputs) => {
      const updatedInputs = {
        ...prevInputs,
        [productValue]: correctedValue,
      };

      // Use the updatedInputs directly to create the serializedProducts array
      const serializedProducts = issuedProduct.map((product) => ({
        quantity: updatedInputs[product.value] || "",
        inventory_id: product.value,
        code: product.code,
        name: product.name,
      }));

      setarrayDataProdBackend(serializedProducts);

      console.log("Selected Products:", serializedProducts);

      // Return the updatedInputs to be used as the new state
      return updatedInputs;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      // e.stopPropagation();
      swal({
        icon: "error",
        title: "Fields are required",
        text: "Please fill the red text fields (enter 0 if not applicable)",
      });
    } else {
      axios
        .post(`${BASE_URL}/issuedReturn/issueReturn`, {
          issuance_id: id,
          return_remarks: remarks,
          arrayDataProdBackend,
          arrayDataAsmBackend,
          arrayDataSpareBackend,
          arrayDataSubpartBackend,
          status: "To be Return",
          userId,
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            swal({
              title: "The Return successfully Done!",
              text: "The Quantity has returned successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate("/inventory");
            });
          } else if (res.status === 201) {
            swal({
              icon: "error",
              title: "Code Already Exists",
              text: "Please input another code",
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

    setValidated(true); // for validations
  };

  useEffect(() => {
    axios
      .get(BASE_URL + "/issuance/returnForm", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setIssuanceCode(res.data[0].issuance_id);
        setSite(res.data[0].warehouse.warehouse_name);
        setCostCenter(res.data[0].cost_center.name);
        // setDateReceived(res.data[0].updateAt);
        const createDate = new Date(res.data[0].createdAt);
        setDateCreated(createDate);
        const receiveDate = new Date(res.data[0].updatedAt);
        setDateReceived(receiveDate);
      })
      .catch((err) => {
        console.error(err);
        // Handle error state or show an error message to the user
      });
  }, [id]);

  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($("#order-listing").length > 0 && issuedProduct.length > 0) {
      $("#order-listing").DataTable();
    }
  }, [issuedProduct]);

  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
        {isLoading ? (
          <div className="loading-container">
            <ReactLoading className="react-loading" type={"bubbles"} />
            Loading Data...
          </div>
        ) : authrztn.includes("Inventory - View") ? (
          <div className="right-body-contents-a">
            <Row>
              <Col>
                <div
                  className="create-head-back"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Link
                    style={{ fontSize: "1.5rem" }}
                    to="/inventory"
                    onClick={() => handleTabClick("issuance")}
                  >
                    <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                  </Link>
                  <h1>Return Form</h1>
                </div>
              </Col>
            </Row>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <div
                className="gen-info"
                style={{
                  fontSize: "20px",
                  position: "relative",
                  paddingTop: "20px",
                }}
              >
                Issuance Info
                <span
                  style={{
                    position: "absolute",
                    height: "0.5px",
                    width: "-webkit-fill-available",
                    background: "#FFA500",
                    top: "81%",
                    left: "11.6rem",
                    transform: "translateY(-50%)",
                  }}
                ></span>
              </div>
              <div className="receivingbox mt-3">
                <div className="row" style={{ padding: "20px" }}>
                  <div className="col-6">
                    <div className="ware">Cost Center Warehouse</div>
                    <div className="cost-c">
                      {site} - {costCenter}
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="created">
                      Issued Date: <p1>{formatDatetime(dateCreated)}</p1>
                    </div>
                  </div>
                  <div className="col-2"></div>
                </div>
              </div>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label style={{ fontSize: "20px" }}>Remarks: </Form.Label>
                <Form.Control
                  onChange={(e) => setRemarks(e.target.value)}
                  required
                  as="textarea"
                  placeholder="Why are you returning these items?"
                  style={{ height: "100px", fontSize: "15px" }}
                />
              </Form.Group>
              <div
                className="gen-info"
                style={{
                  fontSize: "20px",
                  position: "relative",
                  paddingTop: "20px",
                }}
              >
                Item List
                <span
                  style={{
                    position: "absolute",
                    height: "0.5px",
                    width: "-webkit-fill-available",
                    background: "#FFA500",
                    top: "81%",
                    left: "8rem",
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
                        <th className="tableh">Landed Cost</th>
                        <th className="tableh">Quantity</th>
                        <th className="tableh">Quantity to Return</th>
                      </tr>
                    </thead>
                    <tbody>
                      {issuedProduct.map((data) => (
                        <tr key={data.value}>
                          <td>{data.code}</td>
                          <td>{data.name}</td>
                          <td>{data.landePrice}</td>
                          <td>{data.quantity}</td>
                          <td>
                            <Form.Control
                              type="number"
                              value={quantityInputs[data.value]}
                              onChange={(e) =>
                                handleQuantityChange(
                                  e.target.value,
                                  data.value,
                                  data.quantity
                                )
                              }
                              // onChange={(e) => handleQuantityChange(e.target.value, 'asm', i)}
                              required
                              placeholder="Input quantity"
                              style={{
                                height: "40px",
                                width: "130px",
                                fontSize: "15px",
                              }}
                              onKeyDown={(e) =>
                                ["e", "E", "+", "-"].includes(e.key) &&
                                e.preventDefault()
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="save-cancel">
                <Button
                  type="submit"
                  className="btn btn-warning"
                  size="md"
                  style={{ fontSize: "20px", margin: "0px 5px" }}
                >
                  Save
                </Button>
                <Link
                  to="/inventory"
                  onClick={() => handleTabClick("issuance")}
                  className="btn btn-secondary btn-md"
                  size="md"
                  style={{ fontSize: "20px", margin: "0px 5px" }}
                >
                  Cancel
                </Link>
              </div>
            </Form>
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
};

export default ReturnForm;
