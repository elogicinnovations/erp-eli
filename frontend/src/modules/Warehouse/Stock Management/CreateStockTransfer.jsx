import React, { useEffect, useState } from 'react';
import Sidebar from '../../Sidebar/sidebar';
import '../../../assets/global/style.css';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/react-style.css';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import subwarehouse from "../../../assets/global/subwarehouse";
import {
    ArrowCircleLeft,
    Plus,
    CalendarBlank
  } from "@phosphor-icons/react";
import axios from 'axios';
import BASE_URL from '../../../assets/global/url';
import swal from 'sweetalert';

function CreateStockTransfer() {
  const navigate = useNavigate()

  const [source, setSource] = useState();
  const [destination, setDestination] = useState('');
  const [reference_code, setReferenceCode] = useState('');
  const [remarks, setRemarks] = useState('');
  
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

  const [selectedWarehouse, setSelectedWarehouse] = useState('');


  const [col_id, setSelect_Masterlist] = useState([]);
  const handleFormChangeMasterList = (event) => { setSelect_Masterlist(event.target.value);};
  const handleFormSourceWarehouse = (event) => { setSelectedWarehouse(event.target.value)};
  const handleFormDestinationWarehouse = (event) => { setDestination(event.target.value)};

  const [masterList, setMasteList] = useState([]); 
  useEffect(() => {
    axios.get(BASE_URL + '/masterList/masterTable')
      .then(response => {
        setMasteList(response.data);
      })
      .catch(error => {
        console.error('Error fetching master list:', error);
      });
  }, []);


  useEffect(() => {
    axios.get(BASE_URL + '/inventory/fetchInvetory_product_warehouse', {
      params: {
        warehouse: selectedWarehouse,
      },
    })
      .then(res => setFetchProduct(res.data))
      .catch(err => console.log(err));
  }, [selectedWarehouse]);

  useEffect(() => {
    axios.get(BASE_URL + '/inventory/fetchInvetory_assembly_warehouse', {
      params: {
        warehouse: selectedWarehouse,
      },
    })
      .then(res => setFetchAssembly(res.data))
      .catch(err => console.log(err));
  }, [selectedWarehouse]);

  useEffect(() => {
    axios.get(BASE_URL + '/inventory/fetchInvetory_spare_warehouse', {
      params: {
        warehouse: selectedWarehouse,
      },
    })
      .then(res => setFetchSpare(res.data))
      .catch(err => console.log(err));
  }, [selectedWarehouse]);

  useEffect(() => {
    axios.get(BASE_URL + '/inventory/fetchInvetory_subpart_warehouse', {
      params: {
        warehouse: selectedWarehouse,
      },
    })
      .then(res => setFetchSubPart(res.data))
      .catch(err => console.log(err));
  }, [selectedWarehouse]);
  

const add = async (e) => {
  e.preventDefault();

  const form = e.currentTarget;
  if (form.checkValidity() === false) {
    e.preventDefault();
    e.stopPropagation();
    swal({
      icon: 'error',
      title: 'Fields are required',
      text: 'Please fill the red text fields',
    });
  } else {
    try {
      const response = await axios.post(`${BASE_URL}/StockTransfer/create`, {
        selectedWarehouse,
        destination,
        reference_code,
        col_id,
        remarks,
        addProductbackend,
      });

      console.log(response);

      if (response.status === 200) {
        swal({
          title: 'The Stock Transfer request was successful!',
          text: 'The Stock Transfer has been added successfully.',
          icon: 'success',
          button: 'OK',
        }).then(() => {
          navigate('/stockTransfer');
        });
      } else {
        swal({
          icon: 'error',
          title: 'Something went wrong',
          text: 'Please contact our support',
        });
      }
    } catch (error) {
      console.error(error);

      swal({
        icon: 'error',
        title: 'Request failed',
        text:
          error.response?.data?.error ||
          'Please select a Product to request!',
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
    quantity: inputValues[product.value]?.quantity || '',
    desc: inputValues[product.value]?.desc || '',
  }));

  setAddProductbackend(serializedProducts);

  console.log("Selected Products:", serializedProducts);
  
}, [inputValues, product]);


   //date format
function formatDatetime(datetime) {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Date(datetime).toLocaleString('en-US', options);
}

  return (
    <div className="main-of-containers">
        {/* <div className="left-of-main-containers">
            <Sidebar/>
        </div> */}
        <div className="right-of-main-containers">
            <div className="right-body-contents-a">
            <Row>
                
                <Col>
                <div className='create-head-back' style={{display: 'flex', alignItems: 'center'}}>
                    <Link style={{ fontSize: '1.5rem' }} to="/purchaseRequest">
                        <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                    </Link>
                    <h1>
                    Transfer Stock
                    </h1>
                </div>
                    <p1>Purchasing please purchase the following item enumerated below </p1>
                </Col>
            </Row>
              <Form noValidate validated={validated} onSubmit={add}>
              <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '20px' }}>
                          General Information
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '81%',
                              left: '17.8rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                          <div className="row mt-3">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput2">
                              <Form.Label style={{ fontSize: '20px' }}>Source: </Form.Label>   
                                  <Form.Select 
                                      aria-label=""
                                      required
                                      style={{ height: '40px', fontSize: '15px' }}
                                      onChange={handleFormSourceWarehouse}
                                      defaultValue=''
                                    >
                                        <option disabled value=''>
                                          Select Site
                                        </option>
                                        {subwarehouse.map((name, index) => (
                                        <option key={index} value={name}>
                                            {name}
                                        </option>
                                        ))}
                                    </Form.Select>
                              </Form.Group>
                                </div>
                                <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput2">
                              <Form.Label style={{ fontSize: '20px' }}>Destination: </Form.Label>   
                                  <Form.Select 
                                      aria-label=""
                                      required
                                      style={{ height: '40px', fontSize: '15px' }}
                                      onChange={handleFormDestinationWarehouse}
                                      defaultValue=''
                                    >
                                        <option disabled value=''>
                                          Select Site
                                        </option>
                                        {subwarehouse.map((name, index) => (
                                        <option key={index} value={name}>
                                            {name}
                                        </option>
                                        ))}
                                    </Form.Select>
                              </Form.Group>
                                </div>
                          </div>
                        <div className="row">
                        <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Reference code: </Form.Label>
                                <Form.Control readOnly type="text" value={reference_code}  style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput2">
                              <Form.Label style={{ fontSize: '20px' }}>Received By: </Form.Label>   
                              <Form.Select
                                    onChange={handleFormChangeMasterList} 
                                    required
                                    style={{ height: "40px", fontSize: "15px" }}
                                    defaultValue="">
                                    <option
                                      disabled
                                      value="">
                                      Select Employee
                                    </option>
                                    {masterList.map(masterList => (
                                          <option key={masterList.col_id} value={masterList.col_id}>
                                            {masterList.col_Fname}
                                          </option>
                                        ))}
                                    </Form.Select>
                              </Form.Group>
                                </div>
                        </div>
                        <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Remarks: </Form.Label>
                                <Form.Control as="textarea"placeholder="Enter details name" style={{height: '100px', fontSize: '15px'}} onChange={e => setRemarks(e.target.value)}/>
                            </Form.Group>

                        <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '20px' }}>
                          Product List
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '81%',
                              left: '10.7rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                        
                        
                            <div className="table-containss">
                                <div className="main-of-all-tables">
                                    <table id='order-listing'>
                                            <thead>
                                              <tr>
                                                  <th className='tableh'>Code</th>
                                                  <th className='tableh'>Product Name</th>
                                                  <th className='tableh'>UOM</th>
                                                  <th className='tableh'>Available</th>
                                                  <th className='tableh'>Quantity</th>                                           
                                                  <th className='tableh'>Date Created</th>
                                                  {/* <th className='tableh'>Description</th> */}
                                              </tr>
                                            </thead>
                                            <tbody>

                                            {product.length > 0 ? (
                                            product.map((product) => (
                                              <tr key={product.value}>
                                                <td >{product.code}</td>
                                                <td >{product.name}</td>  
                                                <td >{product.unit}</td>    
                                                <td >{product.available}</td>                                      
                                                <td > 
                                                  <div className='d-flex flex-direction-row align-items-center'>
                                                    <input
                                                      type="number"
                                                      value={inputValues[product.value]?.quantity || ''}
                                                      onChange={(e) => handleInputChange(e.target.value, product.value, 'quantity')}
                                                      required
                                                      placeholder="Input quantity"
                                                      style={{ height: '40px', width: '120px', fontSize: '15px' }}
                                                    />
                                                  </div>
                                                </td>
                                                <td >{formatDatetime(product.created)}</td>
                                                {/* <td >
                                                  <div className='d-flex flex-direction-row align-items-center'>
                                                    <input                                              
                                                      as="textarea"
                                                      value={inputValues[product.value]?.desc || ''}
                                                      onChange={(e) => handleInputChange(e.target.value, product.value, 'desc')}
                                                      placeholder="Input description"
                                                      style={{ height: '40px', width: '120px', fontSize: '15px' }}
                                                    />
                                                  </div>
                                                </td> */}
                                              </tr>
                                            ))
                                          ) : (
                                            <tr>
                                              <td>No Product selected</td>
                                            </tr>
                                          )}
                                                 
                                            </tbody>
                                        {showDropdown && (
                                        <div className="dropdown mt-3">
                                
                                                <Select
                                                  isMulti
                                                  options={fetchProduct.map(prod => ({
                                                    value: `${prod.product_tag_supplier.product.product_id}_${prod.product_tag_supplier.product.product_code}_Product`, // Indicate that it's a product
                                                    label: <div>
                                                      Product Code: <strong>{prod.product_tag_supplier.product.product_code}</strong> / 
                                                      Product Name: <strong>{prod.product_tag_supplier.product.product_name}</strong> / 
                                                      Quantity: <strong>{prod.quantity}</strong> 
                                                    </div>,
                                                    type: 'Product',
                                                    values: prod.product_tag_supplier.product.product_id,
                                                    code: prod.product_tag_supplier.product.product_code,
                                                    name: prod.product_tag_supplier.product.product_name,
                                                    unit: prod.product_tag_supplier.product.product_unitMeasurement,
                                                    avaliable: prod.quantity,
                                                    created: prod.product_tag_supplier.product.createdAt
                                                  }))
                                                  .concat(fetchAssembly.map(assembly => ({
                                                    value: `${assembly.assembly_supplier.assembly.id}_${assembly.assembly_supplier.assembly.assembly_code}_Assembly`, // Indicate that it's an assembly
                                                    label: <div>
                                                      Assembly Code: <strong>{assembly.assembly_supplier.assembly.assembly_code}</strong> / 
                                                      Assembly Name: <strong>{assembly.assembly_supplier.assembly.assembly_name}</strong> /
                                                      Quantity: <strong>{assembly.quantity}</strong>  
                                                    </div>,
                                                    type: 'Assembly',
                                                    values: assembly.assembly_supplier.assembly.id,
                                                    code: assembly.assembly_supplier.assembly.assembly_code,
                                                    name: assembly.assembly_supplier.assembly.assembly_name,
                                                    unit: assembly.assembly_supplier.assembly.assembly_unitMeasurement,
                                                    available: assembly.quantity,
                                                    created: assembly.assembly_supplier.assembly.createdAt
                                                  })))
                                                  .concat(fetchSpare.map(spare => ({
                                                    value: `${spare.sparepart_supplier.sparePart.id}_${spare.sparepart_supplier.sparePart.spareParts_code}_Spare`, // Indicate that it's an assembly
                                                    label: <div>
                                                      Product Part Code: <strong>{spare.sparepart_supplier.sparePart.spareParts_code}</strong> / 
                                                      Product Part Name: <strong>{spare.sparepart_supplier.sparePart.spareParts_name}</strong> / 
                                                      Quantity: <strong>{spare.quantity}</strong>
                                                    </div>,
                                                    type: 'Spare',
                                                    values: spare.sparepart_supplier.sparePart.id,
                                                    code: spare.sparepart_supplier.sparePart.spareParts_code,
                                                    name: spare.sparepart_supplier.sparePart.spareParts_name,
                                                    unit: spare.sparepart_supplier.sparePart.spareParts_unitMeasurement,
                                                    available: spare.quantity,
                                                    created: spare.sparepart_supplier.sparePart.createdAt
                                                  })))
                                                  .concat(fetchSubPart.map(subPart => ({
                                                    value: `${subPart.subpart_supplier.subPart.id}_${subPart.subpart_supplier.subPart.subPart_code}_SubPart`, // Indicate that it's an assembly
                                                    label: <div>
                                                      Product Sub-Part Code: <strong>{subPart.subpart_supplier.subPart.subPart_code}</strong> / 
                                                      Product Sub-Part Name: <strong>{subPart.subpart_supplier.subPart.subPart_name}</strong> / 
                                                      Quantity: <strong>{subPart.quantity}</strong>
                                                    </div>,
                                                    type: 'SubPart',
                                                    values: subPart.subpart_supplier.subPart.id,
                                                    code: subPart.subpart_supplier.subPart.subPart_code,
                                                    name: subPart.subpart_supplier.subPart.subPart_name,
                                                    unit: subPart.subpart_supplier.subPart.subPart_unitMeasurement,
                                                    available: subPart.quantity,
                                                    created: subPart.subpart_supplier.subPart.createdAt
                                                  })))
                                                }
                                                  onChange={selectProduct}
                                                />

                                        </div>
                                      )}
                                            <div className="item">
                                                <div className="new_item">
                                                    <button type="button" onClick={displayDropdown}>
                                                      <span style={{marginRight: '4px'}}>
                                                      </span>
                                                      <Plus size={20} /> New Item
                                                    </button>
                                                </div>
                                            </div>
                                    </table>
                                </div>
                            </div>
                        
                        <div className='save-cancel'>
                          <Button type='submit' className='btn btn-warning' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Save</Button>
                          <Link to='/stockTransfer' className='btn btn-secondary btn-md' size="md" style={{ fontSize: '20px', margin: '0px 5px'  }}>
                              Close
                          </Link>
                        </div>
                </Form>
                       
            </div>
        </div>
    </div>
  )
}

export default CreateStockTransfer
