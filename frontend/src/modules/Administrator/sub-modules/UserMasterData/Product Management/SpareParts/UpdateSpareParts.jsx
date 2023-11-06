import React from 'react'
import Sidebar from '../../../../../Sidebar/sidebar';
import '../../../../../../assets/global/style.css';
import { Link } from 'react-router-dom';
import '../../../../../styles/react-style.css';
import Form from 'react-bootstrap/Form';
import {
    MagnifyingGlass,
    Gear, 
    Bell,
    UserCircle,
    Plus,
    Trash,
    NotePencil,
  } from "@phosphor-icons/react";
import '../../../../../../assets/skydash/vendors/feather/feather.css';
import '../../../../../../assets/skydash/vendors/css/vendor.bundle.base.css';
import '../../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css';
import '../../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
import '../../../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css';
import '../../../../../../assets/skydash/css/vertical-layout-light/style.css';
import '../../../../../../assets/skydash/vendors/js/vendor.bundle.base';
import '../../../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
import '../../../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4';
import '../../../../../../assets/skydash/js/off-canvas';

import * as $ from 'jquery';

function UpdateSpareParts() {

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
                <h1>Update Spare Parts</h1>
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
                                <Form.Label style={{ fontSize: '20px' }}>Spare Parts Name: </Form.Label>
                                <Form.Control type="text" placeholder="Enter item name" style={{height: '40px', fontSize: '15px'}}/>
                              </Form.Group>
                            </div>
                            <div className="col-6">
                                <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Label style={{ fontSize: '20px' }}>Supplier: </Form.Label>
                                  <Form.Select aria-label="Default select example" 
                                  style={{ height: '40px', fontSize: '15px' }}>
                                  </Form.Select>
                                </Form.Group>
                              </div>
                          </div>
                        </Form>
                        <Form>
                        <div className="row">
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label style={{ fontSize: '20px' }}>Details: </Form.Label>
                                <Form.Control as="textarea"placeholder="Enter details name" style={{height: '100px', fontSize: '15px'}}/>
                            </Form.Group>
                        </div>
                        </Form>

                        <div className="gen-info" style={{ fontSize: '20px', position: 'relative', paddingTop: '30px' }}>
                          Sub Parts List
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
                                    <table id='order-listing'>
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
                                                    <button className='btn'><NotePencil size={32} /></button>
                                                    <button className='btn'><Trash size={32} color="#e60000" /></button>
                                                    </td>
                                                    </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className='save-cancel'>
                        <Link to='/spareParts' className='btn btn-warning' size="md" style={{ fontSize: '20px', margin: '0px 5px' }}>Update</Link>
                        <Link to='/spareParts' className='btn btn-secondary btn-md' size="md" style={{ fontSize: '20px', margin: '0px 5px'  }}>
                            Close
                        </Link>
                        </div>
            </div>
        </div>
    </div>
  )
}

export default UpdateSpareParts
