import React, { useState, useEffect } from "react";
import Sidebar from "../../../../../Sidebar/sidebar";
import "../../../../../../assets/global/style.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../../../../styles/react-style.css";
// import Form from "react-bootstrap/Form";
import axios from "axios";
import BASE_URL from "../../../../../../assets/global/url";
import swal from "sweetalert";
import Select from "react-select";
import { Button, InputGroup, Form } from "react-bootstrap";
// import cls_unit from '../../../../../../assets/global/unit';
// import cls_unitMeasurement from '../../../../../../assets/global/unitMeasurement';
// import Button from "react-bootstrap/Button";
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

function UpdateAssemblyForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [validated, setValidated] = useState(false);

  //Fetching Assembly Table
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  // const [unit, setunit] = useState('');
  // const [slct_binLocation, setslct_binLocation] = useState([]);
  // const [binLocation, setbinLocation] = useState([]);
  // const [unitMeasurement, setunitMeasurement] = useState('');
  // const [slct_manufacturer, setslct_manufacturer] = useState([]);
  // const [manufacturer, setManufacturer] = useState([]);
  // const [thresholds, setThresholds] = useState('');
  const [spareParts, setspareParts] = useState([]);
  const handleSpareClick = (selectedOptions) => {
    setspareParts(selectedOptions);
  };

  const [priceInput, setPriceInput] = useState({});
  const [addPriceInput, setaddPriceInputbackend] = useState([]);
  useEffect(() => {
    axios
      .get(BASE_URL + "/assembly/fetchTableEdit", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setCode(res.data[0].assembly_code);
        setName(res.data[0].assembly_name);
        setDesc(res.data[0].assembly_desc);
        // setunit(res.data[0].assembly_unit);
        // setslct_binLocation(res.data[0].assembly_location);
        // setunitMeasurement(res.data[0].assembly_unitMeasurement);
        // setslct_manufacturer(res.data[0].assembly_manufacturer);
        // setThresholds(res.data[0].threshhold);
      })
      .catch((err) => console.log(err));
  }, [id]);

  //Fetching to View Supplier
  const [fetchSupp, setFetchSupp] = useState([]);
  useEffect(() => {
    axios
      .get(BASE_URL + "/supplier/fetchTable")
      .then((res) => setFetchSupp(res.data))
      .catch((err) => console.log(err));
  }, []);

  //Fetching to View Spare Parts
  const [fetchSparePart, setFetchPart] = useState([]);
  useEffect(() => {
    axios
      .get(BASE_URL + "/sparePart/fetchTable")
      .then((res) => setFetchPart(res.data))
      .catch((err) => console.log(err));
  }, []);

  //Fetching to View Sub Parts
  const [fetchSub, setFetchSub] = useState([]);
  useEffect(() => {
    axios
      .get(BASE_URL + "/subPart/fetchtable")
      .then((res) => setFetchSub(res.data))
      .catch((err) => console.log(err));
  }, []);

  //Fetching For Association of Assembly and Supplier
  const [assembly_supp, setAssembly_supp] = useState([]);
  useEffect(() => {
    axios
      .get(BASE_URL + "/supplier_assembly/fetchAssigned", {
        params: {
          id: id,
        },
      })
      .then((res) => setAssembly_supp(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  //Fetching For Association of Assembly and Spare Part
  const [spareAssembly, setSpareAssembly] = useState([]);
  useEffect(() => {
    axios
      .get(BASE_URL + "/spare_assembly/fetchSpareAssembly", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setSpareAssembly(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  //Fetching For Association of Assembly and Subpart
  const [subAssembly, setSubAssembly] = useState([]);
  useEffect(() => {
    axios
      .get(BASE_URL + "/assembly_subparts/fetchinTable", {
        params: {
          id: id,
        },
      })
      .then((res) => setSubAssembly(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  // useEffect(() => {
  //   axios.get(BASE_URL + '/binLocation/fetchTable')
  //     .then(response => {
  //       setbinLocation(response.data);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching roles:', error);
  //     });
  // }, []);

  // useEffect(() => {
  //   axios.get(BASE_URL + '/manufacturer/retrieve')
  //     .then(response => {
  //       setManufacturer(response.data);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching roles:', error);
  //     });
  // }, []);

  const [supp, setSupp] = useState([]);
  const handleSelectChange_Supp = (selectedOptions) => {
    setSupp(selectedOptions);
  };

  const [showDropdown, setShowDropdown] = useState(false);
  const handleAddSuppClick = () => {
    setShowDropdown(true);
  };

  const [isReadOnly, setReadOnly] = useState(false);
  const handleEditClick = () => {
    setReadOnly(true);
  };

  // const handleChangeUnit = (event) => {
  //   setunit(event.target.value);
  // };

  // const handleFormChangeBinLocation = (event) => {
  //   setslct_binLocation(event.target.value);
  // };

  // const handleChangeMeasurement = (event) => {
  //   setunitMeasurement(event.target.value);
  // };

  // const handleFormChangeManufacturer = (event) => {
  //   setslct_manufacturer(event.target.value);
  // };

  //Update
  const update = async (e) => {
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
        text: "Please fill the Required text fields",
      });
    } else {
      axios
        .post(`${BASE_URL}/assembly/update`, null, {
          params: {
            id: id,
            code,
            name,
            supp,
            desc,
            // spareParts,
            // Subparts,
            // unit,
            // unitMeasurement,
            // slct_manufacturer,
            // slct_binLocation,
            // thresholds
            // spareParts,
            // Subparts,
            // addPriceInput
          },
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            swal({
              title: "The Product Assembly Update Successful!",
              text: "The Product Assembly has been Updated Successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate("/assemblyForm");
            });
          } else if (res.status === 201) {
            swal({
              title: "Product Assembly is Already Exist",
              text: "Please Input a New Product Assembly ",
              icon: "error",
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
  return (
    <div className="main-of-containers">
      {/* <div className="left-of-main-containers">
        <Sidebar />
      </div> */}
      <div className="right-of-main-containers">
        <div className="right-body-contents-a">
          <Form noValidate validated={validated} onSubmit={update}>
            <h1>Update Assembly Parts</h1>
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
                    value={code}
                    readOnly={!isReadOnly}
                    onChange={(e) => setCode(e.target.value)}
                    type="text"
                    placeholder="Enter item name"
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
                    value={name}
                    readOnly={!isReadOnly}
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

                  {isReadOnly && (
                    <Form.Select
                      disabled={!isReadOnly}
                      style={{ height: "40px" }}>
                      {fetchSub.map((fetchSparts, i) => (
                        <option key={i} value={fetchSparts.id}>
                          {fetchSparts.subPart_name}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                  {!isReadOnly && (
                    <Form.Select
                      disabled={!isReadOnly}
                      style={{ height: "40px" }}>
                      {subAssembly.map((sparts, i) => (
                        <option key={i} value={sparts.id}>
                          {sparts.subPart.subPart_name}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                </Form.Group>
              </div>
              <div className="col-6">
                {isReadOnly && (
                  <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Spare Parts:
                    </Form.Label>
                    <Select
                      isMulti
                      options={fetchSparePart.map((sparePart) => ({
                        value: sparePart.id,
                        label: sparePart.spareParts_name,
                      }))}
                      // onChange={handleSelectChange}
                    />
                  </Form.Group>
                )}
                {!isReadOnly && (
                  <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label style={{ fontSize: "20px" }}>
                      Spare Parts:
                    </Form.Label>
                    <Form.Select
                      disabled={!isReadOnly}
                      style={{ height: "40px" }}>
                      {spareAssembly.map((spares, i) => (
                        <option key={i} value={spares.id}>
                          {spares.sparePart.spareParts_name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}
              </div>
            </div>

            {/* <div className="row">
                <div className="col-6">
                    <Form.Group controlId="exampleForm.ControlInput2">
                      <Form.Label style={{ fontSize: '20px' }}>Unit: </Form.Label>
                      <Form.Select
                        aria-label=""
                        required
                        style={{ height: '40px', fontSize: '15px' }}
                        value={unit}
                        onChange={handleChangeUnit}>
                          <option disabled value=''>
                              Select Unit ...
                          </option>
                        {cls_unit.map((unit, index) => (
                          <option key={index} value={unit}>
                              {unit}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                </div>

                <div className="col-6">
                    <Form.Group controlId="exampleForm.ControlInput2">
                      <Form.Label style={{ fontSize: '20px' }}>Bin Location: </Form.Label>
                      <Form.Select 
                        aria-label="" 
                        onChange={handleFormChangeBinLocation} 
                        required
                        style={{ height: '40px', fontSize: '15px' }}
                        value={slct_binLocation}>
                          <option disabled value=''>
                              Select Bin Location ...
                          </option>
                            {binLocation.map(binLocation => (
                              <option key={binLocation.bin_id} value={binLocation.bin_id}>
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
                      <Form.Label style={{ fontSize: '20px' }}>Unit of Measurment: </Form.Label>
                      <Form.Select
                        aria-label=""
                        required
                        style={{ height: '40px', fontSize: '15px' }}
                        value={unitMeasurement}
                        onChange={handleChangeMeasurement}>
                          <option disabled value=''>
                              Select Unit Measurement ...
                          </option>
                        {cls_unitMeasurement.map((unitM, index) => (
                          <option key={index} value={unitM}>
                              {unitM}
                          </option>
                        ))}
                        </Form.Select>
                    </Form.Group>
                </div>
                <div className="col-6">
                    <Form.Group controlId="exampleForm.ControlInput2">
                      <Form.Label style={{ fontSize: '20px' }}>Manufacturer: </Form.Label>
                      <Form.Select 
                        aria-label="" 
                        onChange={handleFormChangeManufacturer} 
                        required
                        style={{ height: '40px', fontSize: '15px' }}
                        value={slct_manufacturer}>
                          <option disabled value=''>
                              Select Manufacturer ...
                          </option>
                            {manufacturer.map(manufacturer => (
                              <option key={manufacturer.manufacturer_code} value={manufacturer.manufacturer_code}>
                                {manufacturer.manufacturer_name}
                              </option>
                            ))}
                      </Form.Select>
                    </Form.Group>
                </div>
            </div> */}

            <div className="row">
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label style={{ fontSize: "20px" }}>Details: </Form.Label>
                <Form.Control
                  value={desc}
                  readOnly={!isReadOnly}
                  onChange={(e) => setDesc(e.target.value)}
                  as="textarea"
                  placeholder="Enter details name"
                  style={{ height: "100px", fontSize: "15px" }}
                />
              </Form.Group>
            </div>
            {/* <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '30px' }}>
              Notification Thresholds
              <p className='fs-5'>Sets your preferred thresholds.</p>
              <span
                style={{
                  position: 'absolute',
                  height: '0.5px',
                  width: '-webkit-fill-available',
                  background: '#FFA500',
                  top: '65%',
                  left: '21rem',
                  transform: 'translateY(-50%)',
                }}
              ></span>
            </div>

            <div className="row mt-3">
                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: '20px' }}>Critical Inventory Thresholds: </Form.Label>
                    <Form.Control value={thresholds} onChange={(e) => setThresholds(e.target.value)} type="number" style={{height: '40px', fontSize: '15px'}}/>
                    </Form.Group>
                </div>
                <div className="col-6">
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label style={{ fontSize: '20px' }}>Image Upload: </Form.Label>
                      <div style={{border: "1px #DFE3E7 solid", height: 'auto', maxHeight: '140px', fontSize: '15px', width: '50%', padding: 10}}>
                          <Dropzone onDrop={onDropImage}>
                              {({ getRootProps, getInputProps }) => (
                              <div className='w-100 h-100' {...getRootProps()}>
                                  <input
                                      ref={fileInputRef}
                                      type="file"
                                      style={{display: 'none'}}
                                  />
                                  <div className='d-flex align-items-center' style={{width: '100%', height: '2.5em'}}>
                                    <p className='fs-5 w-100 p-3 btn btn-secondary' style={{color: 'white', fontWeight: 'bold'}}>Drag and drop a file here, or click to select a file</p>
                                  </div>
                                  {selectedimage && 
                                      <div className='d-flex align-items-center justify-content-center' style={{border: "1px green solid", width: '100%', height: '5em'}}>
                                        <p 
                                          style={{color: 'green', fontSize: '15px',}}>
                                            Uploaded Image: {selectedimage.name}
                                        </p>
                                      </div>}
                              </div>
                              )}
                          </Dropzone>
                          
                      </div>              
                  </Form.Group>   
                </div>
              </div> */}

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
                        <th className="tableh">Supplier Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assembly_supp.map((data, i) => (
                        <tr key={i}>
                          <td>{data.supplier.supplier_code}</td>
                          <td>{data.supplier.supplier_name}</td>
                          <td>{data.supplier.supplier_email}</td>
                          <td>{data.supplier.supplier_number}</td>
                          <td>{data.supplier.supplier_address}</td>
                          <td>{data.supplier_price}</td>
                        </tr>
                      ))}

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

                      {isReadOnly && (
                        <Button
                          className="btn btn-danger mt-1"
                          onClick={handleAddSuppClick}
                          size="md"
                          style={{ fontSize: "15px", margin: "0px 5px" }}>
                          Add Supplier
                        </Button>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="save-cancel">
              {isReadOnly && (
                <Button
                  type="submit"
                  className="btn btn-warning"
                  size="md"
                  onClick={update}
                  style={{ fontSize: "20px", margin: "0px 5px" }}>
                  Save
                </Button>
              )}
              {!isReadOnly && (
                <Button
                  type="Button"
                  onClick={handleEditClick}
                  className="btn btn-success"
                  size="s"
                  style={{ fontSize: "20px", margin: "0px 5px" }}>
                  <NotePencil />
                  Edit
                </Button>
              )}
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

export default UpdateAssemblyForm;
