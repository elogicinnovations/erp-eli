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
import {
  CalendarBlank,
  Export,
} from "@phosphor-icons/react";
import NoData from '../../../../src/assets/image/NoData.png';
import { IconButton, TextField, TablePagination, } from '@mui/material';

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

function BIS() {
  const tableRef = useRef();

  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bisContent, setBisContent] = useState([]);
  const [searchBIS, setSearchBIS] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(bisContent.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, bisContent.length);
  const currentItems = bisContent.slice(startIndex, endIndex);

  const reloadTable = () => {
    axios
      .get(BASE_URL + "/report_BIS/content_fetch")
      .then((res) => {
        setBisContent(res.data);
        setSearchBIS(res.data);
      })
      .catch((err) => console.log(err));
  };


  useEffect(() => {
    reloadTable();
  }, []);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredData = searchBIS.filter((data) => {
      return (
        data.inventory_prd.product_tag_supplier.product.product_name.toLowerCase().includes(searchTerm) ||
        data.inventory_prd.product_tag_supplier.product.product_unitMeasurement.toLowerCase().includes(searchTerm) ||
        data.inventory_prd.product_tag_supplier.product.category.category_name.toLowerCase().includes(searchTerm) ||
        data.inventory_prd.product_price.toLowerCase().includes(searchTerm) ||
        data.inventory_prd.freight_cost.toLowerCase().includes(searchTerm) ||
        data.inventory_prd.custom_cost.toLowerCase().includes(searchTerm) ||
        data.inventory_prd.product_price + data.inventory_prd.freight_cost + data.inventory_prd.custom_cost.toLowerCase().includes(searchTerm) ||
        data.quantity.toLowerCase().includes(searchTerm)
      );
    });
  
    setBisContent(filteredData);
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

      // Columns Style
      rows.push(columnStyles.map((style) => "").join(","));

      // Header Label
      const headerRow = input
        .getElementsByTagName("thead")[0]
        .getElementsByTagName("tr")[0];
      const headerData = [];
      for (let i = 0; i < headerRow.cells.length; i++) {
        headerData.push(headerRow.cells[i].innerText);
      }
      rows.push(headerData.join(","));

      // Body Data
      for (const row of input
        .getElementsByTagName("tbody")[0]
        .getElementsByTagName("tr")) {
        const rowData = [];

        // Display data by id row
        for (let i = 0; i < row.cells.length; i++) {
          rowData.push(row.cells[i].innerText);
        }

        rows.push(rowData.join(","));
      }

      // Create A CSV
      const csvContent = rows.join("\n");

      // Blob the datata
      const blob = new Blob([csvContent], { type: "text/csv" });

      // Create Link Download
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "PurchaseOrder Report.csv";

      // Trigger the link download
      link.click();
    }
  };

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
                    <div style={{width: '50%', zIndex: "3", padding: '0 10px'}}>
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
                      </Form.Group>
                        <CalendarBlank size={20} style={{position: 'relative', color: '#9a9a9a', position: 'relative', left: '220px', bottom: '30px'}}/>
                    </div>
                    <div style={{ width: '50%', zIndex: "3", padding: '0 10px' }}>
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
                      </Form.Group>
                        <CalendarBlank size={20} style={{position: 'relative', color: '#9a9a9a', position: 'relative', left: '220px', bottom: '30px'}}/>
                    </div>
                  </div>
                </div>
                <div className="genbutton">
                  <button className='genbutton'>Generate</button>
                </div>
                <div className="export-refresh">
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
                    <th className="tableh">Product Code</th>
                    <th className="tableh">Product Name</th>
                    <th className="tableh">UOM</th> 
                    <th className="tableh">Category</th> 
                    <th className="tableh">Unit Price</th>
                    <th className="tableh">Freight Cost</th>
                    <th className="tableh">Duties & Custom Cost</th>
                    <th className="tableh">Total Price</th>
                    <th className="tableh">Issued Quantity</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {bisContent.map((data, i) => (
                    <tr key={i}>
                      <td>{data.inventory_prd.product_tag_supplier.product.product_code}</td>
                      <td>{data.inventory_prd.product_tag_supplier.product.product_name}</td>
                      <td>{data.inventory_prd.product_tag_supplier.product.product_unitMeasurement}</td>
                      <td>{data.inventory_prd.product_tag_supplier.product.category.category_name}</td>
                      <td>{data.inventory_prd.product_price}</td>
                      <td>{data.inventory_prd.freight_cost}</td>
                      <td>{data.inventory_prd.custom_cost}</td>
                      <td>{data.inventory_prd.product_price + data.inventory_prd.freight_cost + data.inventory_prd.custom_cost}</td>
                      <td>{data.quantity}</td>
                     
                      <td>
                        <button className="viewmore">View More</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
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

export default BIS;
