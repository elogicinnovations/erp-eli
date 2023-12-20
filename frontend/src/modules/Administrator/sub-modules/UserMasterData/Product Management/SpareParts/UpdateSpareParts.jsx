import React, {useState, useEffect} from 'react'
import Sidebar from '../../../../../Sidebar/sidebar';
import '../../../../../../assets/global/style.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../../../../../styles/react-style.css';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import BASE_URL from '../../../../../../assets/global/url';
import cls_unit from '../../../../../../assets/global/unit';
import cls_unitMeasurement from '../../../../../../assets/global/unitMeasurement';
import swal from 'sweetalert';
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import {
  NotePencil,
} from "@phosphor-icons/react";


function UpdateSpareParts() {

const [validated, setValidated] = useState(false);
const [fetchSupp, setFetchSupp] = useState([]); 
const [fetchSubPart, setFetchSubPart] = useState([]);
const [code, setCode] = useState('');
const [name, setName] = useState('');
const [supp, setSupp] = useState([]);
const [desc, setDesc] = useState('');
const [priceInput, setPriceInput] = useState({});
const [addPriceInput, setaddPriceInputbackend] = useState([]);

const [tableSupp, setTableSupp] = useState([]);

const [unit, setunit] = useState('');
const [slct_binLocation, setslct_binLocation] = useState([]);
const [binLocation, setbinLocation] = useState([]); 
const [unitMeasurement, setunitMeasurement] = useState('');
const [slct_manufacturer, setslct_manufacturer] = useState([]);
const [manufacturer, setManufacturer] = useState([]);
const [thresholds, setThresholds] = useState('');

const [SubParts, setSubParts] = useState([]);
const [showDropdown, setShowDropdown] = useState(false);
const [isReadOnly, setReadOnly] = useState(false);

const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);//for disabled of Save button
const navigate = useNavigate();
const { id } = useParams();

//para sa mga input textfieldd fetch
useEffect(() => {
  axios.get(BASE_URL + '/sparePart/fetchTableEdit', {
    params: {
      id: id
    }
  })
    .then(res => {
      setCode(res.data[0].spareParts_code);
      setName(res.data[0].spareParts_name);
      setDesc(res.data[0].spareParts_desc);
      setunit(res.data[0].spareParts_unit);
      setslct_binLocation(res.data[0].spareParts_location);
      setunitMeasurement(res.data[0].spareParts_unitMeasurement);
      setslct_manufacturer(res.data[0].spareParts_manufacturer);
      setThresholds(res.data[0].threshhold);
    })
    .catch(err => console.log(err));
}, [id]);


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
};

//for supplier selection values
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
  setIsSaveButtonDisabled(false);
};

//fetch the supplier spareparts in table
useEffect(() => {
  axios.get(BASE_URL + '/supp_SparePart/fetchTableEdit', {
    params: {
      id: id
    }
  })
    .then(res => {
      const data = res.data;
      setTableSupp(data);
      const selectedOptions = data.map((row) => ({
        value: row.supplier.supplier_code,
        label: `Supplier Code: ${row.supplier_code} / Name: ${row.supplier.supplier_name}`,
        price: row.supplier_price,
      }));
      setaddPriceInputbackend(selectedOptions);
    })
    .catch(err => console.log(err));
}, [id]);

//for fetch the selected subpart on dropdown
useEffect(() => {
  axios.get(BASE_URL + '/subPart_SparePart/fetchsubpartTable', {
    params: {
      id: id
    }
  })
    .then(res => {
      const data = res.data;
      // setFetchSubPart(data);
      const selectedSubparts = data.map((row) => ({
        value: row.subPart_id,
        label: row.subPart.subPart_name,
      }));
      setSubParts(selectedSubparts);
    })
    .catch(err => console.log(err));
}, [id]);


