import React, { useState, useEffect } from "react";
import Sidebar from "../../../../../Sidebar/sidebar";
import "../../../../../../assets/global/style.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../../../../styles/react-style.css";
// import Form from "react-bootstrap/Form";
import axios from "axios";
import BASE_URL from "../../../../../../assets/global/url";
import swal from "sweetalert";
import Select from 'react-select';
import { Button, Form } from "react-bootstrap";
import cls_unitMeasurement from '../../../../../../assets/global/unitMeasurement';
import Carousel from 'react-bootstrap/Carousel';
import {NotePencil } from "@phosphor-icons/react";
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
  //Fetching all data that didn't where clause
  const [validated, setValidated] = useState(false);
  const [fetchcategory, setFetchcategory] = useState([]);
  const [fetchSparePart, setFetchPart] = useState([]);
  const [fetchSub, setFetchSub] = useState([]);
  const [fetchSupp, setFetchSupp] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isReadOnly, setReadOnly] = useState(false);
  const [binLocation, setbinLocation] = useState([]); 
  const [manufacturer, setManufacturer] = useState([]);
  const [tableSupp, setTableSupp] = useState([]);

  //Fetching data that use to be where clause
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [slct_category, setslct_category] = useState([]);
  const [spareParts, setSpareParts] = useState([]);
  const [Subparts, setSubParts] = useState([]);
  const [slct_binLocation, setslct_binLocation] = useState([]);
  const [slct_manufacturer, setslct_manufacturer] = useState([]);
  const [unitMeasurement, setunitMeasurement] = useState('');
  const [thresholds, setThresholds] = useState('');
  const [addPriceInput, setaddPriceInputbackend] = useState([]);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
  const [assemblyimage, setassemblyImages] = useState([]);
  

  useEffect(() => {   
    axios.get(BASE_URL + '/assembly/fetchTableEdit', {
        params: {
          id: id
        }
      })
    .then(res => {
      console.log("DATA ASSEMBLY" + res.data)
      setCode(res.data[0].assembly_code);
      setName(res.data[0].assembly_name);
      setDesc(res.data[0].assembly_desc);
      setslct_category(res.data[0].category_code);
      setslct_binLocation(res.data[0].bin_id);
      setunitMeasurement(res.data[0].assembly_unitMeasurement);
      setslct_manufacturer(res.data[0].assembly_manufacturer);
      setThresholds(res.data[0].threshhold);
      setassemblyImages(res.data[0].assembly_images);
    })
      .catch(err => console.log(err));
  }, []);

  //Fetching to View all Supplier
  useEffect(() => {
    axios
      .get(BASE_URL + "/supplier/fetchTable")
      .then((res) => setFetchSupp(res.data))
      .catch((err) => console.log(err));
  }, []);

  //Fetching to View all Spare Parts
  useEffect(() => {
    axios
      .get(BASE_URL + "/sparePart/fetchTable")
      .then((res) => setFetchPart(res.data))
      .catch((err) => console.log(err));
  }, []);

  //Fetching to View all Sub Parts
  useEffect(() => {
    axios
      .get(BASE_URL + "/subPart/fetchtable")
      .then((res) => setFetchSub(res.data))
      .catch((err) => console.log(err));
  }, []);

    //Fetching to view all category
    useEffect(() => {
      axios.get(BASE_URL + '/category/fetchTable')
        .then(response => {
          setFetchcategory(response.data);
        })
        .catch(error => {
          console.error('Error fetching roles:', error);
        });
    }, []);
  
    useEffect(() => {
      axios.get(BASE_URL + '/binLocation/fetchTable')
        .then(response => {
          setbinLocation(response.data);
        })
        .catch(error => {
          console.error('Error fetching roles:', error);
        });
    }, []);
    
    useEffect(() => {
      axios.get(BASE_URL + '/manufacturer/retrieve')
        .then(response => {
          setManufacturer(response.data);
        })
        .catch(error => {
          console.error('Error fetching roles:', error);
        });
    }, []);

    
    const handlePriceChange = (index, value) => {
      const updatedTable = [...tableSupp];
      updatedTable[index].supplier_price = value;
    
      const serializedPriceDATA = addPriceInput.map((row) => {
        if (row.value === updatedTable[index].supplier_code) {
          return {
            ...row,
            price: value,
          };
        }
        return row;
      });
    
      setTableSupp(updatedTable);
      setaddPriceInputbackend(serializedPriceDATA);
      setIsSaveButtonDisabled(false);
      // Return the updatedInputs to be used as the new state
      return updatedTable;
    };

  const handleSelectChange = (selectedOptions) => {
    setaddPriceInputbackend(selectedOptions);
    const updatedTable = [
      ...tableSupp.filter((row) => selectedOptions.some((option) => option.value === row.supplier_code)),
      ...selectedOptions
        .filter((option) => !tableSupp.some((row) => row.supplier_code === option.value))
        .map((option) => ({
          supplier_code: option.value,
          supplier: {
            supplier_name: option.label.split('/ Name: ')[1].trim(),
            supplier_code: option.suppcodes,
            supplier_email: option.email,
            supplier_number: option.number,
            supplier_address: option.address,
            supplier_receiving: option.receiving,
          },
        })),
    ];
  
    setTableSupp(updatedTable);
  };

  //Fetching For Association of Assembly and Supplier
  useEffect(() => {
    axios.get(BASE_URL + '/supplier_assembly/fetchAssigned', {
      params: {
        id: id
      }
    })
      .then(res => {
        const data = res.data;
        setTableSupp(data);
        const selectedAssemblySuppOptions = data.map((row) => ({
          value: row.supplier.supplier_code,
          label: `Supplier Code: ${row.supplier_code} / Name: ${row.supplier.supplier_name}`,
          price: row.supplier_price,
        }));
        setaddPriceInputbackend(selectedAssemblySuppOptions);
      })
      .catch(err => console.log(err));
  }, [id]);

  //Fetching For Association of Assembly and Spare Part
  useEffect(() => {
    axios.get(BASE_URL + '/spare_assembly/fetchinTable', {
      params: {
        id: id
      }
    })
      .then(res => {
        const data = res.data;
        const selectedSpareparts = data.map((row) => ({
          value: row.sparePart_id,
          label: row.sparePart.spareParts_name,
        }));
        setSpareParts(selectedSpareparts);
      })
      .catch(err => console.log(err));
  }, [id]);


  //Fetching For Association of Assembly and Subpart
  useEffect(() => {
    axios.get(BASE_URL + '/assembly_subparts/fetchinTable', {
      params: {
        id: id
      }
    })
      .then(res => {
        const data = res.data;
        const selectedSubparts = data.map((row) => ({
          value: row.subPart_id,
          label: row.subPart.subPart_name,
        }));
        setSubParts(selectedSubparts);
      })
      .catch(err => console.log(err));
  }, [id]);



  const handleAddSupp = () => {
    setShowDropdown(true);
  };

  const handleEditClick = () => {
    setReadOnly(true);
  };

  //input for assembly code
