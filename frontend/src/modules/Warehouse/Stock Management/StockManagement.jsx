import React, { useEffect, useState } from 'react';
import Sidebar from '../../Sidebar/sidebar';
import '../../../assets/global/style.css';
import '../../styles/react-style.css';
import axios from 'axios';
import BASE_URL from '../../../assets/global/url';
import Button from 'react-bootstrap/Button';
import swal from 'sweetalert';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    Gear, 
    Bell,
    UserCircle,
    Plus,
    DotsThreeCircle,
    CalendarBlank,
    XCircle,
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
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filteredPR, setFilteredPR] = useState([]);

  

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

  

  const handleXCircleClick = () => {
    setStartDate(null);
  };
  
  const handleXClick = () => {
    setEndDate(null);
  };
  
  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };
  

  //function when user click the clear filter button
  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedStatus('');

    // reloadTable();
  };

  // const handleGoButtonClick = () => {
  //   if (!startDate || !endDate || !selectedStatus) {
  //     swal({
  //       icon: 'error',
  //       title: 'Oops...',
  //       text: 'Please fill in all filter sections!',
  //     });
  //     return;
  //   }
  
  //   const filteredData = allPR.filter((data) => {
  //     const createdAt = new Date(data.createdAt);
  //     console.log('startDate:', startDate);
  //     console.log('endDate:', endDate);
  //     console.log('createdAt:', createdAt);

  //     const isWithinDateRange =
  //     (!startDate || createdAt >= startDate.setHours(0, 0, 0, 0)) &&
  //     (!endDate || createdAt <= endDate.setHours(23, 59, 59, 999));
  
  //     const isMatchingStatus =
  //       selectedStatus === 'All Status' || data.status === selectedStatus;
  
  //     return isWithinDateRange && isMatchingStatus;
  //   });
  
  //   setFilteredPR(filteredData);
  // };
  //

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

    useEffect(() => {
        if ($('#order-listing').length > 0) {
          $('#order-listing').DataTable();
        }
      }, []);


  return (
    <div className="main-of-containers">
        {/* <div className="left-of-main-containers">
            <Sidebar/>
        </div> */}
        <div className="right-of-main-containers">
            <div className="right-body-contents">
                <div className="settings-search-master">

                <div className="dropdown-and-iconics">
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
                </div>

                </div>
                <div className="Employeetext-button">
                    <div className="employee-and-button">
                        <div className="button-create-side">
                        <div style={{ position: "relative", marginBottom: "15px" }}>
                                <DatePicker
                                  // selected={startDate}
                                  // onChange={(date) => setStartDate(date)}
                                  placeholderText="Choose Date From"
                                  dateFormat="yyyy-MM-dd"
                                  wrapperClassName="custom-datepicker-wrapper"
                                  popperClassName="custom-popper"
                                  style={{fontFamily: 'Poppins, Source Sans Pro'}}
                                />
                                <CalendarBlank
                                  size={20}
                                  weight="thin"
                                  style={{
                                    position: "absolute",
                                    left: "8px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: 'pointer',
                                  }}
                                />
                                {startDate && (
                                  <XCircle
                                    size={16}
                                    weight="thin"
                                    style={{
                                      position: "absolute",
                                      right: "19px",
                                      top: "50%",
                                      transform: "translateY(-50%)",
                                      cursor: 'pointer',
                                    }}
                                    // onClick={handleXCircleClick}
                                  />
                                )}
                              </div>

                              <div style={{ position: "relative", marginBottom: "15px" }}>
                                <DatePicker
                                  // selected={endDate}
                                  // onChange={(date) => setEndDate(date)}
                                  placeholderText="Choose Date To"
                                  dateFormat="yyyy-MM-dd"
                                  wrapperClassName="custom-datepicker-wrapper"
                                  popperClassName="custom-popper"
                                  style={{fontFamily: 'Poppins, Source Sans Pro'}}
                                />
                                <CalendarBlank
                                  size={20}
                                  weight="thin"
                                  // selected={endDate}
                                  // onChange={(date) => setEndDate(date)}
                                  style={{
                                    position: "absolute",
                                    left: "8px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: 'pointer',
                                  }}
                                />
                                {endDate && (
                                  <XCircle
                                    size={16}
                                    weight="thin"
                                    style={{
                                      position: "absolute",
                                      right: "19px",
                                      top: "50%",
                                      transform: "translateY(-50%)",
                                      cursor: 'pointer',
                                    }}
                                    // onClick={handleXClick}
                                  />
                                )}
                              </div>
                              <Form.Select aria-label="item status"
                                value={selectedStatus}
                                // onChange={handleStatusChange}
                                style={{width: '450px', height: '40px', fontSize: '15px', marginBottom: '15px', fontFamily: 'Poppins, Source Sans Pro'}}
                                required
                                title="Status is required">
                                  <option value="" disabled selected>
                                    Select Status
                                  </option>
                                  <option value="All Status">All Status</option>
                                  <option value="For-Approval">For-Approval</option>
                                  <option value="For-Rejustify">For-Rejustify</option>
                                  <option value="For-Canvassing">For-Canvassing</option>
                                  <option value="To-Received">To-Received</option>
                                  <option value="Cancelled">Cancelled</option>
                                </Form.Select>  
                                  <button className='goesButton' > {/**onClick={handleGoButtonClick} */}
                                    GO
                                  </button>
                                  <button className='Filterclear' > {/**onClick={clearFilters} */}
                                    Clear Filter
                                  </button>
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
                                    <th className='tableh'>Target Warehouse</th>
                                    <th className='tableh'>Quantity</th>
                                    <th className='tableh'>Action</th>
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