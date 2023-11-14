import React from 'react'
import Sidebar from '../../../../Sidebar/sidebar';
import '../../../../../assets/global/style.css';
import { Link } from 'react-router-dom';
import '../../../../styles/react-style.css';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import {
    MagnifyingGlass,
    Gear, 
    Bell,
    UserCircle,
    Plus,
    X,
    NotePencil,
  } from "@phosphor-icons/react";
import '../../../../../assets/skydash/vendors/feather/feather.css';
import '../../../../../assets/skydash/vendors/css/vendor.bundle.base.css';
import '../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css';
import '../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
import '../../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css';
import '../../../../../assets/skydash/css/vertical-layout-light/style.css';
import '../../../../../assets/skydash/vendors/js/vendor.bundle.base';
import '../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
import '../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4';
import '../../../../../assets/skydash/js/off-canvas';

import * as $ from 'jquery';

function UpdateCostCenter() {

React.useEffect(() => {
    $(document).ready(function () {
        $('#order-listing').DataTable();
    });
    }, []);

  return (
    <div className="main-of-containers">
        <div className="left-of-main-containers">
            <Sidebar/>
        </div>
        <div className="right-of-main-containers">
            <div className="right-body-contents-a">
                <h1>Update Cost Center</h1>
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
                          <div className="row mt-3">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Cost Center: </Form.Label>
                                <Form.Control type="text" placeholder="Enter item name" style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-6">
                            <Form.Group controlId="exampleForm.ControlInput2">
                                <Form.Label style={{ fontSize: '20px' }}>Assign User: </Form.Label>
                                <Select
                                isMulti
                                options={[
                                    { value: 'user1', label: 'x' },
                                    { value: 'user2', label: 'y' },
                                    { value: 'user3', label: 'j' },
                                    { value: 'user4', label: 'l' },
                                    { value: 'user5', label: 'q' },
                                ]}
                                />
                            </Form.Group>
                              </div>
                          </div>
                          <div className="row">
                            <div className="col-6">
                              <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Contact: </Form.Label>
                                <Form.Control type="text" placeholder="Enter Contact Number" style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                          </div>
                        <div className="row">
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Description: </Form.Label>
                                <Form.Control as="textarea"placeholder="Enter details name" style={{height: '100px', fontSize: '15px'}}/>
                            </Form.Group>
                        </div>
                        </Form>

                        <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '30px' }}>
                          Master List
                          <span
                            style={{
                              position: 'absolute',
                              height: '0.5px',
                              width: '-webkit-fill-available',
                              background: '#FFA500',
                              top: '85%',
                              left: '10rem',
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
                                                <th className='tableh'>Product Code</th>
                                                <th className='tableh'>Quantity</th>
                                                <th className='tableh'>Sub Parts</th>
                                                <th className='tableh'>Desciptions</th>
                                                <th className='tableh'>Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                    <tr>
                                                    <td>asd</td>
                                                    <td>asdsda</td>
                                                    <td>tnbgv</td>
                                                    <td>sdf</td>
                                                    <td>
                                                    <button className='btn'><X size={32} color="#e60000" /></button>
                                                    </td>
                                                    </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className='save-cancel'>
                        <Link to='/costCenter' className='btn btn-warning' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Save</Link>
                        <Link to='/costCenter' className='btn btn-secondary btn-md' size="md" style={{ fontSize: '20px', margin: '0px 5px'  }}>
                            Close
                        </Link>
                        </div>
            </div>
        </div>
    </div>
  )
}

export default UpdateCostCenter
