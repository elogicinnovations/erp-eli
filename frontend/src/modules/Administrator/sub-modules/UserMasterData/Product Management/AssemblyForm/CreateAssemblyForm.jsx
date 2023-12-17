import React, { useState, useEffect } from "react";
import Sidebar from "../../../../../Sidebar/sidebar";
import "../../../../../../assets/global/style.css";
import { Link, useNavigate } from "react-router-dom";
import "../../../../../styles/react-style.css";
import Form from "react-bootstrap/Form";
import axios from "axios";
import BASE_URL from "../../../../../../assets/global/url";
import swal from "sweetalert";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import cls_unitMeasurement from "../../../../../../assets/global/unitMeasurement";
import cls_unit from "../../../../../../assets/global/unit";
import { Trash, NotePencil } from "@phosphor-icons/react";
import "../../../../../../assets/skydash/vendors/feather/feather.css";
import "../../../../../../assets/skydash/vendors/css/vendor.bundle.base.css";
import "../../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css";
import "../../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
import "../../../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css";
import "../../../../../../assets/skydash/css/vertical-layout-light/style.css";
import "../../../../../../assets/skydash/vendors/js/vendor.bundle.base";
import "../../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
import "../../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4";
import "../../../../../../assets/skydash/js/off-canvas";

import * as $ from "jquery";

