import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../../Sidebar/sidebar";
import "../../../assets/global/style.css";
import "../../styles/react-style.css";
import axios from "axios";
import BASE_URL from "../../../assets/global/url";
import Button from "react-bootstrap/Button";
import swal from "sweetalert";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  CalendarBlank,
  Export,
} from "@phosphor-icons/react";
import { IconButton, TextField, TablePagination, } from '@mui/material';
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

function POTransactionReports() {
  const tableRef = useRef();
  const navigate = useNavigate();
  const [department, setDepartment] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [requestsPR, setRequestsPR] = useState([]);
  const [searchRequestPR, setSearchRequestPR] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(requestsPR.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, requestsPR.length);
  const currentItems = requestsPR.slice(startIndex, endIndex);

  useEffect(() => {
    axios
      .get(BASE_URL + "/department/fetchtableDepartment")
      .then((res) => {
        setDepartment(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleGenerate = () => {
    if (!startDate || !endDate || !selectedDepartment || !selectedStatus) {
      swal({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all filter sections!",
      });
      return;
    }


    axios
      .get(BASE_URL + "/report_PO/requestPRFiltered", {
        params: {
          selectedDepartment,
          selectedStatus,
          startDate,
          endDate,
        },
      })
      .then((res) => {
        setRequestsPR(res.data); // Update requestsPR state with filtered data
      })
      .catch((err) => console.log(err));
  };

  const reloadTable = () => {
    axios
    .get(BASE_URL + "/report_PO/requestPR")
    .then((res) => {
      setRequestsPR(res.data);
      setSearchRequestPR(res.data);
    })
    .catch((err) => console.log(err));
  };

  const exportToCSV = () => {
    const rows = [];
    const columnStyles = [
      { cellWidth: 25 },
      { cellWidth: 25 },
      { cellWidth: 30 },
      { cellWidth: 40 },
      { cellWidth: 20 },
      { cellWidth: 40 },
      { cellWidth: 30 },
      { cellWidth: 20 },
      { cellWidth: 30 },
    ];

    // Add the column styles as the first row in CSV
    rows.push(columnStyles.map((style) => "").join(","));

    // Add the header row
    const headerData = [
      "PR Number",
      "Requested Date",
      "Date Needed",
      "Used For",
      "Requested by",
      "Requested Department",
      "Status",
    ];
    rows.push(headerData.join(","));

    // Add data rows
    requestsPR.forEach((data) => {
      const rowData = [
        `"${data.pr_num}"`,
        `"${formatDatetime(data.createdAt)}"`,
        `"${data.date_needed}"`,
        `"${data.used_for}"`,
        `"${data.masterlist.col_Fname}"`,
        `"${data.masterlist.department.department_name}"`,
        `"${data.status}"`,
      ];
      rows.push(rowData.join(","));
    });

    // Create a CSV string
    const csvContent = rows.join("\n");

    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: "text/csv" });

    // Create a link element to trigger the download
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "PurchaseOrder Report.csv";

    // Trigger the download
    link.click();
  };

  useEffect(() => {
    reloadTable();
  }, []);

  
  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredData = searchRequestPR.filter((data) => {
      return (
        data.pr_num.toLowerCase().includes(searchTerm) ||
        data.status.toLowerCase().includes(searchTerm) ||
        formatDatetime(data.createdAt).toLowerCase().includes(searchTerm) ||
        data.date_needed.toLowerCase().includes(searchTerm) ||
        data.used_for.toLowerCase().includes(searchTerm) ||
        data.masterlist.col_Fname.toLowerCase().includes(searchTerm) ||
        data.masterlist.department.department_name.toLowerCase().includes(searchTerm)
      );
    });
  
    setRequestsPR(filteredData);
    
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

  // useEffect(() => {
  //   // Initialize DataTable when role data is available
  //   if ($("#order-listing").length > 0 && requestsPR.length > 0) {
  //     $("#order-listing").DataTable();
  //   }
  // }, [requestsPR]);

  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
        <div className="right-body-contents">
          <div className="Employeetext-button">
            <div className="employee-and-button">
              <div className="emp-text-side">
                <p>Purchase Requests Report</p>
              </div>
              <div className="button-create-side">
                <div className="filter">
                  <div className="cat-filter">
                    <div className="warehouse-filter">
                      <Form.Select
                        aria-label="item status"
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        style={{
                          width: "250px",
                          height: "40px",
                          fontSize: "15px",
                          marginBottom: "15px",
                          fontFamily: "Poppins, Source Sans Pro",
                        }}
                      >
                        <option disabled value="" selected>
                          Select Department ...
                        </option>
                        <option value={'All'}>
                            All
                          </option>
                        {department.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.department_name}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <div className="product-filter">
                      <Form.Select
                        aria-label="item status"
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        style={{
                          width: "250px",
                          height: "40px",
                          fontSize: "15px",
                          marginBottom: "15px",
                          fontFamily: "Poppins, Source Sans Pro",
                        }}
                      >
                        <option value="" disabled selected>
                          Select Status
                        </option>
                        <option value={'All'}>
                            All
                          </option>
                        <option value="For-Approval">For-Approval</option>

                        <option value="For-Rejustify">For-Rejustify</option>

                        <option value="For-Canvassing">For-Canvassing</option>

                        <option value="On-Canvass">On-Canvass</option>

                        <option value="For-Approval (PO)">
                          For-Approval (PO)
                        </option>
                        <option value="For-Rejustify (PO)">
                          For-Rejustify (PO)
                        </option>
                      </Form.Select>
                    </div>
                  </div>
                  <div className="date-filter">
                    <div
                      style={{ width: "50%", zIndex: "3", padding: "0 10px" }}
                    >
                      <Form.Group
                        controlId="exampleForm.ControlInput2"
                        className="date"
                      >
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          dateFormat="MM/dd/yyyy"
                          placeholderText="Start Date"
                          className="form-control"
                        />
                      </Form.Group>
                      <CalendarBlank
                        size={20}
                        style={{
                          position: "relative",
                          color: "#9a9a9a",
                          position: "relative",
                          left: "220px",
                          bottom: "30px",
                        }}
                      />
                    </div>
                    <div
                      style={{ width: "50%", zIndex: "3", padding: "0 10px" }}
                    >
                      <Form.Group
                        controlId="exampleForm.ControlInput2"
                        className="date"
                      >
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          dateFormat="MM/dd/yyyy"
                          placeholderText="End Date"
                          className="form-control"
                        />
                      </Form.Group>
                      <CalendarBlank
                        size={20}
                        style={{
                          position: "relative",
                          color: "#9a9a9a",
                          position: "relative",
                          left: "220px",
                          bottom: "30px",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="genbutton">
                  <button onClick={handleGenerate} className="genbutton">
                    Generate
                  </button>
                </div>
                <div className="export-refresh">
                  {/* <button className='export'>
                                 <Export size={20} weight="bold" /> <p1>Export</p1>
                            </button> */}
                  <button className="export" onClick={exportToCSV}>
                    <Export size={20} weight="bold" /> <p1>Export</p1>
                  </button>
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
              <table ref={tableRef} className="table-hover">
                <thead>
                  <tr>
                    <th className="tableh">PR Number</th>
                    <th className="tableh">Requested Date</th>
                    <th className="tableh">Date Needed</th>
                    <th className="tableh">Used For</th>
                    <th className="tableh">Requested by</th>
                    <th className="tableh">Requested Department</th>
                    <th className="tableh">Status</th>
                  </tr>
                </thead>
                {requestsPR.length > 0 ? (
                <tbody>
                  {currentItems.map((data, i) => (
                    <tr key={i}>
                      <td
                        onClick={() =>
                          data.status === "For-Canvassing"
                            ? navigate(`/forCanvass/${data.id}`)
                            : data.status === "On-Canvass"
                            ? navigate(`/onCanvass/${data.id}`)
                            : data.status === "For-Approval (PO)"
                            ? navigate(`/PO_approvalRejustify/${data.id}`)
                            : data.status === "For-Rejustify (PO)"
                            ? navigate(`/PO_approvalRejustify/${data.id}`)
                            : navigate(`/purchaseRequestPreview/${data.id}`)
                        }
                      >
                        {data.pr_num}
                      </td>
                      <td
                        onClick={() =>
                          data.status === "For-Canvassing"
                            ? navigate(`/forCanvass/${data.id}`)
                            : data.status === "On-Canvass"
                            ? navigate(`/onCanvass/${data.id}`)
                            : data.status === "For-Approval (PO)"
                            ? navigate(`/PO_approvalRejustify/${data.id}`)
                            : data.status === "For-Rejustify (PO)"
                            ? navigate(`/PO_approvalRejustify/${data.id}`)
                            : navigate(`/purchaseRequestPreview/${data.id}`)
                        }
                      >
                        {formatDatetime(data.createdAt)}
                      </td>
                      <td
                        onClick={() =>
                          data.status === "For-Canvassing"
                            ? navigate(`/forCanvass/${data.id}`)
                            : data.status === "On-Canvass"
                            ? navigate(`/onCanvass/${data.id}`)
                            : data.status === "For-Approval (PO)"
                            ? navigate(`/PO_approvalRejustify/${data.id}`)
                            : data.status === "For-Rejustify (PO)"
                            ? navigate(`/PO_approvalRejustify/${data.id}`)
                            : navigate(`/purchaseRequestPreview/${data.id}`)
                        }
                      >
                        {data.date_needed}
                      </td>
                      <td
                        onClick={() =>
                          data.status === "For-Canvassing"
                            ? navigate(`/forCanvass/${data.id}`)
                            : data.status === "On-Canvass"
                            ? navigate(`/onCanvass/${data.id}`)
                            : data.status === "For-Approval (PO)"
                            ? navigate(`/PO_approvalRejustify/${data.id}`)
                            : data.status === "For-Rejustify (PO)"
                            ? navigate(`/PO_approvalRejustify/${data.id}`)
                            : navigate(`/purchaseRequestPreview/${data.id}`)
                        }
                      >
                        {data.used_for}
                      </td>
                      <td
                        onClick={() =>
                          data.status === "For-Canvassing"
                            ? navigate(`/forCanvass/${data.id}`)
                            : data.status === "On-Canvass"
                            ? navigate(`/onCanvass/${data.id}`)
                            : data.status === "For-Approval (PO)"
                            ? navigate(`/PO_approvalRejustify/${data.id}`)
                            : data.status === "For-Rejustify (PO)"
                            ? navigate(`/PO_approvalRejustify/${data.id}`)
                            : navigate(`/purchaseRequestPreview/${data.id}`)
                        }
                      >
                        {data.masterlist.col_Fname}
                      </td>
                      <td
                        onClick={() =>
                          data.status === "For-Canvassing"
                            ? navigate(`/forCanvass/${data.id}`)
                            : data.status === "On-Canvass"
                            ? navigate(`/onCanvass/${data.id}`)
                            : data.status === "For-Approval (PO)"
                            ? navigate(`/PO_approvalRejustify/${data.id}`)
                            : data.status === "For-Rejustify (PO)"
                            ? navigate(`/PO_approvalRejustify/${data.id}`)
                            : navigate(`/purchaseRequestPreview/${data.id}`)
                        }
                      >
                        {data.masterlist.department.department_name}
                      </td>
                      <td
                        onClick={() =>
                          data.status === "For-Canvassing"
                            ? navigate(`/forCanvass/${data.id}`)
                            : data.status === "On-Canvass"
                            ? navigate(`/onCanvass/${data.id}`)
                            : data.status === "For-Approval (PO)"
                            ? navigate(`/PO_approvalRejustify/${data.id}`)
                            : data.status === "For-Rejustify (PO)"
                            ? navigate(`/PO_approvalRejustify/${data.id}`)
                            : navigate(`/purchaseRequestPreview/${data.id}`)
                        }
                      >
                        {data.status}
                      </td>
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
  );
}

export default POTransactionReports;
