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

  // React.useEffect(() => {
  //     $(document).ready(function () {
  //         $('#order-listing').DataTable();
  //     });
  //     }, []);

  const handleAddProdClick = () => {
    // para pag display ng drop down for add product
    setShowDropdown(true);
  };

  const handleSelectChange_Prod = (selectedOptions) => {
    setAddProduct(selectedOptions);
  };

  const handleQuantityChange = (
    inputValue,
    productValue,
    product_quantity_available
  ) => {
    // Remove non-numeric characters and limit length to 10
    const cleanedValue = inputValue.replace(/\D/g, "").substring(0, 10);

    // Convert cleanedValue to a number
    const numericValue = parseInt(cleanedValue, 10);

    // Create a variable to store the corrected value
    let correctedValue = cleanedValue;

    // Check if the numericValue is greater than the available quantity
    if (numericValue > product_quantity_available) {
      // If greater, set the correctedValue to the maximum available quantity
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

      // Use the updatedInputs directly to create the serializedProducts array
      const serializedProducts = addProduct.map((product) => ({
        quantity: updatedInputs[product.value] || "",
        type: product.type,
        product_id: product.product_id,
        code: product.code,
        name: product.name,
        quantity_available: product.quantity_available,
      }));

      setAddProductbackend(serializedProducts);
      console.log("Selected Products:", serializedProducts);

      // Return the updatedInputs to be used as the new state
      return updatedInputs;
    });
  };

  //get supplier product
  //   useEffect(() => {
  //     const delay = setTimeout(() => {
  //     axios
  //       .get(BASE_URL + "/inventory/fetchToIssueProduct")
  //       .then((res) => {
  //         setFetchProduct(res.data)
  //         setIsLoading(false);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         setIsLoading(false);
  //       });
  //     }, 1000);

  // return () => clearTimeout(delay);
  // }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/inventory/fetchInvetory_product_warehouse", {
          params: {
            warehouse: fromSite,
          },
        })
        .then((res) => {
          setFetchProduct(res.data);
          setIsLoading(false);
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
      title: "Issuance Created",
      text: "The Issuance has been added successfully",
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
                      onChange={(e) => setAccountabilityRefcode(e.target.value)}
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
                              <td>{product.quantity_available}</td>
                              <td>
                                <div className="d-flex flex-direction-row align-items-center">
                                  <Form.Control
                                    type="number"
                                    value={quantityInputs[product.value] || ""}
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
                          // filterOption={({ label }, inputValue) =>
                          //   label.props.children[1].props.children.toLowerCase().includes(inputValue.toLowerCase())
                          // }
                          options={
                            fetchProduct.map((product) => ({
                              value: `${product.productID}_${product.product_code}_Product`,
                              label: (
                                <div>
                                  Product Code:{" "}
                                  <strong>{product.product_code}</strong> /
                                  Product Name:{" "}
                                  <strong>{product.product_name}</strong> /
                                  Quantity:{" "}
                                  <strong>{product.totalQuantity}</strong>
                                </div>
                              ),
                              type: "Product",
                              inventory_id: product.inventory_id,
                              product_id: product.productID,
                              code: product.product_code,
                              name: product.product_name,
                              quantity_available: product.totalQuantity,
                              uom: product.UOM
                            }))
                            .concat(
                              fetchAssembly.map((assembly) => ({
                                value: `${assembly.productID}_${assembly.product_code}_Assembly`,
                                label: (
                                  <div>
                                    Product Code:{" "}
                                    <strong>{assembly.product_code}</strong> /
                                    Product Name:{" "}
                                    <strong>{assembly.product_name}</strong> /
                                    Quantity:{" "}
                                    <strong>{assembly.totalQuantity}</strong>
                                  </div>
                                ),
                                type: "Assembly",
                                inventory_id: assembly.inventory_id,
                                product_id: assembly.productID,
                                code: assembly.product_code,
                                name: assembly.product_name,
                                quantity_available: assembly.totalQuantity,
                                uom: assembly.UOM
                              }))
                            )
                            .concat(
                              fetchSpare.map((spare) => ({
                                value: `${spare.productID}_${spare.product_code}_Spare`,
                                label: (
                                  <div>
                                    Product Code:{" "}
                                    <strong>{spare.product_code}</strong> /
                                    Product Name:{" "}
                                    <strong>{spare.product_name}</strong> /
                                    Quantity:{" "}
                                    <strong>{spare.totalQuantity}</strong>
                                  </div>
                                ),
                                type: "Spare",
                                inventory_id: spare.inventory_id,
                                product_id: spare.productID,
                                code: spare.product_code,
                                name: spare.product_name,
                                quantity_available: spare.totalQuantity,
                                uom: spare.UOM
                              }))
                            )
                            .concat(
                              fetchSubpart.map((subpart) => ({
                                value: `${subpart.productID}_${subpart.product_code}_Subpart`,
                                label: (
                                  <div>
                                    Product Code:{" "}
                                    <strong>{subpart.product_code}</strong> /
                                    Product Name:{" "}
                                    <strong>{subpart.product_name}</strong> /
                                    Quantity:{" "}
                                    <strong>{subpart.totalQuantity}</strong>
                                  </div>
                                ),
                                type: "Subpart",
                                inventory_id: subpart.inventory_id,
                                product_id: subpart.productID,
                                code: subpart.product_code,
                                name: subpart.product_name,
                                quantity_available: subpart.totalQuantity,
                                uom: subpart.UOM
                              }))
                            )
                          }
                          onChange={handleSelectChange_Prod}
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
