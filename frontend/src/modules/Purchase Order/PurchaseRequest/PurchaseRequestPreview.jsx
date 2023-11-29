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
    DotsThreeCircle
  } from "@phosphor-icons/react";
import axios from 'axios';
import BASE_URL from '../../../assets/global/url';
import swal from 'sweetalert';

import * as $ from 'jquery';

function PurchaseRequestPreview() {

    const stat = [
        {
            status: 'Pending',
            date: '11/29/2023'
        }
    ]
    
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
                    <Link style={{ fontSize: '1.5rem' }} to="/purchaseRequest">
                        <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                    </Link>
                    <h1>
                    Purchase Request Preview
                    </h1>
                </div>
                    <p1>Purchasing please purchase the following item enumerated below </p1>
                </Col>
                <Col>
                <div className='Status' style={{display: 'flex', alignItems: 'center'}}>
                    
                {stat.map((data,i) =>(
                    <h4>
                        <div className="row">
                    Status: {data.status}
                    </div>
                        <div className="row">
                    Date Created: {data.date}
                    </div>
                    </h4>
                    ))}
                </div>
                </Col>
            </Row>
                        <Form>
                <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '20px' }}>
                          Purchase Information
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '81%',
                              left: '19rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>
                          <div className="row mt-3">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>PR No.: </Form.Label>
                                <Form.Control type="text" readOnly style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-3">
                            <Form.Group controlId="exampleForm.ControlInput2" className='datepick'>
                                <Form.Label style={{ fontSize: '20px' }}>Date Needed: </Form.Label>
                                  <DatePicker
                                    selected={dateNeeded}
                                    onChange={(date) => setDateNeeded(date)}
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText="Start Date"
                                    className="form-control"
                                  />
                            </Form.Group>
                              </div>
                          </div>
                        <div className="row">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>To be used for: </Form.Label>
                                <Form.Control type="text" style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-6">
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Remarks: </Form.Label>
                                <Form.Control as="textarea"placeholder="Enter details name" style={{height: '100px', fontSize: '15px'}}/>
                            </Form.Group>
                            </div>
                        </div>
                        <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '20px' }}>
                          Order Items
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
                                                <th className='tableh'>Item No.</th>
                                                <th className='tableh'>Quantity</th>
                                                <th className='tableh'>U/M</th>
                                                <th className='tableh'>Item</th>
                                                <th className='tableh'>Description</th>
                                                <th className='tableh'>Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                  {data.map((data,i) =>(
                                                    <tr key={i}>
                                                    <td>{data.samA}</td>
                                                    <td>
                                                      <Form.Group controlId="exampleForm.ControlInput2">
                                                          <Form.Select 
                                                              aria-label=""
                                                              required
                                                              style={{ height: '40px', fontSize: '15px' }}
                                                              defaultValue=''
                                                            >
                                                                <option disabled value=''>
                                                                  Select Product
                                                                </option>
                                                                    <option>
                                                                    </option>
                                                            </Form.Select>
                                                      </Form.Group>
                                                    </td>
                                                    <td>{data.samC}</td>
                                                    <td>{data.samD}</td>
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
                                          <button>
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
                        <Button onClick={handleShow} className='btn btn-secondary btn-md' size="md" style={{ fontSize: '20px', margin: '0px 5px'  }}>
                            Rejustify
                        </Button>
                        </div>
                        
        <Modal show={showModal} onHide={handleClose}>
          <Form>
            <Modal.Header closeButton>
              <Modal.Title style={{ fontSize: '24px' }}>For Rejustification</Modal.Title>     
            </Modal.Header>
              <Modal.Body>
              <div className="row mt-3">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>PR No.: </Form.Label>
                                <Form.Control type="text" readOnly style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-6">
                            <Form.Group controlId="exampleForm.ControlInput2" className='datepick'>
                                <Form.Label style={{ fontSize: '20px' }}>Date Needed: </Form.Label>
                                  <DatePicker
                                    selected={dateNeeded}
                                    onChange={(date) => setDateNeeded(date)}
                                    dateFormat="MM/dd/yyyy"
                                    placeholderText="Start Date"
                                    className="form-control"
                                  />
                            </Form.Group>
                              </div>
                          </div>
                          
                        <div className="row">
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Remarks: </Form.Label>
                                <Form.Control as="textarea"placeholder="Enter details name" style={{height: '100px', fontSize: '15px'}}/>
                            </Form.Group>
                        <div className="col-6">
                            <Link variant="secondary" size="md" style={{ fontSize: '15px' }}>
                                <Paperclip size={20} />Upload Attachment
                            </Link>
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

export default PurchaseRequestPreview
