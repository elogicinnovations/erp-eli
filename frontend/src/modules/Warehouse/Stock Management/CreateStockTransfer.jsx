import React, { useEffect, useState } from 'react';
import Sidebar from '../../Sidebar/sidebar';
import '../../../assets/global/style.css';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/react-style.css';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import subwarehouse from "../../../assets/global/subwarehouse";
import {
    ArrowCircleLeft,
    Plus,
    Paperclip,
    DotsThreeCircle,
    CalendarBlank,
    PlusCircle
  } from "@phosphor-icons/react";
import axios from 'axios';
import BASE_URL from '../../../assets/global/url';
import swal from 'sweetalert';

import * as $ from 'jquery';

function CreateStockTransfer() {
    
    const data = [
    {
        status: 'Pending',
        samA: 'asd',
        samB: 'asd',
        samC: 'asd',
        samD: 'asd',
        samE: 'asd',
    },
    {
        status: 'Pending',
        samA: 'asd',
        samB: 'asd',
        samC: 'asd',
        samD: 'asd',
        samE: 'asd',
    },
    {
        status: 'Pending',
        samA: 'asd',
        samB: 'asd',
        samC: 'asd',
        samD: 'asd',
        samE: 'asd',
    },
    ]

  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [rotatedIcons, setRotatedIcons] = useState(Array(data.length).fill(false));
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const [slct_masterlist, setslct_masterlist] = useState([]); // for getting the value of selected masterlist
  
  const [dateNeeded, setDateNeeded] = useState(null);

  


  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  
  const handleClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if ($('#order-listing').length > 0) {
      $('#order-listing').DataTable();
    }
  }, []);

  useEffect(() => {
    if ($('#order2-listing').length > 0) {
      $('#order2-listing').DataTable();
    }
  }, []);

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

  const [select_masterlist, setSelect_Masterlist] = useState([]);
  const handleFormChangeMasterList = (event) => { setSelect_Masterlist(event.target.value);};
  const [remarks, setRemarks] = useState();
  const [prNum, setPrNum] = useState('');
  const [fetchProduct, setFetchProduct] = useState([]);
  const [fetchAssembly, setFetchAssembly] = useState([]);
  const [fetchSpare, setFetchSpare] = useState([]);
  const [fetchSubPart, setFetchSubPart] = useState([]);
  const [product, setProduct] = useState([]);

  //for supplier selection values
const selectProduct = (selectedOptions) => {
  setProduct(selectedOptions);
};



  useEffect(() => {
    axios.get(BASE_URL + '/product/fetchTable')
      .then(res => setFetchProduct(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    axios.get(BASE_URL + '/assembly/fetchTable')
      .then(res => setFetchAssembly(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    axios.get(BASE_URL + '/sparePart/fetchTable')
      .then(res => setFetchSpare(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    axios.get(BASE_URL + '/subpart/fetchTable')
      .then(res => setFetchSubPart(res.data))
      .catch(err => console.log(err));
  }, []);
  

  useEffect(() => {   
    axios.get(BASE_URL + '/StockTransfer/lastPRNumber')
    .then(res => {
      const prNumber = res.data !== null ? res.data : 0;
      
      // Increment the value by 1
      setPrNum(prNumber + 1);
    })
    .catch(err => console.log(err));
  }, []);

  const displayDropdown = () => {
    setShowDropdown(true);
  };
  

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
                    <Link style={{ fontSize: '1.5rem' }} to="/stockManagement">
                        <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                    </Link>
                    <h1>
                    Create Stock Transfer
                    </h1>
                </div>
                </Col>
            </Row>
                        <Form>
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
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Reference code: </Form.Label>
                                <Form.Control readOnly type="text" value={prNum}  style={{height: '40px', fontSize: '15px'}}/>
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
                                                <th className='tableh'>U/M</th>
                                                <th className='tableh'>Source</th>
                                                <th className='tableh'>Stock</th>
                                                <th className='tableh'>Quantity</th>
                                                <th className='tableh'>Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {showDropdown && (
                                        <div className="dropdown mt-3">
                                          <Select
                                                  isMulti
                                                  options={fetchProduct.map(prod => ({
                                                    value: `${prod.product_id}_${prod.product_code}_Product`, // Indicate that it's a product
                                                    label: <div>
                                                      Product Code: <strong>{prod.product_code}</strong> / 
                                                      Product Name: <strong>{prod.product_name}</strong> / 
                                                    </div>,
                                                    type: 'Product',
                                                    values: prod.product_id,
                                                    code: prod.product_code,
                                                    name: prod.product_name,
                                                    created: prod.createdAt
                                                  }))
                                                  .concat(fetchAssembly.map(assembly => ({
                                                    value: `${assembly.id}_${assembly.assembly_code}_Assembly`, // Indicate that it's an assembly
                                                    label: <div>
                                                      Assembly Code: <strong>{assembly.assembly_code}</strong> / 
                                                      Assembly Name: <strong>{assembly.assembly_name}</strong> / 
                                                    </div>,
                                                    type: 'Assembly',
                                                    values: assembly.id,
                                                    code: assembly.assembly_code,
                                                    name: assembly.assembly_name,
                                                    created: assembly.createdAt
                                                  })))
                                                  .concat(fetchSpare.map(spare => ({
                                                    value: `${spare.id}_${spare.spareParts_code}_Spare`, // Indicate that it's an assembly
                                                    label: <div>
                                                      Product Part Code: <strong>{spare.spareParts_code}</strong> / 
                                                      Product Part Name: <strong>{spare.spareParts_name}</strong> / 
                                                    </div>,
                                                    type: 'Spare',
                                                    values: spare.id,
                                                    code: spare.spareParts_code,
                                                    name: spare.spareParts_name,
                                                    created: spare.createdAt
                                                  })))
                                                  .concat(fetchSubPart.map(subPart => ({
                                                    value: `${subPart.id}_${subPart.subPart_code}_SubPart`, // Indicate that it's an assembly
                                                    label: <div>
                                                      Product Sub-Part Code: <strong>{subPart.subPart_code}</strong> / 
                                                      Product Sub-Part Name: <strong>{subPart.subPart_name}</strong> / 
                                                    </div>,
                                                    type: 'SubPart',
                                                    values: subPart.id,
                                                    code: subPart.subPart_code,
                                                    name: subPart.subPart_name,
                                                    created: subPart.createdAt
                                                  })))
                                                }
                                                  onChange={selectProduct}
                                                />

                                        </div>
                                      )}
                                        </tbody>
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
                        <Button type='submit'  className='btn btn-warning' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Approve</Button>
                        <Link to="/stockManagement" className='btn btn-secondary btn-md' size="md" style={{ fontSize: '20px', margin: '0px 5px'  }}>
                            Cancel
                        </Link>
                        </div>
                        
        
                        </Form>
                       
            </div>
        </div>
    </div>
  )
}

export default CreateStockTransfer
