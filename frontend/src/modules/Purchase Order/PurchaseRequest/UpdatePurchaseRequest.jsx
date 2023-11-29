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
import {
    ArrowCircleLeft,
    Plus
  } from "@phosphor-icons/react";
import axios from 'axios';
import BASE_URL from '../../../assets/global/url';
import swal from 'sweetalert';

import * as $ from 'jquery';

function UpdatePurchaseRequest() {
  const data = [
    {
      samA: 'asd',
      samB: 'asd',
      samC: 'asd',
      samD: 'asd',
      samE: 'asd',
    },
    {
      samA: 'asd',
      samB: 'asd',
      samC: 'asd',
      samD: 'asd',
      samE: 'asd',
    },
    {
      samA: 'asd',
      samB: 'asd',
      samC: 'asd',
      samD: 'asd',
      samE: 'asd',
    },
  ]

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
                    Update Purchase Request
                    </h1>
                </div>
                    <p1>Purchasing please purchase the following item enumerated below </p1>
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
                            <div className="col-6">
                            <Form.Group controlId="exampleForm.ControlInput2">
                                <Form.Label style={{ fontSize: '20px' }}>Date Needed: </Form.Label>
                                <Form.Select 
                                    aria-label=""
                                    required
                                    style={{ height: '40px', fontSize: '15px' }}
                                    defaultValue=''
                                  >
                                      <option disabled value=''>
                                      </option>
                                          <option>
                                          </option>
                                  </Form.Select>
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
                                                <th className='tableh'>PR No.</th>
                                                <th className='tableh'>Requestor</th>
                                                <th className='tableh'>Status</th>
                                                <th className='tableh'>Date Created</th>
                                                <th className='tableh'>Remarks</th>
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
                        <Button type='submit' className='btn btn-warning' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Approve</Button>
                        <Link to='/purchaseRequest' className='btn btn-secondary btn-md' size="md" style={{ fontSize: '20px', margin: '0px 5px'  }}>
                            Rejustify
                        </Link>
                        </div>
                        </Form>
                       
            </div>
        </div>
    </div>
  )
}

export default UpdatePurchaseRequest
