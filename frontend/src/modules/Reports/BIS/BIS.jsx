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
import { CalendarBlank, Export, XCircle } from "@phosphor-icons/react";
import NoData from "../../../../src/assets/image/NoData.png";
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

function BIS() {
  const tableRef = useRef();

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

  const totalPagesBISasm = Math.ceil(bisContent_asm.length / pageSize);
  const startIndexBISasm = (currentPage - 1) * pageSize;
  const endIndexBISasm = Math.min(
    startIndexBISasm + pageSize,
    bisContent_asm.length
  );
  const currentItemsBISasm = bisContent_asm.slice(
    startIndexBISasm,
    endIndexBISasm
  );

  const totalPagesBISspare = Math.ceil(bisContent_spare.length / pageSize);
  const startIndexBISspare = (currentPage - 1) * pageSize;
  const endIndexBISspare = Math.min(
    startIndexBISspare + pageSize,
    bisContent_spare.length
  );
  const currentItemsBISspare = bisContent_spare.slice(
    startIndexBISspare,
    endIndexBISspare
  );

  const totalPagesBISsubpart = Math.ceil(bisContent_subpart.length / pageSize);
  const startIndexBISsubpart = (currentPage - 1) * pageSize;
  const endIndexBISsubpart = Math.min(
    startIndexBISsubpart + pageSize,
    bisContent_subpart.length
  );
  const currentItemsBISsubpart = bisContent_subpart.slice(
    startIndexBISsubpart,
    endIndexBISsubpart
  );

  const maxTotalPages = Math.max(
    totalPagesBISProd,
    totalPagesBISasm,
    totalPagesBISspare,
    totalPagesBISsubpart
  );

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
        setSearchBIS(res.data.prd);
        setBisContent_asm(res.data.asm);
        setSearchBISasm(res.data.asm);
        setBisContent_spare(res.data.spare);
        setSearchBISspare(res.data.spare);
        setBisContent_subpart(res.data.subpart);
        setSearchBISsub(res.data.subpart);
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

  const handleSearch = (event) => {
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

    const filteredSearchBISasm = searchBISasm.filter((data) => {
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
        data.inventory_assembly.assembly_supplier.assembly.category.category_name
          .toLowerCase()
          .includes(searchTerm) ||
        data.inventory_assembly.assembly_supplier.assembly.assembly_code
          .toLowerCase()
          .includes(searchTerm) ||
        data.inventory_assembly.assembly_supplier.assembly.assembly_name
          .toLowerCase()
          .includes(searchTerm) ||
        (typeof data.quantity === "number" &&
          data.quantity.toString().toLowerCase().includes(searchTerm)) ||
        data.inventory_assembly.assembly_supplier.assembly.assembly_unitMeasurement
          .toLowerCase()
          .includes(searchTerm) ||
        ((typeof data.inventory_assembly.price === "number" ||
          typeof data.inventory_assembly.price === "string") &&
          data.inventory_assembly.price
            .toString()
            .toLowerCase()
            .includes(searchTerm)) ||
        ((typeof data.inventory_assembly.freight_cost === "number" ||
          typeof data.inventory_assembly.freight_cost === "string") &&
          data.inventory_assembly.freight_cost
            .toString()
            .toLowerCase()
            .includes(searchTerm)) ||
        ((typeof data.inventory_assembly.custom_cost === "number" ||
          typeof data.inventory_assembly.custom_cost === "string") &&
          data.inventory_assembly.custom_cost
            .toString()
            .toLowerCase()
            .includes(searchTerm)) ||
        (
          data.inventory_assembly.price +
          data.inventory_assembly.freight_cost +
          data.inventory_assembly.custom_cost
        )
          .toFixed(2)
          .includes(searchTerm) ||
        (
          (data.inventory_assembly.price +
            data.inventory_assembly.freight_cost +
            data.inventory_assembly.custom_cost) *
          data.quantity
        )
          .toFixed(2)
          .includes(searchTerm)
      );
    });
    setBisContent_asm(filteredSearchBISasm);

    const filteredSearchBISspare = searchBISspare.filter((data) => {
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
        (data.inventory_spare &&
          data.inventory_spare.sparepart_supplier &&
          data.inventory_spare.sparepart_supplier.sparePart &&
          data.inventory_spare.sparepart_supplier.sparePart.category &&
          data.inventory_spare.sparepart_supplier.sparePart.category.category_name
            .toLowerCase()
            .includes(searchTerm)) ||
        (data.inventory_spare &&
          data.inventory_spare.sparepart_supplier &&
          data.inventory_spare.sparepart_supplier.sparePart &&
          data.inventory_spare.sparepart_supplier.sparePart.spareParts_code
            .toLowerCase()
            .includes(searchTerm)) ||
        (data.inventory_spare &&
          data.inventory_spare.sparepart_supplier &&
          data.inventory_spare.sparepart_supplier.sparePart &&
          data.inventory_spare.sparepart_supplier.sparePart.spareParts_name
            .toLowerCase()
            .includes(searchTerm)) ||
        (typeof data.quantity === "number" &&
          data.quantity.toString().toLowerCase().includes(searchTerm)) ||
        (data.inventory_spare &&
          data.inventory_spare.sparepart_supplier &&
          data.inventory_spare.sparepart_supplier.sparePart &&
          data.inventory_spare.sparepart_supplier.sparePart
            .spareParts_unitMeasurement &&
          data.inventory_spare.sparepart_supplier.sparePart.spareParts_unitMeasurement
            .toLowerCase()
            .includes(searchTerm)) ||
        ((typeof data.inventory_spare.price === "number" ||
          typeof data.inventory_spare.price === "string") &&
          data.inventory_spare.price
            .toString()
            .toLowerCase()
            .includes(searchTerm)) ||
        ((typeof data.inventory_spare.freight_cost === "number" ||
          typeof data.inventory_spare.freight_cost === "string") &&
          data.inventory_spare.freight_cost
            .toString()
            .toLowerCase()
            .includes(searchTerm)) ||
        ((typeof data.inventory_spare.custom_cost === "number" ||
          typeof data.inventory_spare.custom_cost === "string") &&
          data.inventory_spare.custom_cost
            .toString()
            .toLowerCase()
            .includes(searchTerm)) ||
        (
          data.inventory_spare.price +
          data.inventory_spare.freight_cost +
          data.inventory_spare.custom_cost
        )
          .toFixed(2)
          .includes(searchTerm) ||
        (
          (data.inventory_spare.price +
            data.inventory_spare.freight_cost +
            data.inventory_spare.custom_cost) *
          data.quantity
        )
          .toFixed(2)
          .includes(searchTerm)
      );
    });
    setBisContent_spare(filteredSearchBISspare);
    

    const filteredSearchBISsub = searchBISsub.filter((data) => {
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
        data.inventory_subpart.subpart_supplier.subPart.category.category_name
          .toLowerCase()
          .includes(searchTerm) ||
        data.inventory_subpart.subpart_supplier.subPart.subPart_code
          .toLowerCase()
          .includes(searchTerm) ||
        data.inventory_subpart.subpart_supplier.subPart.subPart_name
          .toLowerCase()
          .includes(searchTerm) ||
        (typeof data.quantity === "number" &&
          data.quantity.toString().toLowerCase().includes(searchTerm)) ||
        data.inventory_subpart.subpart_supplier.subPart.subPart_unitMeasurement
          .toLowerCase()
          .includes(searchTerm) ||
        ((typeof data.inventory_subpart.price === "number" ||
          typeof data.inventory_subpart.price === "string") &&
          data.inventory_subpart.price
            .toString()
            .toLowerCase()
            .includes(searchTerm)) ||
        ((typeof data.inventory_subpart.freight_cost === "number" ||
          typeof data.inventory_subpart.freight_cost === "string") &&
          data.inventory_subpart.freight_cost
            .toString()
            .toLowerCase()
            .includes(searchTerm)) ||
        ((typeof data.inventory_subpart.custom_cost === "number" ||
          typeof data.inventory_subpart.custom_cost === "string") &&
          data.inventory_subpart.custom_cost
            .toString()
            .toLowerCase()
            .includes(searchTerm)) ||
        (
          data.inventory_subpart.price +
          data.inventory_subpart.freight_cost +
          data.inventory_subpart.custom_cost
        )
          .toFixed(2)
          .includes(searchTerm) ||
        (
          (data.inventory_subpart.price +
            data.inventory_subpart.freight_cost +
            data.inventory_subpart.custom_cost) *
          data.quantity
        )
          .toFixed(2)
          .includes(searchTerm)
      );
    });
    setBisContent_subpart(filteredSearchBISsub);
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
    let shouldExport = true;

    bisContent.forEach((item) => {
      if (item.inventory_prd && item.inventory_prd.freight_cost === 0) {
        shouldExport = false; // Set the flag to false if condition is met
        swal({
          icon: "error",
          title: "Oops...",
          text: "There's still product that has no Freight Cost",
        });
        return;
      } else if (item.inventory_prd && item.inventory_prd.custom_cost === 0) {
        shouldExport = true;
        swal({
          icon: "warning",
          title: "Warning",
          text: "There's a product that has no Duties & Custom Cost",
        });
        return;
      }
    });

    bisContent_asm.forEach((item) => {
      if (
        item.inventory_assembly &&
        item.inventory_assembly.freight_cost === 0
      ) {
        shouldExport = false; // Set the flag to false if condition is met
        swal({
          icon: "error",
          title: "Oops...",
          text: "There's still product that has no Freight Cost",
        });
        return; // Exit the loop early if condition is met
      } else if (
        item.inventory_assembly &&
        item.inventory_assembly.custom_cost === 0
      ) {
        shouldExport = true;
        swal({
          icon: "warning",
          title: "Warning",
          text: "There's a product that has no Duties & Custom Cost",
        });
        return;
      }
    });

    bisContent_spare.forEach((item) => {
      if (item.inventory_spare && item.inventory_spare.freight_cost === 0) {
        shouldExport = false; // Set the flag to false if condition is met
        swal({
          icon: "error",
          title: "Oops...",
          text: "There's still product that has no Freight Cost",
        });
        return; // Exit the loop early if condition is met
      } else if (
        item.inventory_spare &&
        item.inventory_spare.custom_cost === 0
      ) {
        shouldExport = true;
        swal({
          icon: "warning",
          title: "Warning",
          text: "There's a product that has no Duties & Custom Cost",
        });
        return;
      }
    });

    bisContent_subpart.forEach((item) => {
      if (item.inventory_subpart && item.inventory_subpart.freight_cost === 0) {
        shouldExport = false; // Set the flag to false if condition is met
        swal({
          icon: "error",
          title: "Oops...",
          text: "There's still product that has no Freight Cost",
        });
        return; // Exit the loop early if condition is met
      } else if (
        item.inventory_subpart &&
        item.inventory_subpart.custom_cost === 0
      ) {
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
      "AUP",
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

    bisContent_asm.forEach((data) => {
      const rowData = [
        `"${formatDatetime(data.createdAt)}"`,
        `"${data.issuance.issuance_id}"`,
        `\t${data.issuance.mrs}`,
        `"${data.inventory_assembly.assembly_supplier.assembly.category.category_name}"`,
        `\t${data.inventory_assembly.assembly_supplier.assembly.assembly_code}`,
        `"${data.inventory_assembly.assembly_supplier.assembly.assembly_name}"`,
        `"${data.quantity}"`,
        `"${data.inventory_assembly.assembly_supplier.assembly.assembly_unitMeasurement}"`,

        `"${data.inventory_assembly.price}"`,
        `"${data.inventory_assembly.freight_cost}"`,
        `"${data.inventory_assembly.custom_cost}"`,
        `"${(
          data.inventory_assembly.price +
          data.inventory_assembly.freight_cost +
          data.inventory_assembly.custom_cost
        ).toFixed(2)}"`,
        `"${(
          (data.inventory_assembly.price +
            data.inventory_assembly.freight_cost +
            data.inventory_assembly.custom_cost) *
          data.quantity
        ).toFixed(2)}"`,
      ];
      rows.push(rowData.join(","));
    });

    bisContent_spare.forEach((data) => {
      const rowData = [
        `"${formatDatetime(data.createdAt)}"`,
        `"${data.issuance.issuance_id}"`,
        `\t${data.issuance.mrs}`,
        `"${data.inventory_spare.sparepart_supplier.sparePart.category.category_name}"`,
        `\t${data.inventory_spare.sparepart_supplier.sparePart.spareParts_code}`,
        `"${data.inventory_spare.sparepart_supplier.sparePart.spareParts_name}"`,
        `"${data.quantity}"`,
        `"${data.inventory_spare.sparepart_supplier.sparePart.spareParts_unitMeasurement}"`,
        `"${data.inventory_spare.price}"`,
        `"${data.inventory_spare.freight_cost}"`,
        `"${data.inventory_spare.custom_cost}"`,
        `"${(
          data.inventory_spare.price +
          data.inventory_spare.freight_cost +
          data.inventory_spare.custom_cost
        ).toFixed(2)}"`,
        `"${(
          (data.inventory_spare.price +
            data.inventory_spare.freight_cost +
            data.inventory_spare.custom_cost) *
          data.quantity
        ).toFixed(2)}"`,
      ];
      rows.push(rowData.join(","));
    });

    bisContent_subpart.forEach((data) => {
      const rowData = [
        `"${formatDatetime(data.createdAt)}"`,
        `"${data.issuance.issuance_id}"`,
        `\t${data.issuance.mrs}`,
        `"${data.inventory_subpart.subpart_supplier.subPart.category.category_name}"`,
        `\t${data.inventory_subpart.subpart_supplier.subPart.subPart_code}`,
        `"${data.inventory_subpart.subpart_supplier.subPart.subPart_name}"`,
        `"${data.quantity}"`,
        `"${data.inventory_subpart.subpart_supplier.subPart.subPart_unitMeasurement}"`,
        `"${data.inventory_subpart.price}"`,
        `"${data.inventory_subpart.freight_cost}"`,
        `"${data.inventory_subpart.custom_cost}"`,
        `"${(
          data.inventory_subpart.price +
          data.inventory_subpart.freight_cost +
          data.inventory_subpart.custom_cost
        ).toFixed(2)}"`,
        `"${(
          (data.inventory_subpart.price +
            data.inventory_subpart.freight_cost +
            data.inventory_subpart.custom_cost) *
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
        <div className="right-body-contents">
          <div className="Employeetext-button">
            <div className="employee-and-button">
              <div className="emp-text-side">
                <p>BIS REPORT</p>
              </div>
              <div className="button-create-side">
                <div className="filtering-section">
                  <div className="date-section-filter">
                    <div style={{ position: "relative", marginBottom: "15px" }}>
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
                    <div className="">
                      <Form.Select
                        aria-label="item status"
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        style={{
                          width: "274px",
                          height: "40px",
                          fontSize: "15px",
                          marginBottom: "15px",
                          fontFamily: "Poppins, Source Sans Pro",
                        }}
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
                        onChange={(e) => setSelectedCostcenter(e.target.value)}
                        style={{
                          width: "284px",
                          height: "40px",
                          fontSize: "15px",
                          marginBottom: "15px",
                          fontFamily: "Poppins, Source Sans Pro",
                        }}
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

                  <div className="button-filter-section">
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
                        width: "250px",
                        height: "50px",
                      },
                    }}
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
                    <th className="tableh">AUP</th>
                    <th className="tableh">Total</th>
                  </tr>
                </thead>
                {bisContent.length > 0 ||
                bisContent_asm.length > 0 ||
                bisContent_spare.length > 0 ||
                bisContent_subpart.length > 0 ? (
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

                    {currentItemsBISasm.map((data, i) => (
                      <tr key={i}>
                        <td>{formatDatetime(data.createdAt)}</td>
                        <td>{data.issuance.issuance_id}</td>
                        <td>{data.issuance.mrs}</td>
                        <td>
                          {
                            data.inventory_assembly.assembly_supplier.assembly
                              .category.category_name
                          }
                        </td>
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
                        <td>{data.quantity}</td>
                        <td>
                          {
                            data.inventory_assembly.assembly_supplier.assembly
                              .assembly_unitMeasurement
                          }
                        </td>

                        <td>{data.inventory_assembly.price}</td>
                        <td>{data.inventory_assembly.freight_cost}</td>
                        <td>{data.inventory_assembly.custom_cost}</td>
                        <td>
                          {(
                            data.inventory_assembly.price +
                            data.inventory_assembly.freight_cost +
                            data.inventory_assembly.custom_cost
                          ).toFixed(2)}
                        </td>
                        <td>
                          {(
                            (data.inventory_assembly.price +
                              data.inventory_assembly.freight_cost +
                              data.inventory_assembly.custom_cost) *
                            data.quantity
                          ).toFixed(2)}
                        </td>
                      </tr>
                    ))}

                    {currentItemsBISspare.map((data, i) => (
                      <tr key={i}>
                        <td>{formatDatetime(data.createdAt)}</td>
                        <td>{data.issuance.issuance_id}</td>
                        <td>{data.issuance.mrs}</td>
                        <td>
                          {
                            data.inventory_spare.sparepart_supplier.sparePart
                              .category.category_name
                          }
                        </td>

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
                        <td>{data.quantity}</td>
                        <td>
                          {
                            data.inventory_spare.sparepart_supplier.sparePart
                              .spareParts_unitMeasurement
                          }
                        </td>
                        <td>{data.inventory_spare.price}</td>
                        <td>{data.inventory_spare.freight_cost}</td>
                        <td>{data.inventory_spare.custom_cost}</td>
                        <td>
                          {(
                            data.inventory_spare.price +
                            data.inventory_spare.freight_cost +
                            data.inventory_spare.custom_cost
                          ).toFixed(2)}
                        </td>
                        <td>
                          {(
                            (data.inventory_spare.price +
                              data.inventory_spare.freight_cost +
                              data.inventory_spare.custom_cost) *
                            data.quantity
                          ).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    
                    {currentItemsBISsubpart.map((data, i) => (
                      <tr key={i}>
                        <td>{formatDatetime(data.createdAt)}</td>
                        <td>{data.issuance.issuance_id}</td>
                        <td>{data.issuance.mrs}</td>
                        <td>
                          {
                            data.inventory_subpart.subpart_supplier.subPart
                              .category.category_name
                          }
                        </td>
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
                        <td>{data.quantity}</td>
                        <td>
                          {
                            data.inventory_subpart.subpart_supplier.subPart
                              .subPart_unitMeasurement
                          }
                        </td>

                        <td>{data.inventory_subpart.price}</td>
                        <td>{data.inventory_subpart.freight_cost}</td>
                        <td>{data.inventory_subpart.custom_cost}</td>
                        <td>
                          {(
                            data.inventory_subpart.price +
                            data.inventory_subpart.freight_cost +
                            data.inventory_subpart.custom_cost
                          ).toFixed(2)}
                        </td>
                        <td>
                          {(
                            (data.inventory_subpart.price +
                              data.inventory_subpart.freight_cost +
                              data.inventory_subpart.custom_cost) *
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
              {[...Array(maxTotalPages).keys()].map((num) => (
                <li
                  key={num}
                  className={`page-item ${
                    currentPage === num + 1 ? "active" : ""
                  }`}
                >
                  <button
                    style={{
                      fontSize: "14px",
                      width: "25px",
                      background: currentPage === num + 1 ? "#FFA500" : "white", // Set background to white if not clicked
                      color: currentPage === num + 1 ? "#FFFFFF" : "#000000",
                      border: "none",
                      height: "28px",
                    }}
                    className={`page-link ${
                      currentPage === num + 1 ? "gold-bg" : ""
                    }`}
                    onClick={() => setCurrentPage(num + 1)}
                  >
                    {num + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${
                  currentPage === maxTotalPages ? "disabled" : ""
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
      </div>
    </div>
  );
}

export default BIS;
