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

function InventoryReports() {
  const tableRef = useRef(null);

  const exportToPdf = () => {
    const input = tableRef.current;

    if (input) {
      const pdf = new jsPDF({
        orientation: "landscape", // Change the orientation to landscape
        unit: "mm",
        format: "a4",
        margin: { left: 0, right: 0 }, // Set left and right margins to zero
      });
      // Add a custom header text
      const headerText = "";
      pdf.text(headerText, 10, 10); // Adjust the coordinates as needed

      // Customize styles for autoTable
      const styles = {
        font: "helvetica",
        fontSize: 10,
        textColor: 0,
        lineColor: 200,
        lineWidth: 0.1,
        fontStyle: "normal",
      };

      // Customize header styles
      const headerStyles = {
        fillColor: [200, 200, 200],
        textColor: 0,
        fontStyle: "bold",
      };

      // Use autoTable to directly add the table content to the PDF
      pdf.autoTable({
        html: "#" + input.id, // Use the original table ID
        startY: 10, // You can adjust the starting Y position as needed
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 35 },
          2: { cellWidth: 25 },
          3: { cellWidth: 40 },
          4: { cellWidth: 30 },
          5: { cellWidth: 20 },
          6: { cellWidth: 30 },
          7: { cellWidth: 20 },
          8: { cellWidth: 30 },
        },
        headStyles: headerStyles,
      });

      // Save the PDF
      pdf.save("Inventory Report.pdf");
    }
  };

  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [invetory_prd, setInvetory_prd] = useState([]);
  const [invetory_assmbly, setInvetory_assmbly] = useState([]);
  const [invetory_spare, setInvetory_spare] = useState([]);
  const [invetory_subpart, setInvetory_subpart] = useState([]);

  useEffect(() => {
    //fetch product for inventory
    axios
      .get(BASE_URL + "/report_inv/inventoryPRD")
      .then((res) => setInvetory_prd(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    //fetch product for inventory
    axios
      .get(BASE_URL + "/report_inv/inventoryAssmbly")
      .then((res) => setInvetory_assmbly(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    //fetch product for inventory
    axios
      .get(BASE_URL + "/report_inv/inventorySpare")
      .then((res) => setInvetory_spare(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    //fetch product for inventory
    axios
      .get(BASE_URL + "/report_inv/inventorySubpart")
      .then((res) => setInvetory_subpart(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($("#order2-listing").length > 0 && invetory_prd.length > 0) {
      $("#order2-listing").DataTable();
    }
  }, [invetory_prd]);

  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
        <div className="right-body-contents">
          {/* <div className="settings-search-master">
                <div className="dropdown-and-iconics">
                    <div className="dropdown-side">
                    </div>
                    <div className="iconic-side">
                        <div className="gearsides">
                            <Gear size={35}/>
                        </div>
                        <div className="bellsides">
                            <Bell size={35}/>
                        </div>
                        <div className="usersides">
                            <UserCircle size={35}/>
                        </div>
                        <div className="username">
                          <h3>User Name</h3>
                        </div>
                    </div>
                </div>

                </div> */}
          <div className="Employeetext-button">
            <div className="employee-and-button">
              <div className="emp-text-side">
                <p>Inventory Reports</p>
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
                    <div style={{ zIndex: "3" }}>
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
                    <button className="genbutton">Generate</button>
                  </div>
                </div>
                <div className="export-refresh">
                  <button className="export">
                    <Export size={20} weight="bold" onClick={exportToPdf} />{" "}
                    <p1>Export</p1>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="table-containss">
            <div className="main-of-all-tables">
              <table ref={tableRef} id="order-listing">
                <thead>
                  <tr>
                    <th className="tableh">Product Code</th>
                    <th className="tableh">Product Name</th>
                    <th className="tableh">UOM</th>
                    <th className="tableh">Description</th>
                    <th className="tableh">Location</th>
                    <th className="tableh">Unit Price</th>
                    <th className="tableh">Quantity</th>
                    <th className="tableh">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invetory_prd.map((data, i) => (
                    <tr key={i}>
                      <td>{data.product_tag_supplier.product.product_code}</td>
                      <td>{data.product_tag_supplier.product.product_name}</td>
                      <td>
                        {
                          data.product_tag_supplier.product
                            .product_unitMeasurement
                        }
                      </td>
                      <td>
                        {data.product_tag_supplier.product.product_details}
                      </td>
                      <td>--</td>
                      <td>{data.price}</td>
                      <td>{data.quantity}</td>
                      <td>{data.price * data.quantity}</td>
                    </tr>
                  ))}

                  {invetory_assmbly.map((data, i) => (
                    <tr key={i}>
                      <td>{data.assembly_supplier.assembly.assembly_code}</td>
                      <td>{data.assembly_supplier.assembly.assembly_name}</td>
                      <td>--</td>
                      <td>{data.assembly_supplier.assembly.assembly_desc}</td>
                      <td>--</td>
                      <td>{data.price}</td>
                      <td>{data.quantity}</td>
                      <td>{data.price * data.quantity}</td>
                    </tr>
                  ))}

                  {invetory_spare.map((data, i) => (
                    <tr key={i}>
                      <td>
                        {data.sparepart_supplier.sparePart.spareParts_code}
                      </td>
                      <td>
                        {data.sparepart_supplier.sparePart.spareParts_name}
                      </td>
                      <td>--</td>
                      <td>
                        {data.sparepart_supplier.sparePart.spareParts_desc}
                      </td>
                      <td>--</td>
                      <td>{data.price}</td>
                      <td>{data.quantity}</td>
                      <td>{data.price * data.quantity}</td>
                    </tr>
                  ))}

                  {invetory_subpart.map((data, i) => (
                    <tr key={i}>
                      <td>{data.subpart_supplier.subPart.subPart_code}</td>
                      <td>{data.subpart_supplier.subPart.subPart_name}</td>
                      <td>--</td>
                      <td>{data.subpart_supplier.subPart.subPart_desc}</td>
                      <td>--</td>
                      <td>{data.price}</td>
                      <td>{data.quantity}</td>
                      <td>{data.price * data.quantity}</td>
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

export default InventoryReports;