const handleAssemblyCode = (event) => {
  setCode(event.target.value);
  setIsSaveButtonDisabled(false);
};

//input for assembly name
const handleassemblyname = (event) => {
  setName(event.target.value);
  setIsSaveButtonDisabled(false);
};

//input for assembly description
const handleassemblydescription = (event) => {
  setDesc(event.target.value);
  setIsSaveButtonDisabled(false);
};

//input for assembly threshold
const handleassemblythreshold = (event) => {
  setThresholds(event.target.value);
  setIsSaveButtonDisabled(false);
};

  //for onchange dropdown of spareparts
  const handleSparepartChange = (selectedSpareOptions) => {
    setSpareParts(selectedSpareOptions);
    setIsSaveButtonDisabled(false);
  };

  const handleSubpartChange = (selectedSubOptions) => {
    setSubParts(selectedSubOptions);
    setIsSaveButtonDisabled(false);
  };
  
  const handleFormChangeBinLocation = (event) => {
    setslct_binLocation(event.target.value);
    setIsSaveButtonDisabled(false);
  };
  
  const handleChangeMeasurement = (event) => {
    setunitMeasurement(event.target.value);
    setIsSaveButtonDisabled(false);
  };
  
  const handleFormChangeManufacturer = (event) => {
    setslct_manufacturer(event.target.value);
    setIsSaveButtonDisabled(false);
  };

  // for Catergory on change function
  const handleFormChangeCategory = (event) => {
    setslct_category(event.target.value);
    setIsSaveButtonDisabled(false);
  };

  //Update
  const update = async (e) => {
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
      axios
        .post(`${BASE_URL}/assembly/update`, null, {
          params: {
            id,
            code,
            name,
            desc,
            spareParts,
            Subparts,
            unitMeasurement,
            slct_manufacturer,
            slct_binLocation,
            thresholds,
            addPriceInput
          },
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            swal({
              title: "The Assembly Update Succesful!",
              text: "The Assembly has been Updated Successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate("/assemblyForm");
            });
          } else if (res.status === 201) {
            swal({
              title: "Assembly is Already Exist",
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

  return (
    <div className="main-of-containers">
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
                {/* {
                  assemblyimage.length > 0 && assemblyimage.map((image) => (
                    <img src={`data:image/png;base64,${image.assembly_image}`} alt={`assembly-img-${image.id}`}/>
                  ))
                } */}

              {assemblyimage.length > 0 && (
                <Carousel data-bs-theme="dark" interval={3000} wrap={true} className="custom-carousel">
                  {assemblyimage.map((image, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="carousel-image"
                        src={`data:image/png;base64,${image.assembly_image}`}
                        alt={`assembly-img-${image.id}`}
                      />
                      <Carousel.Caption>{/* Caption content */}</Carousel.Caption>
                    </Carousel.Item>
                  ))}
                </Carousel>
              )}
            </div>

            <div className="row">
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Assembly Code:{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    value={code}
                    readOnly={!isReadOnly}
                    onChange={(e) => handleAssemblyCode(e)}
                    type="text"
                    placeholder="Enter item name"
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Item Name:{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    value={name}
                    readOnly={!isReadOnly}
                    onChange={(e) => handleassemblyname(e)}
                    type="text"
                    placeholder="Enter item name"
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
                <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: '20px' }}>Category: </Form.Label>
                  <Form.Select 
                    aria-label="" 
                    onChange={handleFormChangeCategory}
                    required
                    style={{ height: '40px', fontSize: '15px' }}
                    value={slct_category}
                    disabled={!isReadOnly}>
                      <option disabled value=''>
                          Select Category ...
                      </option>
                        {fetchcategory.map(category => (
                          <option key={category.category_code} value={category.category_code}>
                            {category.category_name}
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
                        Spare Parts:{" "}
                      </Form.Label>
                      <Select
                        isMulti
                        options={fetchSparePart.map((sparePart) => ({
                          value: sparePart.id,
                          label: sparePart.spareParts_name,
                        }))}
                        onChange={handleSparepartChange}
                        value={spareParts}
                        isDisabled={!isReadOnly}
                      />
                  </Form.Group>
                </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                    <Form.Label style={{ fontSize: '20px' }}>Sub-Part: </Form.Label>
                    <Select
                      isMulti
                      isDisabled={!isReadOnly}
                      options={fetchSub.map((subPart) => ({
                        value: subPart.id,
                        label: subPart.subPart_name ,
                      }))}
                      onChange={handleSubpartChange}
                      value={Subparts}
                    />
                  </Form.Group>
              </div>
            </div>

              <div className="row">
                  <div className="col-4">
                      <Form.Group controlId="exampleForm.ControlInput2">
                        <Form.Label style={{ fontSize: '20px' }}>Bin Location: </Form.Label>
                        <Form.Select 
                          disabled={!isReadOnly}
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
                                    <strong>{binLocation.bin_name + "-"}</strong>
                                    <strong>{binLocation.bin_subname}</strong>
                                </option>
                              ))}
                        </Form.Select>
                      </Form.Group>
                  </div>
                  <div className="col-4">
                    <Form.Group controlId="exampleForm.ControlInput2">
                      <Form.Label style={{ fontSize: '20px' }}>Unit of Measurment: </Form.Label>
                      <Form.Select
                        disabled={!isReadOnly}
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
                <div className="col-4">
                    <Form.Group controlId="exampleForm.ControlInput2">
                      <Form.Label style={{ fontSize: '20px' }}>Manufacturer: </Form.Label>
                      <Form.Select 
                        disabled={!isReadOnly}
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
              </div>


                        <div className="row">
                          <Form.Group controlId="exampleForm.ControlInput1">
                            <Form.Label style={{ fontSize: "20px" }}>Details: </Form.Label>
                            <Form.Control
                              value={desc}
                              readOnly={!isReadOnly}
                              onChange={(e) => handleassemblydescription(e)}
                              as="textarea"
                              placeholder="Enter details name"
                              style={{ height: "100px", fontSize: "15px" }}
                            />
                          </Form.Group>
                        </div>

                        <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '30px' }}>
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
                                <Form.Control  disabled={!isReadOnly} 
                                value={thresholds} 
                                onChange={(e) => handleassemblythreshold(e)} 
                                type="number" 
                                style={{height: '40px', fontSize: '15px'}}/>
                                </Form.Group>
                            </div>
                            {/* <div className="col-6">

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
                                  <table>
                                    <thead>
                                      <tr>
                                        <th className='tableh'>Supplier Code</th>
                                        <th className='tableh'>Name</th>
                                        <th className='tableh'>Email</th>
                                        <th className='tableh'>Contact</th>
                                        <th className='tableh'>Address</th>
                                        <th className='tableh'>Receiving Area</th>
                                        <th className='tableh'>Price</th>
                                        <th className='tableh'>VAT</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                        {tableSupp.length > 0 ? (
                                          tableSupp.map((data, i) => (
                                            <tr key={i}>
                                              <td>{data.supplier_code}</td>
                                              <td>{data.supplier.supplier_name}</td>
                                              <td>{data.supplier.supplier_email}</td>
                                              <td>{data.supplier.supplier_number}</td>
                                              <td>{data.supplier.supplier_address}</td>
                                              <td>{data.supplier.supplier_receiving}</td>
                                              <td>
                                                <div className="d-flex align-items-center">
                                                  <span style={{ fontSize: '20px', marginRight: '5px' }}>
                                                    ₱
                                                  </span>
                                                  <Form.Control
                                                    type="number"
                                                    style={{ height: "35px", fontSize: '14px', fontFamily: 'Poppins, Source Sans Pro'}}
                                                    value={data.supplier_price || ''}
                                                    readOnly={!isReadOnly}
                                                    onChange={(e) => handlePriceChange(i, e.target.value)}/>
                                                </div>
                                              </td>
                                              <td>
                                              { (data.supplier.supplier_vat / 100 * data.supplier_price).toFixed(2) }
                                              </td>
                                            </tr>
                                          ))
                                        ) : (
                                          <tr>
                                            <td colSpan="6" style={{ textAlign: "center" }}>
                                              No Supplier selected
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>

                                    {showDropdown && (
                                        <div className="dropdown mt-3">
                                           <Select
                                                isMulti
                                                options={fetchSupp.map((supplier) => ({
                                                  value: supplier.supplier_code,
                                                  label: `Supplier Code: ${supplier.supplier_code} / Name: ${supplier.supplier_name}`,
                                                  suppcodes: supplier.supplier_code,
                                                  email: supplier.supplier_email, 
                                                  number: supplier.supplier_number, 
                                                  address: supplier.supplier_address,
                                                  receiving: supplier.supplier_receiving,
                                                  vatable: supplier.supplier_vat
                                                }))}
                                                value={addPriceInput}
                                                onChange={handleSelectChange}
                                              />
                                        </div>
                                      )}

                                      
                                      {isReadOnly && (
                                        <Button
                                        variant="outline-warning"
                                        onClick={handleAddSupp}
                                        size="md"
                                        style={{ fontSize: '15px', marginTop: '10px' }}
                                          
                                        >
                                          Add Supplier
                                        </Button>
                                        )}
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
                                disabled={isSaveButtonDisabled}
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