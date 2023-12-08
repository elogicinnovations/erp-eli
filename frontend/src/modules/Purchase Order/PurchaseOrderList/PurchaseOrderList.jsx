import React, { useEffect, useState, useRef } from 'react';
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
    CalendarBlank,
    XCircle
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

function PurchaseOrderList() {

const navigate = useNavigate();
const [startDate, setStartDate] = useState(null);

const handleXCircleClick = () => {
  setStartDate(null);
};
const [endDate, setEndDate] = useState(null);
const handleXClick = () => {
  setEndDate(null);
};

const [pr_req, setPr_req] = useState([]);

  const reloadTable = () =>{
    axios.get(BASE_URL + '/PR/fetchTable_PO')
    .then(res => setPr_req(res.data))
    .catch(err => console.log(err));
  }
  
  useEffect(() => {
     reloadTable()
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
      if ($('#order-listing').length > 0 && pr_req.length > 0) {
        $('#order-listing').DataTable();
      }
    }, [pr_req]);


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
                            <p>Purchase Order List</p>
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
                
                <div className="clone-dropdown">
                  <div className="dateandselet">
                      <Form>
                        <div className="row">
                          <div className="col-4">
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
                          </div>

                          <div className="col-4">
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
                          </div>

                          <div className="col-4">
                            <Form.Select aria-label="item status"
                            style={{width: '250px', height: '40px', fontSize: '15px'}}>
                              <option disabled selected>
                                Select Status
                              </option>
                            </Form.Select>
                          </div>
                        </div>
                      </Form>
                      </div>

                      <div className="buttonGo">
                          <button className='btngo'>
                            GO
                          </button>
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
                              <th className='tableh'>Date Approved</th>
                              <th className='tableh'>Remarks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pr_req.map((data, i) => (
                              <tr key={i}>
                             <td
                                  onClick={() =>
                                    data.status === 'For-Approval (PO)' ? 
                                    navigate(`/PO_approvalRejustify/${data.id}`) :
                                    data.status === 'For-Rejustify (PO)' ?
                                      navigate(`/PO_approvalRejustify/${data.id}`) :
                                      data.status === 'To-Receive' ?
                                      navigate(`/PO_receive/${data.id}`) :
                                      navigate(`/purchaseOrderListPreview/${data.id}`)
                                  }
                                >
                                  {data.pr_num}
                                </td>

                              <td onClick={() => 
                                          data.status === 'For-Approval (PO)' ? 
                                            navigate(`/PO_approvalRejustify/${data.id}`) :
                                            data.status === 'For-Rejustify (PO)' ?
                                              navigate(`/PO_approvalRejustify/${data.id}`) :
                                              data.status === 'To-Receive' ?
                                              navigate(`/PO_receive/${data.id}`) :
                                              navigate(`/purchaseOrderListPreview/${data.id}`)
                                        }>
                                    --
                                </td>

                                

                                <td onClick={() => 
                                           data.status === 'For-Approval (PO)' ? 
                                           navigate(`/PO_approvalRejustify/${data.id}`) :
                                           data.status === 'For-Rejustify (PO)' ?
                                             navigate(`/PO_approvalRejustify/${data.id}`) :
                                             data.status === 'To-Receive' ?
                                             navigate(`/PO_receive/${data.id}`) :
                                             navigate(`/purchaseOrderListPreview/${data.id}`)
                                        }>
                                           { (data.status === 'For-Approval (PO)' ? 'For Approval' :
                                            data.status === 'For-Rejustify (PO)' ? 'For Rejustify' :
                                            data.status)}
                                  </td>

                                  <td onClick={() => 
                                           data.status === 'For-Approval (PO)' ? 
                                           navigate(`/PO_approvalRejustify/${data.id}`) :
                                           data.status === 'For-Rejustify (PO)' ?
                                             navigate(`/PO_approvalRejustify/${data.id}`) :
                                             data.status === 'To-Receive' ?
                                             navigate(`/PO_receive/${data.id}`) :
                                             navigate(`/purchaseOrderListPreview/${data.id}`)
                                        }>
                                    {formatDatetime(data.updatedAt)}
                                </td>

                                <td onClick={() => 
                                           data.status === 'For-Approval (PO)' ? 
                                           navigate(`/PO_approvalRejustify/${data.id}`) :
                                           data.status === 'For-Rejustify (PO)' ?
                                             navigate(`/PO_approvalRejustify/${data.id}`) :
                                             data.status === 'To-Receive' ?
                                             navigate(`/PO_receive/${data.id}`) :
                                             navigate(`/purchaseOrderListPreview/${data.id}`)
                                        }>
                                   {data.remarks}
                                </td>

                          
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

export default PurchaseOrderList