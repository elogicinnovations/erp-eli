import React, { useEffect, useState, useRef } from 'react';
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
// import ExportToPDF from './export';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Import autoTable
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

function POTransactionReports() {
  const tableRef = useRef(null);

  // const exportToPdf = () => {
  //   const input = tableRef.current;

  //   if (input) {
  //     html2canvas(input)
  //       .then((canvas) => {
  //         const imgData = canvas.toDataURL('image/png');
  //         const pdf = new jsPDF('p', 'mm', 'a4');
  //         pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.width, input.clientHeight / input.clientWidth * pdf.internal.pageSize.width);
  //         pdf.save('exported-table.pdf');
  //       });
  //   }
  // };
  const exportToPdf = () => {
    const pdf = new jsPDF('p', 'pt', 'letter');
    const totalPagesExp = '{total_pages_count_string}';
  
    // Adjust your page settings as needed
    // const pdfWidth = 612;
    // const pdfHeight = 792;
    const pdfWidth = 612;
    const pdfHeight = 792;
    const pageMargin = 40;
    const contentWidth = pdfWidth - 2 * pageMargin;
    const contentHeight = pdfHeight - 2 * pageMargin;
    const lineHeight = 20;
  
    const allData = [
      ...PO_prd,
      ...PO_assmbly,
      ...PO_spare,
      ...PO_subpart
    ];
  
    let cursorY = pageMargin;
    let currentPage = 1;
    // console.log(allData);

  
    const generatePageContent = (data) => {
      // Construct the content of each page based on the data
      const tableRows = data.map((rowData) => {
        return Object.values(rowData).map(value => String(value));
      });

      // const tableRows = allData.map((rowData) => {
      //   // Construct an array for each row, representing the values in the table
      //   return [
      //     rowData.pr_id,
      //     rowData.purchase_req.updatedAt,
      //     rowData.product_tag_supplier.product.product_code,
      //     rowData.product_tag_supplier.product.product_name,
      //     rowData.product_tag_supplier.product.product_unitMeasurement,
      //     rowData.product_tag_supplier.supplier.supplier_name,
      //     rowData.product_tag_supplier.product_price,
      //     rowData.quantity,
      //     rowData.product_tag_supplier.product_price * rowData.quantity
      //   ];
        
      // });
      
  
      const startY = cursorY;
  const remainingPageSpace = contentHeight - (startY - pageMargin);
  const maxRowsPerPage = Math.floor(remainingPageSpace / lineHeight);

  const slicedRows = tableRows.slice(0, maxRowsPerPage);
  cursorY += slicedRows.length * lineHeight;

  const tableHeader = ['PO Number', 'PO Date', 'Product Code', 'Product', 'UOM', 'Supplier', 'Unit Cost', 'Quantity', 'Total'];
  pdf.text(tableHeader, pageMargin, startY);
  pdf.autoTable({
    startY: cursorY,
    head: [tableHeader], // Add your table header
    body: slicedRows
  });

  if (tableRows.length > maxRowsPerPage) {
    pdf.addPage();
    currentPage++;
    cursorY = pageMargin;
    generatePageContent(tableRows.slice(maxRowsPerPage));
  }
    };
  
    generatePageContent(allData);
  
    // Add total pages count in the footer
    const pageCountOptions = {
      totalPages: totalPagesExp,
      pageCounter: currentPage
    };
    pdf.putTotalPages(pageCountOptions);
    
    pdf.save('exported-table.pdf');
  };
  
  

const navigate = useNavigate();
const [startDate, setStartDate] = useState(null);
const [endDate, setEndDate] = useState(null);


const [PO_prd, setPO_prd] = useState([]);
const [PO_assmbly, setPO_assmbly] = useState([]);
const [PO_spare, setPO_spare] = useState([]);
const [PO_subpart, setPO_subpart] = useState([]);
  

useEffect(() => { //fetch product for inventory
  axios.get(BASE_URL + '/report_PO/PO_PRD')
    .then(res => setPO_prd(res.data))
    .catch(err => console.log(err));
}, []);

useEffect(() => { //fetch product for inventory
  axios.get(BASE_URL + '/report_PO/PO_asmbly')
    .then(res => setPO_assmbly(res.data))
    .catch(err => console.log(err));
}, []);


useEffect(() => { //fetch product for inventory
  axios.get(BASE_URL + '/report_PO/PO_spare')
    .then(res => setPO_spare(res.data))
    .catch(err => console.log(err));
}, []);


useEffect(() => { //fetch product for inventory
  axios.get(BASE_URL + '/report_PO/PO_subpart')
    .then(res => setPO_subpart(res.data))
    .catch(err => console.log(err));
}, []);



  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($('#order-listing').length > 0 && PO_prd.length > 0) {
      $('#order-listing').DataTable();
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
                          <div style={{zIndex: '3'}}>
                              <Form.Group controlId="exampleForm.ControlInput2" className='date'>
                                <DatePicker
                                  selected={startDate}
                                  onChange={(date) => setStartDate(date)}
                                  dateFormat="MM/dd/yyyy"
                                  placeholderText="Start Date"
                                  className="form-control"
                                />
                                <CalendarBlank size={20} style={{position: 'relative', color: '#9a9a9a', right:'25px'}}/>
                              </Form.Group>
                          </div>
                          <div style={{zIndex: '3'}}>
                              <Form.Group controlId="exampleForm.ControlInput2" className='date'>
                                <DatePicker
                                  selected={endDate}
                                  onChange={(date) => setEndDate(date)}
                                  dateFormat="MM/dd/yyyy"
                                  placeholderText="End Date"
                                  className="form-control"
                                />
                                <CalendarBlank size={20} style={{position: 'relative', color: '#9a9a9a', right:'25px'}}/>
                              </Form.Group>
                          </div>
                          <button className='genbutton'>Generate</button>
                        </div>
                        </div>
                          <div className='export-refresh'>
                            {/* <button className='export'>
                                 <Export size={20} weight="bold" /> <p1>Export</p1>
                            </button> */}
                              <button className='export' onClick={exportToPdf}>
                                <Export size={20} weight="bold" /> <p1>Export</p1>
                              </button>
                          </div>
                        </div>
                    </div>
                </div>
                <div className="table-containss">
                    <div className="main-of-all-tables">
                       {/* <ExportToPDF tableId="order-listing" tableData={PO_prd} /> */}
                       <table ref={tableRef} id='order-listing'>
                                <thead>
                                <tr>
                                    <th className='tableh'>PO Number</th>
                                    <th className='tableh'>PO Date</th>
                                    <th className='tableh'>Product Code</th>
                                    <th className='tableh'>Product</th>
                                    <th className='tableh'>UOM</th>
                                    <th className='tableh'>Supplier</th>
                                    <th className='tableh'>Unit Cost</th>
                                    <th className='tableh'>Quantity</th>
                                    <th className='tableh'>Total</th>
                                </tr>
                                </thead>
                                <tbody>
                                      {PO_prd.map((data,i) =>(
                                        <tr key={i}>
                                        <td>{data.pr_id}</td>
                                        <td>{data.purchase_req.updatedAt}</td>
                                        <td>{data.product_tag_supplier.product.product_code}</td>
                                        <td>{data.product_tag_supplier.product.product_name}</td>
                                        <td>{data.product_tag_supplier.product.product_unitMeasurement}</td>
                                        <td>{data.product_tag_supplier.supplier.supplier_name}</td>
                                        <td>{data.product_tag_supplier.product_price}</td>
                                        <td>{data.quantity}</td>
                                        <td>{data.product_tag_supplier.product_price * data.quantity}</td>
                                        </tr>
                                      ))}

                                      {PO_assmbly.map((data,i) =>(
                                        <tr key={i}>
                                        <td>{data.pr_id}</td>
                                        <td>{data.purchase_req.updatedAt}</td>
                                        <td>{data.assembly_supplier.assembly.assembly_code}</td>
                                        <td>{data.assembly_supplier.assembly.assembly_name}</td>
                                        <td>--</td>
                                        <td>{data.assembly_supplier.supplier.supplier_name}</td>
                                        <td>{data.assembly_supplier.supplier_price}</td>
                                        <td>{data.quantity}</td>
                                        <td>{data.assembly_supplier.supplier_price * data.quantity}</td>
                                        </tr>
                                      ))}

                                      {PO_spare.map((data,i) =>(
                                        <tr key={i}>
                                          <td>{data.pr_id}</td>
                                          <td>{data.purchase_req.updatedAt}</td>
                                          <td>{data.sparepart_supplier.sparePart.spareParts_code}</td>
                                          <td>{data.sparepart_supplier.sparePart.spareParts_name}</td>
                                          <td>--</td>
                                          <td>{data.sparepart_supplier.supplier.supplier_name}</td>
                                          <td>{data.sparepart_supplier.supplier_price}</td>
                                          <td>{data.quantity}</td>
                                          <td>{data.sparepart_supplier.supplier_price * data.quantity}</td>
                                        </tr>
                                      ))}

                                      {PO_subpart.map((data,i) =>(
                                        <tr key={i}>
                                          <td>{data.pr_id}</td>
                                          <td>{data.purchase_req.updatedAt}</td>
                                          <td>{data.subpart_supplier.subPart.subPart_code}</td>
                                          <td>{data.subpart_supplier.subPart.subPart_name}</td>
                                          <td>--</td>
                                          <td>{data.subpart_supplier.supplier.supplier_name}</td>
                                          <td>{data.subpart_supplier.supplier_price}</td>
                                          <td>{data.quantity}</td>
                                          <td>{data.subpart_supplier.supplier_price * data.quantity}</td>
                                        </tr>
                                      ))}
                            </tbody> 
                        </table>
                    </div>
                </div>
            </div>

        </div>
    </div>
  )
}

export default POTransactionReports