function CreateAssemblyForm() {
  const [validated, setValidated] = useState(false);

  const [fetchSparePart, setFetchPart] = useState([]);
  const [fetchSupp, setFetchSupp] = useState([]);
  const [fetchSubPart, setFetchsub] = useState([]);
  const [spareParts, setSparePart] = useState([]);
  const [subparting, setsubparting] = useState([]);
  const [thresholds, setThresholds] = useState("");
  const [manufacturer, setManufacturer] = useState([]);
  const [unit, setUnit] = useState("");
  const [binLocation, setbinLocation] = useState([]);
  const [slct_binLocation, setslct_binLocation] = useState("")
  const [slct_manufacturer, setslct_manufacturer] = useState("")
  const [unitMeasurement, setUnitMeasurement] = useState("")
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [priceInput, setPriceInput] = useState({});
  const [addPriceInput, setaddPriceInputbackend] = useState([]);
  // for display selected subPart in Table
  const [supp, setSupp] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  const restrictScientificNotation = (event) => {
    // Allow only numeric values and a dot (.)
    event.target.value = event.target.value.replace(/[^0-9.]/);
  };

  useEffect(() => {
    axios
      .get(BASE_URL + "/supplier/fetchTable")
      .then((res) => setFetchSupp(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/sparePart/fetchTable")
      .then((res) => setFetchPart(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/subpart/fetchTable")
      .then((res) => setFetchsub(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/binLocation/fetchTable")
      .then((response) => {
        setbinLocation(response.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(BASE_URL + "/manufacturer/retrieve")
      .then((response) => {
        setManufacturer(response.data);
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      });
  }, []);

  //for supplier selection values
  const handleSelectChange = (selectedOptions) => {
    setSparePart(selectedOptions);
  };

  const handleSubpartChange = (selectedOption) => {
    setsubparting(selectedOption);
  };

  const handleSelectChange_Supp = (selectedOptions) => {
    setSupp(selectedOptions);
  };

  const handleAddSuppClick = () => {
    setShowDropdown(true);
  };
  
  const handleChangeUnit = (event) => {
    setUnit(event.target.value);
  };
  
  const handleFormChangeBinLocation = (event) => {
    setslct_binLocation(event.target.value);
  };

  const handleChangeMeasurement = (event) => {
    setUnitMeasurement(event.target.value);
  };
  
  const handleFormChangeManufacturer = (event) => {
    setslct_manufacturer(event.target.value);
  };

  const handlePriceinput = (value, priceValue) => {
    setPriceInput((prevInputs) => {
      const updatedInputs = {
        ...prevInputs,
        [priceValue]: value,
      };

      // Use the updatedInputs directly to create the serializedProducts array
      const serializedPrice = supp.map((supp) => ({
        price: updatedInputs[supp.value] || "",
        code: supp.codes,
      }));

      setaddPriceInputbackend(serializedPrice);

      console.log("Price Inputted:", serializedPrice);

      // Return the updatedInputs to be used as the new state
      return updatedInputs;
    });
  };

  const add = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      // if required fields has NO value
      //    console.log('requried')
      swal({
        icon: "error",
        title: "Fields are required",
        text: "Please fill the red text fields",
      });
    } else {
      axios
        .post(`${BASE_URL}/assembly/create`, {
          code,
          name,
          desc,
          spareParts,
          addPriceInput,
          subparting,
          unit,
          slct_binLocation,
          unitMeasurement,
          slct_manufacturer,
          thresholds
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            swal({
              title: "The Assembly sucessfully added!",
              text: "The Assembly has been updated successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate("/assemblyForm");
            });
          } else if (res.status === 201) {
            swal({
              icon: "error",
              title: "Code Already Exist",
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

    setValidated(true); //for validations
  };

  const handleKeyPress = (e) => {
    if (e.key === "e" || isNaN(e.key)) {
      e.preventDefault();
    }
    e.target.value = e.target.value.replace(/[^0-9.]/);
  };
  return (
    <div className="main-of-containers">
      {/* <div className="left-of-main-containers">
        <Sidebar />
      </div> */}
      <div className="right-of-main-containers">
        <div className="right-body-contents-a">
          <Form
            noValidate
            validated={validated}
            onSubmit={add}>
            <h1>Add Assembly Parts</h1>
            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "20px",
              }}>
              General Information
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "81%",
                  left: "18rem",
                  transform: "translateY(-50%)",
                }}></span>
            </div>

            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Product Code:{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    onChange={(e) => setCode(e.target.value)}
                    type="text"
                    placeholder="Enter item code"
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Item Name:{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Enter item name"
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Sub Parts:{" "}
                  </Form.Label>
                  <Select
                    isMulti
                    options={fetchSubPart.map((subpart) => ({
                      value: subpart.id,
                      label: subpart.subPart_name,
                    }))}
                    onChange={handleSubpartChange}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Spare Parts:{" "}
                  </Form.Label>
                  <Select
                    isMulti
                    options={fetchSparePart.map((sparePart) => ({
                      value: sparePart.id,
                      label: sparePart.spareParts_name,
                    }))}
                    onChange={handleSelectChange}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>Unit: </Form.Label>
                  <Form.Select
                    aria-label=""
                    style={{ height: "40px", fontSize: "15px" }}
                    defaultValue=""
                    onChange={handleChangeUnit}>
                    <option
                      disabled
                      value="">
                      Select Unit ...
                    </option>
                    {cls_unit.map((unit, index) => (
                      <option
                        key={index}
                        value={unit}>
                        {unit}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Bin Location:{" "}
                  </Form.Label>
                  <Form.Select
                    aria-label=""
                    onChange={handleFormChangeBinLocation}
                    required
                    style={{ height: "40px", fontSize: "15px" }}
                    defaultValue="">
                    <option
                      disabled
                      value="">
                      Select Bin Location ...
                    </option>
                    {binLocation.map((binLocation) => (
                      <option
                        key={binLocation.bin_id}
                        value={binLocation.bin_id}>
                        {binLocation.bin_name}
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
                    Unit of Measurement:{" "}
                  </Form.Label>
                  <Form.Select
                    aria-label=""
                    style={{ height: "40px", fontSize: "15px" }}
                    defaultValue=""
                    onChange={handleChangeMeasurement}>
                    <option
                      disabled
                      value="">
                      Select Unit Measurement ...
                    </option>
                    {cls_unitMeasurement.map((unitM, index) => (
                      <option
                        key={index}
                        value={unitM}>
                        {unitM}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Manufacturer:{" "}
                  </Form.Label>
                  <Form.Select
                    aria-label=""
                    onChange={handleFormChangeManufacturer}
                    required
                    style={{ height: "40px", fontSize: "15px" }}
                    defaultValue="">
                    <option
                      disabled
                      value="">
                      Select Manufacturer ...
                    </option>
                    {manufacturer.map((manufacturer) => (
                      <option
                        key={manufacturer.manufacturer_code}
                        value={manufacturer.manufacturer_code}>
                        {manufacturer.manufacturer_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label style={{ fontSize: "20px" }}>Details: </Form.Label>
                <Form.Control
                  onChange={(e) => setDesc(e.target.value)}
                  as="textarea"
                  placeholder="Enter details name"
                  style={{ height: "100px", fontSize: "15px" }}
                />
              </Form.Group>
            </div>

<div
  className="gen-info"
  style={{
    fontSize: "20px",
    position: "relative",
    paddingTop: "30px",
  }}>
  Notification Thresholds
  <p>Sets your preferred thresholds.</p>
  <span
    style={{
      position: "absolute",
      height: "0.5px",
      width: "-webkit-fill-available",
      background: "#FFA500",
      top: "65%",
      left: "21rem",
      transform: "translateY(-50%)",
    }}></span>
</div>

<div className="row mt-3">
  <div className="col-6">
    <Form.Group controlId="exampleForm.ControlInput1">
      <Form.Label style={{ fontSize: "20px" }}>
        Critical Inventory Thresholds:{" "}
      </Form.Label>
      <Form.Control
        onChange={(e) => {
          const inputValue = e.target.value;
          const sanitizedValue = inputValue.replace(/\D/g, "");
          setThresholds(sanitizedValue);
        }}
        type="text"
        placeholder="Minimum Stocking"
        style={{ height: "40px", fontSize: "15px" }}
        maxLength={10}
        pattern="[0-9]*"
      />
    </Form.Group>
  </div>
  {/* <div className="col-6">
    <Form.Group controlId="exampleForm.ControlInput1">
      <Form.Label style={{ fontSize: "20px" }}>
        Image Upload:{" "}
      </Form.Label>
      <div
        style={{
          border: "1px #DFE3E7 solid",
          height: "auto",
          maxHeight: "140px",
          fontSize: "15px",
          width: "720px",
          padding: 10,
        }}>
        <Dropzone
          onDrop={onDropImage}
          onChange={(e) => setselectedimage(e.target.value)}>
          {({ getRootProps, getInputProps }) => (
            <div
              className="w-100 h-100"
              style={{ width: "700px" }}
              {...getRootProps()}>
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: "none" }}
              />
              <div
                className="d-flex align-items-center"
                style={{ width: "700px", height: "2.5em" }}>
                <p
                  className="fs-5 w-100 p-3 btn btn-secondary"
                  style={{ color: "white", fontWeight: "bold" }}>
                  Drag and drop a file here, or click to select a
                  file
                </p>
              </div>
              {selectedimage.length > 0 && (
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    border: "1px green solid",
                    width: "700px",
                    height: "5em",
                    padding: "1rem",
                    overflowY: "auto",
                  }}>
                  Uploaded Images:
                  <p
                    style={{
                      color: "green",
                      fontSize: "15px",
                      display: "flex",
                      height: "4em",
                      flexDirection: "column",
                    }}>
                    {selectedimage.map((image, index) => (
                      <div key={index}>
                        <div className="imgContainer">
                          <span className="imgUpload">
                            {image.name}
                          </span>
                          <X
                            size={20}
                            onClick={removeImage}
                            className="removeButton"
                          />
                        </div>
                      </div>
                    ))}
                  </p>
                </div>
              )}
            </div>
          )}
        </Dropzone>
      </div>
    </Form.Group>
  </div> */}
</div>

            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "30px",
              }}>
              Supplier List
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "85%",
                  left: "12rem",
                  transform: "translateY(-50%)",
                }}></span>
            </div>
            <div className="supplier-table">
              <div className="table-containss">
                <div className="main-of-all-tables">
                  <table id="order-listing">
                    <thead>
                      <tr>
                        <th className="tableh">Supplier Code</th>
                        <th className="tableh">Name</th>
                        <th className="tableh">Email</th>
                        <th className="tableh">Contact</th>
                        <th className="tableh">Address</th>
                        <th className="tableh">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supp.length > 0 ? (
                        supp.map((supp) => (
                          <tr>
                            <td>{supp.codes}</td>
                            <td>{supp.names}</td>
                            <td>{supp.email}</td>
                            <td>{supp.contact}</td>
                            <td>{supp.address}</td>
                            <td>
                              <span
                                style={{
                                  fontSize: "20px",
                                  marginRight: "5px",
                                }}>
                                ₱
                              </span>
                              <input
                                type="number"
                                style={{ height: "50px" }}
                                placeholder="Input Price"
                                value={priceInput[supp.value] || ""}
                                onChange={(e) =>
                                  handlePriceinput(e.target.value, supp.value)
                                }
                                required
                                onInput={handleKeyPress}
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td>No Supplier selected</td>
                        </tr>
                      )}
                    </tbody>
                    {showDropdown && (
                      <div className="dropdown mt-3">
                        <Select
                          isMulti
                          options={fetchSupp.map((supp) => ({
                            value: supp.supplier_code,
                            label: (
                              <div>
                                Supplier Code:{" "}
                                <strong>{supp.supplier_code}</strong> / Name:{" "}
                                <strong>{supp.supplier_name}</strong>
                              </div>
                            ),
                            codes: supp.supplier_code,
                            names: supp.supplier_name,
                            email: supp.supplier_email,
                            contact: supp.supplier_number,
                            address: supp.supplier_address,
                            price: supp.supplier_price,
                          }))}
                          onChange={handleSelectChange_Supp}
                        />
                      </div>
                    )}

                    <Button
                      variant="outline-warning"
                      onClick={handleAddSuppClick}
                      size="md"
                      style={{ fontSize: "15px", marginTop: "10px" }}>
                      Add Supplier
                    </Button>
                  </table>
                </div>
              </div>
            </div>

            <div className="save-cancel">
              <Button
                type="submit"
                className="btn btn-warning"
                size="md"
                style={{ fontSize: "20px", margin: "0px 5px" }}>
                Save
              </Button>
              <Link
                to="/assemblyForm"
                className="btn btn-secondary btn-md"
                size="md"
                style={{ fontSize: "20px", margin: "0px 5px" }}>
                Close
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default CreateAssemblyForm;
