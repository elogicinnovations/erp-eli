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

import { CostContext } from '../../../../../contexts/contexts';

function ViewCostCenter() {

    const costData = useContext(CostContext)
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

      
  const [selectedRow, setSelectedRow] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleRowClick = (index) => {
    setSelectedRow(index);
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    console.log("Cost Context: ", costData.value);
  }, [costData])

  const renderDropdown = () => {
    if (selectedRow === null) return null;

    return (
      <tr className={selectedRow === selectedRow ? 'active' : ''}>
        <td  className="dropdown" colSpan="5">
          <div className="dropdown">
            <table className="drop_table">
              <thead>
                <tr>
                  <th className="theadD">ID</th>
                  <th className="theadD">Name</th>
                  <th className="theadD">Assigned User</th>
                  <th className="theadD">Contact #</th>
                  <th className="theadD">Status</th>
                </tr>
              </thead>
              <tbody className='tbodyD'>
                {Data.map((data, i) => (
                    <tr key={i}>
                      <td className='tbodyD'>{data.samA}</td>
                      <td className='tbodyD'>{data.samB}</td>
                      <td className='tbodyD'>{data.samC}</td>
                      <td className='tbodyD'>{data.samD}</td>
                      <td className='tbodyD'>{data.samE}</td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    );
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
                    <table id="order-listing">
                      <thead>
                        <tr>
                          <th className="tableh">ID</th>
                          <th className="tableh">Name</th>
                          <th className="tableh">Assigned User</th>
                          <th className="tableh">Contact #</th>
                          <th className="tableh">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Data.map((data, i) => (
                          <React.Fragment key={i}>
                            <tr onClick={() => handleRowClick(i)}>
                              <td>{data.samA}</td>
                              <td>{data.samB}</td>
                              <td>{data.samC}</td>
                              <td>{data.samD}</td>
                              <td>{data.samE}</td>
                            </tr>
                            {selectedRow === i && showDropdown && renderDropdown()}
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
