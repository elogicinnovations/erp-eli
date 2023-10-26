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
import {
    MagnifyingGlass,
    Gear, 
    Bell,
    UserCircle,
    Plus,
    Trash,
    NotePencil,
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



function Supplier() {
    React.useEffect(() => {
        $(document).ready(function () {
          $('#order-listing').DataTable();
        });
      }, []);
    return(

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
                                <p>Supplier</p>
                            </div>

                            <div className="button-create-side">
                            <div className="Buttonmodal-new">
                                <Link to={'/CreateSupplier'} style={{textDecoration: 'none', backgroundColor: 'inherit'}}>
                                <button>
                                    <span style={{ }}>
                                    <Plus size={25} />
                                    </span>
                                    Create New
                                </button>
                                </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="table-containss">
                        <div className="main-of-all-tables">
                            <table id='order-listing'>
                                    <thead>
                                    <tr>
                                        <th className='tableh'>SUPPLIER ID</th>
                                        <th className='tableh'>SUPPLIER NAME</th>
                                        <th className='tableh'>CONTACT</th>
                                        <th className='tableh'>STATUS</th>
                                        <th className='tableh'>VATABLE</th>
                                        <th className='tableh'>ACTION</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                            <tr>
                                            <td>035</td>
                                            <td><Link to="/viewsupplier" title="Click to view supplier details">JOSEPH</Link></td>
                                            <td>0922tutunogtunog</td>
                                            <td>ACTIVE</td>
                                            <td>MURA LANG</td>
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
            </div>
        </div>
    );
}

export default Supplier;