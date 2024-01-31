import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import NoData from '../../../assets/image/NoData.png';
import NoAccess from '../../../assets/image/NoAccess.png';
// import Sidebar from '../../Sidebar/sidebar';
import '../../../assets/global/style.css';
import '../../styles/react-style.css';
import axios from 'axios';
import BASE_URL from '../../../assets/global/url';
import swal from 'sweetalert';
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    Gear, 
    Bell,
    UserCircle,
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
import Header from '../../../partials/header';

function ReceivingStockTransfer({authrztn}) {
  const navigate = useNavigate();
  const [stockTransfer, setStockTransfer] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filteredPR, setFilteredPR] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

// Fetch Data

const reloadTable = () => {
  const delay = setTimeout(() => {
  axios
    .get(BASE_URL + '/StockTransfer/fetchTable')
    .then((res) => {
      setStockTransfer(res.data)
      setFilteredPR(res.data)
      setIsLoading(false);
    })
    .catch((err) => {
      console.log(err)
      setIsLoading(false);
    });
  }, 1000);

  return () => clearTimeout(delay);
};

useEffect(() => {
   reloadTable()
  }, []);
      
const handleXCircleClick = () => {
  setStartDate(null);
};

const handleXClick = () => {
  setEndDate(null);
};

const handleStatusChange = (e) => {
  setSelectedStatus(e.target.value);
};

const handleGoButtonClick = () => {
  if (!startDate || !endDate || !selectedStatus) {
    swal({
      icon: 'error',
      title: 'Oops...',
      text: 'Please fill in all filter sections!',
    });
    return;
  }

  const filteredData = stockTransfer.filter((data) => {
    const createdAt = new Date(data.createdAt);
    console.log('startDate:', startDate);
    console.log('endDate:', endDate);
    console.log('createdAt:', createdAt);

    const isWithinDateRange =
    (!startDate || createdAt >= startDate.setHours(0, 0, 0, 0)) &&
    (!endDate || createdAt <= endDate.setHours(23, 59, 59, 999));

    const isMatchingStatus =
      selectedStatus === 'All Status' || data.status === selectedStatus;

    return isWithinDateRange && isMatchingStatus;
  });

  setFilteredPR(filteredData);
};

    //function when user click the clear filter button
    const clearFilters = () => {
      setStartDate(null);
      setEndDate(null);
      setSelectedStatus('');
  
      reloadTable();
    };
  
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
      // Initialize DataTable when role data is available
      if ($('#order-listing').length > 0 && stockTransfer.length > 0) {
        $('#order-listing').DataTable();
      }
    }, [stockTransfer]);

  return (
    <div className="main-of-containers">
        {/* <div className="left-of-main-containers">
            <Sidebar/>
        </div> */}
        <div className="right-of-main-containers">
              {isLoading ? (
                <div className="loading-container">
                  <ReactLoading className="react-loading" type={'bubbles'}/>
                  Loading Data...
                </div>
              ) : (
                authrztn.includes('Receiving - View') ? (
            <div className="right-body-contents">
                {/* <div className="settings-search-master">

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

                </div> */}
                <div className="Employeetext-button">
                    <div className="employee-and-button">
                        <div className="emp-text-side">
                            <p>Receiving Stock Transfer</p>
                        </div>
                        <div className="button-create-side">
                        <div style={{ position: "relative", marginBottom: "15px" }}>
                                <DatePicker
                                  selected={startDate}
                                  onChange={(date) => setStartDate(date)}
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
                                    onClick={handleXCircleClick}
                                  />
                                )}
                              </div>

                              <div style={{ position: "relative", marginBottom: "15px" }}>
                                <DatePicker
                                  selected={endDate}
                                  onChange={(date) => setEndDate(date)}
                                  placeholderText="Choose Date To"
                                  dateFormat="yyyy-MM-dd"
                                  wrapperClassName="custom-datepicker-wrapper"
                                  popperClassName="custom-popper"
                                  style={{fontFamily: 'Poppins, Source Sans Pro'}}
                                />
                                <CalendarBlank
                                  size={20}
                                  weight="thin"
                                  selected={endDate}
                                  onChange={(date) => setEndDate(date)}
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
                                    onClick={handleXClick}
                                  />
                                )}
                              </div>
                              <Form.Select aria-label="item status"
                                value={selectedStatus}
                                onChange={handleStatusChange}
                                style={{height: '40px', fontSize: '15px', marginBottom: '15px', fontFamily: 'Poppins, Source Sans Pro'}}
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
                                  <button className='goesButton' onClick={handleGoButtonClick}>
                                    GO
                                  </button>
                                  <button className='Filterclear' onClick={clearFilters}>
                                    Clear Filter
                                  </button>

                              <div className="Buttonmodal-new">
                            </div>
                        </div>
                    </div>
                </div>
                <div className="table-containss">
                    <div className="main-of-all-tables">
                        <table className='table-hover' id='order-listing'>
                                <thead>
                                <tr>
                                    <th className='tableh'>Stock ID</th>
                                    <th className='tableh'>Source</th>
                                    <th className='tableh'>Destination</th>
                                    <th className='tableh'>Reference #</th>
                                </tr>
                                </thead>
                                {filteredPR.length > 0 ? (
                                <tbody>
                                {filteredPR.map((data, i) => (
                                        <tr key={i}>
                                        <td onClick={() => navigate(`/viewToReceivingStockTransfer/${data.stock_id}`)}>{data.stock_id}</td>
                                        <td onClick={() => navigate(`/viewToReceivingStockTransfer/${data.stock_id}`)}>{data.source}</td>
                                        <td onClick={() => navigate(`/viewToReceivingStockTransfer/${data.stock_id}`)}>{data.destination}</td>
                                        <td onClick={() => navigate(`/viewToReceivingStockTransfer/${data.stock_id}`)}>{data.reference_code}</td>
                                        </tr>
                                      ))}
                              </tbody>
                                ) : (
                                  <div className="no-data">
                                    <img src={NoData} alt="NoData" className="no-data-img" />
                                    <h3>
                                      No Data Found
                                    </h3>
                                  </div>
                              )}
                          </table>
                    </div>
                </div>
            </div>
        ) : (
          <div className="no-access">
            <img src={NoAccess} alt="NoAccess" className="no-access-img"/>
            <h3>
              You don't have access to this function.
            </h3>
          </div>
        )
              )}

        </div>
    </div>
  )
}

export default ReceivingStockTransfer