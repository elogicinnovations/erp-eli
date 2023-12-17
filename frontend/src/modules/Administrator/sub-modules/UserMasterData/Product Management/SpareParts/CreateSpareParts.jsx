import React, {useState, useEffect} from 'react'
import Sidebar from '../../../../../Sidebar/sidebar';
import '../../../../../../assets/global/style.css';
import { Link, useNavigate } from 'react-router-dom';
import '../../../../../styles/react-style.css';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import BASE_URL from '../../../../../../assets/global/url';
import cls_unitMeasurement from "../../../../../../assets/global/unitMeasurement";
import cls_unit from "../../../../../../assets/global/unit";
import swal from 'sweetalert';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import {
    Plus,
    Trash,
    NotePencil,
  } from "@phosphor-icons/react";



function CreateSpareParts() {

  const [validated, setValidated] = useState(false);
  const [fetchSupp, setFetchSupp] = useState([]);
  const [fetchSubPart, setFetchSubPart] = useState([]);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [supp, setSupp] = useState([]);
  const [desc, setDesc] = useState('');
  const [thresholds, setThresholds] = useState("");
  const [manufacturer, setManufacturer] = useState([]);
  const [unit, setUnit] = useState("");
  const [binLocation, setbinLocation] = useState([]);
  const [slct_binLocation, setslct_binLocation] = useState("")
  const [slct_manufacturer, setslct_manufacturer] = useState("")
  const [unitMeasurement, setUnitMeasurement] = useState("")
  const [sparepriceInput, setsparePriceInput] = useState({});
  const [SpareaddPriceInput, setsparePriceInputbackend] = useState([]);
  // for display selected subPart in Table
  const [SubParts, setSubParts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);


const navigate = useNavigate();


useEffect(() => {
  axios.get(BASE_URL + '/supplier/fetchTable')
    .then(res => setFetchSupp(res.data))
    .catch(err => console.log(err));
}, []);

useEffect(() => {
  axios.get(BASE_URL + '/subPart/fetchTable')
    .then(res => setFetchSubPart(res.data))
    .catch(err => console.log(err));
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
  setSupp(selectedOptions);
};

const handleSelectChange_SubPart = (selectedOptions) => {
  setSubParts(selectedOptions);
};

const handleAddSupp = () => {
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
const handleSparePriceinput = (value, priceValue) => {
  setsparePriceInput((prevInputs) => {
    const updatedInputs = {
      ...prevInputs,
      [priceValue]: value,
    };

    // Use the updatedInputs directly to create the serializedProducts array
    const serializedPrice = supp.map((supp) => ({
      price: updatedInputs[supp.value] || '',
      code: supp.codes
      
    }));
    setsparePriceInputbackend(serializedPrice);
  
    console.log("Price Inputted:", serializedPrice);

    // Return the updatedInputs to be used as the new state
    return updatedInputs;
  });
};

const add = async e => {
  e.preventDefault();

  const form = e.currentTarget;
  if (form.checkValidity() === false) {
    e.preventDefault();
    e.stopPropagation();
  // if required fields has NO value
  //    console.log('requried')
      swal({
          icon: 'error',
          title: 'Fields are required',
          text: 'Please fill the red text fields'
        });
  }
  else{
    axios.post(`${BASE_URL}/sparePart/create`, {
      code,
      name, 
      desc, 
      SubParts, 
      SpareaddPriceInput,
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
          title: "Product Spare-Part Add Succesful!",
          text: "The Product Spare-Part has been Added Successfully.",
          icon: "success",
          button: "OK",
        }).then(() => {
          navigate("/spareParts");
        });
      } else if (res.status === 201) {
        swal({
          title: "Product Spare-Part is Already Exist",
          text: "Please Input a New Product Spare-Part ",
          icon: "error",
        });
      } else {
        swal({
          icon: "error",
          title: "Something went wrong",
          text: "Please contact our support",
        });
      }
    })

  }

  setValidated(true); //for validations

  
};

// React.useEffect(() => {
//     $(document).ready(function () {
//         $('#order-listing').DataTable();
//     });
//     }, []);

  return (
    <div className="main-of-containers">
        {/* <div className="left-of-main-containers">
            <Sidebar/>
        </div> */}
        <div className="right-of-main-containers">
            <div className="right-body-contents-a">
              <Form noValidate validated={validated} onSubmit={add}>
                <h1>Add Spare Parts</h1>
                <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '20px' }}>
                          General Information
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '81%',
                              left: '18rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                 
                          <div className="row mt-3">
                          <div className="col-4">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Code: </Form.Label>
                                <Form.Control onChange={(e) => setCode(e.target.value) } required type="text" placeholder="Enter item code" style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-4">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Name: </Form.Label>
                                <Form.Control type="text" onChange={(e) => setName(e.target.value) } required placeholder="Enter item name" style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-4">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                <Form.Label style={{ fontSize: '20px' }}>Subpart: </Form.Label>
                                  <Select
                                    isMulti
                                    options={fetchSubPart.map((subPart) => ({
                                      value: subPart.id,
                                      label: subPart.subPart_name,
                                    }))}
                                    onChange={handleSelectChange_SubPart}
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
                                <Form.Label style={{ fontSize: '20px' }}>Details: </Form.Label>
                                <Form.Control onChange={(e) => setDesc(e.target.value) } as="textarea"placeholder="Enter details name" style={{height: '100px', fontSize: '15px'}}/>
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
                        

                        <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '30px' }}>
                          Supplier List
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '85%',
                              left: '12rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
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
                                                <td>{supp.sparereceving}</td>
                                                <td>
                                                  <span style={{ fontSize: '20px', marginRight: '5px' }}>₱</span>
                                                    <input
                                                      type="number"
                                                      style={{height: '50px'}}
                                                      placeholder="Input Price"
                                                      value={sparepriceInput[supp.value] || ''}
                                                      onChange={(e) => handleSparePriceinput(e.target.value, supp.value)}
                                                      required
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
                                            options={fetchSupp.map(supp => ({
                                              value: supp.supplier_code,
                                              label: <div>
                                                    Supplier Code: <strong>{supp.supplier_code}</strong> / 
                                                    Name: <strong>{supp.supplier_name}</strong> 
                                                  </div>,
                                              codes: supp.supplier_code,
                                              names: supp.supplier_name,
                                              email: supp.supplier_email,
                                              contact: supp.supplier_number,
                                              address: supp.supplier_address,
                                              sparereceving: supp.supplier_receiving,
                                              price: supp.supplier_price
                                            }))}
                                            onChange={handleSelectChange}
                                          />
                                        </div>
                                      )}

                                      <Button
                                        variant="outline-warning"
                                        onClick={handleAddSupp}
                                        size="md"
                                        style={{ fontSize: '15px', marginTop: '10px' }}
                                      >
                                        Add Supplier
                                      </Button>
                                  </table>
                                </div>
                            </div>
                        </div>
                        <div className='save-cancel'>
                          <Button type='submit' className='btn btn-warning' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Save</Button>
                          <Link to='/spareParts' className='btn btn-secondary btn-md' size="md" style={{ fontSize: '20px', margin: '0px 5px'  }}>
                              Close
                          </Link>
                        </div>
                </Form>
            </div>
        </div>
    </div>
  )
}

export default CreateSpareParts