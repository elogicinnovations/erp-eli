import React, { useEffect, useState } from 'react';
import Sidebar from '../../Sidebar/sidebar';
import '../../../assets/global/style.css';
import '../../styles/react-style.css';
import axios from 'axios';
import BASE_URL from '../../../assets/global/url';
import Button from 'react-bootstrap/Button';
import swal from 'sweetalert';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    MagnifyingGlass,
    Gear, 
    Bell,
    UserCircle,
    Plus,
    Trash,
    NotePencil,
    DotsThreeCircle,
    CalendarBlank,
    Export,
    ArrowClockwise
  } from "@phosphor-icons/react";
  import '../../../assets/skydash/vendors/feather/feather.css';
  import '../../../assets/skydash/vendors/css/vendor.bundle.base.css';
  import '../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css';
  import '../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
  import '../../../assets/skydash/vendors/ti-icons/css/themify-icons.css';
  import '../../../assets/skydash/css/vertical-layout-light/style.css';
  import '../../../assets/skydash/vendors/js/vendor.bundle.base';
  import '../../../assets/skydash/vendors/datatables.net/jquery.dataTables';
  import '../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4';
  import '../../../assets/skydash/js/off-canvas';
  
  import * as $ from 'jquery';

function POTransactionReports() {

    
// Artifitial data

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
      
// Artifitial data

const navigate = useNavigate();
const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);
  
    useEffect(() => {
        if ($('#order-listing').length > 0) {
          $('#order-listing').DataTable();
        }
      }, []);


  return (
    <div className="main-of-containers">
        <div className="right-of-main-containers">
            <div className="right-body-contents">
                <div className="settings-search-master">

                <div className="dropdown-and-iconics">
                    <div className="emp-text-side">
                            <p>Purchase Order Reports</p>
                        </div>
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
                        <div className="button-create-side">
                        <div className="filter">
                          <div className="warehouse-filter">
                          <Form.Select aria-label="item status"
                            style={{width: '250px', height: '40px', fontSize: '15px', marginBottom: '15px', fontFamily: 'Poppins, Source Sans Pro'}}>
                            <option value="" disabled selected>
                              Warehouse
                            </option>
                          </Form.Select>
                          </div>
                          <div className="product-filter">
                          <Form.Select aria-label="item status"
                            style={{width: '250px', height: '40px', fontSize: '15px', marginBottom: '15px', fontFamily: 'Poppins, Source Sans Pro'}}>
                            <option value="" disabled selected>
                              Product
                            </option>
                          </Form.Select>
                          </div>
                        </div>
                          <div className="col-2" style={{zIndex: '3'}}>
                              <Form.Group controlId="exampleForm.ControlInput2" className='date'>
                                <DatePicker
                                  selected={startDate}
                                  onChange={(date) => setStartDate(date)}
                                  dateFormat="MM/dd/yyyy"
                                  placeholderText="Start Date"
                                  className="form-control"
                                />
                                <CalendarBlank size={20} style={{position: 'relative', color: '#9a9a9a', right:'25px'}}/>
                              </Form.Group>
                          </div>
                          <div className="col-2" style={{zIndex: '3'}}>
                              <Form.Group controlId="exampleForm.ControlInput2" className='date'>
                                <DatePicker
                                  selected={endDate}
                                  onChange={(date) => setEndDate(date)}
                                  dateFormat="MM/dd/yyyy"
                                  placeholderText="End Date"
                                  className="form-control"
                                />
                                <CalendarBlank size={20} style={{position: 'relative', color: '#9a9a9a', right:'25px'}}/>
                              </Form.Group>
                          </div>
                        <div className='export-refresh'>
                            <button className='export'>
                                 <Export size={20} weight="bold" /> <p1>Export</p1>
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="table-containss">
                    <div className="main-of-all-tables">
                        <table id='order-listing'>
                                <thead>
                                <tr>
                                    <th className='tableh'>PO Number</th>
                                    <th className='tableh'>PO Date</th>
                                    <th className='tableh'>Product Code</th>
                                    <th className='tableh'>Product</th>
                                    <th className='tableh'>UOM</th>
                                    <th className='tableh'>Supplier</th>
                                    <th className='tableh'>Unit Cost</th>
                                    <th className='tableh'>Quantity</th>
                                    <th className='tableh'>Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                      {data.map((data,i) =>(
                                        <tr key={i}>
                                        <td>{data.samA}</td>
                                        <td>{data.samB}</td>
                                        <td>{data.samC}</td>
                                        <td>{data.samD}</td>
                                        <td>{data.samE}</td>
                                        <td>{data.samE}</td>
                                        <td>{data.samE}</td>
                                        <td>{data.samE}</td>
                                        <td>{data.samE}</td>
                                        </tr>
                                      ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    </div>
  )
}

export default POTransactionReports