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
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [invetory_prd, setInvetory_prd] = useState([]);
  const [invetory_assmbly, setInvetory_assmbly] = useState([]);
  const [invetory_spare, setInvetory_spare] = useState([]);
  const [invetory_subpart, setInvetory_subpart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [warehouse, setWarehouse] = useState([]);
  const [category, setCategory] = useState([]);

  const [slctWarehouse, setSlctWarehouse] = useState();
  const [slctCategory, setSlctCategory] = useState();


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
        .get(BASE_URL + "/report_inv/inventoryPRD")
        .then((res) => {
          setInvetory_prd(res.data);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });

      axios
        .get(BASE_URL + "/report_inv/inventoryASM")
        .then((res) => {
          setInvetory_assmbly(res.data);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });

      axios
        .get(BASE_URL + "/report_inv/inventorySPR")
        .then((res) => {
          setInvetory_spare(res.data);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });

      axios
        .get(BASE_URL + "/report_inv/inventorySBP")
        .then((res) => {
          setInvetory_subpart(res.data);
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

  useEffect(() => {
    // Initialize DataTable when role data is available
    if (
      $("#order-listing").length > 0 &&
      invetory_prd.length > 0 &&
      invetory_assmbly.length > 0 &&
      invetory_spare.length > 0 &&
      invetory_subpart.length > 0
    ) {
      $("#order-listing").DataTable();
    }
  }, [invetory_prd, invetory_assmbly, invetory_spare, invetory_subpart]);

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

    invetory_assmbly.forEach((data) => {
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
            ? data.totalPRQuantity_asm +
              data.totalPR_intransit_Quantity +
              data.totalPR_Approval_Quantity
            : "--"
        }"`,
        `"${data.totalPR_received_Quantity}"`,
      ];
      rows.push(rowData.join(","));
    });

    invetory_spare.forEach((data) => {
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

    invetory_subpart.forEach((data) => {
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
      .get(BASE_URL + "/report_inv/Filtered_prd", {
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

      axios
      .get(BASE_URL + "/report_inv/Filtered_asm", {
        params: {
          slctCategory,
          slctWarehouse,
          strDate: startDate,
          enDate: endDate,
        },
      })
      .then((res) => {
        setInvetory_assmbly(res.data); 
      })
      .catch((err) => console.log(err));


      axios
      .get(BASE_URL + "/report_inv/Filtered_spare", {
        params: {
          slctCategory,
          slctWarehouse,
          strDate: startDate,
          enDate: endDate,
        },
      })
      .then((res) => {
        setInvetory_spare(res.data); 
      })
      .catch((err) => console.log(err));

      axios
      .get(BASE_URL + "/report_inv/Filtered_subpart", {
        params: {
          slctCategory,
          slctWarehouse,
          strDate: startDate,
          enDate: endDate,
        },
      })
      .then((res) => {
        setInvetory_subpart(res.data); 
      })
      .catch((err) => console.log(err));
    

    
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
                <div className="button-create-side">
                  <div className="filter">
                    <div className="cat-filter">
                      <div className="warehouse-filter">
                        <Form.Select
                          aria-label="item status"
                          onChange={(e) => setSlctWarehouse(e.target.value)}
                          style={{
                            width: "250px",
                            height: "40px",
                            fontSize: "15px",
                            marginBottom: "15px",
                            fontFamily: "Poppins, Source Sans Pro",
                          }}
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
                      <div className="product-filter">
                        <Form.Select
                          aria-label="item status"
                          style={{
                            width: "250px",
                            height: "40px",
                            fontSize: "15px",
                            marginBottom: "15px",
                            fontFamily: "Poppins, Source Sans Pro",
                          }}
                          onChange={(e) => setSlctCategory(e.target.value)}
                        >
                          <option disabled selected value="">
                            Select Category ...
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
                    <div className="date-filter">
                      <div className="date-pick">
                        <Form.Group
                          controlId="exampleForm.ControlInput2"
                          className="date"
                        >
                          <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            dateFormat="MM/dd/yyyy"
                            placeholderText="Start Date"
                            className="form-control"
                          />
                        </Form.Group>
                        <CalendarBlank
                          size={20}
                          style={{
                            position: "relative",
                            color: "#9a9a9a",
                            position: "relative",
                            left: "220px",
                            bottom: "30px",
                          }}
                        />
                      </div>
                      <div className="date-pick">
                        <Form.Group
                          controlId="exampleForm.ControlInput2"
                          className="date"
                        >
                          <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            dateFormat="MM/dd/yyyy"
                            placeholderText="End Date"
                            className="form-control"
                          />
                        </Form.Group>
                        <CalendarBlank
                          size={20}
                          style={{
                            position: "relative",
                            color: "#9a9a9a",
                            position: "relative",
                            left: "220px",
                            bottom: "30px",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="genbutton">
                    <button onClick={handleGenerate} className="genbutton">Generate</button>
                  </div>
                  <div className="export-refresh">
                    <button className="export" onClick={handleShow}>
                      <Export size={20} weight="bold" /> <p1>Export</p1>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="table-containss">
              <div className="main-of-all-tables">
                <table id="order-listing">
                  <thead>
                    <tr>
                      <th className="tableh">Product Code</th>
                      <th className="tableh">Product Name</th>
                      <th className="tableh">UOM</th>
                      <th className="tableh">Location</th>
                      <th className="tableh">Unit Price</th>
                      <th className="tableh">Quantity</th>
                      <th className="tableh">Total</th>
                      <th className="tableh">Issued (quantity)</th>
                      <th className="tableh">To Receive (quantity)</th>
                      <th className="tableh">Received (quantity)</th>
                    </tr>
                  </thead>
                  {invetory_prd.length > 0 ||
                  invetory_assmbly.length > 0 ||
                  invetory_spare.length > 0 ||
                  invetory_subpart.length > 0 ? (
                    <tbody>
                      {invetory_prd.map((data, i) => (
                        <tr key={i}>
                          <td>{data.product_code}</td>
                          <td>{data.product_name}</td>
                          <td>{data.UOM}</td>
                          <td>{data.warehouse_name}</td>
                          <td>{data.price}</td>
                          <td>{data.totalQuantity}</td>
                          <td>{data.price * data.totalQuantity}</td>
                          <td>{data.totalIssuedQuantity}</td>
                          <td>
                            {data.warehouse_name === "Main"
                              ? data.totalPRQuantity +
                                data.totalPR_intransit_Quantity +
                                data.totalPR_Approval_Quantity
                              : "--"}
                          </td>
                          <td>{data.totalPR_received_Quantity}</td>
                        </tr>
                      ))}
                       {invetory_assmbly.map((data, i) => (
                        <tr key={i}>
                          <td>{data.product_code}</td>
                          <td>{data.product_name}</td>
                          <td>{data.UOM}</td>
                          <td>{data.warehouse_name}</td>
                          <td>{data.price}</td>
                          <td>{data.totalQuantity}</td>
                          <td>{data.price * data.totalQuantity}</td>
                          <td>{data.totalIssuedQuantity}</td>
                          <td>
                            {data.warehouse_name === "Main"
                              ? data.totalPRQuantity_asm +
                                data.totalPR_intransit_Quantity +
                                data.totalPR_Approval_Quantity
                              : "--"}
                          </td>
                          <td>{data.totalPR_received_Quantity}</td>
                        </tr>
                      ))}

                      {invetory_spare.map((data, i) => (
                        <tr key={i}>
                          <td>{data.product_code}</td>
                          <td>{data.product_name}</td>
                          <td>{data.UOM}</td>
                          <td>{data.warehouse_name}</td>
                          <td>{data.price}</td>
                          <td>{data.totalQuantity}</td>
                          <td>{data.price * data.totalQuantity}</td>
                          <td>{data.totalIssuedQuantity}</td>
                          <td>
                            {data.warehouse_name === "Main"
                              ? data.totalPRQuantity +
                                data.totalPR_intransit_Quantity +
                                data.totalPR_Approval_Quantity
                              : "--"}
                          </td>
                          <td>{data.totalPR_received_Quantity}</td>
                        </tr>
                      ))}

                      {invetory_subpart.map((data, i) => (
                        <tr key={i}>
                          <td>{data.product_code}</td>
                          <td>{data.product_name}</td>
                          <td>{data.UOM}</td>
                          <td>{data.warehouse_name}</td>
                          <td>{data.price}</td>
                          <td>{data.totalQuantity}</td>
                          <td>{data.price * data.totalQuantity}</td>
                          <td>{data.totalIssuedQuantity}</td>
                          <td>
                            {data.warehouse_name === "Main"
                              ? data.totalPRQuantity +
                                data.totalPR_intransit_Quantity +
                                data.totalPR_Approval_Quantity
                              : "--"}
                          </td>
                          <td>{data.totalPR_received_Quantity}</td>
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
