import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import NoData from '../../../assets/image/NoData.png';
import NoAccess from '../../../assets/image/NoAccess.png';
// import Sidebar from '../../Sidebar/sidebar';
import '../../../assets/global/style.css';
import '../../styles/react-style.css';
import axios from 'axios';
import BASE_URL from '../../../assets/global/url';
// import Button from 'react-bootstrap/Button';
import swal from 'sweetalert';
import { Link, useNavigate } from 'react-router-dom';
// import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconButton, TextField, TablePagination, } from '@mui/material';
import usePagination from '@mui/material/usePagination';
import { styled } from '@mui/material/styles';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import {
  FilePdf,
  FileCsv,
  FileXls,
  FileJpg,
  FilePng,    
} from "@phosphor-icons/react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {
    Plus,
    DotsThreeCircle,
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
  import { jwtDecode } from "jwt-decode";
  import * as $ from 'jquery';

function StockManagement({ authrztn }) {

  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [stockMgnt, setStockMgnt] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [rotatedIcons, setRotatedIcons] = useState(Array(stockMgnt.length).fill(false));
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [userId, setuserId] = useState('');
  
  const [stockTransfer, setStockTransfer] = useState([]);
  const [searchStock, setSearchStock] = useState([]);
  const [specificStock, setSpecificStock] = useState([])
  const [openRows, setOpenRows] = useState(null);
  const [showRejustify, setshowRejustify] = useState(false);
  const [Rejustifyremarks, setRejustifyremarks] = useState("")
  const [RejustifyFile, setRejustifyFile] = useState([])
  const handleCloseRejustify = () => setshowRejustify(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(stockTransfer.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, stockTransfer.length);
  const currentItems = stockTransfer.slice(startIndex, endIndex);

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

  const handleRejustify = async (stock_id) => {
    try {
      setshowRejustify(true);
      const res = await axios
      .get(BASE_URL + '/StockTransfer/fetchRejustifyRemarks', {
        params: { stock_id: stock_id },
      });
      setRejustifyremarks(res.data.remarks)
      setRejustifyFile(res.data)
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadFile = async () => {
    try {
      if (!RejustifyFile) {
        console.error('No file available for download');
        return;
      }

      const { file, mimeType, fileExtension } = RejustifyFile;

      // Convert the array data into a Uint8Array
      const uint8Array = new Uint8Array(file.data);

      // Create a Blob object from the Uint8Array with the determined MIME type
      const blob = new Blob([uint8Array], { type: mimeType });

      // Create a URL for the Blob object
      const url = window.URL.createObjectURL(blob);

      // Set a default file name with the correct file extension
      const fileName = `RejustifyFile.${fileExtension}`;

      // Create a link element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);

      // Trigger the download
      a.click();

      // Clean up resources
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRowToggle = async (stock_id) => {
    try {
      const res = await axios.get(BASE_URL + '/StockTransfer/fetchdropdownData', {
        params: { stock_id: stock_id },
      });

      setSpecificStock(res.data);

      setOpenRows((prevOpenRow) => (prevOpenRow === stock_id ? null : stock_id));
    } catch (err) {
      console.error(err);
    }
  };



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



    
    // Fetch Data
    // useEffect(() => {
    // axios.get(BASE_URL + '/StockTransfer/fetchTable')
    // .then(res => setStockTransfer(res.data))
    // .catch(err => console.log(err));
    // }, []);

    useEffect(() => {
      axios.get(BASE_URL + '/StockTransfer/fetchTable')
          .then(res => {
              setStockTransfer(res.data);
              setSearchStock(res.data);
          })
          .catch(err => console.log(err));
  }, []);
  
    const [updateModalShow, setUpdateModalShow] = useState(false);
    const handleModalToggle = () => {
      setUpdateModalShow(!updateModalShow);
    };

    const handleSearch = (event) => {
      const searchTerm = event.target.value.toLowerCase();
      const filteredData = searchStock.filter((data) => {
        return (
          data.status.toLowerCase().includes(searchTerm) ||
          formatDatetime(data.createdAt).toLowerCase().includes(searchTerm) ||
          data.remarks.toLowerCase().includes(searchTerm) ||
          data.SourceWarehouse.warehouse_name.toLowerCase().includes(searchTerm) ||
          data.DestinationWarehouse.warehouse_name.toLowerCase().includes(searchTerm)
        );
      });
    
      setStockTransfer(filteredData);
      
    };
    
    const handleDelete = async id => {
      swal({
        title: "Are you sure?",
        text: "Once Cancelled, all stock transfer will return to inventory!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          try {
            const response = await axios.delete(BASE_URL + `/stockTransfer/delete/${id}?userId=${userId}`);

            if (response.status === 200) {
              swal({
                title: "Cancelled Stock Transfer!",
                text: "The Stock Transfer has been Cancelled Successfully.",
                icon: "success",
                button: "OK",
              }).then(() => {
                setStockTransfer(prev => prev.filter(data => data.id !== id));
                window.location.reload();
              });
            } else if (response.status === 202) {
              swal({
                icon: 'error',
                title: 'Delete Prohibited',
                text: 'You cannot delete Stock Trasnfer that is used'
              });
            } else {
              swal({
                icon: 'error',
                title: 'Something went wrong',
                text: 'Please contact our support'
              });
            }

          } catch (err) {
            console.log(err);
          }
        }
      });
    }; 

    
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filteredPR, setFilteredPR] = useState([]);

  const reloadTable = () => {
    const delay = setTimeout(() => {
    axios
      .get(BASE_URL + '/PR/fetchTableToReceive')
      .then((res) => {
        setStockMgnt(res.data)
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
    
      const filteredData = stockMgnt.filter((data) => {
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
                authrztn.includes('Stock Management - View') ? (
            <div className="right-body-contents">
                <div className="settings-search-master">
                </div>
                <div className="Employeetext-button">
                    <div className="employee-and-button">
                        <div className="emp-text-side">
                            <p>Stock Transfer</p>
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
                                    FILTER
                                  </button>
                                  <button className='Filterclear' onClick={clearFilters}>
                                    Clear Filter
                                  </button>
                        <div className="Buttonmodal-new">
                          { authrztn?.includes('Stock Management - Add') && (
                                <Link to="/createStockTransfer" className='button'>
                                <span style={{ }}>
                                <Plus size={25} />Stock Transfer
                                </span>
                                </Link>
                          )}

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
                                    {/* <th className='tableh'>Transfer ID</th> */}
                                    <th className='tableh'>Description</th>
                                    <th className='tableh'>Source Warehouse</th>
                                    <th className='tableh'>Destination</th>
                                    <th className='tableh'>Status</th>
                                    <th className='tableh'>Date Transfered</th>
                                    <th className='tableh'>Action</th>
                                </tr>
                                </thead>
                                {stockTransfer.length > 0 ? (
                                <tbody>
                                      {currentItems.map((data,i) =>(
                                        <React.Fragment key={i}>
                                        <tr>
                                        <td>
                                            <IconButton
                                                aria-label="expand row"
                                                size="small"
                                                onClick={() => handleRowToggle(data.stock_id)}>
                                              {openRows === data.stock_id ? (
                                                  <KeyboardArrowUpIcon style={{ fontSize: 25 }}/>
                                                ) : (
                                                  <KeyboardArrowDownIcon style={{ fontSize: 25 }}/>
                                                )}
                                              </IconButton>
                                          </td>
                                          {/* <td onClick={() => navigate(`/stockManagementPreview/${data.stock_id}`)}>{data.stock_id}</td> */}
                                          <td onClick={() => navigate(`/stockManagementPreview/${data.stock_id}`)}>{data.remarks}</td>
                                          <td onClick={() => navigate(`/stockManagementPreview/${data.stock_id}`)}>{data.SourceWarehouse.warehouse_name}</td>
                                          <td onClick={() => navigate(`/stockManagementPreview/${data.stock_id}`)}>{data.DestinationWarehouse.warehouse_name}</td>
                                          <td onClick={() => navigate(`/stockManagementPreview/${data.stock_id}`)}>{data.status}</td>
                                          <td onClick={() => navigate(`/stockManagementPreview/${data.stock_id}`)}>{formatDatetime(data.createdAt)}</td>
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
                                          <button onClick={() => handleDelete(data.stock_id)} className='btn'>Cancel</button>
                                          </div>
                                          </td>
                                        </tr>
                                        <tr>
                                            <td style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: '#F5EFED' }} colSpan="7">
                                              <Collapse in={openRows === data.stock_id} timeout="auto" unmountOnExit>
                                                <div style={{width: '95%'}}>
                                                    <thead style={{borderBottom: '1px solid #CECECE'}}>
                                                      <tr>
                                                        <th style={{backgroundColor: 'inherit', fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>Status</th>
                                                        <th style={{backgroundColor: 'inherit', fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>Date</th>
                                                      </tr>
                                                      </thead>
                                                      <tbody>
                                                        {specificStock.map((history, i) => (
                                                        <tr key={i}>
                                                          {history.status === 'For-Rejustify (Stock Transfer)' ? (
                                                          <td style={{ fontSize: '14px', padding: '10px', fontFamily: 'Arial, sans-serif'}} onClick={() => {
                                                            handleRejustify(history.stockTransfer_id);
                                                          }}>
                                                            <div className="for-rejustify"
                                                            style={{
                                                              color: "white",
                                                              padding: "5px",
                                                              borderRadius: "5px",
                                                              textAlign: "center",
                                                              width: "210px",
                                                              backgroundColor: "red"}}>
                                                              {history.status}  
                                                            </div>
                                                                                                      
                                                          </td>
                                                          ) : (
                                                            <td style={{ fontSize: '14px', padding: '10px', fontFamily: 'Arial, sans-serif' }}>
                                                              {history.status}                                            
                                                            </td>
                                                            )}
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

                          <nav>
                              <ul className="pagination" style={{ float: "right" }}>
                                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                  <button
                                  type="button"
                                  style={{fontSize: '14px',
                                  cursor: 'pointer',
                                  color: '#000000',
                                  textTransform: 'capitalize',
                                }}
                                  className="page-link" 
                                  onClick={() => setCurrentPage((prevPage) => prevPage - 1)}>Previous</button>
                                </li>
                                {[...Array(totalPages).keys()].map((num) => (
                                  <li key={num} className={`page-item ${currentPage === num + 1 ? "active" : ""}`}>
                                    <button 
                                    style={{
                                      fontSize: '14px',
                                      width: '25px',
                                      background: currentPage === num + 1 ? '#FFA500' : 'white', // Set background to white if not clicked
                                      color: currentPage === num + 1 ? '#FFFFFF' : '#000000', 
                                      border: 'none',
                                      height: '28px',
                                    }}
                                    className={`page-link ${currentPage === num + 1 ? "gold-bg" : ""}`} onClick={() => setCurrentPage(num + 1)}>{num + 1}</button>
                                  </li>
                                ))}
                                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                  <button
                                  style={{fontSize: '14px',
                                  cursor: 'pointer',
                                  color: '#000000',
                                  textTransform: 'capitalize'}}
                                  className="page-link" onClick={() => setCurrentPage((prevPage) => prevPage + 1)}>Next</button>
                                </li>
                              </ul>
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
        <Modal
            show={showRejustify}
            onHide={handleCloseRejustify}
            backdrop="static"
            keyboard={false}
            size="lg"
          >
              <Modal.Header closeButton>
                <Modal.Title style={{fontSize: '24px', fontFamily: 'Poppins, Source Sans Pro'}}>For-Rejustify</Modal.Title>
                  
              </Modal.Header>
              <Modal.Body>
                  <div className="rejustify-modal-container">
                      <div className="rejustify-modal-content">
                          <div className="remarks-file-section">
                              <div className="remarks-sec">
                              <p>
                                Remarks
                              </p>
                              <Form.Control
                                  as="textarea"
                                  rows={3}
                                  style={{
                                  fontFamily: 'Poppins, Source Sans Pro',
                                  fontSize: "16px",
                                  height: "200px",
                                  maxHeight: "200px",
                                  resize: "none",
                                  overflowY: "auto",
                                  }}
                                  disabled
                                  value={Rejustifyremarks}
                                />
                              </div>

                             <div className="file-sec-container">
                                  <p>
                                    File Attached
                                  </p>
                              <div className="file-sec">
                                  <div className="file-content" >
                                    <Button onClick={handleDownloadFile}>
                                          Download File
                                          {RejustifyFile && RejustifyFile.fileExtension && (
                                            <>
                                              {RejustifyFile.fileExtension === 'pdf' && <FilePdf size={32} color="#ef6262" weight="fill" />}
                                              {RejustifyFile.fileExtension === 'csv' && <FileCsv size={32} color="#8fffa2" weight="fill" />}
                                              {RejustifyFile.fileExtension === 'xls' && <FileXls size={32} color="#8fffa2" weight="fill" />}
                                              {RejustifyFile.fileExtension === 'jpg' && <FileJpg size={32} color="#757575" weight="fill" />}
                                              {RejustifyFile.fileExtension === 'png' && <FilePng size={32} color="#757575" weight="fill" />}
                                            </>
                                          )}
                                        </Button>
                                  </div>
                              </div>
                            </div>     

                          </div>
                      </div>
                  </div>
              </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
          </Modal>
    </div>
  )
}

export default StockManagement