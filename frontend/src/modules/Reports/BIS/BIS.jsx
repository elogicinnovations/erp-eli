//test test
import React, { useEffect, useState, useRef } from "react";
import ReactLoading from "react-loading";
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
import NoAccess from "../../../../src/assets/image/NoAccess.png";
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

function BIS({ authrztn }) {
  const tableRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bisContent, setBisContent] = useState([]);
  const [searchBIS, setSearchBIS] = useState([]);
  const [bisContent_asm, setBisContent_asm] = useState([]);
  const [searchBISasm, setSearchBISasm] = useState([]);
  const [bisContent_spare, setBisContent_spare] = useState([]);
  const [searchBISspare, setSearchBISspare] = useState([]);
  const [bisContent_subpart, setBisContent_subpart] = useState([]);
  const [searchBISsub, setSearchBISsub] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPagesBISProd = Math.ceil(bisContent.length / pageSize);
  const startIndexBISprod = (currentPage - 1) * pageSize;
  const endIndexBISprod = Math.min(
    startIndexBISprod + pageSize,
    bisContent.length
  );
  const currentItemsBISprod = bisContent.slice(
    startIndexBISprod,
    endIndexBISprod
  );

  const totalPages = Math.max(totalPagesBISProd);

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

  const [department, setDepartment] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [costCenter, setCostcenter] = useState([]);
  const [selectedCostcenter, setSelectedCostcenter] = useState("");
  useEffect(() => {
    axios
      .get(BASE_URL + "/department/fetchtableDepartment")
      .then((res) => {
        setDepartment(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(BASE_URL + "/costCenter/getCostCenter")
      .then((res) => {
        setCostcenter(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const reloadTable = () => {
    const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/report_BIS/content_fetch")
        .then((res) => {
          setBisContent(res.data.prd);
          setSearchBIS(res.data.prd);
          setBisContent_asm(res.data.asm);
          setSearchBISasm(res.data.asm);
          setBisContent_spare(res.data.spare);
          setSearchBISspare(res.data.spare);
          setBisContent_subpart(res.data.subpart);
          setSearchBISsub(res.data.subpart);
          setIsLoading(false);
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

  const handleGenerate = () => {
    if (!startDate || !endDate || !selectedDepartment || !selectedCostcenter) {
      swal({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all filter sections!",
      });
      return;
    }

    axios
      .get(BASE_URL + "/report_BIS/filter", {
        params: {
          selectedDepartment,
          selectedCostcenter,
          strDate: startDate,
          enDate: endDate,
        },
      })
      .then((res) => {
        setBisContent(res.data.prd);
        setSearchBIS(res.data.prd);
        // setBisContent_asm(res.data.asm);
        // setBisContent_spare(res.data.spare);
        // setBisContent_subpart(res.data.subpart);
      })
      .catch((err) => console.log(err));
  };

  const handleSearch = (event) => {
    setCurrentPage(1);
    const searchTerm = event.target.value.toLowerCase();
    const filteredSearchBIS = searchBIS.filter((data) => {
      return (
        formatDatetime(data.createdAt).toLowerCase().includes(searchTerm) ||
        formatDatetime(formatDatetime(data.createdAt))
          .toLowerCase()
          .includes(searchTerm) ||
        (typeof data.issuance.issuance_id === "number" &&
          data.issuance.issuance_id
            .toString()
            .toLowerCase()
            .includes(searchTerm)) ||
        ((typeof data.issuance.mrs === "string" ||
          typeof data.issuance.mrs === "number") &&
          data.issuance.mrs.toString().toLowerCase().includes(searchTerm)) ||
        data.inventory_prd.product_tag_supplier.product.category.category_name
          .toLowerCase()
          .includes(searchTerm) ||
        data.inventory_prd.product_tag_supplier.product.product_code
          .toLowerCase()
          .includes(searchTerm) ||
        data.inventory_prd.product_tag_supplier.product.product_name
          .toLowerCase()
          .includes(searchTerm) ||
        (typeof data.quantity === "number" &&
          data.quantity.toString().toLowerCase().includes(searchTerm)) ||
        data.inventory_prd.product_tag_supplier.product.product_unitMeasurement
          .toLowerCase()
          .includes(searchTerm) ||
        ((typeof data.inventory_prd.price === "number" ||
          typeof data.inventory_prd.price === "string") &&
          data.inventory_prd.price
            .toString()
            .toLowerCase()
            .includes(searchTerm)) ||
        ((typeof data.inventory_prd.freight_cost === "number" ||
          typeof data.inventory_prd.freight_cost === "string") &&
          data.inventory_prd.freight_cost
            .toString()
            .toLowerCase()
            .includes(searchTerm)) ||
        ((typeof data.inventory_prd.custom_cost === "number" ||
          typeof data.inventory_prd.custom_cost === "string") &&
          data.inventory_prd.custom_cost
            .toString()
            .toLowerCase()
            .includes(searchTerm)) ||
        (
          data.inventory_prd.price +
          data.inventory_prd.freight_cost +
          data.inventory_prd.custom_cost
        )
          .toFixed(2)
          .includes(searchTerm) ||
        (
          (data.inventory_prd.price +
            data.inventory_prd.freight_cost +
            data.inventory_prd.custom_cost) *
          data.quantity
        )
          .toFixed(2)
          .includes(searchTerm)
      );
    });
    setBisContent(filteredSearchBIS);
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

  const exportToCSV = () => {
    // let shouldExport = true;

    bisContent.forEach((item) => {
      if (item.inventory_prd && item.inventory_prd.freight_cost === 0) {
        // shouldExport = false; // Set the flag to false if condition is met
        swal({
          icon: "warning",
          title: "Warning",
          text: "There's still product that has no Freight Cost",
        });
        return;
      } else if (item.inventory_prd && item.inventory_prd.custom_cost === 0) {
        // shouldExport = true;
        swal({
          icon: "warning",
          title: "Warning",
          text: "There's a product that has no Duties & Custom Cost",
        });
        return;
      }
    });

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

    // Add the header row
    const headerData = [
      "Doc Date",
      "BIS#",
      "MRS",
      "Category",
      "Product Code",
      "Product Name",
      "Issued Quantity",
      "UOM",
      "Unit Price",
      "Freight Cost",
      "Duties & Custom Cost",
      "Landed Cost",
      "Total Price",
    ];
    rows.push(headerData.join(","));

    // Add data rows
    bisContent.forEach((data) => {
      const rowData = [
        `"${formatDatetime(data.createdAt)}"`,
        `"${data.issuance.issuance_id}"`,
        `\t${data.issuance.mrs}`,
        `"${data.inventory_prd.product_tag_supplier.product.category.category_name}"`,
        `\t${data.inventory_prd.product_tag_supplier.product.product_code}`,
        `"${data.inventory_prd.product_tag_supplier.product.product_name}"`,
        `"${data.quantity}"`,
        `"${data.inventory_prd.product_tag_supplier.product.product_unitMeasurement}"`,
        `"${data.inventory_prd.price}"`,
        `"${data.inventory_prd.freight_cost}"`,
        `"${data.inventory_prd.custom_cost}"`,
        `"${(
          data.inventory_prd.price +
          data.inventory_prd.freight_cost +
          data.inventory_prd.custom_cost
        ).toFixed(2)}"`,
        `"${(
          (data.inventory_prd.price +
            data.inventory_prd.freight_cost +
            data.inventory_prd.custom_cost) *
          data.quantity
        ).toFixed(2)}"`,
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
    setSelectedCostcenter("");
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
                <div className="emp-text-side">
                  <p>BIS REPORT</p>
                </div>
                <div className="">
                  <div className="filtering-section">
                    <div className="filter-sec">
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
                            style={{
                              width: "274px",
                              height: "40px",
                              fontSize: "15px",
                              marginBottom: "15px",
                              fontFamily: "Poppins, Source Sans Pro",
                            }}
                            className="select-inv-rep"
                            value={selectedDepartment}
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
                            onChange={(e) =>
                              setSelectedCostcenter(e.target.value)
                            }
                            style={{
                              width: "284px",
                              height: "40px",
                              fontSize: "15px",
                              marginBottom: "15px",
                              fontFamily: "Poppins, Source Sans Pro",
                            }}
                            className="select-inv-rep"
                            value={selectedCostcenter}
                          >
                            <option disabled value="" selected>
                              Select Cost Center
                            </option>
                            <option value={"All"}>All</option>
                            {costCenter.map((cost) => (
                              <option key={cost.id} value={cost.id}>
                                {cost.name}
                              </option>
                            ))}
                          </Form.Select>
                        </div>
                      </div>
                    </div>

                    {/* <div className="button-filter-section">
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
                    </div> */}

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
                      <th className="tableh">Doc Date</th>
                      <th className="tableh">BIS#</th>
                      <th className="tableh">MRS</th>
                      <th className="tableh">Category</th>
                      <th className="tableh">Product Code</th>
                      <th className="tableh">Product Name</th>
                      <th className="tableh">Issued Quantity</th>
                      <th className="tableh">UOM</th>
                      <th className="tableh">Unit Price</th>
                      <th className="tableh">Freight Cost</th>
                      <th className="tableh">Custom Cost</th>
                      <th className="tableh">Landed Cost</th>
                      <th className="tableh">Total</th>
                    </tr>
                  </thead>
                  {bisContent.length > 0 ? (
                    <tbody>
                      {currentItemsBISprod.map((data, i) => (
                        <tr key={i}>
                          <td>{formatDatetime(data.createdAt)}</td>
                          <td>{data.issuance.issuance_id}</td>
                          <td>{data.issuance.mrs}</td>
                          <td>
                            {
                              data.inventory_prd.product_tag_supplier.product
                                .category.category_name
                            }
                          </td>
                          <td>
                            {
                              data.inventory_prd.product_tag_supplier.product
                                .product_code
                            }
                          </td>
                          <td>
                            {
                              data.inventory_prd.product_tag_supplier.product
                                .product_name
                            }
                          </td>
                          <td>{data.quantity}</td>
                          <td>
                            {
                              data.inventory_prd.product_tag_supplier.product
                                .product_unitMeasurement
                            }
                          </td>
                          <td>{data.inventory_prd.price}</td>
                          <td>{data.inventory_prd.freight_cost}</td>
                          <td>{data.inventory_prd.custom_cost}</td>
                          <td>
                            {(
                              data.inventory_prd.price +
                              data.inventory_prd.freight_cost +
                              data.inventory_prd.custom_cost
                            ).toFixed(2)}
                          </td>
                          <td>
                            {(
                              (data.inventory_prd.price +
                                data.inventory_prd.freight_cost +
                                data.inventory_prd.custom_cost) *
                              data.quantity
                            ).toFixed(2)}
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

export default BIS;
