//test test
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
import { CalendarBlank, Export, XCircle } from "@phosphor-icons/react";
import NoData from "../../../../src/assets/image/NoData.png";
import { IconButton, TextField, TablePagination } from "@mui/material";

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

function BIS_Summary() {
  const tableRef = useRef();

  const navigate = useNavigate();
  const [category, setcategory] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bisContent, setBisContent] = useState([]);
  const [searchBIS, setSearchBIS] = useState([]);



//pagination start
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(bisContent.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, bisContent.length);
  const currentItems = bisContent.slice(startIndex, endIndex);
  const MAX_PAGES = 5; // Maximum number of pages to display without ellipsis

  // Function to generate an array of page numbers with ellipsis
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
      pages.unshift('...');
    }
    if (endPage < totalPages) {
      pages.push('...');
    }

    return pages;
  };

  //pagination end

  const handlePageClick = (page) => {
    if (page === '...') return;
    setCurrentPage(page);
  };

  const handleXCircleClick = () => {
    setStartDate(null);
  };

  const handleXClick = () => {
    setEndDate(null);
  };

  const reloadTable = () => {
    axios
      .get(BASE_URL + "/category/fetchTable")
      .then((res) => {
        setcategory(res.data);
        // setSearchCategory(res.data)
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(BASE_URL + "/report_BIS_Summary/content_fetch")
      .then((res) => {
        setBisContent(res.data);
        setSearchBIS(res.data)
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    reloadTable();
  }, []);

  const handleGenerate = () => {
    if (!startDate || !endDate) {
      swal({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all filter sections!",
      });
      return;
    }

    axios
      .get(BASE_URL + "/report_BIS_Summary/filter", {
        params: {
          strDate: startDate,
          enDate: endDate,
        },
      })
      .then((res) => {
        setBisContent(res.data);
        setSearchBIS(res.data)
      })
      .catch((err) => console.log(err));
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    reloadTable();
  };

  const handleSearch = (event) => {
    setCurrentPage(1);
    const searchTerm = event.target.value.toLowerCase();
    
    const filteredSearchBIS = searchBIS.filter((data) => {
      // Filter by costCenterName
      const costCenterNameMatches = data.costCenterName.toLowerCase().includes(searchTerm);
  
      // Filter by prices in each category
      const categoryMatches = Object.values(data.prices).some(price => price.toString().toLowerCase().includes(searchTerm));
  
      // Return true if either costCenterName or any price matches the search term
      return costCenterNameMatches || categoryMatches;
    });
  
    setBisContent(filteredSearchBIS);
  };


  const exportToCSV = () => {
    let shouldExport = true;

    // bisContent.forEach((item) => {
    //   if (item.inventory_prd && item.inventory_prd.freight_cost === 0) {
    //     shouldExport = false; // Set the flag to false if condition is met
    //     swal({
    //       icon: "error",
    //       title: "Oops...",
    //       text: "There's still product that has no Freight Cost",
    //     });
    //     return;
    //   } else if (item.inventory_prd && item.inventory_prd.custom_cost === 0) {
    //     shouldExport = true;
    //     swal({
    //       icon: "warning",
    //       title: "Warning",
    //       text: "There's a product that has no Duties & Custom Cost",
    //     });
    //     return;
    //   }
    // });


    // // Only export if the flag is true
    // if (!shouldExport) {
    //   return;
    // }

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

    const headerRow = ["Cost Center"];
    category.forEach(categoryItem => {
      headerRow.push(categoryItem.category_name);
    });
    rows.push(headerRow.join(","));

    // Add data rows
    bisContent.forEach((data) => {
      const rowData = [
          data.costCenterName, // Assuming this is the cost center name from bisContent
          ...Object.values(data.prices).map(price => price === 0 ? '-' : price.toFixed(2))
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
    link.download = "BIS Report.csv";

    // Trigger the download
    link.click();
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

  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
        <div className="right-body-contents">
          <div className="Employeetext-button">
            <div className="employee-and-button">
              <div className="emp-text-side">
                <p>BIS REPORT</p>
              </div>
              <div className="button-create-side">
                <div className="filtering-section">
                  <div className="date-section-filter">
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
                  </div>

                  <div className="warehouse-product-filter">
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
                  </div>

                  <div className="button-filter-section">
                    <div className="btnfilter">
                      <button
                        className="actualbtnfilter"
                        onClick={handleGenerate}
                      >
                        FILTER
                      </button>
                    </div>
                    <div className="clearbntfilter">
                      <button
                        className="actualclearfilter"
                        onClick={clearFilters}
                      >
                        Clear Filter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="table-containss"      
          >
            <div className="main-of-all-tables">
              <div className="searchandexport">
                <div className="exportfield">
                  <button
                    className="export"
                    onClick={exportToCSV}
                  >
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
                        width: "250px",
                        height: "50px",
                      },
                    }}
                    onChange={handleSearch}
                  />
                </div>
              </div>

              <table
                style={{ width: "1650px", overflow: "auto" }}
                ref={tableRef}
                className="table-hover"
              >
                <thead>
                  <tr>
                    <th className="tableh">Cost Center</th>
                    {category.map((data) => (
                      <th key={data.category_code} className="tableh">
                        {data.category_name}
                      </th>
                    ))}
                  </tr>
                </thead>
                {bisContent.length > 0 ? (
                  <tbody>
                    {currentItems.map((data) => (
                      <tr key={data.costCenterId}>
                        <td>{data.costCenterName}</td>
                        {Object.entries(data.prices).map(
                          ([categoryCode, price]) => (
                            <td key={categoryCode}>{price === 0 ? '-' : price.toFixed(2)}</td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td colSpan={category.length + 1}>
                        <div className="no-data">
                          <img
                            src={NoData}
                            alt="NoData"
                            className="no-data-img"
                          />
                          <h3>No Data Found</h3>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </div>
          <nav style={{ marginTop: '15px' }}>
      <ul className="pagination" style={{ float: "right" }}>
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            type="button"
            style={{ fontSize: '14px', cursor: 'pointer', color: '#000000', textTransform: 'capitalize' }}
            className="page-link"
            onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
          >
            Previous
          </button>
        </li>
        {generatePages().map((page, index) => (
          <li key={index} className={`page-item ${currentPage === page ? "active" : ""}`}>
            <button
              style={{
                fontSize: '14px',
                width: '25px',
                background: currentPage === page ? '#FFA500' : 'white',
                color: currentPage === page ? '#FFFFFF' : '#000000',
                border: 'none',
                height: '28px',
              }}
              className={`page-link ${currentPage === page ? "gold-bg" : ""}`}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <button
            style={{ fontSize: '14px', cursor: 'pointer', color: '#000000', textTransform: 'capitalize' }}
            className="page-link"
            onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
        </div>
      </div>
    </div>
  );
}

export default BIS_Summary;
