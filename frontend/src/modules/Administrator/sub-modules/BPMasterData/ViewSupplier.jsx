import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../../Sidebar/sidebar';
import axios from 'axios';
import BASE_URL from '../../../../assets/global/url';
import swal from 'sweetalert';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {
MagnifyingGlass,
Printer,
ArrowCircleLeft,
} from "@phosphor-icons/react";
import '../../../../assets/skydash/vendors/feather/feather.css';
import '../../../../assets/skydash/vendors/css/vendor.bundle.base.css';
import '../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css';
import '../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
import '../../../../assets/skydash/vendors/ti-icons/css/themify-icons.css';
import '../../../../assets/skydash/css/vertical-layout-light/style.css';
import '../../../../assets/skydash/vendors/js/vendor.bundle.base';
import '../../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
import '../../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4';
import '../../../../assets/skydash/js/off-canvas';

import * as $ from 'jquery';  

function ViewSupplier() {
    React.useEffect(() => {
        $(document).ready(function () {
          $('#order-listing').DataTable();
          $('#ordered-listing').DataTable();
        });
      }, []);
    const tabStyle = {
        padding: '10px 15px', 
        margin: '0 10px',
        color: '#333',
        transition: 'color 0.3s',
    };
    const tablestyle = {
        fontSize: '20px',
    };
    return (
        <div className="main-of-containers">
            <div className="left-of-main-containers">
            <Sidebar />
            </div>

            <div className="mid-of-main-containers">
            </div>
                <div className="right-of-main-containers">
                    <div className="right-body-contents">
                        <div className="headers-text">
                            <div className="arrowandtitle">
                                <Link to='/supplier'><ArrowCircleLeft size={50} color="#60646c" weight="fill" /></Link>
                                <div className="titletext">
                                    <h1>KINGKONG INCO</h1>
                                        <div className="home-supplier-tag">
                                            <p>Home</p>
                                            <p>•</p>
                                            <p>Supplier</p>
                                            <p>•</p>
                                            <p>Kingkong Inco</p>
                                        </div>
                                </div>
                            </div>
                        </div>

                        <div className="searches-sidebars">
 
                        </div>

                        <div className="tabbutton-sides">
                            <Tabs
                                defaultActiveKey="profile"
                                transition={false}
                                id="noanim-tab-example"
                                >
                                <Tab eventKey="profile" title={<span style={{...tabStyle, fontSize: '20px', overflowY: 'auto'}}>Profile</span>}>
                                    <div style={{ maxHeight: '540px', overflowY: 'auto', paddingLeft: '15px', overflowX: 'hidden', paddingBottom: '40px' }}>
                                    <Form style={{paddingLeft: '15px'}}>
                                        <h1>Details</h1>
                                        <div className="row">
                                            <div className="col-6">
                                            <Form.Group controlId="exampleForm.ControlInput1">
                                                <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>Supplier Name: </Form.Label>
                                                <Form.Control style={{height: '50px', fontSize: '16px', width: '95%'}} readOnly />
                                            </Form.Group>
                                            </div>
                                            <div className="col-6">
                                            <Form.Group controlId="exampleForm.ControlInput2">
                                                <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>Code: </Form.Label>
                                                <Form.Control style={{height: '50px', fontSize: '16px', width: '95%'}} readOnly />
                                            </Form.Group>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-6">
                                            <Form.Group controlId="exampleForm.ControlInput1">
                                                <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>TIN: </Form.Label>
                                                <Form.Control style={{height: '50px', fontSize: '16px', width: '95%'}} readOnly />
                                            </Form.Group>
                                            </div>
                                            <div className="col-6">
                                            <Form.Group controlId="exampleForm.ControlInput2">
                                                <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>Terms: </Form.Label>
                                                <Form.Control style={{height: '50px', fontSize: '16px', width: '95%'}} readOnly/>
                                            </Form.Group>
                                            </div>
                                        </div>
                                    </Form>

                                    <Form style={{paddingLeft: '15px'}}>
                                        <h1>Location Information</h1>
                                        <div className="">
                                            <Form.Group controlId="exampleForm.ControlInput1">
                                                <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>Address: </Form.Label>
                                                <Form.Control style={{height: '50px', fontSize: '16px', width: '97.5%'}} readOnly />
                                            </Form.Group>
                                        </div>
                                        <div className="row">
                                            <div className="col-6">
                                            <Form.Group controlId="exampleForm.ControlInput1">
                                                <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>City: </Form.Label>
                                                <Form.Control style={{height: '50px', fontSize: '16px', width: '95%'}} readOnly />
                                            </Form.Group>
                                            </div>
                                            <div className="col-6">
                                            <Form.Group controlId="exampleForm.ControlInput2">
                                                <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>ZipCode: </Form.Label>
                                                <Form.Control style={{height: '50px', fontSize: '16px', width: '95%'}} readOnly />
                                            </Form.Group>
                                            </div>
                                        </div>
                                    </Form>

                                    <Form style={{paddingLeft: '15px'}}>
                                        <h1>Contact Details</h1>
                                        <div className="row">
                                            <div className="col-6">
                                            <Form.Group controlId="exampleForm.ControlInput1">
                                                <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>Contact Person: </Form.Label>
                                                <Form.Control style={{height: '50px', fontSize: '16px', width: '95%'}} readOnly />
                                            </Form.Group>
                                            </div>
                                            <div className="col-6">
                                            <Form.Group controlId="exampleForm.ControlInput2">
                                                <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>Mobile No.: </Form.Label>
                                                <Form.Control style={{height: '50px', fontSize: '16px', width: '95%'}} readOnly />
                                            </Form.Group>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-6">
                                            <Form.Group controlId="exampleForm.ControlInput1">
                                                <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>Telephone No.: </Form.Label>
                                                <Form.Control style={{height: '50px', fontSize: '16px', width: '95%'}} readOnly />
                                            </Form.Group>
                                            </div>
                                            <div className="col-6">
                                            <Form.Group controlId="exampleForm.ControlInput2">
                                                <Form.Label style={{ fontSize: '20px', marginBottom: '10px' }}>Terms (no. of days) </Form.Label>
                                                <Form.Control style={{height: '50px', fontSize: '16px', width: '95%'}} readOnly/>
                                            </Form.Group>
                                            </div>
                                        </div>
                                    </Form>
                                    </div>
                                </Tab>
                                <Tab eventKey="product list" title={<span style={{...tabStyle, fontSize: '20px' }}>Product List</span>}>
                                        <div className="productandprint">
                                            <h1>Products</h1>
                                            <div className="printbtns">
                                                <button>
                                                <span style={{marginRight: '4px'}}>
                                                    <Printer size={20} />
                                                </span>
                                                    Print
                                                </button>
                                            </div>
                                        </div>
                                        <div className="main-of-all-tables">
                                            <table id='order-listing'>
                                                <thead>
                                                    <tr>
                                                        <th>Code</th>
                                                        <th>Product Name</th>
                                                        <th>Category</th>
                                                        <th>UOM</th>
                                                        <th>Contact</th>
                                                        <th>Price</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>HAHAH</td>
                                                        <td>HHAHAH</td>
                                                        <td>HEHEHE</td>
                                                        <td>SDSADAS</td>
                                                        <td>DSAD</td>
                                                        <td>DSADAS</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                </Tab>
                                <Tab eventKey="ordered list" title={<span style={{...tabStyle, fontSize: '20px' }}>Ordered List</span>}>
                                    <div className="orderhistory-side">
                                        <h1>Order History</h1>
                                        <div className="printersbtn">
                                            <button>
                                                <span style={{marginRight: '4px'}}>
                                                    <Printer size={20} />
                                                </span>
                                                Print
                                            </button>
                                        </div>
                                    </div>
                                    <div className="main-of-all-tables">
                                        <table id="ordered-listing">
                                            <thead>
                                                <tr>
                                                    <th>UNA</th>
                                                    <th>PANGALAWA</th>
                                                    <th>PANGATLO</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>first</td>
                                                    <td>second</td>
                                                    <td>third</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>

                </div>
            </div>    
        </div>
    );
}
export default ViewSupplier;
