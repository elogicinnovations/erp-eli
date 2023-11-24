import React, { useEffect, useState } from 'react';
import Sidebar from '../../../../Sidebar/sidebar';
import '../../../../../assets/global/style.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import '../../../../styles/react-style.css';
import Form from 'react-bootstrap/Form';
import swal from 'sweetalert';
import axios from 'axios';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import BASE_URL from '../../../../../assets/global/url';
import Button from 'react-bootstrap/Button';
import {
    Trash,
    NotePencil,
  } from "@phosphor-icons/react";

  import * as $ from 'jquery';


function ViewCostCenter() {

    const Data = [
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

    const [showDropdown, setShowDropdown] = useState(false); 
    const [selectedRow, setSelectedRow] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    useEffect(() => {
        if ($('#order-listing').length > 0) {
          $('#order-listing').DataTable();
        }
      }, []);

    const handleTbodyClick = (index) => {
        setSelectedRow(selectedRow === index ? null : index);
        setIsDropdownOpen(!isDropdownOpen);
    };

  return (
    <div className="main-of-containers">
        <div className="left-of-main-containers">
            <Sidebar/>
        </div>
        <div className="right-of-main-containers">
            <div className="right-body-contents-a">
              <Row>
                <Col>
                  <h1>Cost Center</h1>
                </Col>
                <Col>
                <div className="row">
                            <div className="col-6">
                            <div className="form-group d-flex flex-row"> 
                                  <label className='userstatus' style={{fontSize: 15, marginRight: 10}}>Status</label>
                                  <input
                                      type="checkbox"
                                      name="cstatus"
                                      className="toggle-switch"
                                  />
                                  </div>
                              </div> 
                        </div>
                </Col>
              </Row>
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
                        <Form>
                          <div className="row">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Cost Center: </Form.Label>
                                <Form.Control type="text" placeholder="Enter item name" style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-6">
                            <Form.Group controlId="exampleForm.ControlInput2">
                                <Form.Label style={{ fontSize: '20px' }}>Assign User: </Form.Label>
                                <Form.Select 
                                    aria-label="" 
                                    required
                                    style={{ height: '40px', fontSize: '15px' }}
                                  >
                                      <option disabled value=''>
                                          Select User
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
                                <Form.Label style={{ fontSize: '20px' }}>Contact Number: </Form.Label>
                                <Form.Control type="text" placeholder="Enter contact number..." style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                           </div>
                        <div className="row">
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Description: </Form.Label>
                                <Form.Control as="textarea" placeholder="Enter details name" style={{height: '100px', fontSize: '15px'}}/>
                            </Form.Group>
                        </div>
                        <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '20px' }}>
                          Issued Products
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '81%',
                              left: '14rem',
                              transform: 'translateY(-50%)',
                            }}
                          ></span>
                        </div>

                        <div className="table-containss">
                    <div className="main-of-all-tables">
                        <table id='order-listing'>
                                <thead>
                                <tr>
                                    <th className='tableh'>ID</th>
                                    <th className='tableh'>Name</th>
                                    <th className='tableh'>Assigned User</th>
                                    <th className='tableh'>Contact #</th>
                                    <th className='tableh'>Status</th>
                                    <th className='tableh'>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                            {Data.map((data, i) => (
                                <React.Fragment key={i}>
                                    <tr>
                                        <td onClick={() => handleTbodyClick(i)}>{data.samA}</td>
                                        <td onClick={() => handleTbodyClick(i)}>{data.samB}</td>
                                        <td onClick={() => handleTbodyClick(i)}>{data.samC}</td>
                                        <td onClick={() => handleTbodyClick(i)}>{data.samD}</td>
                                        <td onClick={() => handleTbodyClick(i)}>{data.samE}</td>
                                        <td>
                                            <Link className='btn'><NotePencil size={32} /></Link>
                                            <button className='btn'><Trash size={32} color="#e60000" /></button>
                                        </td>
                                    </tr>
                                    {selectedRow === i && (
                                        <tr>
                                            <td className={`drop ${isDropdownOpen ? 'open' : ''}`} colSpan="6">
                                                <table className="drop_table">
                                                    <thead>
                                                    <tr>
                                                        <th className='theadD'>ID</th>
                                                        <th className='theadD'>Name</th>
                                                        <th className='theadD'>Assigned User</th>
                                                        <th className='theadD'>Contact #</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className='tbodyD'>asd</td>
                                                            <td className='tbodyD'>asd</td>
                                                            <td className='tbodyD'>asd</td>
                                                            <td className='tbodyD'>asd</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                        </table>
                    </div>
                </div>
                       
                        <div className='save-cancel'>
                        <Link to='/costCenter' className='btn btn-secondary btn-md' size="md" style={{ fontSize: '20px', margin: '0px 5px',  width: '200px'}}>
                            Close
                        </Link>
                        </div>
                        </Form>
            </div>
        </div>
    </div>
  )
}

export default ViewCostCenter
