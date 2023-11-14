import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../Sidebar/sidebar';
import axios from 'axios';
import BASE_URL from '../../assets/global/url';
import swal from 'sweetalert';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import receiving from "../../assets/global/receiving";
import {
    MagnifyingGlass,
    Gear, 
    Bell,
    UserCircle,
    Plus,
    Trash,
    NotePencil,
  } from "@phosphor-icons/react";


import '../../assets/skydash/vendors/feather/feather.css';
import '../../assets/skydash/vendors/css/vendor.bundle.base.css';
import '../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css';
import '../../assets/skydash/vendors/datatables.net/jquery.dataTables';
import '../../assets/skydash/vendors/ti-icons/css/themify-icons.css';
import '../../assets/skydash/css/vertical-layout-light/style.css';
import '../../assets/skydash/vendors/js/vendor.bundle.base';
import '../../assets/skydash/vendors/datatables.net/jquery.dataTables';
import '../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4';
import '../../assets/skydash/js/off-canvas';

import * as $ from 'jquery';  

function Inventory() {

    React.useEffect(() => {
        $(document).ready(function () {
          $('#order-listing').DataTable();
        });
      }, []);

    React.useEffect(() => {
        $(document).ready(function () {
          $('#order1-listing').DataTable();
        });
      }, []);

    React.useEffect(() => {
        $(document).ready(function () {
          $('#order2-listing').DataTable();
        });
      }, []);

    const tabStyle = {
        padding: '10px 15px', 
        margin: '0 10px',
        color: '#333',
        transition: 'color 0.3s',
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

                    <div className="settings-search-master">

                        <div className="dropdown-and-iconics">
                            <div className="dropdown-side">

                            </div>
                            <div className="iconic-side">
                                <div className="gearsides">
                                    <Gear size={35}/>
                                </div>
                                <div className="bellsides">
                                    <Bell size={35}/>
                                </div>
                                <div className="usersides">
                                    <UserCircle size={35}/>
                                </div>
                                <div className="username">
                                <h3>User Name</h3>
                                </div>
                            </div>
                        </div>

                        </div>
                        <div className="Employeetext-button">
                    <div className="employee-and-button">
                        <div className="emp-text-side">
                            <p>Inventory</p>
                        </div>

                        <div className="button-create-side">
                        <div className="Buttonmodal-new">
                            
                            </div>
                        </div>

                    </div>
                </div>

                        <div className="tabbutton-sides">
                            <Tabs
                                defaultActiveKey="profile"
                                transition={false}
                                id="noanim-tab-example"
                                >
                                <Tab eventKey="profile" title={<span style={{...tabStyle, fontSize: '20px', overflowY: 'auto'}}>Profile</span>}>
                                    <div className="table-containss">
                                        <div className="main-of-all-tables">
                                            <table id='order-listing'>
                                                    <thead>
                                                    <tr>
                                                        <th className='tableh'>User #</th>
                                                        <th className='tableh'>Name</th>
                                                        <th className='tableh'>Contact</th>
                                                        <th className='tableh'>Description</th>
                                                        <th className='tableh'>Action</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                            <tr>
                                                            <td>a</td>
                                                            <td>a</td>
                                                            <td>a</td>
                                                            <td>a</td>
                                                            <td>
                                                            <Link to='/updateCostCenter' className='btn'><NotePencil size={32} /></Link>
                                                            <button className='btn'><Trash size={32} color="#e60000" /></button>
                                                            </td>
                                                            </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab eventKey="product list" title={<span style={{...tabStyle, fontSize: '20px' }}>Product List</span>}>
                                    <div className="table-containss">
                                        <div className="main-of-all-tables">
                                            <table id='order1-listing'>
                                                    <thead>
                                                    <tr>
                                                        <th className='tableh'>User #</th>
                                                        <th className='tableh'>Name</th>
                                                        <th className='tableh'>Contact</th>
                                                        <th className='tableh'>Description</th>
                                                        <th className='tableh'>Action</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                            <tr>
                                                            <td>a</td>
                                                            <td>a</td>
                                                            <td>a</td>
                                                            <td>a</td>
                                                            <td>
                                                            <Link to='/updateCostCenter' className='btn'><NotePencil size={32} /></Link>
                                                            <button className='btn'><Trash size={32} color="#e60000" /></button>
                                                            </td>
                                                            </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab eventKey="ordered list" title={<span style={{...tabStyle, fontSize: '20px' }}>Ordered List</span>}>
                                    <div className="table-containss">
                                        <div className="main-of-all-tables">
                                            <table id='order2-listing'>
                                                    <thead>
                                                    <tr>
                                                        <th className='tableh'>User #</th>
                                                        <th className='tableh'>Name</th>
                                                        <th className='tableh'>Contact</th>
                                                        <th className='tableh'>Description</th>
                                                        <th className='tableh'>Action</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                            <tr>
                                                            <td>a</td>
                                                            <td>a</td>
                                                            <td>a</td>
                                                            <td>a</td>
                                                            <td>
                                                            <Link to='/updateCostCenter' className='btn'><NotePencil size={32} /></Link>
                                                            <button className='btn'><Trash size={32} color="#e60000" /></button>
                                                            </td>
                                                            </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>

                </div>
            </div>    
        </div>
    );
}
export default Inventory;
