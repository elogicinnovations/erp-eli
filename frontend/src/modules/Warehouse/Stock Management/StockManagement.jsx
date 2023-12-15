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
    CalendarBlank
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

function StockManagement() {

  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  

  const [stockMgnt, setStockMgnt] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [rotatedIcons, setRotatedIcons] = useState(Array(stockMgnt.length).fill(false));
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

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
      setRotatedIcons(Array(stockMgnt.length).fill(false));
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

  
    useEffect(() => {
        if ($('#order-listing').length > 0) {
          $('#order-listing').DataTable();
        }
      }, []);

       //date format
    function formatDatetime(datetime) {
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      };
      return new Date(datetime).toLocaleString('en-US', options);
    }


    const [stockTransfer, setStockTransfer] = useState([]);

    // Fetch Data
    useEffect(() => {
    axios.get(BASE_URL + '/StockTransfer/fetchTable')
    .then(res => setStockTransfer(res.data))
    .catch(err => console.log(err));
    }, []);

  return (
    <div className="main-of-containers">
        {/* <div className="left-of-main-containers">
            <Sidebar/>
        </div> */}
        <div className="right-of-main-containers">
            <div className="right-body-contents">
                <div className="settings-search-master">

                {/* <div className="dropdown-and-iconics">
                    <div className="dropdown-side">
                        <div className="emp-text-side">
                            <p>Stock Management</p>
                        </div>
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
                </div> */}

                </div>
                <div className="Employeetext-button">
                    <div className="employee-and-button">
                        <div className="button-create-side">
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
                          <div className="col-4">
                              <Form.Group controlId="exampleForm.ControlInput2">
                                  <Form.Select 
                                      aria-label=""
                                      required
                                      style={{ height: '40px', fontSize: '15px' }}
                                      defaultValue=''
                                    >
                                        <option disabled value=''>
                                          Status
                                        </option>
                                            <option>
                                            </option>
                                    </Form.Select>
                              </Form.Group>
                                </div>
                                  <Button variant="secondary" size="md"style={{ fontSize: '20px' }}>
                                      Go
                                  </Button>
                        <div className="Buttonmodal-new">
                                <Link to="/createStockTransfer" className='button'>
                                <span style={{ }}>
                                <Plus size={25} /> Stock Transfer
                                </span>
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
                                    <th className='tableh'>Transfer ID</th>
                                    <th className='tableh'>Description</th>
                                    <th className='tableh'>Date Transfered</th>
                                    <th className='tableh'>Source Warehouse</th>
                                    <th className='tableh'>Destination</th>
                                    <th className='tableh'>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                      {stockTransfer.map((data,i) =>(
                                        <tr key={i}>
                                        <td>{data.stock_id}</td>
                                        <td>{data.remarks}</td>
                                        <td>{formatDatetime(data.createdAt)}</td>
                                        <td>{data.source}</td>
                                        <td>{data.destination}</td>
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
                                              {/* Your dropdown content here */}
                                              
                                          <button className='btn' onClick={() => navigate(`/stockManagementPreview`)}>View</button>
                                          <button className='btn'>Cancel</button>
                                          </div>
                                          </td>
                                        {/* <td>
                                        <button className='btn'><Trash size={20} style={{color: 'red'}}/></button>
                                        </td> */}
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

export default StockManagement