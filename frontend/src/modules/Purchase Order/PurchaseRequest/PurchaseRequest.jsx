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
    Gear, 
    Bell,
    UserCircle,
    Plus,
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

function PurchaseRequest() {



  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filteredPR, setFilteredPR] = useState([]);
  const [allPR, setAllPR] = useState([]);

  const handleXCircleClick = () => {
    setStartDate(null);
  };

  const handleXClick = () => {
    setEndDate(null);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };



  const [PR, setPR] = useState([]);

  const reloadTable = () => {
    axios
      .get(BASE_URL + '/PR/fetchTable')
      .then((res) => {
        setAllPR(res.data);
        setFilteredPR(res.data);
      })
      .catch((err) => console.log(err));
  };
  
  useEffect(() => {
     reloadTable()
    }, []);

    const handleGoButtonClick = () => {
      if (!startDate || !endDate || !selectedStatus) {
        swal({
          icon: 'error',
          title: 'Oops...',
          text: 'Please fill in all filter sections!',
        });
        return;
      }
    
      const filteredData = allPR.filter((data) => {
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
    

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedStatus('');

    reloadTable();
  };

    const CancelRequest = async (row_id, row_status) => {
      swal({
        title: "Are you sure?",
        text: "You are about to cancel the request",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (cancel) => {
        if (cancel) {
          try {
                  // console.log(row_status)
                  if (row_status !== 'For-Approval' && row_status !== 'For-Rejustification') {
                    swal({
                        icon: 'error',
                        title: 'Cancel Prohibited',
                        text: 'You can only cancel a request that is "Pending" OR "For-Rejustification"'
                    });
                }              
                else{
                  const  response = await axios.put(BASE_URL + `/PR/cancel`,{
                    row_id, row_status
                  });
                  
                  if (response.status === 200) {
                    swal({
                      title: 'Cancelled Successfully',
                      text: 'The Request is cancelled successfully',
                      icon: 'success',
                      button: 'OK'
                    }).then(() => {
                      reloadTable();
                      
                    });
                  } else {
                  swal({
                    icon: 'error',
                    title: 'Something went wrong',
                    text: 'Please contact our support'
                  });
                }
              }
          } catch (err) {
            console.log(err);
          }
        } else {
          swal({
            title: "Cancelled Successfully",
            text: "Product not Deleted!",
            icon: "warning",
          });
        }
      });
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
      if ($('#order-listing').length > 0 && PR.length > 0) {
        $('#order-listing').DataTable();
      }
    }, [PR]);


  return (
    <div className="main-of-containers">
        <div className="left-of-main-containers">
            <Sidebar/>
        </div>

        <div className="mid-of-main-containers">
        </div>

        <div className="right-of-main-containers">
            <div className="right-body-contents">
                <div className="settings-search-master">

                <div className="dropdown-and-iconics">
                    <div className="dropdown-side">
                        <div className="emp-text-side">
                            <p>Purchase Request</p>
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
                                  selected={startDate}
                                  onChange={(date) => setStartDate(date)}
                                  placeholderText="Choose Date From"
                                  dateFormat="yyyy-MM-dd"
                                  wrapperClassName="custom-datepicker-wrapper"
                                  popperClassName="custom-popper"
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
                                style={{width: '450px', height: '40px', fontSize: '15px', marginBottom: '15px', fontFamily: 'Poppins, Source Sans Pro'}}
                                required>
                                  <option value="" disabled selected>
                                    Select Status
                                  </option>
                                  <option value="All Status">All Status</option>
                                  <option value="For-Approval">For-Approval</option>
                                  <option value="For-Rejustify">For-Rejustify</option>
                                  <option value="For-Canvassing">For-Canvassing</option>
                                  <option value="Cancelled">Cancelled</option>
                                </Form.Select>  
                                  <button className='goesButton' onClick={handleGoButtonClick}>
                                    GO
                                  </button>
                                  <button className='Filterclear' onClick={clearFilters}>
                                    Clear Filter
                                  </button>
                              <div className="Buttonmodal-new">
                                <button>
                                    <Link to="/createPurchaseRequest" className='button'>
                                    <span style={{ }}>
                                    <Plus size={25} />
                                    </span>
                                    New PR
                                    </Link>
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
                                    <th className='tableh'>PR No.</th>
                                    <th className='tableh'>Requestor</th>
                                    <th className='tableh'>Status</th>
                                    <th className='tableh'>Date Created</th>
                                    <th className='tableh'>Remarks</th>
                                    <th className='tableh'>Action</th>
                                </tr>
                                </thead>
                                {filteredPR.length > 0 ? (
                                <tbody>
                                {filteredPR.map((data, i) => (
                                        <tr key={i}>
                                        <td onClick={() => navigate(`/purchaseRequestPreview/${data.id}`)}>{data.pr_num}</td>
                                        <td onClick={() => navigate(`/purchaseRequestPreview/${data.id}`)}>--</td>
                                        <td onClick={() => navigate(`/purchaseRequestPreview/${data.id}`)}>
                                          <button className='btn btn-secondary' style={{fontSize: '12px'}}>
                                          {data.status}
                                          </button></td>
                                        <td onClick={() => navigate(`/purchaseRequestPreview/${data.id}`)}>{formatDatetime(data.createdAt)}</td>
                                        <td onClick={() => navigate(`/purchaseRequestPreview/${data.id}`)}>{data.remarks}</td>
                                        <td>
                                        <button className='btn btn-danger'onClick={() => CancelRequest(data.id, data.status)}>Cancel</button>
                                        </td>
                                        </tr>
                                      ))}
                            </tbody>
                            ) : (
                              <tbody>
                              <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}>
                                  No matches found.
                                </td>
                              </tr>
                            </tbody>
                          )}
                        </table>
                    </div>
                </div>
            </div>

        </div>
    </div>
  )
}

export default PurchaseRequest