useEffect(() => {
  axios.get(BASE_URL + '/supplier/fetchTable')
    .then(res => setFetchSupp(res.data))
    .catch(err => console.log(err));
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


useEffect(() => {
  axios.get(BASE_URL + '/subPart/fetchTable')
    .then(res => setFetchSubPart(res.data))
    .catch(err => console.log(err));
}, []);


const handleSelectChange_SubPart = (selectedOptions) => {
  setSubParts(selectedOptions);
};

const handleEditClick = () => {
  // for clicking the button can be editted not readonly
  setReadOnly(true);
};

const handleAddSupp = () => {
  setShowDropdown(true);
};

const handleChangeUnit = (event) => {
  setunit(event.target.value);
};

const handleFormChangeBinLocation = (event) => {
  setslct_binLocation(event.target.value);
};

const handleChangeMeasurement = (event) => {
  setunitMeasurement(event.target.value);
};

const handleFormChangeManufacturer = (event) => {
  setslct_manufacturer(event.target.value);
};

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
      .post(`${BASE_URL}/sparePart/update`, null, {
        params: {
          id,
          code,
          name,
          desc,
          SubParts,
          addPriceInput,
          unit,
          unitMeasurement,
          slct_manufacturer,
          slct_binLocation,
          thresholds,    
        },
      })
      .then((res) => {
        // console.log(res);
        if (res.status === 200) {
          swal({
            title: "The Spare Part sucessfully updated!",
            text: "The Spare Part has been updated successfully.",
            icon: "success",
            button: "OK",
          }).then(() => {
            navigate("/spareParts");
            setIsSaveButtonDisabled(true);
          });
        } else if (res.status === 201) {
          swal({
            icon: "error",
            title: "Spare Part Already Exist",
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
console.log(addPriceInput)

  return (
    <div className="main-of-containers">
        <div className="right-of-main-containers">
            <div className="right-body-contents-a"> 
            
                <div className='d-flex flex-direction-row'>
                    <h1>Update Spare Parts</h1>
                </div>
               
                <Form noValidate validated={validated} onSubmit={update}>
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
                                <Form.Control disabled={!isReadOnly} value={code} onChange={(e) => setCode(e.target.value) } required type="text" placeholder="Enter item code" style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-4">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Name: </Form.Label>
                                <Form.Control type="text" value={name} disabled={!isReadOnly}  onChange={(e) => setName(e.target.value) } required placeholder="Enter item name" style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-4">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Sub-Part: </Form.Label>

                                  <Select
                                    isMulti
                                    isDisabled={!isReadOnly}
                                    options={fetchSubPart.map((subPart) => ({
                                      value: subPart.id,
                                      label: subPart.subPart_name , // Set label to subPart_name for options
                                    }))}
                                    onChange={handleSelectChange_SubPart}
                                    value={SubParts}
                                  />

                                </Form.Group>
                              </div>
                          </div>

                          <div className="row">
                              <div className="col-6">
                                  <Form.Group controlId="exampleForm.ControlInput2">
                                    <Form.Label style={{ fontSize: '20px' }}>Unit: </Form.Label>
                                    <Form.Select
                                      disabled={!isReadOnly}
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
                          </div>

                          <div className="row">
                              <div className="col-6">
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
                              <div className="col-6">
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
                                <Form.Label style={{ fontSize: '20px' }}>Details: </Form.Label>
                                <Form.Control disabled={!isReadOnly} value={desc} onChange={(e) => setDesc(e.target.value) } as="textarea"placeholder="Enter details name" style={{height: '100px', fontSize: '15px'}}/>
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
                                <Form.Control  disabled={!isReadOnly} value={thresholds} onChange={(e) => setThresholds(e.target.value)} type="number" style={{height: '40px', fontSize: '15px'}}/>
                                </Form.Group>
                            </div>
                            {/* <div className="col-6">
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
                                    {tableSupp.map((data,i) =>(
                                        <tr key={i}>
                                          <td>{data.supplier_code}</td>
                                          <td>{data.supplier.supplier_name}</td>
                                          <td>{data.supplier.supplier_email}</td>
                                          <td>{data.supplier.supplier_number}</td>
                                          <td>{data.supplier.supplier_address}</td>
                                          <td>{data.supplier.supplier_receiving}</td>
                                          <td>
                                            <span style={{ fontSize: '20px', marginRight: '5px' }}>₱</span>
                                            <input
                                              type="number"
                                              style={{ height: '50px' }}
                                              value={data.supplier_price || ''}
                                              readOnly={!isReadOnly}
                                              onChange={(e) => handlePriceChange(i, e.target.value)}
                                            />
                                          </td>
                                        </tr>
                                      ))}

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
                        <div className='save-cancel'>
                        {isReadOnly && (
                          <Button type='submit' disabled={isSaveButtonDisabled} className='btn btn-warning' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Update</Button>
                        )    
                      
                        }
                        {!isReadOnly && (
                          <Button type='Button' onClick={handleEditClick} className='btn btn-success' size="s" style={{ fontSize: '20px', margin: '0px 5px' }}><NotePencil/>Edit</Button>
                        )}
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

export default UpdateSpareParts