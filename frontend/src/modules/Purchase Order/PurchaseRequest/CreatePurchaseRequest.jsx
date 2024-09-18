import React, { useEffect, useState } from "react";
// import Sidebar from "../../Sidebar/sidebar";
// import Row from "react-bootstrap/Row";
// import Col from "react-bootstrap/Col";
// import * as $ from "jquery";
import "../../../assets/global/style.css";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/react-style.css";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowCircleLeft, Plus, CalendarBlank } from "@phosphor-icons/react";
import axios from "axios";
import BASE_URL from "../../../assets/global/url";
import swal from "sweetalert";
import { jwtDecode } from "jwt-decode";

function CreatePurchaseRequest() {
  const navigate = useNavigate();

  const [prNum, setPrNum] = useState("");
  const [dateNeed, setDateNeed] = useState("");
  const [useFor, setUseFor] = useState("");
  const [remarks, setRemarks] = useState("");
  const [product, setProduct] = useState([]);
  const [addProductbackend, setAddProductbackend] = useState([]);
  // const [quantityInputs, setQuantityInputs] = useState({}); // to add the quantity to array
  // const [descInputs, setDescInputs] = useState({}); // to add the description to array
  const [inputValues, setInputValues] = useState({});

  const [validated, setValidated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [fetchProduct, setFetchProduct] = useState([]);
  const [fetchAssembly, setFetchAssembly] = useState([]);
  const [fetchSpare, setFetchSpare] = useState([]);
  const [fetchSubPart, setFetchSubPart] = useState([]);
  // const [Fname, setFname] = useState('');
  // const [username, setUsername] = useState('');
  // const [userRole, setUserRole] = useState('');
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
  // para sa pag fetch ng last pr number
  useEffect(() => {
    axios
      .get(BASE_URL + "/PR/lastPRNumber")
      .then((res) => {
        const code =
          res.data !== null ? res.data.toString().padStart(8, "0") : "00000001";

        // Increment the value by 1
        setPrNum(code);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/product/fetchTable")
      .then((res) => setFetchProduct(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/assembly/fetchTable")
      .then((res) => setFetchAssembly(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/sparePart/fetchTable")
      .then((res) => setFetchSpare(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/subpart/fetchTable")
      .then((res) => setFetchSubPart(res.data))
      .catch((err) => console.log(err));
  }, []);

  const [searchInput, setSearchInput] = useState("");
  const handleInputChangeSearch = (inputValue) => {
    setSearchInput(inputValue);
  };
  const filteredOptions = fetchProduct
    .map((prod) => ({
      value: `${prod.product_id}_${prod.product_code}_Product`, // Indicate that it's a product
      // label: (
      //   <div>
      //     Product Code: <strong>{prod.product_code}</strong> / Product Name:{" "}
      //     <strong>{prod.product_name}</strong> /
      //   </div>
      // ),
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
      try {
        const response = await axios.post(`${BASE_URL}/PR/create`, {
          pr_num: prNum,
          dateNeed,
          useFor,
          remarks,
          addProductbackend,
          userId,
        });

        console.log(response);

        if (response.status === 200) {
          swal({
            title: "Purchase Request Successfully Added!",
            text: "Your request for purchase has been successfully processed.",
            icon: "success",
            button: "OK",
          }).then(() => {
            navigate("/purchaseRequest");
          });
        } else if (response.status === 201) {
          swal({
            title: "Oopps!",
            text: "PR number already exist. Please input another number or Reload the browser to get the latest available number",
            icon: "error",
            button: "OK",
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
          title: "Something went wrong",
          text: "Please contact your support immediately",
        });
      }
    }

    setValidated(true); // for validations
  };

  const displayDropdown = () => {
    setShowDropdown(true);
  };

  //for supplier selection values
  const selectProduct = (selectedOptions) => {
    setProduct(selectedOptions);
    // Update input values based on selected options
    const newInputValues = {};

    selectedOptions.forEach((selectedOption) => {
      const { value } = selectedOption;
      newInputValues[value] = {
        quantity: "", // Clear quantity input
        desc: "", // Clear description input
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
    const serializedProducts = product.map((product) => ({
      type: product.type,
      value: product.values,
      quantity: inputValues[product.value]?.quantity || "",
      desc: inputValues[product.value]?.desc || "",
    }));

    setAddProductbackend(serializedProducts);

    console.log("Selected Products:", serializedProducts);
  }, [inputValues, product]);

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

  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
        <div className="right-body-contentss">
          <div className="arrowandtitle">
            <Link to="/purchaseRequest">
              <ArrowCircleLeft size={45} color="#60646c" weight="fill" />
            </Link>
            <div className="titletext">
              <h1>Create Purchase Request</h1>
            </div>
          </div>
          <Form noValidate validated={validated} onSubmit={add}>
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
                  left: "22rem",
                  transform: "translateY(-50%)",
                }}
              ></span>
            </div>
            <div className="row mt-3" style={{ position: "relative" }}>
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>PR #: </Form.Label>
                  <Form.Control
                    type="text"
                    value={prNum}
                    onChange={(e) => setPrNum(e.target.value)}
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-4">
                <div
                  className="date-beg"
                  style={{ position: "relative", marginBottom: "15px" }}
                >
                  <Form.Group
                    controlId="exampleForm.ControlInput2"
                    className="datepick"
                  >
                    <Form.Label style={{ fontSize: "20px" }}>
                      Date Needed:{" "}
                    </Form.Label>

                    <DatePicker
                      required
                      selected={dateNeed}
                      onChange={(date) => setDateNeed(date)}
                      minDate={new Date()}
                      dateFormat="yyyy-MM-dd"
                      placeholderText="Start Date"
                      className="form-control"
                    />

                    {/* <CalendarBlank
                    size={20}
                    style={{
                      position: "absolute",
                      left: "440px",
                      top: "73%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  /> */}
                  </Form.Group>
                </div>
              </div>
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    To be used for:{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    onChange={(e) => setUseFor(e.target.value)}
                    placeholder="Enter where/whom will use"
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
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter details"
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
                position: "sticky",
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
                      <th className="tableh">Date Created</th>
                      <th className="tableh">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.length > 0 ? (
                      product.map((product) => (
                        <tr key={product.value}>
                          <td>{product.code}</td>
                          <td>{product.name}</td>
                          <td>
                            <div className="d-flex flex-direction-row align-items-center">
                              <Form.Control
                                type="number"
                                value={
                                  inputValues[product.value]?.quantity || ""
                                }
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
                                required
                                placeholder="Input quantity"
                                style={{
                                  height: "40px",
                                  width: "120px",
                                  fontSize: "15px",
                                }}
                              />
                            </div>
                          </td>
                          <td>{formatDatetime(product.created)}</td>
                          <td>
                            <div className="d-flex flex-direction-row align-items-center">
                              <Form.Control
                                type="text"
                                value={inputValues[product.value]?.desc || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    e.target.value,
                                    product.value,
                                    "desc"
                                  )
                                }
                                placeholder="Input description"
                                style={{
                                  height: "40px",
                                  width: "150px",
                                  fontSize: "15px",
                                  overflowY: "auto",
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: "center" }}>
                          No Product selected
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {showDropdown && (
                    <div className="dropdown mt-3">
                      <Select
                        isMulti
                        options={filteredOptions}
                        onChange={selectProduct}
                        onInputChange={handleInputChangeSearch}
                      />
                    </div>
                  )}
                  <div className="item">
                    <div className="new_item">
                      <button type="button" onClick={displayDropdown}>
                        <span style={{ marginRight: "4px" }}></span>
                        <Plus size={20} /> New Item
                      </button>
                    </div>
                  </div>
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
                to="/purchaseRequest"
                className="btn btn-secondary btn-md"
                size="md"
                style={{ fontSize: "20px", margin: "0px 5px" }}
              >
                Close
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default CreatePurchaseRequest;
