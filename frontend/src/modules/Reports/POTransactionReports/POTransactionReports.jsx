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
  MagnifyingGlass,
  Gear,
  Bell,
  UserCircle,
  Plus,
  Trash,
  NotePencil,
  DotsThreeCircle,
  CalendarBlank,
  Export,
  ArrowClockwise,
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

function POTransactionReports() {
  const tableRef = useRef();

  // good but not in proper format
  // const exportToPdf = () => {
  //   const input = tableRef.current;

  //   if (input) {
  //     const pdf = new jsPDF('p', 'mm', 'a4');

  //     // Set the width and height of the PDF page
  //     const pdfWidth = pdf.internal.pageSize.width;

  //     // Use autoTable to directly add the table content to the PDF
  //     pdf.autoTable({
  //       html: '#' + input.id, // Use the original table ID
  //       startY: 0, // You can adjust the starting Y position as needed
  //     });

  //     // Save the PDF
  //     pdf.save('exported-table.pdf');
  //   }
  // };

  const exportToPdf = () => {
    const input = tableRef.current;

    if (input) {
      const pdf = new jsPDF({
        orientation: "landscape", // Change the orientation to landscape
        unit: "mm",
        format: "a4",
        margin: { left: 0, right: 0 }, // Set left and right margins to zero
      });

      // Use autoTable to directly add the table content to the PDF
      pdf.autoTable({
        html: "#" + input.id, // Use the original table ID
        startY: 10, // You can adjust the starting Y position as needed
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 25 },
          2: { cellWidth: 30 },
          3: { cellWidth: 40 },
          4: { cellWidth: 20 },
          5: { cellWidth: 40 },
          6: { cellWidth: 30 },
          7: { cellWidth: 20 },
          8: { cellWidth: 30 },
        },
      });

      // Save the PDF
      pdf.save("PurchaseOrder Report.pdf");
    }
  };
  const exportToCSV = () => {
    const input = tableRef.current;

    if (input) {
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

      // Iterate over the header row
      const headerRow = input
        .getElementsByTagName("thead")[0]
        .getElementsByTagName("tr")[0];
      const headerData = [];
      for (let i = 0; i < headerRow.cells.length; i++) {
        headerData.push(headerRow.cells[i].innerText);
      }
      rows.push(headerData.join(","));

      // Iterate over each row in the tbody
      for (const row of input
        .getElementsByTagName("tbody")[0]
        .getElementsByTagName("tr")) {
        const rowData = [];

        // Iterate over each cell in the row
        for (let i = 0; i < row.cells.length; i++) {
          rowData.push(row.cells[i].innerText); // Use innerText to get the text content of the cell
        }

        rows.push(rowData.join(",")); // Join cell values with commas and add to the rows array
      }

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
    }
  };

  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [PO_prd, setPO_prd] = useState([]);
  const [PO_assmbly, setPO_assmbly] = useState([]);
  const [PO_spare, setPO_spare] = useState([]);
  const [PO_subpart, setPO_subpart] = useState([]);

  useEffect(() => {
    //fetch product for inventory
    axios
      .get(BASE_URL + "/report_PO/PO_PRD")
      .then((res) => setPO_prd(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    //fetch product for inventory
    axios
      .get(BASE_URL + "/report_PO/PO_asmbly")
      .then((res) => setPO_assmbly(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    //fetch product for inventory
    axios
      .get(BASE_URL + "/report_PO/PO_spare")
      .then((res) => setPO_spare(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    //fetch product for inventory
    axios
      .get(BASE_URL + "/report_PO/PO_subpart")
      .then((res) => setPO_subpart(res.data))
      .catch((err) => console.log(err));
  }, []);

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

  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($("#order-listing").length > 0 && PO_prd.length > 0) {
      $("#order-listing").DataTable();
    }
  }, [PO_prd]);

  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
        <div className="right-body-contents">
          <div className="Employeetext-button">
            <div className="employee-and-button">
              <div className="emp-text-side">
                <p>Purchase Order Reports</p>
              </div>
              <div className="button-create-side">
                <div className="filter">
                  <div className="cat-filter">
                    <div className="warehouse-filter">
                      <Form.Select
                        aria-label="item status"
                        style={{
                          width: "250px",
                          height: "40px",
                          fontSize: "15px",
                          marginBottom: "15px",
                          fontFamily: "Poppins, Source Sans Pro",
                        }}>
                        <option value="" disabled selected>
                          Location
                        </option>
                      </Form.Select>
                    </div>
                    <div className="product-filter">
                      <Form.Select
                        aria-label="item status"
                        style={{
                          width: "250px",
                          height: "40px",
                          fontSize: "15px",
                          marginBottom: "15px",
                          fontFamily: "Poppins, Source Sans Pro",
                        }}>
                        <option value="" disabled selected>
                          Product
                        </option>
                      </Form.Select>
                    </div>
                  </div>
                  <div className="date-filter">
                    <div style={{ zIndex: "3", margin:'0 0 10px 10px' }}>
                      <Form.Group
                        controlId="exampleForm.ControlInput2"
                        className="date">
                        <DatePicker
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          dateFormat="MM/dd/yyyy"
                          placeholderText="Start Date"
                          className="form-control"
                        />
                        <CalendarBlank
                          size={20}
                          style={{
                            position: "relative",
                            color: "#9a9a9a",
                            right: "25px",
                          }}
                        />
                      </Form.Group>
                    </div>
                    <div style={{ zIndex: "3" }}>
                      <Form.Group
                        controlId="exampleForm.ControlInput2"
                        className="date">
                        <DatePicker
                          selected={endDate}
                          onChange={(date) => setEndDate(date)}
                          dateFormat="MM/dd/yyyy"
                          placeholderText="End Date"
                          className="form-control"
                        />
                        <CalendarBlank
                          size={20}
                          style={{
                            position: "relative",
                            color: "#9a9a9a",
                            right: "25px",
                          }}
                        />
                      </Form.Group>
                    </div>
                  </div>
                </div>
                <div className="genbutton">
                  <button className='genbutton'>Generate</button>
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
              {/* <ExportToPDF tableId="order-listing" tableData={PO_prd} /> */}
              <table ref={tableRef} id="order-listing">
                <thead>
                  <tr>
                    <th className="tableh">PO Number</th>
                    <th className="tableh">PO Date</th>
                    <th className="tableh">Product Code</th>
                    <th className="tableh">Product</th>
                    <th className="tableh">UOM</th>
                    <th className="tableh">Supplier</th>
                    <th className="tableh">Unit Cost</th>
                    <th className="tableh">Quantity</th>
                    <th className="tableh">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {PO_prd.map((data, i) => (
                    <tr key={i}>
                      <td>{data.pr_id}</td>
                      <td>{formatDatetime(data.purchase_req.updatedAt)}</td>
                      <td>{data.product_tag_supplier.product.product_code}</td>
                      <td>{data.product_tag_supplier.product.product_name}</td>
                      <td>
                        {
                          data.product_tag_supplier.product
                            .product_unitMeasurement
                        }
                      </td>
                      <td>
                        {data.product_tag_supplier.supplier.supplier_name}
                      </td>
                      <td>{data.product_tag_supplier.product_price}</td>
                      <td>{data.quantity}</td>
                      <td>
                        {data.product_tag_supplier.product_price *
                          data.quantity}
                      </td>
                    </tr>
                  ))}

                  {PO_assmbly.map((data, i) => (
                    <tr key={i}>
                      <td>{data.pr_id}</td>
                      <td>{formatDatetime(data.purchase_req.updatedAt)}</td>
                      <td>{data.assembly_supplier.assembly.assembly_code}</td>
                      <td>{data.assembly_supplier.assembly.assembly_name}</td>
                      <td>--</td>
                      <td>{data.assembly_supplier.supplier.supplier_name}</td>
                      <td>{data.assembly_supplier.supplier_price}</td>
                      <td>{data.quantity}</td>
                      <td>
                        {data.assembly_supplier.supplier_price * data.quantity}
                      </td>
                    </tr>
                  ))}

                  {PO_spare.map((data, i) => (
                    <tr key={i}>
                      <td>{data.pr_id}</td>
                      <td>{formatDatetime(data.purchase_req.updatedAt)}</td>
                      <td>
                        {data.sparepart_supplier.sparePart.spareParts_code}
                      </td>
                      <td>
                        {data.sparepart_supplier.sparePart.spareParts_name}
                      </td>
                      <td>--</td>
                      <td>{data.sparepart_supplier.supplier.supplier_name}</td>
                      <td>{data.sparepart_supplier.supplier_price}</td>
                      <td>{data.quantity}</td>
                      <td>
                        {data.sparepart_supplier.supplier_price * data.quantity}
                      </td>
                    </tr>
                  ))}

                  {PO_subpart.map((data, i) => (
                    <tr key={i}>
                      <td>{data.pr_id}</td>
                      <td>{formatDatetime(data.purchase_req.updatedAt)}</td>
                      <td>{data.subpart_supplier.subPart.subPart_code}</td>
                      <td>{data.subpart_supplier.subPart.subPart_name}</td>
                      <td>--</td>
                      <td>{data.subpart_supplier.supplier.supplier_name}</td>
                      <td>{data.subpart_supplier.supplier_price}</td>
                      <td>{data.quantity}</td>
                      <td>
                        {data.subpart_supplier.supplier_price * data.quantity}
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
  );
}

export default POTransactionReports;
