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
  
  const [dateNeeded, setDateNeeded] = useState(null);

  const toggleDropdown = (event, index) => {
    // Check if the clicked icon is already open, close it
    if (index === openDropdownIndex) {
      setRotatedIcons((prevRotatedIcons) => {
        const newRotatedIcons = [...prevRotatedIcons];
        newRotatedIcons[index] = !newRotatedIcons[index];
        return newRotatedIcons;
      });
      setShowDropdown(false);
      setOpenDropdownIndex(null);
    } else {
      // If a different icon is clicked, close the currently open dropdown and open the new one
      setRotatedIcons(Array(data.length).fill(false));
      const iconPosition = event.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: iconPosition.bottom + window.scrollY,
        left: iconPosition.left + window.scrollX,
      });
      setRotatedIcons((prevRotatedIcons) => {
        const newRotatedIcons = [...prevRotatedIcons];
        newRotatedIcons[index] = true;
        return newRotatedIcons;
      });
      setShowDropdown(true);
      setOpenDropdownIndex(index);
    }
  };


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

  return (
    <div className="main-of-containers">
        <div className="left-of-main-containers">
            <Sidebar/>
        </div>
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
                                            <option>
                                            </option>
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
                                            <option>
                                            </option>
                                    </Form.Select>
                              </Form.Group>
                                </div>
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Reference code: </Form.Label>
                                <Form.Control readOnly type="text" style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput2">
                              <Form.Label style={{ fontSize: '20px' }}>Received By: </Form.Label>   
                                  <Form.Select 
                                      aria-label=""
                                      required
                                      style={{ height: '40px', fontSize: '15px' }}
                                      defaultValue=''
                                    >
                                        <option disabled value=''>
                                          Select Employee
                                        </option>
                                            <option>
                                            </option>
                                    </Form.Select>
                              </Form.Group>
                                </div>
                          </div>
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Remarks: </Form.Label>
                                <Form.Control as="textarea"placeholder="Enter details name" style={{height: '100px', fontSize: '15px'}}/>
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
                                                  {data.map((data,i) =>(
                                                    <tr key={i}>
                                                    <td>{data.samA}</td>
                                                    <td>{data.samC}</td>
                                                    <td>{data.samC}</td>
                                                    <td>{data.samD}</td>
                                                    <td>{data.samE}</td>
                                                    <td>{data.samE}</td>
                                                    <td>
                                                    <DotsThreeCircle
                                                        size={32}
                                                        className="dots-icon"
                                                        style={{
                                                        cursor: 'pointer',
                                                        transform: `rotate(${rotatedIcons[i] ? '90deg' : '0deg'})`,
                                                        color: rotatedIcons[i] ? '#666' : '#000',
                                                        transition: 'transform 0.3s ease-in-out, color 0.3s ease-in-out',
                                                        }}
                                                        onClick={(event) => toggleDropdown(event, i)}
                                                    />
                                                    <div
                                                        className='choices'
                                                        style={{
                                                        position: 'fixed',
                                                        top: dropdownPosition.top - 30 + 'px',
                                                        left: dropdownPosition.left - 100 + 'px',
                                                        opacity: showDropdown ? 1 : 0,
                                                        visibility: showDropdown ? 'visible' : 'hidden',
                                                        transition: 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out',
                                                        boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
                                                        }}
                                                    >
                                                    <button className='btn'>
                                                    <Link to="/updatePurchaseRequest" style={{textDecoration: 'none', color: '#252129'}}>
                                                        Update
                                                        </Link>
                                                        </button>
                                                    <button className='btn'>Delete</button>
                                                    </div>
                                                    </td>
                                                    </tr>
                                                  ))}
                                        </tbody>
                                  <div className="item">
                                      <div className="new_item">
                                          <button onClick={handleShow} >
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
                        
        <Modal show={showModal} onHide={handleClose} size="xl">
          <Form>
            <Modal.Header closeButton>
              <Modal.Title style={{ fontSize: '24px' }}>Product List</Modal.Title>     
            </Modal.Header>
              <Modal.Body>
                        <div className="table-containss">
                            <div className="main-of-all-tables">
                                <table id='order2-listing'>
                                        <thead>
                                        <tr>
                                            <th className='tableh'>Code</th>
                                            <th className='tableh'>Product Name</th>
                                            <th className='tableh'>Category</th>
                                            <th className='tableh'>UOM</th>
                                            <th className='tableh'>Supplier</th>
                                            <th className='tableh'>Contact</th>
                                            <th className='tableh'>Price</th>
                                            <th className='tableh'></th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                                {data.map((data,i) =>(
                                                <tr key={i}>
                                                <td>{data.samA}</td>
                                                <td>{data.samC}</td>
                                                <td>{data.samD}</td>
                                                <td>{data.samE}</td>
                                                <td>{data.samE}</td>
                                                <td>{data.samE}</td>
                                                <td>{data.samE}</td>
                                                <td><button type='button' className='btn canvas'><PlusCircle size={32}/></button></td>
                                                </tr>
                                                ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" size="md" onClick={handleClose} style={{ fontSize: '20px' }}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="warning" size="md" style={{ fontSize: '20px' }}>
                        Save
                    </Button>
                </Modal.Footer>
            </Form>
          </Modal>
                        </Form>
                       
            </div>
        </div>
    </div>
  )
}

export default CreateStockTransfer
