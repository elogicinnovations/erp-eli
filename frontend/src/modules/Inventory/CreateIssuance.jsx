import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../assets/global/url";
import Sidebar from "../Sidebar/sidebar";
import ReactLoading from "react-loading";
import NoData from "../../assets/image/NoData.png";
import NoAccess from "../../assets/image/NoAccess.png";
import "../../assets/global/style.css";
import { Link, useNavigate } from "react-router-dom";
import "../styles/react-style.css";
import Form from "react-bootstrap/Form";
// import subwarehouse from "../../assets/global/subwarehouse";
import swal from "sweetalert";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import { ArrowCircleLeft, Warehouse } from "@phosphor-icons/react";
import { jwtDecode } from "jwt-decode";

const CreateIssuance = ({ setActiveTab, authrztn }) => {
  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
  };

  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [showDropdown, setShowDropdown] = useState(false);
  const [fetchProduct, setFetchProduct] = useState([]);
  const [addProduct, setAddProduct] = useState([]); // para sa pag ng product na e issue sa table
  const [addProductbackend, setAddProductbackend] = useState([]); // para sa pag ng product na e issue sa backend
  const [quantityInputs, setQuantityInputs] = useState({});
  const [fetchwarehouse, setFetchwarehouse] = useState([]);

  // assembly
  const [fetchAssembly, setFetchAssembly] = useState([]);

  //spare part
  const [fetchSpare, setFetchSpare] = useState([]);

  //sub-part
  const [fetchSubpart, setFetchSubpart] = useState([]);

  const [fromSite, setFromSite] = useState("");
  const [issuedTo, setIssuedTo] = useState();
  const [withAccountability, setWithAccountability] = useState("false");
  const [accountabilityRefcode, setAccountabilityRefcode] = useState();
  const [serialNumber, setSerialNumber] = useState();
  const [jobOrderRefcode, setJobOrderRefcode] = useState();
  const [receivedBy, setReceivedBy] = useState();
  const [transportedBy, setTransportedBy] = useState();
  const [mrs, setMrs] = useState();
  const [remarks, setRemarks] = useState();
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

  const reloadCode = () => {
    const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/issuance/lastAccRefCode")
        .then((res) => {
          setAccountabilityRefcode(res.data.nextCode);
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
    reloadCode();
  }, []);

  const [searchInput, setSearchInput] = useState("");

  const handleAddProdClick = () => {
    setShowDropdown(true);
    axios
      .get(BASE_URL + "/inventory/fetchInvetory_product_warehouse", {
        params: {
          warehouse: fromSite,
        },
      })
      .then((res) => {
        setFetchProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSelectChange_Prod = (selectedOptions) => {
    setAddProduct(selectedOptions);
  };

  const handleQuantityChange = (
    inputValue,
    productValue,
    product_quantity_available
  ) => {
    const cleanedValue = inputValue.replace(/\D/g, "").substring(0, 10);
    const numericValue = parseInt(cleanedValue, 10);
    let correctedValue = cleanedValue;

    if (numericValue > product_quantity_available) {
      correctedValue = product_quantity_available.toString();
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

      const serializedProducts = addProduct.map((product) => ({
        quantity: updatedInputs[product.value] || "",
        type: product.type,
        product_id: product.product_id,
        code: product.code,
        name: product.name,
        quantity_available: product.quantity_available,
      }));

      setAddProductbackend(serializedProducts);

      return updatedInputs;
    });
  };

  // Custom filter function to limit options to 10
  const customFilterOption = (option, { inputValue }) => {
    const searchInput = inputValue.toLowerCase();
    const productCode = option.code ? option.code.toLowerCase() : "";
    const productName = option.name ? option.name.toLowerCase() : "";
    const productUOM = option.uom ? option.uom.toLowerCase() : "";

    return (
      productCode.includes(searchInput) ||
      productName.includes(searchInput) ||
      productUOM.includes(searchInput)
    );
  };

  const handleInputChange = (inputValue) => {
    setSearchInput(inputValue);
  };

  const filteredOptions = fetchProduct
    .map((product) => ({
      value: `${product.productID}_${product.product_code}_Product`,
      // label: (
      //   <div>
      //     Product Code: <strong>{product.product_code}</strong> / Product Name:{" "}
      //     <strong>{product.product_name}</strong> / Quantity:{" "}
      //     <strong>{product.totalQuantity}</strong> / UOM:{" "}
      //     <strong>{product.UOM}</strong>
      //   </div>
      // ),
      label: `(${product.product_code}) - ${product.product_name} - ${product.UOM}`,
      type: "Product",
      inventory_id: product.inventory_id,
      product_id: product.productID,
      code: product.product_code,
      name: product.product_name,
      quantity_available: product.totalQuantity,
      uom: product.UOM,
      setUOM: product.setUOM,
    }))
    .filter((option) => {
      const searchString = `${option.code.toLowerCase()} ${option.name.toLowerCase()} ${option.uom.toLowerCase()}`;
      return searchString.includes(searchInput.toLowerCase());
    })
    .slice(0, 5);

  // useEffect(() => {
  //   const delay = setTimeout(() => {
  //     axios
  //       .get(BASE_URL + "/inventory/fetchInvetory_product_warehouse", {
  //         params: {
  //           warehouse: fromSite,
  //         },
  //       })
  //       .then((res) => {
  //         setFetchProduct(res.data);
  //         setIsLoading(false);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         // setIsLoading(false);
  //       });
  //   }, 1000);

  //   return () => clearTimeout(delay);
  // }, [fromSite]);

  useEffect(() => {
    const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/inventory/fetchInvetory_assembly_warehouse", {
          params: {
            warehouse: fromSite,
          },
        })
        .then((res) => {
          setFetchAssembly(res.data);
          // setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          // setIsLoading(false);
        });
    }, 1000);

    return () => clearTimeout(delay);
  }, [fromSite]);

  useEffect(() => {
    const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/inventory/fetchInvetory_spare_warehouse", {
          params: {
            warehouse: fromSite,
          },
        })
        .then((res) => {
          setFetchSpare(res.data);
          // setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          // setIsLoading(false);
        });
    }, 1000);

    return () => clearTimeout(delay);
  }, [fromSite]);

  useEffect(() => {
    const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/inventory/fetchInvetory_subpart_warehouse", {
          params: {
            warehouse: fromSite,
          },
        })
        .then((res) => {
          setFetchSubpart(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          // setIsLoading(false);
        });
    }, 1000);

    return () => clearTimeout(delay);
  }, [fromSite]);

  // //get supplier Assembly
  // useEffect(() => {
  //   axios
  //     .get(BASE_URL + "/inventory/fetchToIssueAssembly")
  //     .then((res) => setFetchAssembly(res.data))
  //     .catch((err) => console.log(err));
  // }, []);

  // //get supplier Spare
  // useEffect(() => {
  //   axios
  //     .get(BASE_URL + "/inventory/fetchToIssueSpare")
  //     .then((res) => setFetchSpare(res.data))
  //     .catch((err) => console.log(err));
  // }, []);

  // //get supplier Subpart
  // useEffect(() => {
  //   axios
  //     .get(BASE_URL + "/inventory/fetchToIssueSubpart")
  //     .then((res) => setFetchSubpart(res.data))
  //     .catch((err) => console.log(err));
  // }, []);

  //get warehouse
  useEffect(() => {
    axios
      .get(BASE_URL + "/warehouses/fetchtableWarehouses")
      .then((res) => setFetchwarehouse(res.data))
      .catch((err) => console.log(err));
  }, []);

  //get MasterList
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    axios
      .get(BASE_URL + "/masterList/masterTable")
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  //get Cost Center
  const [costCenter, setCostCenter] = useState([]);
  useEffect(() => {
    axios
      .get(BASE_URL + "/costCenter/getCostCenter")
      .then((response) => {
        setCostCenter(response.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  // ----------------------------------Start Add new Issuance------------------------------//
  const handleFormChangeTransported = (event) => {
    setTransportedBy(event.target.value);
  };
  const handleFormChangeReceived = (event) => {
    setReceivedBy(event.target.value);
  };
  const handleFormChangeIssuedTo = (event) => {
    setIssuedTo(event.target.value);
  };
  const handleFormChangeWarehouse = (event) => {
    setFromSite(event.target.value);
  };
  const handleCheckbox = () => {
    if (withAccountability === "false") {
      setWithAccountability("true");
    } else {
      setWithAccountability("false");
    }
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
        text: "Please fill the red text fields",
      });
    } else {
      // const formData = new FormData();
      //   formData.append('fromSite', fromSite);
      //   formData.append('issuedTo', issuedTo);
      //   formData.append('withAccountability', withAccountability);
      //   formData.append('accountabilityRefcode', accountabilityRefcode);
      //   formData.append('serialNumber', serialNumber);
      //   formData.append('jobOrderRefcode', jobOrderRefcode);
      //   formData.append('receivedBy', receivedBy);
      //   formData.append('transportedBy', transportedBy);
      //   formData.append('mrs', mrs);
      //   formData.append('remarks', remarks);
      //   formData.append('addProductbackend', addProductbackend);

      // axios
      // .post(BASE_URL + '/issuance/create',
      //   {
      //     fromSite,issuedTo,withAccountability,accountabilityRefcode,serialNumber,
      //     jobOrderRefcode,receivedBy,transportedBy,mrs,remarks, addProductbackend
      //   })
      fetch(BASE_URL + "/issuance/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fromSite,
          issuedTo,
          withAccountability,
          accountabilityRefcode,
          serialNumber,
          jobOrderRefcode,
          receivedBy,
          transportedBy,
          mrs,
          remarks,
          addProductbackend: addProductbackend,
          userId,
        }),
      }).then((res) => {
        console.log(res);
        if (res.status === 200) {
          SuccessInserted(res);
        } else if (res.status === 201) {
          Duplicate_Message();
        } else {
          ErrorInserted();
        }
      });
    }
    setValidated(true); //for validations
  };
  // ----------------------------------End Add new Issuance------------------------------//

  // ----------------------------------Validation------------------------------//
  const SuccessInserted = (res) => {
    swal({
      title: "Issuance Add Successful",
      text: "The New Issued Product has been created successfully",
      icon: "success",
      button: "OK",
    }).then(() => {
      navigate("/inventory");
    });
  };
  const Duplicate_Message = () => {
    swal({
      title: "Issuance Already Exist",
      text: "",
      icon: "error",
      button: "OK",
    });
  };
  const ErrorInserted = () => {
    swal({
      title: "Something went wrong",
      text: "Please Contact our Support",
      icon: "error",
      button: "OK",
    });
  };
  // const handleQuantityChange = (e, productValue) => {
  //   const updatedProducts = addProduct.map((product) => {
  //     if (product.value === productValue) {
  //       return { ...product, quantity: e.target.value };
  //     }
  //     return product;
  //   });

  //   setAddProductbackend(updatedProducts);
  //   console.log('to backend' + updatedProducts)
  // };

  // ----------------------------------End Validation------------------------------//

  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
        {isLoading ? (
          <div className="loading-container">
            <ReactLoading className="react-loading" type={"bubbles"} />
            Loading Data...
          </div>
        ) : authrztn.includes("Inventory - Add") ? (
          <div className="right-body-contentss">
            <div className="arrowandtitle">
              <Link to="/inventory">
                <ArrowCircleLeft size={45} color="#60646c" weight="fill" />
              </Link>
              <div className="titletext">
                <h1>Create Issuance</h1>
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
                Issuance Info
                <span
                  style={{
                    position: "absolute",
                    height: "0.5px",
                    width: "-webkit-fill-available",
                    background: "#FFA500",
                    top: "81%",
                    left: "15rem",
                    transform: "translateY(-50%)",
                  }}
                ></span>
              </div>

              <div className="row mt-3">
                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label style={{ fontSize: "20px" }}>From: </Form.Label>
                    <Form.Select
                      style={{ height: "40px", fontSize: "15px" }}
                      required
                      onChange={handleFormChangeWarehouse}
                      defaultValue=""
                    >
                      <option disabled selected value="">
                        Select Site
                      </option>
                      {fetchwarehouse.map((ware, index) => (
                        <option key={index} value={ware.id}>
                          {ware.warehouse_name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Issued to:{" "}
                    </Form.Label>
                    <Form.Select
                      style={{ height: "40px", fontSize: "15px" }}
                      required
                      onChange={handleFormChangeIssuedTo}
                    >
                      <option value="">Select Cost Center</option>
                      {costCenter.map((costCenter) => (
                        <option key={costCenter.id} value={costCenter.id}>
                          {costCenter.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                <div className="col-6"></div>
                <div className="col-6">
                  <Form.Check
                    type="checkbox"
                    label="With Accountability"
                    style={{ fontSize: "15px" }}
                    onClick={(e) => handleCheckbox()}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Accountability Refcode:{" "}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Refcode..."
                      style={{ height: "40px", fontSize: "15px" }}
                      readOnly
                      required
                      value={accountabilityRefcode}
                      // onChange={(e) => setAccountabilityRefcode(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Serial Number:{" "}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Serial Number..."
                      style={{ height: "40px", fontSize: "15px" }}
                      onChange={(e) => setSerialNumber(e.target.value)}
                    />
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Job Order Refcode:{" "}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Job Order Refcode..."
                      style={{ height: "40px", fontSize: "15px" }}
                      onChange={(e) => setJobOrderRefcode(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Received by:{" "}
                    </Form.Label>
                    <Form.Select
                      style={{ height: "40px", fontSize: "15px" }}
                      required
                      onChange={handleFormChangeReceived}
                      defaultValue=""
                    >
                      <option disabled value="">
                        Select Employee
                      </option>
                      {roles.map((role) => (
                        <option key={role.col_id} value={role.col_id}>
                          {role.col_Fname}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Transported by:{" "}
                    </Form.Label>
                    <Form.Select
                      style={{ height: "40px", fontSize: "15px" }}
                      required
                      onChange={handleFormChangeTransported}
                    >
                      <option value="">Select Employee</option>
                      {roles.map((role) => (
                        <option key={role.col_id} value={role.col_id}>
                          {role.col_Fname}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: "20px" }}>
                      M.R.S #:{" "}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      required
                      placeholder="Input #"
                      style={{ height: "40px", fontSize: "15px" }}
                      onChange={(e) => setMrs(e.target.value)}
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
                    placeholder="Enter Remarks"
                    style={{ height: "100px", fontSize: "15px" }}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </Form.Group>
              </div>

              <div
                className="gen-info"
                style={{
                  fontSize: "20px",
                  position: "relative",
                  paddingTop: "30px",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    height: "0.5px",
                    width: "-webkit-fill-available",
                    background: "#FFA500",
                    top: "85%",
                    left: "0rem",
                    transform: "translateY(-50%)",
                  }}
                ></span>
              </div>
              <div className="supplier-table">
                <div className="table-containss">
                  <div className="main-of-all-tables">
                    <table>
                      <thead>
                        <tr>
                          <th className="tableh">Product Code</th>
                          <th className="tableh">Product Name</th>
                          <th className="tableh">UOM</th>
                          <th className="tableh">Sub-Unit</th>
                          <th className="tableh">Availability</th>
                          <th className="tableh">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {addProduct.length > 0 ? (
                          addProduct.map((product) => (
                            <tr key={product.value}>
                              <td key={product.value}>{product.code}</td>
                              <td key={product.value}>{product.name}</td>
                              <td>{product.uom}</td>
                              <td>
                                {product.setUOM === true
                                  ? `(qty of pcs inside ${product.uom})`
                                  : `(qty per ${product.uom})`}
                              </td>
                              <td>{product.quantity_available}</td>
                              <td>
                                <div className="d-flex flex-direction-row align-items-center">
                                  <Form.Control
                                    type="number"
                                    value={quantityInputs[product.value] || ""}
                                    onKeyDown={(e) => {
                                      ["e", "E", "+", "-"].includes(e.key) &&
                                        e.preventDefault();
                                    }}
                                    onInput={(e) =>
                                      handleQuantityChange(
                                        e.target.value,
                                        product.value,
                                        product.quantity_available
                                      )
                                    }
                                    required
                                    placeholder="Input quantity"
                                    style={{
                                      height: "40px",
                                      width: "120px",
                                      fontSize: "15px",
                                    }}
                                    min="0"
                                    max="9999999999"
                                  />
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="6"
                              style={{
                                textAlign: "center",
                                fontFamily: "Poppins, Source Sans Pro",
                              }}
                            >
                              No Product Selected
                            </td>
                          </tr>
                        )}
                      </tbody>
                      {showDropdown && (
                        <Select
                          isMulti
                          options={filteredOptions}
                          onChange={handleSelectChange_Prod}
                          onInputChange={handleInputChange}
                        />
                      )}

                      {fromSite ? (
                        <Button
                          variant="warning"
                          onClick={handleAddProdClick}
                          size="md"
                          style={{
                            fontSize: "15px",
                            marginTop: "10px",
                            fontFamily: "Poppins, Source Sans Pro",
                          }}
                        >
                          Add Product
                        </Button>
                      ) : (
                        <></>
                      )}
                    </table>
                  </div>
                  <div className="save-cancel">
                    {addProduct && addProduct.length > 0 ? (
                      <Button
                        type="submit"
                        variant="warning"
                        size="md"
                        style={{
                          fontSize: "20px",
                          margin: "0px 5px",
                          fontFamily: "Poppins, Source Sans Pro",
                        }}
                      >
                        Save
                      </Button>
                    ) : (
                      <></>
                    )}

                    <Link
                      to="/inventory"
                      onClick={() => handleTabClick("issuance")}
                      className="btn btn-secondary btn-md"
                      size="md"
                      style={{ fontSize: "20px", margin: "0px 5px" }}
                    >
                      Close
                    </Link>
                  </div>
                </div>
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

export default CreateIssuance;
