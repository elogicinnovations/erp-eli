import React, { useEffect, useState, useRef } from "react";
import ReactLoading from "react-loading";
import "../../../assets/global/style.css";
import "../../styles/react-style.css";
import axios from "axios";
import BASE_URL from "../../../assets/global/url";
import swal from "sweetalert";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CalendarBlank, Export, XCircle } from "@phosphor-icons/react";
import { TextField } from "@mui/material";
import NoData from "../../../../src/assets/image/NoData.png";
import NoAccess from "../../../../src/assets/image/NoAccess.png";

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

function ReceivingReport({ authrztn }) {
  const tableRef = useRef();
  const navigate = useNavigate();
  const [department, setDepartment] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [requestsPR, setRequestsPR] = useState([]);
  const [searchRequestPR, setSearchRequestPR] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(requestsPR.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, requestsPR.length);
  const currentItems = requestsPR.slice(startIndex, endIndex);
  const MAX_PAGES = 5;

  const generatePages = () => {
    const pages = [];
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > MAX_PAGES) {
      const half = Math.floor(MAX_PAGES / 2);
      if (currentPage <= half + 1) {
        endPage = MAX_PAGES;
      } else if (currentPage >= totalPages - half) {
        startPage = totalPages - MAX_PAGES + 1;
      } else {
        startPage = currentPage - half;
        endPage = currentPage + half;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (startPage > 1) {
      pages.unshift("...");
    }
    if (endPage < totalPages) {
      pages.push("...");
    }

    return pages;
  };

  //pagination end

  const handlePageClick = (page) => {
    if (page === "...") return;
    setCurrentPage(page);
  };

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
    const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/pr_history/fetchReportReceivingData")
        .then((res) => {
          setRequestsPR(res.data);
          setSearchRequestPR(res.data);
          setIsLoading(false);

          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }, 1000);

    return () => clearTimeout(delay);
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
    setCurrentPage(1);
    const searchTerm = event.target.value.toLowerCase();
    const filteredData = searchRequestPR.filter((data) => {
      return (
        data.pr_num.toLowerCase().includes(searchTerm) ||
        data.status.toLowerCase().includes(searchTerm) ||
        formatDatetime(data.createdAt).toLowerCase().includes(searchTerm) ||
        data.date_needed.toLowerCase().includes(searchTerm) ||
        data.used_for.toLowerCase().includes(searchTerm) ||
        data.masterlist.col_Fname.toLowerCase().includes(searchTerm) ||
        data.masterlist.department.department_name
          .toLowerCase()
          .includes(searchTerm)
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

  const handleXCircleClick = () => {
    setStartDate(null);
  };

  const handleXClick = () => {
    setEndDate(null);
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedDepartment("");
    setSelectedStatus("");
    reloadTable();
  };

  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
        {isLoading ? (
          <div className="loading-container">
            <ReactLoading className="react-loading" type={"bubbles"} />
            Loading Data...
          </div>
        ) : authrztn.includes("Report - View") ? (
          <div className="right-body-contents">
            <div className="Employeetext-button">
              <div className="employee-and-button">
                <div className="emp-text-side ">
                  <p className="potr-text">Receiving Report</p>
                </div>

                <div className="" style={{ marginTop: "5px" }}>
                  <div className="filtering-section">
                    <div className="filter-sect">
                      <div className="date-section-filter">
                        <div
                          style={{ position: "relative", marginBottom: "15px" }}
                        >
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

                        <div
                          style={{ position: "relative", marginBottom: "15px" }}
                        >
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
                      </div>

                      <div className="warehouse-product-filter">
                        <div className="">
                          <Form.Select
                            aria-label="item status"
                            onChange={(e) =>
                              setSelectedDepartment(e.target.value)
                            }
                            value={selectedDepartment}
                            style={{
                              width: "274px",
                              height: "40px",
                              fontSize: "15px",
                              marginBottom: "15px",
                              fontFamily: "Poppins, Source Sans Pro",
                            }}
                            className="select-inv-rep"
                          >
                            <option disabled value="" selected>
                              Select Department
                            </option>
                            <option value={"All"}>All</option>
                            {department.map((dept) => (
                              <option key={dept.id} value={dept.id}>
                                {dept.department_name}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                        <div className="">
                          <Form.Select
                            aria-label="item status"
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            style={{
                              width: "284px",
                              height: "40px",
                              fontSize: "15px",
                              marginBottom: "15px",
                              fontFamily: "Poppins, Source Sans Pro",
                            }}
                            className="select-inv-rep"
                            value={selectedStatus}
                          >
                            <option value="" disabled selected>
                              Select Status
                            </option>
                            <option value={"All"}>All</option>
                            <option value="For-Approval">For-Approval</option>

                            <option value="For-Rejustify">For-Rejustify</option>

                            <option value="For-Canvassing">
                              For-Canvassing
                            </option>

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
                    </div>

                    <div className="pur-filt-container my-4 cus-wid">
                      <button
                        onClick={handleGenerate}
                        className="goesButton cust-height"
                      >
                        FILTER
                      </button>
                      <button
                        className="actualclearfilter Filterclear  cust-height"
                        onClick={clearFilters}
                      >
                        Clear Filter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-containss">
              <div className="main-of-all-tables">
                <div className="searchandexport">
                  <div className="exportfield">
                    <button className="export" onClick={exportToCSV}>
                      <Export size={20} weight="bold" /> <p1>Export</p1>
                    </button>
                  </div>
                  <div className="searchfield">
                    <TextField
                      label="Search"
                      variant="outlined"
                      style={{
                        float: "right",
                      }}
                      InputLabelProps={{
                        style: { fontSize: "14px" },
                      }}
                      InputProps={{
                        style: {
                          fontSize: "14px",
                          // width: "250px",
                          height: "50px",
                        },
                      }}
                      className="act-search"
                      onChange={handleSearch}
                    />
                  </div>
                </div>
                <table ref={tableRef} className="table-hover">
                  <thead>
                    <tr>
                      <th className="tableh">PO Number</th>
                      <th className="tableh">Supplier</th>
                      <th className="tableh">Date Received</th>
                    </tr>
                  </thead>
                  {requestsPR.length > 0 ? (
                    <tbody>
                      {currentItems.map((data, i) => (
                        <tr key={i}>
                          <td>{data.receiving_po.po_id}</td>
                          <td>
                            {
                              data.purchase_req_canvassed_prd
                                .product_tag_supplier.supplier.supplier_name
                            }
                          </td>
                          <td>
                            {data.receiving_po.date_received === null
                              ? "n/a"
                              : data.receiving_po.date_received}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <div className="no-data">
                      <img src={NoData} alt="NoData" className="no-data-img" />
                      <h3>No Data Found</h3>
                    </div>
                  )}
                </table>
              </div>
            </div>
            <nav style={{ marginTop: "15px" }}>
              <ul className="pagination" style={{ float: "right" }}>
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    type="button"
                    style={{
                      fontSize: "14px",
                      cursor: "pointer",
                      color: "#000000",
                      textTransform: "capitalize",
                    }}
                    className="page-link"
                    onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
                  >
                    Previous
                  </button>
                </li>
                {generatePages().map((page, index) => (
                  <li
                    key={index}
                    className={`page-item ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    <button
                      style={{
                        fontSize: "14px",
                        width: "25px",
                        background: currentPage === page ? "#FFA500" : "white",
                        color: currentPage === page ? "#FFFFFF" : "#000000",
                        border: "none",
                        height: "28px",
                      }}
                      className={`page-link ${
                        currentPage === page ? "gold-bg" : ""
                      }`}
                      onClick={() => handlePageClick(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    style={{
                      fontSize: "14px",
                      cursor: "pointer",
                      color: "#000000",
                      textTransform: "capitalize",
                    }}
                    className="page-link"
                    onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        ) : (
          <div className="no-access">
            <img src={NoAccess} alt="NoAccess" className="no-access-img" />
            <h3>You don't have access to this function.</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReceivingReport;
