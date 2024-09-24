import React, { useEffect, useState, useRef } from "react";
import ReactLoading from "react-loading";
import "../../../assets/global/style.css";
import "../../styles/react-style.css";
import axios from "axios";
import BASE_URL from "../../../assets/global/url";
import swal from "sweetalert";
import { Link, useNavigate } from "react-router-dom";
import { Form, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarBlank, Export, XCircle } from "@phosphor-icons/react";
import { TextField } from "@mui/material";
import NoData from "../../../../src/assets/image/NoData.png";
import NoAccess from "../../../../src/assets/image/NoAccess.png";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

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

  const [show, setShow] = useState(false);
  const [receivingDetails, setReceivingDetails] = useState([]);

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
  const [selected_data, setSelectedData] = useState([]); // for modal supplier name with po id
  const [isExporting, setIsExporting] = useState(false);
  const handleShow = (data) => {
    setSelectedData(data);

    axios
      .get(`${BASE_URL}/pr_history/getReceivingDetails`, {
        params: { po_id: data.receiving_po.po_id },
      })
      .then((response) => {
        setShow(true);
        setReceivingDetails(response.data);
      })
      .catch((error) => {
        console.error("Error fetching receiving details:", error);
        swal({
          icon: "error",
          title: "Oops...",
          text: "Failed to fetch receiving details. Please try again.",
        });
      });
  };

  const exportToPDF = async () => {
    setIsExporting(true);
    const div = document.getElementById(`content-to-pdf`);

    const SupplierName =
      selected_data.purchase_req_canvassed_prd.product_tag_supplier.supplier
        .supplier_name;
    const POID = selected_data.receiving_po.po_id;

    try {
      const imageData = await toPng(div);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add a background color
      pdf.setFillColor(240, 240, 240);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");

      // Add a header
      pdf.setFillColor(51, 122, 183);
      pdf.rect(0, 0, pageWidth, 40, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont(undefined, "bold");
      pdf.text("Receiving History", pageWidth / 2, 25, { align: "center" });

      // Add report details
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(12);
      pdf.setFont(undefined, "normal");
      const currentDate = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Manila",
      });
      pdf.text(`Supplier: ${SupplierName}`, 15, 50);
      pdf.text(`PO ID: ${POID}`, 15, 60);
      pdf.text(`Exported: ${currentDate}`, 15, 70);

      // Add the table
      const tableData = receivingDetails.map((data) => [
        data.product_code,
        data.product_name,
        data.static_quantity,
        data.purchase_price,
        data.received_quantity,
        data.qty_balance,
      ]);

      pdf.autoTable({
        head: [
          [
            "Product Code",
            "Product Name",
            "Qty Ordered",
            "Purchase Price",
            "Qty Delivered",
            "Qty Balance",
          ],
        ],
        body: tableData,
        startY: 80,
        theme: "grid",
        headStyles: { fillColor: [51, 122, 183], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });

      // Add a footer
      const pageCount = pdf.internal.getNumberOfPages();
      pdf.setFontSize(10);
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 10, {
          align: "right",
        });
      }

      pdf.save("receiving_report.pdf");

      swal({
        icon: "success",
        title: "Success",
        text: "PDF generated successfully.",
      });

      setIsExporting(false);
    } catch (error) {
      swal({
        icon: "error",
        title: "Something went wrong",
        text: "Failed to generate PDF.",
      });
      console.error("Failed to generate PDF:", error);
    }
  };

  const handleClose = () => {
    setShow(false);
    // setSelectedData(null);
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
    const searchTerm = event.target.value.toLowerCase().trim();

    // Use the full dataset (searchRequestPR) for filtering
    const filteredData = searchRequestPR.filter((data) => {
      // Safely access nested properties
      const productName =
        data.purchase_req_canvassed_prd?.product_tag_supplier?.product?.product_name?.toLowerCase() ||
        "";
      const productCode =
        data.purchase_req_canvassed_prd?.product_tag_supplier?.product?.product_code?.toLowerCase() ||
        "";
      const poId = data.receiving_po?.po_id?.toLowerCase() || "";
      const supplierName =
        data.purchase_req_canvassed_prd?.product_tag_supplier?.supplier?.supplier_name?.toLowerCase() ||
        "";
      const dateReceived = data.receiving_po?.date_received
        ? formatDatetime(data.receiving_po.date_received).toLowerCase()
        : "";

      return (
        poId.includes(searchTerm) ||
        supplierName.includes(searchTerm) ||
        dateReceived.includes(searchTerm) ||
        productName.includes(searchTerm) ||
        productCode.includes(searchTerm)
      );
    });

    console.log("Search term:", searchTerm);
    console.log("Filtered data:", filteredData);

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
                  <p className="potr-text">Receiving History Report</p>
                </div>

                <div className="" style={{ marginTop: "5px" }}>
                  <div className="filtering-section"></div>
                </div>
              </div>
            </div>
            <div className="table-containss">
              <div className="main-of-all-tables">
                <div className="searchandexport">
                  <div className="exportfield">
                    {/* <button className="export" onClick={exportToCSV}>
                      <Export size={20} weight="bold" /> <p1>Export</p1>
                    </button> */}
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
                        <tr
                          key={`${data.receiving_po.po_id}-${i}`}
                          onClick={() => handleShow(data)}
                        >
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

            <Modal backdrop="static" size="xl" show={show} onHide={handleClose}>
              <Modal.Header closeButton className="bg-light">
                <Modal.Title className="h4 font-weight-bold">
                  {`${selected_data?.purchase_req_canvassed_prd?.product_tag_supplier?.supplier?.supplier_name} - ${selected_data?.receiving_po?.po_id}`}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div id="content-to-pdf">
                  <div className="table-responsive">
                    <table className="table table-hover table-striped table-bordered">
                      <thead className="thead-light">
                        <tr>
                          <th className="fs-4 align-middle">Product Code</th>
                          <th className="fs-4 align-middle">Product Name</th>
                          <th className="fs-4 align-middle">Qty Ordered</th>
                          <th className="fs-4 align-middle">Purchase Price</th>
                          <th className="fs-4 align-middle">Qty Delivered</th>
                          <th className="fs-4 align-middle">Qty Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {receivingDetails.map((data, i) => (
                          <tr key={i}>
                            <td className=" fs-5 align-middle">
                              {data.product_code}
                            </td>
                            <td
                              title={data.product_name}
                              className="fs-5 align-middle"
                              style={{
                                maxWidth: "300px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {data.product_name}
                            </td>
                            <td className=" fs-5 align-middle">
                              {data.static_quantity}
                            </td>
                            <td className=" fs-5 align-middle">
                              {data.purchase_price}
                            </td>
                            <td className=" fs-5 align-middle">
                              {data.received_quantity}
                            </td>
                            <td className=" fs-5 align-middle">
                              {data.qty_balance}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                {isExporting === true ? (
                  <button className="btn btn-primary btn-lg me-2">
                    Exporting...
                  </button>
                ) : (
                  <React.Fragment>
                    <button
                      className="btn btn-primary btn-lg me-2"
                      onClick={exportToPDF}
                    >
                      Export to PDF
                    </button>
                    <button
                      className="btn btn-secondary btn-lg"
                      onClick={handleClose}
                    >
                      Close
                    </button>
                  </React.Fragment>
                )}
              </Modal.Footer>
            </Modal>

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
