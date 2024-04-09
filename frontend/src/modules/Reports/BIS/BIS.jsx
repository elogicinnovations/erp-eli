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

function BIS() {
  const tableRef = useRef();

  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bisContent, setBisContent] = useState([]);
  const [bisContent_asm, setBisContent_asm] = useState([]);
  const [bisContent_spare, setBisContent_spare] = useState([]);
  const [bisContent_subpart, setBisContent_subpart] = useState([]);

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
    axios
      .get(BASE_URL + "/report_BIS/content_fetch")
      .then((res) => {
        setBisContent(res.data.prd);
        setBisContent_asm(res.data.asm);
        setBisContent_spare(res.data.spare);
        setBisContent_subpart(res.data.subpart);
      })
      .catch((err) => console.log(err));
  };

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
        setBisContent_asm(res.data.asm);
        setBisContent_spare(res.data.spare);
        setBisContent_subpart(res.data.subpart);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    reloadTable();
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

  const exportToCSV = () => {

    let shouldExport = true;

    bisContent.forEach(item => {
      if (item.inventory_prd && item.inventory_prd.freight_cost === 0) {
        shouldExport = false; // Set the flag to false if condition is met
        swal({
          icon: "error",
          title: "Oops...",
          text: "There's still product that has no Freight Cost",
        });
        return; 
      }
      else if (item.inventory_prd && item.inventory_prd.custom_cost === 0){
        shouldExport = true; 
        swal({
          icon: "warning",
          title: "Warning",
          text: "There's a product that has no Duties & Custom Cost",
        });
        return; 
      }
    });

  bisContent_asm.forEach(item => {
    if (item.inventory_assembly && item.inventory_assembly.freight_cost === 0) {
      shouldExport = false; // Set the flag to false if condition is met
      swal({
        icon: "error",
        title: "Oops...",
        text: "There's still product that has no Freight Cost",
      });
      return; // Exit the loop early if condition is met
    }
    else if (item.inventory_assembly && item.inventory_assembly.custom_cost === 0){
      shouldExport = true; 
      swal({
        icon: "warning",
        title: "Warning",
        text: "There's a product that has no Duties & Custom Cost",
      });
      return; 
    }
  });


  bisContent_spare.forEach(item => {
    if (item.inventory_spare && item.inventory_spare.freight_cost === 0) {
      shouldExport = false; // Set the flag to false if condition is met
      swal({
        icon: "error",
        title: "Oops...",
        text: "There's still product that has no Freight Cost",
      });
      return; // Exit the loop early if condition is met
    }
    else if (item.inventory_spare && item.inventory_spare.custom_cost === 0){
      shouldExport = true; 
      swal({
        icon: "warning",
        title: "Warning",
        text: "There's a product that has no Duties & Custom Cost",
      });
      return; 
    }
  });

  bisContent_subpart.forEach(item => {
    if (item.inventory_subpart && item.inventory_subpart.freight_cost === 0) {
      shouldExport = false; // Set the flag to false if condition is met
      swal({
        icon: "error",
        title: "Oops...",
        text: "There's still product that has no Freight Cost",
      });
      return; // Exit the loop early if condition is met
    }
    else if (item.inventory_subpart && item.inventory_subpart.custom_cost === 0){
      shouldExport = true; 
      swal({
        icon: "warning",
        title: "Warning",
        text: "There's a product that has no Duties & Custom Cost",
      });
      return; 
    }
  });

  // Only export if the flag is true
  if (!shouldExport) {
    return;
  }

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
      "Cost Center",
      "Department",
      "Issued Quantity",
      "Product Code",
      "Product Name",
      "UOM",
      "Category",
      "Unit Price",
      "Freight Cost",
      "Duties & Custom Cost",
      "Total Price",
      "Issued Date",
    ];
    rows.push(headerData.join(","));

    // Add data rows
    bisContent.forEach((data) => {
      const rowData = [
        `"${data.issuance.cost_center.name}"`,
        `"${data.issuance.cost_center.masterlist.department.department_name}"`,
        `"${data.quantity}"`,
        `"${data.inventory_prd.product_tag_supplier.product.product_code}"`,
        `"${data.inventory_prd.product_tag_supplier.product.product_name}"`,
        `"${data.inventory_prd.product_tag_supplier.product.product_unitMeasurement}"`,
        `"${data.inventory_prd.product_tag_supplier.product.category.category_name}"`,
        `"${data.inventory_prd.price}"`,
        `"${data.inventory_prd.freight_cost}"`,
        `"${data.inventory_prd.custom_cost}"`,
        `"${
          data.inventory_prd.price +
          data.inventory_prd.freight_cost +
          data.inventory_prd.custom_cost
        }"`,
        `"${formatDatetime(data.createdAt)}"`,
      ];
      rows.push(rowData.join(","));
    });

    bisContent_asm.forEach((data) => {
      const rowData = [
        `"${data.issuance.cost_center.name}"`,
        `"${data.issuance.cost_center.masterlist.department.department_name}"`,
        `"${data.quantity}"`,
        `"${data.inventory_assembly.assembly_supplier.assembly.assembly_code}"`,
        `"${data.inventory_assembly.assembly_supplier.assembly.assembly_code}"`,
        `"${data.inventory_assembly.assembly_supplier.assembly.assembly_unitMeasurement}"`,
        `"${data.inventory_assembly.assembly_supplier.assembly.category.category_name}"`,
        `"${data.inventory_assembly.price}"`,
        `"${data.inventory_assembly.freight_cost}"`,
        `"${data.inventory_assembly.custom_cost}"`,
        `"${
          data.inventory_assembly.price +
          data.inventory_assembly.freight_cost +
          data.inventory_assembly.custom_cost
        }"`,
        `"${formatDatetime(data.createdAt)}"`,
      ];
      rows.push(rowData.join(","));
    });

    bisContent_spare.forEach((data) => {
      const rowData = [
        `"${data.issuance.cost_center.name}"`,
        `"${data.issuance.cost_center.masterlist.department.department_name}"`,
        `"${data.quantity}"`,
        `"${data.inventory_spare.sparepart_supplier.sparePart.spareParts_code}"`,
        `"${data.inventory_spare.sparepart_supplier.sparePart.spareParts_name}"`,
        `"${data.inventory_spare.sparepart_supplier.sparePart.spareParts_unitMeasurement}"`,
        `"${data.inventory_spare.sparepart_supplier.sparePart.category.category_name}"`,
        `"${data.inventory_spare.price}"`,
        `"${data.inventory_spare.freight_cost}"`,
        `"${data.inventory_spare.custom_cost}"`,
        `"${
          data.inventory_spare.price +
          data.inventory_spare.freight_cost +
          data.inventory_spare.custom_cost
        }"`,
        `"${formatDatetime(data.createdAt)}"`,
      ];
      rows.push(rowData.join(","));
    });

    bisContent_subpart.forEach((data) => {
      const rowData = [
        `"${data.issuance.cost_center.name}"`,
        `"${data.issuance.cost_center.masterlist.department.department_name}"`,
        `"${data.quantity}"`,
        `"${data.inventory_subpart.subpart_supplier.subPart.subPart_code}"`,
        `"${data.inventory_subpart.subpart_supplier.subPart.subPart_name}"`,
        `"${data.inventory_subpart.subpart_supplier.subPart.subPart_unitMeasurement}"`,
        `"${data.inventory_subpart.subpart_supplier.subPart.category.category_name}"`,
        `"${data.inventory_subpart.price}"`,
        `"${data.inventory_subpart.freight_cost}"`,
        `"${data.inventory_subpart.custom_cost}"`,
        `"${
          data.inventory_subpart.price +
          data.inventory_subpart.freight_cost +
          data.inventory_subpart.custom_cost
        }"`,
        `"${formatDatetime(data.createdAt)}"`,
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

  useEffect(() => {
    if (
      $("#order-listing").length > 0 &&
      bisContent.length > 0 ||
      bisContent_asm.length > 0 ||
      bisContent_spare.length > 0 ||
      bisContent_subpart.length > 0
    ) {
      $("#order-listing").DataTable();
    }
  }, []);

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
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        style={{
                          width: "250px",
                          height: "40px",
                          fontSize: "15px",
                          marginBottom: "15px",
                          fontFamily: "Poppins, Source Sans Pro",
                        }}
                      >
                        <option disabled value="" selected>
                          Select Department ...
                        </option>
                        <option value={"All"}>All</option>
                        {department.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.department_name}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <div className="product-filter">
                      <Form.Select
                        aria-label="item status"
                        onChange={(e) => setSelectedCostcenter(e.target.value)}
                        style={{
                          width: "250px",
                          height: "40px",
                          fontSize: "15px",
                          marginBottom: "15px",
                          fontFamily: "Poppins, Source Sans Pro",
                        }}
                      >
                        <option disabled value="" selected>
                          Select Cost Center ...
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
                  <div className="date-filter">
                    <div
                      style={{ width: "50%", zIndex: "3", padding: "0 10px" }}
                    >
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
                    <div
                      style={{ width: "50%", zIndex: "3", padding: "0 10px" }}
                    >
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
                  <button className="genbutton" onClick={handleGenerate}>
                    Generate
                  </button>
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
              <table ref={tableRef} id="order-listing">
                <thead>
                  <tr>
                    <th className="tableh">Cost Center</th>
                    <th className="tableh">Department</th>
                    <th className="tableh">Issued Quantity</th>
                    <th className="tableh">Product Code</th>
                    <th className="tableh">Product Name</th>
                    <th className="tableh">UOM</th>
                    <th className="tableh">Category</th>
                    <th className="tableh">Unit Price</th>
                    <th className="tableh">Freight Cost</th>
                    <th className="tableh">Duties & Custom Cost</th>
                    <th className="tableh">Total Price</th>
                    <th className="tableh">Issued Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bisContent.map((data, i) => (
                    <tr key={i}>
                      <td>{data.issuance.cost_center.name}</td>
                      <td>
                        {
                          data.issuance.cost_center.masterlist.department
                            .department_name
                        }
                      </td>
                      <td>{data.quantity}</td>
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
                      <td>
                        {
                          data.inventory_prd.product_tag_supplier.product
                            .product_unitMeasurement
                        }
                      </td>
                      <td>
                        {
                          data.inventory_prd.product_tag_supplier.product
                            .category.category_name
                        }
                      </td>
                      <td>{data.inventory_prd.price}</td>
                      <td>{data.inventory_prd.freight_cost}</td>
                      <td>{data.inventory_prd.custom_cost}</td>
                      <td>
                        {data.inventory_prd.price +
                          data.inventory_prd.freight_cost +
                          data.inventory_prd.custom_cost}
                      </td>
                      <td>{formatDatetime(data.createdAt)}</td>
                    </tr>
                  ))}
                  {bisContent_asm.map((data, i) => (
                    <tr key={i}>
                      <td>{data.issuance.cost_center.name}</td>
                      <td>
                        {
                          data.issuance.cost_center.masterlist.department
                            .department_name
                        }
                      </td>
                      <td>{data.quantity}</td>
                      <td>
                        {
                          data.inventory_assembly.assembly_supplier.assembly
                            .assembly_code
                        }
                      </td>
                      <td>
                        {
                          data.inventory_assembly.assembly_supplier.assembly
                            .assembly_name
                        }
                      </td>
                      <td>
                        {
                          data.inventory_assembly.assembly_supplier.assembly
                            .assembly_unitMeasurement
                        }
                      </td>
                      <td>
                        {
                          data.inventory_assembly.assembly_supplier.assembly
                            .category.category_name
                        }
                      </td>
                      <td>{data.inventory_assembly.price}</td>
                      <td>{data.inventory_assembly.freight_cost}</td>
                      <td>{data.inventory_assembly.custom_cost}</td>
                      <td>
                        {data.inventory_assembly.price +
                          data.inventory_assembly.freight_cost +
                          data.inventory_assembly.custom_cost}
                      </td>
                      <td>{formatDatetime(data.createdAt)}</td>
                    </tr>
                  ))}

                  {bisContent_spare.map((data, i) => (
                    <tr key={i}>
                      <td>{data.issuance.cost_center.name}</td>
                      <td>
                        {
                          data.issuance.cost_center.masterlist.department
                            .department_name
                        }
                      </td>
                      <td>{data.quantity}</td>
                      <td>
                        {
                          data.inventory_spare.sparepart_supplier.sparePart
                            .spareParts_code
                        }
                      </td>
                      <td>
                        {
                          data.inventory_spare.sparepart_supplier.sparePart
                            .spareParts_name
                        }
                      </td>
                      <td>
                        {
                          data.inventory_spare.sparepart_supplier.sparePart
                            .spareParts_unitMeasurement
                        }
                      </td>
                      <td>
                        {
                          data.inventory_spare.sparepart_supplier.sparePart
                            .category.category_name
                        }
                      </td>
                      <td>{data.inventory_spare.price}</td>
                      <td>{data.inventory_spare.freight_cost}</td>
                      <td>{data.inventory_spare.custom_cost}</td>
                      <td>
                        {data.inventory_spare.price +
                          data.inventory_spare.freight_cost +
                          data.inventory_spare.custom_cost}
                      </td>
                      <td>{formatDatetime(data.createdAt)}</td>
                    </tr>
                  ))}

                  {bisContent_subpart.map((data, i) => (
                    <tr key={i}>
                      <td>{data.issuance.cost_center.name}</td>
                      <td>
                        {
                          data.issuance.cost_center.masterlist.department
                            .department_name
                        }
                      </td>
                      <td>{data.quantity}</td>
                      <td>
                        {
                          data.inventory_subpart.subpart_supplier.subPart
                            .subPart_code
                        }
                      </td>
                      <td>
                        {
                          data.inventory_subpart.subpart_supplier.subPart
                            .subPart_name
                        }
                      </td>
                      <td>
                        {
                          data.inventory_subpart.subpart_supplier.subPart
                            .subPart_unitMeasurement
                        }
                      </td>
                      <td>
                        {
                          data.inventory_subpart.subpart_supplier.subPart
                            .category.category_name
                        }
                      </td>
                      <td>{data.inventory_subpart.price}</td>
                      <td>{data.inventory_subpart.freight_cost}</td>
                      <td>{data.inventory_subpart.custom_cost}</td>
                      <td>
                        {data.inventory_subpart.price +
                          data.inventory_subpart.freight_cost +
                          data.inventory_subpart.custom_cost}
                      </td>
                      <td>{formatDatetime(data.createdAt)}</td>
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

export default BIS;
