import React, { useEffect, useState } from "react";
import ReactLoading from 'react-loading';
import NoAccess from '../../../assets/image/NoAccess.png';
// import Sidebar from "../../Sidebar/sidebar";
import "../../../assets/global/style.css";
import "../../styles/react-style.css";
import axios from "axios";
import BASE_URL from "../../../assets/global/url";
import swal from "sweetalert";
import { Link, useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Collapse from '@mui/material/Collapse';
// import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconButton, TextField, TablePagination, } from '@mui/material';
import usePagination from '@mui/material/usePagination';
import { styled } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {
  Plus,
  CalendarBlank,
  XCircle,
} from "@phosphor-icons/react";
import NoData from '../../../../src/assets/image/NoData.png';

import "../../../assets/skydash/vendors/feather/feather.css";
import "../../../assets/skydash/vendors/css/vendor.bundle.base.css";
import "../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4.css";
import "../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
import "../../../assets/skydash/vendors/ti-icons/css/themify-icons.css";
import "../../../assets/skydash/css/vertical-layout-light/style.css";
import "../../../assets/skydash/vendors/js/vendor.bundle.base";
import "../../../assets/skydash/vendors/datatables.net/jquery.dataTables";
import "../../../assets/skydash/vendors/datatables.net-bs4/dataTables.bootstrap4";
import "../../../assets/skydash/js/off-canvas";

import * as $ from "jquery";
import Header from "../../../partials/header";
import { jwtDecode } from "jwt-decode";
// const ITEMS_PER_PAGE = 5; 


function PurchaseRequest({ authrztn }) {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredPR, setFilteredPR] = useState([]);
  const [allPR, setAllPR] = useState([]);
  const [openRows, setOpenRows] = useState(null);
  const [specificPR, setSpecificPR] = useState([]);
  const [userId, setuserId] = useState('');

  const decodeToken = () => {
    var token = localStorage.getItem('accessToken');
    if(typeof token === 'string'){
    var decoded = jwtDecode(token);
    setuserId(decoded.id);
    }
  }

  useEffect(() => {
    decodeToken();
  }, [])

  const { items, ...pagination } = usePagination({
    count: Math.ceil(filteredPR.length / 5),
  });

  const List = styled('ul')({
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    float: 'right'
  });

  // const [currentPage, setCurrentPage] = useState(1);

  // const handleChange = (event, value) => {
  //   setCurrentPage(value);
  // };
  
  // const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  // const endIndex = startIndex + ITEMS_PER_PAGE;

  const handleRowToggle = async (id) => {
    try {
      const res = await axios.get(BASE_URL + '/PR_history/fetchdropdownData', {
        params: { id: id },
      });

      setSpecificPR(res.data);

      setOpenRows((prevOpenRow) => (prevOpenRow === id ? null : id)); // Toggle openRow
    } catch (err) {
      console.error(err);
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

  const [PR, setPR] = useState([]);

  // const reloadTable = () => {
  //   axios
  //     .get(BASE_URL + "/PR/fetchTable")
  //     .then((res) => {
  //       setAllPR(res.data);
  //       setFilteredPR(res.data);
  //     })
  //     .catch((err) => console.log(err));
  // };

  // useEffect(() => {
  //   reloadTable();
  // }, []);

  const reloadTable = () => {
    const delay = setTimeout(() => {
    axios
      .get(BASE_URL + "/PR/fetchTable")
      .then((res) => {
        setAllPR(res.data);
        setFilteredPR(res.data);
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
    reloadTable();
  }, []);
  

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredData = allPR.filter((data) => {
      return (
        data.pr_num.toLowerCase().includes(searchTerm) ||
        data.status.toLowerCase().includes(searchTerm) ||
        formatDatetime(data.createdAt).toLowerCase().includes(searchTerm) ||
        data.remarks.toLowerCase().includes(searchTerm)
      );
    });
  
    setFilteredPR(filteredData);
    
  };

  const handleGoButtonClick = () => {
    if (!startDate || !endDate || !selectedStatus) {
      swal({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all filter sections!",
      });
      return;
    }

    const filteredData = allPR.filter((data) => {
      const createdAt = new Date(data.createdAt);

      console.log("startDate:", startDate);
      console.log("endDate:", endDate);
      console.log("createdAt:", createdAt);

      const isWithinDateRange =
        (!startDate || createdAt >= startDate.setHours(0, 0, 0, 0)) &&
        (!endDate || createdAt <= endDate.setHours(23, 59, 59, 999));

      const isMatchingStatus =
        selectedStatus === "All Status" || data.status === selectedStatus;

      return isWithinDateRange && isMatchingStatus;
    });

    setFilteredPR(filteredData);
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedStatus("");

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
          if (
            row_status !== "For-Approval" &&
            row_status !== "For-Rejustification"
          ) {
            swal({
              icon: "error",
              title: "Cancel Prohibited",
              text: 'You can only cancel a request that is "Pending" OR "For-Rejustification"',
            });
          } else {
            const response = await axios.put(BASE_URL + `/PR/cancel`, {
              row_id,
              row_status,
              userId,
            });

            if (response.status === 200) {
              swal({
                title: "Purchase Request Cancel Successful",
                text: "The Purchase Request is Cancelled successfully",
                icon: "success",
                button: "OK",
              }).then(() => {
                reloadTable();
              });
            } else {
              swal({
                icon: "error",
                title: "Something went wrong",
                text: "Please contact our support",
              });
            }
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        swal({
          title: "Cancelled Successfully",
          text: "PO not Deleted!",
          icon: "warning",
        });
      }
    });
  };

  //date format
  function formatDatetime(datetime) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(datetime).toLocaleString("en-US", options);
  }

  //date format
  function formatDatetime(datetime) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(datetime).toLocaleString("en-US", options);
  }
//WAG e delete
  // useEffect(() => {
  //   if ($("#order-listing").length > 0 && allPR.length > 0 && !$.fn.DataTable.isDataTable('#order-listing')) {
  //     $('#order-listing').DataTable({
  //       "order": [[ $('.pr-column').index(), 'desc' ]]
  //     });
  //   }
  // }, [allPR]);

  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($('#order-listing').length > 0 && allPR.length > 0) {
      $('#order-listing').DataTable();
    }
  }, [allPR]);


  const [showDropdown, setShowDropdown] = useState(false);

  // Function to toggle the visibility of the dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  

  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
      {isLoading ? (
                <div className="loading-container">
                  <ReactLoading className="react-loading" type={'bubbles'}/>
                  Loading Data...
                </div>
              ) : (
        authrztn.includes('PR - View') ? (
        <div className="right-body-contents">
          <div className="Employeetext-button">
            <div className="employee-and-button">
              <div className="emp-text-side">
                <p>Purchase Request</p>
              </div>
              <div className="resp">
                <div className="button-create-side">
                  <div className="date-beg" style={{ position: "relative", marginBottom: "15px" }}>
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
                        cursor: "pointer",
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
                          cursor: "pointer",
                        }}
                        onClick={handleXCircleClick}
                      />
                    )}
                  </div>

                  <div className="date-end" style={{ position: "relative", marginBottom: "15px" }}>
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
                        cursor: "pointer",
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
                          cursor: "pointer",
                        }}
                        onClick={handleXClick}
                      />
                    )}
                  </div>
                  <Form.Select className="fil-stat"
                    aria-label="item status"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    style={{
                      height: "40px",
                      fontSize: "15px",
                      marginBottom: "15px",
                      fontFamily: "Poppins, Source Sans Pro",
                    }}
                    required>
                    <option value="" disabled selected>
                      Select Status
                    </option>
                    <option value="All Status">All Status</option>
                    <option value="For-Approval">For-Approval</option>
                    <option value="For-Rejustify">For-Rejustify</option>
                    <option value="For-Canvassing">For-Canvassing</option>
                    <option value="To-Receive">To Receive</option>
                    <option value="Cancelled">Cancelled</option>
                  </Form.Select>
                  <button className="goesButton" onClick={handleGoButtonClick}>
                    FILTER
                  </button>
                  <button className="Filterclear" onClick={clearFilters}>
                    Clear Filter
                  </button>
                  <div className="Buttonmodal-new">

                    { authrztn.includes('PR - Add') && (
                    <Link to="/createPurchaseRequest" className="button">
                      <span style={{}}>
                        <Plus size={25} />
                      </span>
                      New PR
                    </Link>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="table-containss">
            <div className="main-of-all-tables">
                <TextField
                  label="Search"
                  variant="outlined"
                  style={{ marginBottom: '10px', 
                  float: 'right',
                  }}
                  InputLabelProps={{
                    style: { fontSize: '14px'},
                  }}
                  InputProps={{
                    style: { fontSize: '14px', width: '250px', height: '50px' },
                  }}
                  onChange={handleSearch}/>
              <table aria-label="collapsible table" className='table-hover'>
                <thead>
                  <tr>
                    <th className="tableh"></th>
                    <th className="tableh">PR #.</th>
                    <th className="tableh">Requestor</th>
                    <th className="tableh">Department</th>
                    <th className="tableh">Status</th>
                    <th className="pr-column">Date Created</th>
                    <th className="tableh">Remarks</th>
                    <th className="tableh">Action</th>
                  </tr>
                </thead>
                {filteredPR.length > 0 ? (
                  <tbody>
                    {filteredPR.map((data, i) => (
                      <React.Fragment key={i}>
                        <tr>
                          <td>
                            <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() => handleRowToggle(data.id)}>
                               {openRows === data.id ? (
                                  <KeyboardArrowUpIcon style={{ fontSize: 25 }}/>
                                ) : (
                                  <KeyboardArrowDownIcon style={{ fontSize: 25 }}/>
                                )}
                              </IconButton>
                          </td>
                          <td onClick={() => 
                                data.status === 'For-Canvassing' ?
                                navigate(`/forCanvass/${data.id}`) :   
                                data.status === 'On-Canvass' ?
                                navigate(`/onCanvass/${data.id}`) :                       
                                navigate(`/purchaseRequestPreview/${data.id}`)
                              }
                          >
                            {data.pr_num}
                          </td>
                            <td onClick={() => 
                                data.status === 'For-Canvassing' ?
                                navigate(`/forCanvass/${data.id}`) :   
                                data.status === 'On-Canvass' ?
                                navigate(`/onCanvass/${data.id}`) :                       
                                navigate(`/purchaseRequestPreview/${data.id}`)
                              }
                          >
                           {data.masterlist.col_Fname}
                          </td>
                          <td onClick={() => 
                                data.status === 'For-Canvassing' ?
                                navigate(`/forCanvass/${data.id}`) :   
                                data.status === 'On-Canvass' ?
                                navigate(`/onCanvass/${data.id}`) :                       
                                navigate(`/purchaseRequestPreview/${data.id}`)
                              }
                          >
                           {data.masterlist.department.department_name}
                          </td>
                          <td onClick={() => 
                                data.status === 'For-Canvassing' ?
                                navigate(`/forCanvass/${data.id}`) :   
                                data.status === 'On-Canvass' ?
                                navigate(`/onCanvass/${data.id}`) :                       
                                navigate(`/purchaseRequestPreview/${data.id}`)
                              }
                          >
                            <p className="" style={{ fontSize: "12px" }}>
                              {data.status}
                            </p>
                          </td>
                          <td onClick={() => 
                          data.status === 'For-Canvassing' ?
                            navigate(`/forCanvass/${data.id}`) :   
                            data.status === 'On-Canvass' ?
                            navigate(`/onCanvass/${data.id}`) :                       
                            navigate(`/purchaseRequestPreview/${data.id}`)
                          }
                          style={{fontSize: '14px'}}
                          >
                            {formatDatetime(data.createdAt)}
                          </td>
                          <td onClick={() =>                      
                                data.status === 'For-Canvassing' ?
                                navigate(`/forCanvass/${data.id}`) :   
                                data.status === 'On-Canvass' ?
                                navigate(`/onCanvass/${data.id}`) :                       
                                navigate(`/purchaseRequestPreview/${data.id}`)
                              }                      
                            >
                            {data.remarks}
                          </td>
                          <td>
                            <div className="d-flex flex-direction-row align-items-center">
                              { authrztn.includes('PR - Reject') && (
                                data.status !== "Cancelled" && data.status !== "For-Canvassing"
                                && data.status !== "On-Canvass" && data.status !== "For-Approval (PO)" 
                                && data.status !== "To-Receive" && data.status !== "Delivered") && (
                                  <button
                                    className="btn btn-danger"
                                    onClick={() => CancelRequest(data.id, data.status)}
                                  >
                                    Cancel
                                  </button>
                              )}
                            </div>                   
                            </td>
                          </tr>
                          <tr>
                            <td style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: '#F5EFED' }} colSpan="8">
                              <Collapse in={openRows === data.id} timeout="auto" unmountOnExit>
                                <div style={{width: '95%'}}>
                                    <thead style={{borderBottom: '1px solid #CECECE'}}>
                                      <tr>
                                        <th style={{backgroundColor: 'inherit', fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>Status</th>
                                        <th style={{backgroundColor: 'inherit', fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>Date</th>
                                      </tr>
                                      </thead>
                                      <tbody>
                                        {specificPR.map((history, i) => (
                                        <tr key={i}>
                                          <td style={{fontSize: '14px', padding: '10px', fontFamily: 'Arial, sans-serif'}}>{history.status}</td>
                                          <td style={{fontSize: '14px', padding: '10px', fontFamily: 'Arial, sans-serif'}}>{formatDatetime(history.createdAt)}</td>
                                        </tr>
                                        ))}
                                  </tbody>
                                  </div>
                              </Collapse>
                            </td>
                          </tr>
                        </React.Fragment>
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
              {/* <Stack spacing={2} style={{float: 'right'}}>
                  <Pagination
                    count={Math.ceil(filteredPR.length / ITEMS_PER_PAGE)}
                    page={currentPage}
                    onChange={handleChange}
                    size="large"
                    sx={{
                      '& .MuiPaginationItem-icon': {
                        fontSize: '30px',
                      },
                      '& .MuiPaginationItem-page': {
                        fontSize: '13px',
                      },
                    }}
                  />
              </Stack> */}
              <nav>
                <List>
                  {items.map(({ page, type, selected, ...item }, index) => {
                    let children = null;
                    if (type === 'start-ellipsis' || type === 'end-ellipsis') {
                      children = '…';
                    } else if (type === 'page') {
                      children = (
                        <button
                          type="button"
                          style={{
                            fontWeight: selected ? 'bold' : undefined,
                            fontSize: '14px',
                            width: '25px',
                            background: '#FFA500',
                            color: '#FFFFFF',
                            border: 'none',
                            height: '28px',

                          }}
                          {...item}
                        >
                          {page}
                        </button>
                      );
                    } else {
                      children = (
                        <button type="button" {...item}
                        style={{fontSize: '14px',
                        cursor: 'pointer',
                        color: '#000000',
                        textTransform: 'capitalize'}}>
                          {type}
                        </button>
                      );
                    }

                    return <li key={index}>{children}</li>;
                  })}
                </List>
              </nav>
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
  );
}

export default PurchaseRequest;
