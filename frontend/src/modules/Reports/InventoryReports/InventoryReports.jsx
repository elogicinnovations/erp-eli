import React, { useEffect, useState, useRef } from "react";
import ReactLoading from "react-loading";
import NoData from "../../../assets/image/NoData.png";
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
import { CalendarBlank, Export, XCircle } from "@phosphor-icons/react";
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

function InventoryReports() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [invetory_prd, setInvetory_prd] = useState([]);
  const [searchInventory, setSearchInventory] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [warehouse, setWarehouse] = useState([]);
  const [category, setCategory] = useState([]);

  const [slctWarehouse, setSlctWarehouse] = useState("");
  const [slctCategory, setSlctCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPagesInventory = Math.ceil(invetory_prd.length / pageSize);
  const startIndexInventory = (currentPage - 1) * pageSize;
  const endIndexInventory = Math.min(
    startIndexInventory + pageSize,
    invetory_prd.length
  );
  const currentItemsInventory = invetory_prd.slice(
    startIndexInventory,
    endIndexInventory
  );

  const totalPages = Math.max(totalPagesInventory);
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

  const reloadTable = () => {
    const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/warehouses/fetchtableWarehouses")
        .then((response) => {
          setWarehouse(response.data);
        })
        .catch((error) => {
          console.error("Error fetching roles:", error);
          setIsLoading(false);
        });

      axios
        .get(BASE_URL + "/category/fetchTable")
        .then((response) => {
          setCategory(response.data);
        })
        .catch((error) => {
          console.error("Error fetching roles:", error);
        });

      axios
        .get(BASE_URL + "/report_inv/inventoryPRDds")
        .then((res) => {
          setInvetory_prd(res.data);
          setSearchInventory(res.data);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }, 1000);

    return () => clearTimeout(delay);
  };

  useEffect(() => {
    reloadTable();
  }, []);

  const handleSearch = (event) => {
    setCurrentPage(1);
    const searchTerm = event.target.value.toLowerCase();

    const filteredInventory = searchInventory.filter(
      (data) =>
        data.product_code.toLowerCase().includes(searchTerm) ||
        data.product_name.toLowerCase().includes(searchTerm) ||
        data.UOM.toLowerCase().includes(searchTerm) ||
        data.totalQuantity.toString().toLowerCase().includes(searchTerm) ||
        data.price *
          data.totalQuantity.toString().toLowerCase().includes(searchTerm) ||
        data.totalIssuedQuantity
          .toString()
          .toLowerCase()
          .includes(searchTerm) ||
        data.totalPR_received_Quantity
          .toString()
          .toLowerCase()
          .includes(searchTerm) ||
        data.warehouse_name.toLowerCase().includes(searchTerm)
    );
    setInvetory_prd(filteredInventory);
  };

  const [modalshow, setmodalShow] = useState(false);

  const handleClose = () => setmodalShow(false);
  const handleShow = () => setmodalShow(true);

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
      "Product Code",
      "Product Name",
      "UOM",
      "Location",
      "UnitPrice",
      "Quantity",
      "Total",
      "Issued Quantity",
      "To Receive (quantity)",
      "Received (quantity)",
    ];
    rows.push(headerData.join(","));

    // Add data rows
    invetory_prd.forEach((data) => {
      const rowData = [
        `"${data.product_code}"`,
        `"${data.product_name}"`,
        `"${data.UOM}"`,
        `"${data.warehouse_name}"`,
        `"${data.price}"`,
        `"${data.totalQuantity}"`,
        `"${data.price * data.totalQuantity}"`,
        `"${data.totalIssuedQuantity}"`,
        `"${
          data.warehouse_name === "Main"
            ? data.totalPRQuantity +
              data.totalPR_intransit_Quantity +
              data.totalPR_Approval_Quantity
            : "--"
        }"`,
        `"${data.totalPR_received_Quantity}"`,
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
    link.download = "Inventory Report.csv";

    // Trigger the download
    link.click();

    // Close the modal after exporting
    handleClose();
  };

  const handleGenerate = () => {
    if (!startDate || !endDate || !slctCategory || !slctWarehouse) {
      swal({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all filter sections!",
      });
      return;
    }
    axios
      .get(BASE_URL + "/report_inv/Filtered_prdds", {
        params: {
          slctCategory,
          slctWarehouse,
          strDate: startDate,
          enDate: endDate,
        },
      })
      .then((res) => {
        setInvetory_prd(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleXCircleClick = () => {
    setStartDate(null);
  };

  const handleXClick = () => {
    setEndDate(null);
  };

  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSlctWarehouse("");
    setSlctCategory("");
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
        ) : (
          <div className="right-body-contents">
            <div className="Employeetext-button">
              <div className="employee-and-button">
                <div className="emp-text-side">
                  <p>Inventory Reports</p>
                </div>

                <div className="" style={{ marginTop: "5px" }}>
                  {/* Orig */}
                  {/* <div className="filtering-section">
                      <div className="date-section-filter">
                          <div style={{ position: "relative", marginBottom: "15px" }}>
                          <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          placeholderText="Choose Date From"
                          dateFormat="yyyy-MM-dd"
                          wrapperClassName="custom-datepicker-wrapper"
                          popperClassName="custom-popper"
                          style={{ fontFamily: "Poppins, Source Sans Pro"}}
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

                      <div className="">
                            <Form.Select
                              aria-label="item status"
                              onChange={(e) => setSlctWarehouse(e.target.value)}
                              style={{
                                width: "274px",
                                height: "40px",
                                fontSize: "15px",
                                marginBottom: "15px",
                                fontFamily: "Poppins, Source Sans Pro",
                              }}
                              value={slctWarehouse}
                            >
                              <option value="" disabled selected>
                                Select Site
                              </option>
                              <option value="All">All</option>
                              {warehouse.map((warehouse) => (
                                <option key={warehouse.id} value={warehouse.id}>
                                  {warehouse.warehouse_name}
                                </option>
                              ))}
                            </Form.Select>
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

                          <div className="">
                            <Form.Select
                              aria-label="item status"
                              style={{
                                width: "284px",
                                height: "40px",
                                fontSize: "15px",
                                marginBottom: "15px",
                                fontFamily: "Poppins, Source Sans Pro",
                              }}
                              onChange={(e) => setSlctCategory(e.target.value)}
                              value={slctCategory}
                            >
                              <option disabled selected value="">
                                Select Category
                              </option>

                              <option value="All">All</option>
                              {category.map((category) => (
                                <option
                                  key={category.category_code}
                                  value={category.category_code}
                                >
                                  {category.category_name}
                                </option>
                              ))}
                            </Form.Select>
                          </div>
                      </div>

                      <div className="button-filter-section">
                        <div className="btnfilter">
                            <button onClick={handleGenerate} className="actualbtnfilter">FILTER</button>
                        </div>
                        <div className="clearbntfilter">
                         <button className="actualclearfilter"
                              onClick={clearFilters}
                              >
                                  Clear Filter
                              </button>
                        </div>
                      </div>
                  </div> */}

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
                            onChange={(e) => setSlctWarehouse(e.target.value)}
                            style={{
                              // width: "274px",
                              height: "40px",
                              fontSize: "15px",
                              marginBottom: "15px",
                              fontFamily: "Poppins, Source Sans Pro",
                            }}
                            className="select-inv-rep"
                            value={slctWarehouse}
                          >
                            <option value="" disabled selected>
                              Select Site
                            </option>
                            <option value="All">All</option>
                            {warehouse.map((warehouse) => (
                              <option key={warehouse.id} value={warehouse.id}>
                                {warehouse.warehouse_name}
                              </option>
                            ))}
                          </Form.Select>
                        </div>

                        <div className="">
                          <Form.Select
                            aria-label="item status"
                            style={{
                              // width: "284px",
                              height: "40px",
                              fontSize: "15px",
                              marginBottom: "15px",
                              fontFamily: "Poppins, Source Sans Pro",
                            }}
                            className="select-inv-rep"
                            onChange={(e) => setSlctCategory(e.target.value)}
                            value={slctCategory}
                          >
                            <option disabled selected value="">
                              Select Category
                            </option>

                            <option value="All">All</option>
                            {category.map((category) => (
                              <option
                                key={category.category_code}
                                value={category.category_code}
                              >
                                {category.category_name}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </div>
                    </div>

                    {/* <div className="button-filter-section">
                      <div className="btnfilter"> */}
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
                    {/* <div className="clearbntfilter"> */}
                    {/* </div> */}
                  </div>

                  {/* </div>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="table-containss">
              <div className="main-of-all-tables">
                <div className="searchandexport">
                  <div className="exportfield">
                    <button className="export" onClick={handleShow}>
                      <Export size={20} weight="bold" /> <span>Export</span>
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

                <table className="table-hover">
                  <thead>
                    <tr>
                      <th className="tableh">Product Code</th>
                      <th className="tableh">Product Name</th>
                      <th className="tableh">UOM</th>
                      <th className="tableh">Location</th>
                      <th className="tableh">Unit Price</th>
                      <th className="tableh">Quantity</th>
                      <th className="tableh">Total</th>
                      {/* <th className="tableh">Issued (quantity)</th>
                      <th className="tableh">To Receive (quantity)</th>
                      <th className="tableh">Received (quantity)</th> */}
                    </tr>
                  </thead>
                  {invetory_prd.length > 0 ? (
                    <tbody>
                      {currentItemsInventory.map((data, i) => (
                        <tr key={i}>
                          <td>{data.product_code}</td>
                          <td>{data.product_name}</td>
                          <td>{data.UOM}</td>
                          <td>{data.warehouse_name}</td>
                          <td>{data.price}</td>
                          <td>{data.totalQuantity}</td>
                          <td>{data.price * data.totalQuantity}</td>
                          {/* <td>{data.totalIssuedQuantity}</td>
                          <td>
                            {data.warehouse_name === "Main"
                              ? data.totalPRQuantity +
                                data.totalPR_intransit_Quantity +
                                data.totalPR_Approval_Quantity
                              : "--"}
                          </td>
                          <td>{data.totalPR_received_Quantity}</td> */}
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
        )}

        <Modal
          show={modalshow}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "25px" }}>Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h3>Do you want to Export Inventory Report</h3>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-warning"
              size="md"
              style={{ fontSize: "18px" }}
              onClick={exportToCSV}
            >
              Yes
            </Button>
            <Button
              variant="outline-secondary"
              size="md"
              style={{ fontSize: "18px" }}
              onClick={handleClose}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default InventoryReports;
