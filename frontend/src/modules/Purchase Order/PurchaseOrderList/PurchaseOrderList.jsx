import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../../Sidebar/sidebar";
import NoData from '../../../../src/assets/image/NoData.png';
import ReactLoading from 'react-loading';
import NoAccess from '../../../assets/image/NoAccess.png';
import "../../../assets/global/style.css";
import "../../styles/react-style.css";
import axios from "axios";
import BASE_URL from "../../../assets/global/url";
import Button from "react-bootstrap/Button";
import swal from "sweetalert";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { IconButton, TextField, TablePagination, } from '@mui/material';
import usePagination from '@mui/material/usePagination';
import Modal from 'react-bootstrap/Modal';
import {
  CalendarBlank,
  XCircle,
  FilePdf,
  FileCsv,
  FileXls,
  FileJpg,
  FilePng,  
} from "@phosphor-icons/react";
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

function PurchaseOrderList({ authrztn }) {
  const navigate = useNavigate();
  const [openRows, setOpenRows] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredPR, setFilteredPR] = useState([]);
  const [allPR, setAllPR] = useState([]);
  const [specificPR, setSpecificPR] = useState([]);
  const [pr_req, setPr_req] = useState([]);
  const [showRejustify, setshowRejustify] = useState(false);
  const [Rejustifyremarks, setRejustifyremarks] = useState("")
  const [RejustifyFile, setRejustifyFile] = useState([])
  const handleCloseRejustify = () => setshowRejustify(false);

  const handleXCircleClick = () => {
    setStartDate(null);
  };

  const handleXClick = () => {
    setEndDate(null);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

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

  const handleRejustify = async (pr_id) => {
    try {
      setshowRejustify(true);
      const res = await axios
      .get(BASE_URL + '/PR_history/fetchRejustifyRemarks', {
        params: { pr_id: pr_id },
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

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredData = allPR.filter((data) => {
      return (
        data.pr_num.toLowerCase().includes(searchTerm) ||
        data.status.toLowerCase().includes(searchTerm) ||
        formatDatetime(data.createdAt).toLowerCase().includes(searchTerm) ||
        data.remarks.toLowerCase().includes(searchTerm) ||
        data.masterlist.col_Fname.toLowerCase().includes(searchTerm) ||
        data.masterlist.department.department_name.toLowerCase().includes(searchTerm)
      );
    });
  
    setFilteredPR(filteredData);
    
  };

  // const reloadTable = () => {
  //   axios
  //     .get(BASE_URL + "/PR/fetchTable_PO")
  //     .then((res) => {
  //       setPr_req(res.data);
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
      .get(BASE_URL + "/PR/fetchTable_PO")
      .then((res) => {
        setPr_req(res.data);
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

  //Function when user click the Go button to filter
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

  //function when user click the clear filter button
  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedStatus("");

    reloadTable();
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

  // useEffect(() => {
  //   // Initialize DataTable when role data is available and pr_req has changed
  //   if ($("#order-listing").length > 0 && pr_req.length > 0 && !$.fn.DataTable.isDataTable('#order-listing')) {
  //     $('#order-listing').DataTable({
  //       // Specify initial sorting order for the PR #. column
  //       "order": [[ $('.pr-column').index(), 'asc' ]]
  //     });
  //   }
  // }, [pr_req]);

  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($("#order-listing").length > 0 && pr_req.length > 0) {
      $("#order-listing").DataTable();
    }
  }, [pr_req]);

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
        <div className="right-body-contents">
          <div className="Employeetext-button">
            <div className="employee-and-button">
              <div className="emp-text-side">
                <p>Purchase Order List</p>
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
                    style={{ fontFamily: "Poppins, Source Sans Pro" }}
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

                <div style={{ position: "relative", marginBottom: "15px" }}>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    placeholderText="Choose Date To"
                    dateFormat="yyyy-MM-dd"
                    wrapperClassName="custom-datepicker-wrapper"
                    popperClassName="custom-popper"
                    style={{ fontFamily: "Poppins, Source Sans Pro" }}
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
                <Form.Select
                  aria-label="item status"
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  style={{
                    height: "40px",
                    fontSize: "15px",
                    marginBottom: "15px",
                    fontFamily: "Poppins, Source Sans Pro",
                  }}
                  required
                  title="Status is required"
                >
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
                <button className="goesButton" onClick={handleGoButtonClick}>
                  FILTER
                </button>
                <button className="Filterclear" onClick={clearFilters}>
                  Clear Filter
                </button>
                <div className="Buttonmodal-new"></div>
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
              <table className="table-hover">
                <thead>
                  <tr>
                    <th className="tableh"></th>
                    <th className="tableh">PR No.</th>
                    <th className="tableh">Requestor</th>
                    <th className="tableh">Department</th>
                    <th className="tableh">Status</th>
                    <th className="pr-column">Date Approved</th>
                    <th className="tableh">Remarks</th>
                  </tr>
                </thead>
                {filteredPR.length > 0 ? (
                  <tbody>
                    {filteredPR.map((data, i) => (
                       <React.Fragment key={i}>
                      <tr >
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
                        <td
                          onClick={() =>
                            data.status === "For-Approval (PO)"
                              ? navigate(`/PO_approvalRejustify/${data.id}`)
                              : data.status === "For-Rejustify (PO)"
                              ? navigate(`/PO_approvalRejustify/${data.id}`)
                              : data.status === "To-Receive"
                              ? navigate(`/PO_receive/${data.id}`)
                              : navigate(`/purchaseOrderListPreview/${data.id}`)
                          }
                        >
                          {data.pr_num}
                        </td>

                        <td
                          onClick={() =>
                            data.status === "For-Approval (PO)"
                              ? navigate(`/PO_approvalRejustify/${data.id}`)
                              : data.status === "For-Rejustify (PO)"
                              ? navigate(`/PO_approvalRejustify/${data.id}`)
                              : data.status === "To-Receive"
                              ? navigate(`/PO_receive/${data.id}`)
                              : navigate(`/purchaseOrderListPreview/${data.id}`)
                          }
                        >
                          {data.masterlist.col_Fname}
                        </td>
                        <td
                          onClick={() =>
                            data.status === "For-Approval (PO)"
                              ? navigate(`/PO_approvalRejustify/${data.id}`)
                              : data.status === "For-Rejustify (PO)"
                              ? navigate(`/PO_approvalRejustify/${data.id}`)
                              : data.status === "To-Receive"
                              ? navigate(`/PO_receive/${data.id}`)
                              : navigate(`/purchaseOrderListPreview/${data.id}`)
                          }
                        >
                          {data.masterlist.department.department_name}
                        </td>

                        <td
                          onClick={() =>
                            data.status === "For-Approval (PO)"
                              ? navigate(`/PO_approvalRejustify/${data.id}`)
                              : data.status === "For-Rejustify (PO)"
                              ? navigate(`/PO_approvalRejustify/${data.id}`)
                              : data.status === "To-Receive"
                              ? navigate(`/PO_receive/${data.id}`)
                              : navigate(`/purchaseOrderListPreview/${data.id}`)
                          }
                        >
                          <button
                            className="btn btn-secondary"
                            style={{ fontSize: "12px" }}
                          >
                            {data.status === "For-Approval (PO)"
                              ? "For Approval"
                              : data.status === "For-Rejustify (PO)"
                              ? "For Rejustify"
                              : data.status}
                          </button>
                        </td>

                        <td
                          onClick={() =>
                            data.status === "For-Approval (PO)"
                              ? navigate(`/PO_approvalRejustify/${data.id}`)
                              : data.status === "For-Rejustify (PO)"
                              ? navigate(`/PO_approvalRejustify/${data.id}`)
                              : data.status === "To-Receive"
                              ? navigate(`/PO_receive/${data.id}`)
                              : navigate(`/purchaseOrderListPreview/${data.id}`)
                          }
                        >
                          {formatDatetime(data.updatedAt)}
                        </td>

                        <td
                          onClick={() =>
                            data.status === "For-Approval (PO)"
                              ? navigate(`/PO_approvalRejustify/${data.id}`)
                              : data.status === "For-Rejustify (PO)"
                              ? navigate(`/PO_approvalRejustify/${data.id}`)
                              : data.status === "To-Receive"
                              ? navigate(`/PO_receive/${data.id}`)
                              : navigate(`/purchaseOrderListPreview/${data.id}`)
                          }
                        >
                          {data.remarks}
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
                                          {history.status === 'For-Rejustify (PO)' ? (
                                          <td style={{ fontSize: '14px', padding: '10px', fontFamily: 'Arial, sans-serif'}} onClick={() => {
                                            handleRejustify(history.pr_id);
                                          }}>
                                            {history.status}                                            
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
            </div>
          </div>
        </div>
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
  );
}

export default PurchaseOrderList;
