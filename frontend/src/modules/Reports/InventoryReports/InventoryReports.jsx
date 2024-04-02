import React, { useEffect, useState, useRef } from 'react';
import ReactLoading from 'react-loading';
import NoData from '../../../assets/image/NoData.png';
import Sidebar from '../../Sidebar/sidebar';
import '../../../assets/global/style.css';
import '../../styles/react-style.css';
import axios from 'axios';
import BASE_URL from '../../../assets/global/url';
import Button from 'react-bootstrap/Button';
import swal from 'sweetalert';
import { Link, useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
    ArrowClockwise
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
  
  import * as $ from 'jquery';
import Header from '../../../partials/header';

function InventoryReports() {

  // const tableRef = useRef(null); wag i-remove para to sa pdf export
  
  // const exportToPdf = () => {
  //   const input = tableRef.current;
  
  //   if (input) {
  //     const pdf = new jsPDF({
  //       orientation: 'landscape', // Change the orientation to landscape
  //       unit: 'mm',
  //       format: 'a4',
  //       margin: { left: 0, right: 0 }, // Set left and right margins to zero
  //     });
  //           // Add a custom header text
  //       const headerText = '';
  //       pdf.text(headerText, 10, 10); // Adjust the coordinates as needed


  //      // Customize styles for autoTable
  //   const styles = {
  //     font: 'helvetica',
  //     fontSize: 10,
  //     textColor: 0,
  //     lineColor: 200,
  //     lineWidth: 0.1,
  //     fontStyle: 'normal',
  //   };

  //   // Customize header styles
  //   const headerStyles = { 
  //                         fillColor: [200, 200, 200], 
  //                         textColor: 0, 
  //                         fontStyle: 'bold' 
  //                       };

  
  //     // Use autoTable to directly add the table content to the PDF
  //     pdf.autoTable({
  //       html: '#' + input.id, // Use the original table ID
  //       startY: 10, // You can adjust the starting Y position as needed
  //       columnStyles: { 
  //           0: { cellWidth: 35 }, 
  //           1: { cellWidth: 35 }, 
  //           2: { cellWidth: 25 }, 
  //           3: { cellWidth: 40 }, 
  //           4: { cellWidth: 30 }, 
  //           5: { cellWidth: 20 }, 
  //           6: { cellWidth: 30 }, 
  //           7: { cellWidth: 20 }, 
  //           8: { cellWidth: 30 } 
  //         },
  //         headStyles: headerStyles,
  //     });
  
  //     // Save the PDF
  //     pdf.save('Inventory Report.pdf');
  //   }
  // };



const navigate = useNavigate();
const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);

const [invetory_prd, setInvetory_prd] = useState([]);
const [invetory_assmbly, setInvetory_assmbly] = useState([]);
const [invetory_spare, setInvetory_spare] = useState([]);
const [invetory_subpart, setInvetory_subpart] = useState([]);
const [isLoading, setIsLoading] = useState(true);
  
useEffect(() => {
  const delay = setTimeout(() => {
  axios.get(BASE_URL + '/report_inv/inventoryPRD')
    .then(res => {
      setInvetory_prd(res.data);
      setIsLoading(false);
    })
    .catch((err) => {
      console.log(err);
      setIsLoading(false);
    });
}, 1000);

return () => clearTimeout(delay);
}, []);

useEffect(() => {
  const delay = setTimeout(() => {
  axios.get(BASE_URL + '/report_inv/inventoryASM')
    .then(res => {
      setInvetory_assmbly(res.data)
      setIsLoading(false);
    })
    .catch((err) => {
      console.log(err);
      setIsLoading(false);
    });
}, 1000);

return () => clearTimeout(delay);
}, []);

useEffect(() => {
  const delay = setTimeout(() => {
  axios.get(BASE_URL + '/report_inv/inventorySpare')
    .then(res => {
      setInvetory_spare(res.data)
      setIsLoading(false);
  })
  .catch((err) => {
    console.log(err);
    setIsLoading(false);
  });
}, 1000);

return () => clearTimeout(delay);
}, []);

useEffect(() => {
  const delay = setTimeout(() => {
  axios.get(BASE_URL + '/report_inv/inventorySubpart')
    .then(res => {
      setInvetory_subpart(res.data)
      setIsLoading(false);
  })
  .catch((err) => {
    console.log(err);
    setIsLoading(false);
  });
}, 1000);

return () => clearTimeout(delay);
}, []);

  
useEffect(() => {
  // Initialize DataTable when role data is available
  if ($('#order-listing').length > 0 && invetory_prd.length > 0) {
    $('#order-listing').DataTable();
  }
}, [invetory_prd]);


const [modalshow, setmodalShow] = useState(false);

const handleClose = () => setmodalShow(false);
const handleShow = () => setmodalShow(true);

const handleExport = () => {
  // Convert table data to CSV format
  const csvData = convertTableToCSV();

  // Create a Blob from the CSV data and initiate a download
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'inventoryReport.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Close the modal after exporting
  handleClose();
};

const convertTableToCSV = () => {
  // Access the table headers and rows to convert to CSV format
  const tableHeaders = Array.from(document.querySelectorAll('#order-listing thead th'))
    .map(th => th.textContent.trim())
    .join(',');

  const tableRows = document.querySelectorAll('#order-listing tbody tr');
  const rows = Array.from(tableRows).map(row =>
    Array.from(row.children).map(td => td.textContent.trim()).join(',')
  );

  return `${tableHeaders}\n${rows.join('\n')}`;
};

  return (
    <div className="main-of-containers">
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
                            <p>Inventory Reports</p>
                        </div>
                        <div className="button-create-side">
                        <div className="filter">
                        <div className="cat-filter">
                          <div className="warehouse-filter">
                          <Form.Select aria-label="item status"
                            style={{width: '250px', height: '40px', fontSize: '15px', marginBottom: '15px', fontFamily: 'Poppins, Source Sans Pro'}}>
                            <option value="" disabled selected>
                              Location
                            </option>
                          </Form.Select>
                          </div>
                          <div className="product-filter">
                          <Form.Select aria-label="item status"
                            style={{width: '250px', height: '40px', fontSize: '15px', marginBottom: '15px', fontFamily: 'Poppins, Source Sans Pro'}}>
                            <option value="" disabled selected>
                              Product
                            </option>
                          </Form.Select>
                          </div>
                        </div>
                        <div className="date-filter">
                          <div className='date-pick'>
                              <Form.Group controlId="exampleForm.ControlInput2" className='date'>
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
                          <div className='date-pick'>
                              <Form.Group controlId="exampleForm.ControlInput2" className='date'>
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
                        <div className='export-refresh'>
                            <button className='export' onClick={handleShow}>
                              <Export size={20} weight="bold" /> <p1>Export</p1>
                            </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="table-containss">
                    <div className="main-of-all-tables">
                        <table id='order-listing'>
                                <thead>
                                <tr>
                                    <th className='tableh'>Product Code</th>
                                    <th className='tableh'>Product Name</th>
                                    <th className='tableh'>UOM</th>
                                    <th className='tableh'>Location</th>
                                    <th className='tableh'>Unit Price</th>
                                    <th className='tableh'>Quantity</th>                              
                                    <th className='tableh'>Total</th>
                                    <th className='tableh'>To Receive (quantity)</th>
                                </tr>
                                </thead>
                                {invetory_prd.length > 0 || invetory_assmbly.length > 0 ? (
                                <tbody>
                                      {invetory_prd.map((data,i) =>(
                                        <tr key={i}>
                                        <td>{data.product_code}</td>
                                        <td>{data.product_name}</td>
                                        <td>{data.UOM}</td>
                                        <td>{data.warehouse_name}</td>
                                        <td>{data.price}</td>
                                        <td>{data.totalQuantity}</td>                                      
                                        <td>{data.price * data.totalQuantity}</td>
                                        <td>{data.warehouse_name === 'Main' ? data.totalPRQuantity : '--'}</td>
                                        </tr>
                                      ))}      
                                      {invetory_assmbly.map((data,i) =>(
                                        <tr key={i}>
                                        <td>{data.product_code}</td>
                                        <td>{data.product_name}</td>
                                        <td>{data.UOM}</td>
                                        <td>{data.warehouse_name}</td>
                                        <td>{data.price}</td>
                                        <td>{data.totalQuantity}</td>                                      
                                        <td>{data.price * data.totalQuantity}</td>
                                        <td>{data.warehouse_name === 'Main' ? data.totalPRQuantity_asm : '--'}</td>
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
            </div>
              )}

            <Modal
              show={modalshow}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}>
              <Modal.Header closeButton>
                <Modal.Title
                style={{fontSize: '25px'}}>Confirmation</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h3>Do you want to Export Inventory Report</h3>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="outline-warning"
                size='md' style={{fontSize: '18px'}}
                onClick={handleExport}>Yes</Button>
                <Button variant="outline-secondary"
                size='md' style={{fontSize: '18px'}} 
                onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
        </div>
    </div>
  )
}

export default InventoryReports