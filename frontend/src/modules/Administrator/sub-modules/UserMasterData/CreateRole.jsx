import React, { useState, useEffect } from "react";
import Sidebar from "../../../Sidebar/sidebar";
import axios from "axios";
import "../../../../assets/global/style.css";
import "../../../styles/react-style.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import swal from "sweetalert";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import BASE_URL from "../../../../assets/global/url";
import { MagnifyingGlass, Gear, Bell, UserCircle } from "@phosphor-icons/react";
import { border } from "@mui/system";
import { jwtDecode } from "jwt-decode";

function Create_role() {
  const navigate = useNavigate();
  // Inserting to database checkboxes
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [Fname, setFname] = useState("");
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userId, setuserId] = useState("");

  const decodeToken = () => {
    var token = localStorage.getItem("accessToken");
    if (typeof token === "string") {
      var decoded = jwtDecode(token);
      setUsername(decoded.username);
      setFname(decoded.Fname);
      setUserRole(decoded.userrole);
      setuserId(decoded.id);
    }
  };

  useEffect(() => {
    decodeToken();
  }, []);

  const handleRoleNameInput = (e) => {
    const inputValue = e.target.value;
    const isValid = /^[a-zA-Z\s',.\-]+$/.test(inputValue);
    if (!isValid) {
      // Show an error message or prevent further input
      e.target.setCustomValidity("Invalid role name");
    } else {
      e.target.setCustomValidity(""); // Clear any previous validation message
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rolename = document.getElementsByName("rolename")[0].value;
    const desc = document.getElementsByName("desc")[0].value;

    if (rolename === "") {
      swal({
        title: "Required Field",
        text: "Rolename is required",
        icon: "error",
        button: "OK",
      });
    } else {
      try {
        const response = await fetch(
          BASE_URL + `/userRole/createUserrole/${rolename}?userId=${userId}`,
          {
            rolename,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              selectedCheckboxes: selectedCheckboxes.map((item) => ({
                ...item,
                rolename,
                desc,
              })),
            }),
          }
        );

        if (response.status === 200) {
          swal({
            title: "User Role Added Successfully!",
            text: "The new user role has been added successfully.",
            icon: "success",
            button: "OK",
          }).then(() => {
            navigate("/userRole");
          });
        } else if (response.status === 202) {
          swal({
            title: "User Role Already Exists",
            text: "Please enter a new user role.",
            icon: "error",
          });
        }
        // else {
        //     swal({
        //     icon: 'error',
        //     title: 'Oops...',
        //     text: 'Something went wrong!',
        //     });
        // }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };

  // Inserting to database checkboxes

  const handleCheckboxChange = (value) => {
    const rolename = document.getElementsByName("rolename")[0].value;
    const desc = document.getElementsByName("desc")[0].value;
    const authorization = value;

    if (
      value === "Master List - View" &&
      selectedCheckboxes.some((item) => item.value === "Master List - View")
    ) {
      setSelectedCheckboxes(
        selectedCheckboxes.filter(
          (item) =>
            item.value !== "Master List - View" &&
            item.value !== "Master List - Add" &&
            item.value !== "Master List - Edit" &&
            item.value !== "Master List - Delete"
        )
      );
    } else if (
      value === "User Access Role - View" &&
      selectedCheckboxes.some(
        (item) => item.value === "User Access Role - View"
      )
    ) {
      setSelectedCheckboxes(
        selectedCheckboxes.filter(
          (item) =>
            item.value !== "User Access Role - View" &&
            item.value !== "User Access Role - Add" &&
            item.value !== "User Access Role - Edit" &&
            item.value !== "User Access Role - Delete"
        )
      );
    } else if (
      value === "Product List - View" &&
      selectedCheckboxes.some((item) => item.value === "Product List - View")
    ) {
      setSelectedCheckboxes(
        selectedCheckboxes.filter(
          (item) =>
            item.value !== "Product List - View" &&
            item.value !== "Product List - Add" &&
            item.value !== "Product List - Edit" &&
            item.value !== "Product List - Delete"
        )
      );
    }

    // if (value === "Assembly - View" && selectedCheckboxes.some((item) => item.value === "Assembly - View")) {
    //   setSelectedCheckboxes(
    //     selectedCheckboxes.filter((item) =>
    //       item.value !== "Assembly - View" &&
    //       item.value !== "Assembly - Add" &&
    //       item.value !== "Assembly - Edit" &&
    //       item.value !== "Assembly - Delete"
    //     )
    //   );
    // } else

    // if (value === "Spare Part - View" && selectedCheckboxes.some((item) => item.value === "Spare Part - View")) {
    //   setSelectedCheckboxes(
    //     selectedCheckboxes.filter((item) =>
    //       item.value !== "Spare Part - View" &&
    //       item.value !== "Spare Part - Add" &&
    //       item.value !== "Spare Part - Edit" &&
    //       item.value !== "Spare Part - Delete"
    //     )
    //   );
    // } else

    // if (value === "Sub-Part - View" && selectedCheckboxes.some((item) => item.value === "Sub-Part - View")) {
    //   setSelectedCheckboxes(
    //     selectedCheckboxes.filter((item) =>
    //       item.value !== "Sub-Part - View" &&
    //       item.value !== "Sub-Part - Add" &&
    //       item.value !== "Sub-Part - Edit" &&
    //       item.value !== "Sub-Part - Delete"
    //     )
    //   );
    // } else
    else if (
      value === "Product Categories - View" &&
      selectedCheckboxes.some(
        (item) => item.value === "Product Categories - View"
      )
    ) {
      setSelectedCheckboxes(
        selectedCheckboxes.filter(
          (item) =>
            item.value !== "Product Categories - View" &&
            item.value !== "Product Categories - Add" &&
            item.value !== "Product Categories - Edit" &&
            item.value !== "Product Categories - Delete"
        )
      );
    } else if (
      value === "Product Manufacturer - View" &&
      selectedCheckboxes.some(
        (item) => item.value === "Product Manufacturer - View"
      )
    ) {
      setSelectedCheckboxes(
        selectedCheckboxes.filter(
          (item) =>
            item.value !== "Product Manufacturer - View" &&
            item.value !== "Product Manufacturer - Add" &&
            item.value !== "Product Manufacturer - Edit" &&
            item.value !== "Product Manufacturer - Delete"
        )
      );
    } else if (
      value === "Bin Location - View" &&
      selectedCheckboxes.some((item) => item.value === "Bin Location - View")
    ) {
      setSelectedCheckboxes(
        selectedCheckboxes.filter(
          (item) =>
            item.value !== "Bin Location - View" &&
            item.value !== "Bin Location - Add" &&
            item.value !== "Bin Location - Edit" &&
            item.value !== "Bin Location - Delete"
        )
      );
    } else if (
      value === "Cost Centre - View" &&
      selectedCheckboxes.some((item) => item.value === "Cost Centre - View")
    ) {
      setSelectedCheckboxes(
        selectedCheckboxes.filter(
          (item) =>
            item.value !== "Cost Centre - View" &&
            item.value !== "Cost Centre - Add" &&
            item.value !== "Cost Centre - Edit" &&
            item.value !== "Cost Centre - Delete"
        )
      );
    } else if (
      value === "Supplier - View" &&
      selectedCheckboxes.some((item) => item.value === "Supplier - View")
    ) {
      setSelectedCheckboxes(
        selectedCheckboxes.filter(
          (item) =>
            item.value !== "Supplier - View" &&
            item.value !== "Supplier - Add" &&
            item.value !== "Supplier - Edit" &&
            item.value !== "Supplier - Delete"
        )
      );
    } else if (
      value === "Warehouses - View" &&
      selectedCheckboxes.some((item) => item.value === "Warehouses - View")
    ) {
      setSelectedCheckboxes(
        selectedCheckboxes.filter(
          (item) =>
            item.value !== "Warehouses - View" &&
            item.value !== "Warehouses - Add" &&
            item.value !== "Warehouses - Edit" &&
            item.value !== "Warehouses - Delete"
        )
      );
    } else if (
      value === "Inventory - View" &&
      selectedCheckboxes.some((item) => item.value === "Inventory - View")
    ) {
      setSelectedCheckboxes(
        selectedCheckboxes.filter(
          (item) =>
            item.value !== "Inventory - View" &&
            item.value !== "Inventory - Add" &&
            item.value !== "Inventory - Edit" &&
            item.value !== "Inventory - Approval" &&
            item.value !== "Inventory - Reject"
        )
      );
    } else if (
      value === "PR - View" &&
      selectedCheckboxes.some((item) => item.value === "PR - View")
    ) {
      setSelectedCheckboxes(
        selectedCheckboxes.filter(
          (item) =>
            item.value !== "PR - View" &&
            item.value !== "PR - Add" &&
            item.value !== "PR - Edit" &&
            item.value !== "PR - Approval" &&
            item.value !== "PR - Reject"
        )
      );
    } else if (
      value === "PO - View" &&
      selectedCheckboxes.some((item) => item.value === "PO - View")
    ) {
      setSelectedCheckboxes(
        selectedCheckboxes.filter(
          (item) =>
            item.value !== "PO - View" &&
            item.value !== "PO - Approval" &&
            item.value !== "PO - Reject"
        )
      );
    } else if (
      value === "Receiving - View" &&
      selectedCheckboxes.some((item) => item.value === "Receiving - View")
    ) {
      setSelectedCheckboxes(
        selectedCheckboxes.filter(
          (item) =>
            item.value !== "Receiving - View" &&
            item.value !== "Receiving - Approval" &&
            item.value !== "Receiving - Reject"
        )
      );
    } else if (
      value === "Stock Management - View" &&
      selectedCheckboxes.some(
        (item) => item.value === "Stock Management - View"
      )
    ) {
      setSelectedCheckboxes(
        selectedCheckboxes.filter(
          (item) =>
            item.value !== "Stock Management - View" &&
            item.value !== "Stock Management - Add" &&
            item.value !== "Stock Management - Approval" &&
            item.value !== "Stock Management - Reject"
        )
      );
    } else {
      if (selectedCheckboxes.some((item) => item.value === value)) {
        setSelectedCheckboxes(
          selectedCheckboxes.filter((item) => item.value !== value)
        );
      } else {
        setSelectedCheckboxes([
          ...selectedCheckboxes,
          { value, rolename, desc, authorization },
        ]);
      }
    }
  };

  const handleSelectAll = () => {
    // Select all checkboxes
    const allCheckboxValues = [
      "Dashboard - View",
      "Master List - Add",
      "Master List - Edit",
      "Master List - Delete",
      "Master List - View",
      "User Access Role - Add",
      "User Access Role - Edit",
      "User Access Role - Delete",
      "User Access Role - View",
      "Department - Add",
      "Department - Edit",
      "Department - Delete",
      "Department - View",
      "Product List - Add",
      "Product List - Edit",
      "Product List - Delete",
      "Product List - View",
      // "Assembly - Add",
      // "Assembly - Edit",
      // "Assembly - Delete",
      // "Assembly - View",
      // "Spare Part - Add",
      // "Spare Part - Edit",
      // "Spare Part - Delete",
      // "Spare Part - View",
      // "Sub-Part - Add",
      // "Sub-Part - Edit",
      // "Sub-Part - Delete",
      // "Sub-Part - View",
      "Product Categories - Add",
      "Product Categories - Edit",
      "Product Categories - Delete",
      "Product Categories - View",
      "Product Manufacturer - Add",
      "Product Manufacturer - Edit",
      "Product Manufacturer - Delete",
      "Product Manufacturer - View",
      "Bin Location - Add",
      "Bin Location - Edit",
      "Bin Location - Delete",
      "Bin Location - View",
      "Cost Centre - Add",
      "Cost Centre - Edit",
      "Cost Centre - Delete",
      "Cost Centre - View",
      "Supplier - Add",
      "Supplier - Edit",
      "Supplier - Delete",
      "Supplier - View",
      "Warehouses - Add",
      "Warehouses - Edit",
      "Warehouses - Delete",
      "Warehouses - View",
      "Inventory Type - View",
      "Inventory - View",
      "Inventory - Add",
      "Inventory - Edit",
      "Inventory - Approval",
      "Inventory - Reject",
      "PR - Add",
      "PR - Edit",
      "PR - Approval",
      "PR - Reject",
      "PR - View",
      "PO - Approval",
      "PO - Reject",
      "PO - View",
      "Receiving - View",
      "Receiving - Approval",
      "Receiving - Reject",
      "Stock Management - Add",
      "Stock Management - View",
      "Stock Management - Approval",
      "Stock Management - Reject",
      "Report - View",
      "Accountability - View",
      "Price Checker - View",
      "Activity Logs - View",
    ];

    const updatedCheckboxes = allCheckboxValues.map((value) => ({
      value,
      rolename: document.getElementsByName("rolename")[0].value,
      desc: document.getElementsByName("desc")[0].value,
      authorization: value,
    }));

    setSelectedCheckboxes(updatedCheckboxes);
  };

  const handleUnselectAll = () => {
    // Unselect all checkboxes
    setSelectedCheckboxes([]);
  };

  const MasterList = selectedCheckboxes.find(
    (item) => item.value === "Master List - View"
  );
  const MasterListDisable = !MasterList;
  const MasterListAdd =
    selectedCheckboxes.some((item) => item.value === "Master List - Add") &&
    !MasterListDisable;
  const MasterListEdit =
    selectedCheckboxes.some((item) => item.value === "Master List - Edit") &&
    !MasterListDisable;
  const MasterListDelete =
    selectedCheckboxes.some((item) => item.value === "Master List - Delete") &&
    !MasterListDisable;

  const Department = selectedCheckboxes.find(
    (item) => item.value === "Department - View"
  );
  const DepartmentDisable = !Department;
  const DepartmentAdd =
    selectedCheckboxes.some((item) => item.value === "Department - Add") &&
    !DepartmentDisable;
  const DepartmentEdit =
    selectedCheckboxes.some((item) => item.value === "Department - Edit") &&
    !DepartmentDisable;
  const DepartmentDelete =
    selectedCheckboxes.some((item) => item.value === "Department - Delete") &&
    !DepartmentDisable;

  const UserRole = selectedCheckboxes.some(
    (item) => item.value === "User Access Role - View"
  );
  const UserRoleDisable = !UserRole;
  const UserRoleAdd =
    selectedCheckboxes.some(
      (item) => item.value === "User Access Role - Add"
    ) && !UserRoleDisable;
  const UserRoleEdit =
    selectedCheckboxes.some(
      (item) => item.value === "User Access Role - Edit"
    ) && !UserRoleDisable;
  const UserRoleDelete =
    selectedCheckboxes.some(
      (item) => item.value === "User Access Role - Delete"
    ) && !UserRoleDisable;

  const ProductList = selectedCheckboxes.some(
    (item) => item.value === "Product List - View"
  );
  const ProductListDisable = !ProductList;
  const ProductListAdd =
    selectedCheckboxes.some((item) => item.value === "Product List - Add") &&
    !ProductListDisable;
  const ProductListEdit =
    selectedCheckboxes.some((item) => item.value === "Product List - Edit") &&
    !ProductListDisable;
  const ProductListDelete =
    selectedCheckboxes.some((item) => item.value === "Product List - Delete") &&
    !ProductListDisable;

  // const Assembly = selectedCheckboxes.some((item) => item.value === "Assembly - View");
  // const AssemblyDisable = !Assembly;
  // const AssemblyAdd = selectedCheckboxes.some((item) => item.value === "Assembly - Add") && !AssemblyDisable;
  // const AssemblyEdit = selectedCheckboxes.some((item) => item.value === "Assembly - Edit") && !AssemblyDisable;
  // const AssemblyDelete = selectedCheckboxes.some((item) => item.value === "Assembly - Delete") && !AssemblyDisable;

  // const SpareParts = selectedCheckboxes.some((item) => item.value === "Spare Part - View");
  // const SparePartsDisable = !SpareParts;
  // const SparePartsAdd = selectedCheckboxes.some((item) => item.value === "Spare Part - Add") && !SparePartsDisable;
  // const SparePartsEdit = selectedCheckboxes.some((item) => item.value === "Spare Part - Edit") && !SparePartsDisable;
  // const SparePartsDelete = selectedCheckboxes.some((item) => item.value === "Spare Part - Delete") && !SparePartsDisable;

  // const SubParts = selectedCheckboxes.some((item) => item.value === "Sub-Part - View");
  // const SubPartsDisable = !SubParts;
  // const SubPartsAdd = selectedCheckboxes.some((item) => item.value === "Sub-Part - Add") && !SubPartsDisable;
  // const SubPartsEdit = selectedCheckboxes.some((item) => item.value === "Sub-Part - Edit") && !SubPartsDisable;
  // const SubPartsDelete = selectedCheckboxes.some((item) => item.value === "Sub-Part - Delete") && !SubPartsDisable;

  const ProductCategories = selectedCheckboxes.some(
    (item) => item.value === "Product Categories - View"
  );
  const ProductCategoriesDisable = !ProductCategories;
  const ProductCategoriesAdd =
    selectedCheckboxes.some(
      (item) => item.value === "Product Categories - Add"
    ) && !ProductCategoriesDisable;
  const ProductCategoriesEdit =
    selectedCheckboxes.some(
      (item) => item.value === "Product Categories - Edit"
    ) && !ProductCategoriesDisable;
  const ProductCategoriesDelete =
    selectedCheckboxes.some(
      (item) => item.value === "Product Categories - Delete"
    ) && !ProductCategoriesDisable;

  const ProductManufacturer = selectedCheckboxes.some(
    (item) => item.value === "Product Manufacturer - View"
  );
  const ProductManufacturerDisable = !ProductManufacturer;
  const ProductManufacturerAdd =
    selectedCheckboxes.some(
      (item) => item.value === "Product Manufacturer - Add"
    ) && !ProductManufacturerDisable;
  const ProductManufacturerEdit =
    selectedCheckboxes.some(
      (item) => item.value === "Product Manufacturer - Edit"
    ) && !ProductManufacturerDisable;
  const ProductManufacturerDelete =
    selectedCheckboxes.some(
      (item) => item.value === "Product Manufacturer - Delete"
    ) && !ProductManufacturerDisable;

  const BinLocation = selectedCheckboxes.some(
    (item) => item.value === "Bin Location - View"
  );
  const BinLocationDisable = !BinLocation;
  const BinLocationAdd =
    selectedCheckboxes.some((item) => item.value === "Bin Location - Add") &&
    !BinLocationDisable;
  const BinLocationEdit =
    selectedCheckboxes.some((item) => item.value === "Bin Location - Edit") &&
    !BinLocationDisable;
  const BinLocationDelete =
    selectedCheckboxes.some((item) => item.value === "Bin Location - Delete") &&
    !BinLocationDisable;

  const CostCentre = selectedCheckboxes.some(
    (item) => item.value === "Cost Centre - View"
  );
  const CostCentreDisable = !CostCentre;
  const CostCentreAdd =
    selectedCheckboxes.some((item) => item.value === "Cost Centre - Add") &&
    !CostCentreDisable;
  const CostCentreEdit =
    selectedCheckboxes.some((item) => item.value === "Cost Centre - Edit") &&
    !CostCentreDisable;
  const CostCentreDelete =
    selectedCheckboxes.some((item) => item.value === "Cost Centre - Delete") &&
    !CostCentreDisable;

  const Supplier = selectedCheckboxes.some(
    (item) => item.value === "Supplier - View"
  );
  const SupplierDisable = !Supplier;
  const SupplierAdd =
    selectedCheckboxes.some((item) => item.value === "Supplier - Add") &&
    !SupplierDisable;
  const SupplierEdit =
    selectedCheckboxes.some((item) => item.value === "Supplier - Edit") &&
    !SupplierDisable;
  const SupplierDelete =
    selectedCheckboxes.some((item) => item.value === "Supplier - Delete") &&
    !SupplierDisable;

  const Warehouses = selectedCheckboxes.some(
    (item) => item.value === "Warehouses - View"
  );
  const WarehousesDisable = !Warehouses;
  const WarehousesAdd =
    selectedCheckboxes.some((item) => item.value === "Warehouses - Add") &&
    !WarehousesDisable;
  const WarehousesEdit =
    selectedCheckboxes.some((item) => item.value === "Warehouses - Edit") &&
    !WarehousesDisable;
  const WarehousesDelete =
    selectedCheckboxes.some((item) => item.value === "Warehouses - Delete") &&
    !WarehousesDisable;

  const Inventory = selectedCheckboxes.some(
    (item) => item.value === "Inventory - View"
  );
  const InventoryDisable = !Inventory;
  const InventoryAdd =
    selectedCheckboxes.some((item) => item.value === "Inventory - Add") &&
    !InventoryDisable;
  const InventoryEdit =
    selectedCheckboxes.some((item) => item.value === "Inventory - Edit") &&
    !InventoryDisable;
  const InventoryApproval =
    selectedCheckboxes.some((item) => item.value === "Inventory - Approval") &&
    !InventoryDisable;
  const InventoryReject =
    selectedCheckboxes.some((item) => item.value === "Inventory - Reject") &&
    !InventoryDisable;

  const PurchaseRequest = selectedCheckboxes.some(
    (item) => item.value === "PR - View"
  );
  const PurchaseRequestDisable = !PurchaseRequest;
  const PurchaseRequestAdd =
    selectedCheckboxes.some((item) => item.value === "PR - Add") &&
    !PurchaseRequestDisable;
  const PurchaseRequestEdit =
    selectedCheckboxes.some((item) => item.value === "PR - Edit") &&
    !PurchaseRequestDisable;
  const PurchaseRequestApproval =
    selectedCheckboxes.some((item) => item.value === "PR - Approval") &&
    !PurchaseRequestDisable;
  const PurchaseRequestReject =
    selectedCheckboxes.some((item) => item.value === "PR - Reject") &&
    !PurchaseRequestDisable;

  const PurchaseOrder = selectedCheckboxes.some(
    (item) => item.value === "PO - View"
  );
  const PurchaseOrderDisable = !PurchaseOrder;
  const PurchaseOrderApproval =
    selectedCheckboxes.some((item) => item.value === "PO - Approval") &&
    !PurchaseOrderDisable;
  const PurchaseOrderReject =
    selectedCheckboxes.some((item) => item.value === "PO - Reject") &&
    !PurchaseOrderDisable;

  const Receiving = selectedCheckboxes.some(
    (item) => item.value === "Receiving - View"
  );
  const ReceivingDisable = !Receiving;
  const ReceivingApproval =
    selectedCheckboxes.some((item) => item.value === "Receiving - Approval") &&
    !ReceivingDisable;
  const ReceivingReject =
    selectedCheckboxes.some((item) => item.value === "Receiving - Reject") &&
    !ReceivingDisable;

  const StockTransfer = selectedCheckboxes.some(
    (item) => item.value === "Stock Management - View"
  );
  const StockTransferDisable = !StockTransfer;
  const StockTransferAdd =
    selectedCheckboxes.some(
      (item) => item.value === "Stock Management - Add"
    ) && !StockTransferDisable;
  const StockTransferApproval =
    selectedCheckboxes.some(
      (item) => item.value === "Stock Management - Approval"
    ) && !StockTransferDisable;
  const StockTransferReject =
    selectedCheckboxes.some(
      (item) => item.value === "Stock Management - Reject"
    ) && !StockTransferDisable;

  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
        <div className="right-body-contentss">
          <div className="Employeetext-button">
            <div className="employee-and-button">
              <div className="emp-text-side">
                <p>Role Profile</p>
              </div>

              <div className="button-create-side"></div>
            </div>
          </div>
          <div className="table-containss">
            <div className="main-of-all-tables">
              <form className="w-100 mt-3" onSubmit={handleSubmit}>
                <Form
                  // style={{ marginLeft: "50px" }}
                  className="form-createRole"
                >
                  <div className="row">
                    <div className="col-6">
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label style={{ fontSize: "20px" }}>
                          Name:{" "}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Role Name"
                          style={{
                            height: "40px",
                            fontSize: "15px",
                            width: "500px",
                          }}
                          name="rolename"
                          required
                          maxLength={50}
                          onInput={handleRoleNameInput}
                        />
                      </Form.Group>
                      <div className="invalid-feedback">
                        Role Name Must not have Number and Special Characters
                      </div>
                    </div>
                    <div className="col-6">
                      <Form.Group controlId="exampleForm.ControlInput2">
                        <Form.Label style={{ fontSize: "20px" }}>
                          Description:{" "}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Description ..."
                          style={{
                            height: "40px",
                            fontSize: "15px",
                            width: "500px",
                          }}
                          maxLength={200}
                          className="form-control"
                          name="desc"
                        />
                      </Form.Group>
                    </div>
                  </div>
                </Form>

                <div
                  className="d-flex form-createRole-selectAll"
                  // style={{ marginLeft: "50px" }}
                >
                  <Button
                    variant="warning"
                    style={{
                      width: "100px",
                      marginRight: "10px",
                      fontSize: "1.5rem",
                    }}
                    onClick={handleSelectAll}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="warning"
                    style={{ width: "100px", fontSize: "1.5rem" }}
                    onClick={handleUnselectAll}
                  >
                    Unselect All
                  </Button>
                </div>

                <div
                  className="w-100 mt-1 form-createRole"
                  // style={{ marginLeft: "50px" }}
                >
                  <table class="table">
                    <thead className="rbacthead">
                      <tr>
                        <th style={{ fontSize: 15 }}>Module</th>
                        <th style={{ fontSize: 15 }}>View</th>
                        <th style={{ fontSize: 15 }}>Add</th>
                        <th style={{ fontSize: 15 }}>Edit</th>
                        <th style={{ fontSize: 15 }}>Archive/Delete</th>
                        <th style={{ fontSize: 15 }}>Approval</th>
                        <th style={{ fontSize: 15 }}>Reject</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* --------------------------------------BREAK ------------------------------*/}
                      <td>
                        <h3 className="role-head">Dashboard</h3>
                      </td>
                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}
                          >
                            Dashboard
                          </td>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Dashboard - View"
                              name="vehicle1"
                              value="Dashboard - View"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Dashboard - View"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Dashboard - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Dashboard - View"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Dashboard - Add"
                              name="vehicle1"
                              value="Dashboard - Add"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Dashboard - Add"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Dashboard - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Dashboard - Add"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Dashboard - Edit"
                              name="vehicle1"
                              value="Dashboard - Edit"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Dashboard - Edit"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Dashboard - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Dashboard - Edit"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Dashboard - Delete"
                              name="vehicle1"
                              value="Dashboard - Delete"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Dashboard - Delete"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Dashboard - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Dashboard - Delete"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Dashboard - Approval"
                              name="vehicle1"
                              value="Dashboard - Approval"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Dashboard - Approval"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Dashboard - Approval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Dashboard - Approval"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Dashboard - Reject"
                              name="vehicle1"
                              value="Dashboard - Reject"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Dashboard - Reject"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Dashboard - Reject")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Dashboard - Reject"
                            ></label>
                          </div>
                        </td>
                      </tr>
                      {/* --------------------------------------BREAK ------------------------------*/}
                      <td>
                        <h3 className="role-head">Administrator</h3>
                      </td>
                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}
                          >
                            Master List
                          </td>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Master List - View"
                              name="vehicle1"
                              value="Master List - View"
                              checked={MasterList}
                              onChange={() =>
                                handleCheckboxChange("Master List - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Master List - View"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Master List - Add"
                              name="vehicle1"
                              value="Master List - Add"
                              disabled={MasterListDisable}
                              checked={MasterListAdd}
                              onChange={() =>
                                handleCheckboxChange("Master List - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Master List - Add"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Master List - Edit"
                              name="vehicle1"
                              value="Master List - Edit"
                              disabled={MasterListDisable}
                              checked={MasterListEdit}
                              onChange={() =>
                                handleCheckboxChange("Master List - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Master List - Edit"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Master List - Delete"
                              name="vehicle1"
                              value="Master List - Delete"
                              disabled={MasterListDisable}
                              checked={MasterListDelete}
                              onChange={() =>
                                handleCheckboxChange("Master List - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Master List - Delete"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Master List - Aprroval"
                              name="vehicle1"
                              value="Master List - Aprroval"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Master List - Aprroval"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Master List - Aprroval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Master List - Aprroval"
                            ></label>
                          </div>
                        </td>
                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Master List - Reject"
                              name="vehicle1"
                              value="Master List - Reject"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Master List - Reject"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Master List - Reject")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Master List - Reject"
                            ></label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}
                          >
                            User Access Role
                          </td>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="User Access Role - View"
                              name="vehicle1"
                              value="User Access Role - View"
                              checked={UserRole}
                              onChange={() =>
                                handleCheckboxChange("User Access Role - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="User Access Role - View"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="User Access Role - Add"
                              name="vehicle1"
                              value="User Access Role - Add"
                              disabled={UserRoleDisable}
                              checked={UserRoleAdd}
                              onChange={() =>
                                handleCheckboxChange("User Access Role - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="User Access Role - Add"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={UserRoleDisable}
                              type="checkbox"
                              id="User Access Role - Edit"
                              name="vehicle1"
                              value="User Access Role - Edit"
                              checked={UserRoleEdit}
                              onChange={() =>
                                handleCheckboxChange("User Access Role - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="User Access Role - Edit"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={UserRoleDisable}
                              type="checkbox"
                              id="User Access Role - Delete"
                              name="vehicle1"
                              value="User Access Role - Delete"
                              checked={UserRoleDelete}
                              onChange={() =>
                                handleCheckboxChange(
                                  "User Access Role - Delete"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="User Access Role - Delete"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="User Access Role - Aprroval"
                              name="vehicle1"
                              value="User Access Role - Aprroval"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "User Access Role - Aprroval"
                              )}
                              onChange={() =>
                                handleCheckboxChange(
                                  "User Access Role - Aprroval"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="User Access Role - Aprroval"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="User Access Role - Reject"
                              name="vehicle1"
                              value="User Access Role - Reject"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "User Access Role - Reject"
                              )}
                              onChange={() =>
                                handleCheckboxChange(
                                  "User Access Role - Reject"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="User Access Role - Reject"
                            ></label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}
                          >
                            Department
                          </td>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Department - View"
                              name="vehicle1"
                              value="Department - View"
                              checked={Department}
                              onChange={() =>
                                handleCheckboxChange("Department - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Department - View"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Department - Add"
                              name="vehicle1"
                              value="Department - Add"
                              disabled={DepartmentDisable}
                              checked={DepartmentAdd}
                              onChange={() =>
                                handleCheckboxChange("Department - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Department - Add"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Department - Edit"
                              name="vehicle1"
                              value="Department - Edit"
                              disabled={DepartmentDisable}
                              checked={DepartmentEdit}
                              onChange={() =>
                                handleCheckboxChange("Department - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Department - Edit"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Department - Delete"
                              name="vehicle1"
                              value="Department - Delete"
                              disabled={DepartmentDisable}
                              checked={DepartmentDelete}
                              onChange={() =>
                                handleCheckboxChange("Department - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Department - Delete"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Department - Aprroval"
                              name="vehicle1"
                              value="Department - Aprroval"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Department - Aprroval"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Department - Aprroval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Department - Aprroval"
                            ></label>
                          </div>
                        </td>
                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Department - Reject"
                              name="vehicle1"
                              value="Department - Reject"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Department - Reject"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Department - Reject")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Department - Reject"
                            ></label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}
                          >
                            Product List
                          </td>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Product List - View"
                              name="vehicle1"
                              value="Product List - View"
                              checked={ProductList}
                              onChange={() =>
                                handleCheckboxChange("Product List - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product List - View"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={ProductListDisable}
                              type="checkbox"
                              id="Product List - Add"
                              name="vehicle1"
                              value="Product List - Add"
                              checked={ProductListAdd}
                              onChange={() =>
                                handleCheckboxChange("Product List - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product List - Add"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={ProductListDisable}
                              type="checkbox"
                              id="Product List - Edit"
                              name="vehicle1"
                              value="Product List - Edit"
                              checked={ProductListEdit}
                              onChange={() =>
                                handleCheckboxChange("Product List - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product List - Edit"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={ProductListDisable}
                              type="checkbox"
                              id="Product List - Delete"
                              name="vehicle1"
                              value="Product List - Delete"
                              checked={ProductListDelete}
                              onChange={() =>
                                handleCheckboxChange("Product List - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product List - Delete"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Product List - Aprroval"
                              name="vehicle1"
                              value="Product List - Aprroval"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Product List - Aprroval"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Product List - Aprroval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product List - Aprroval"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Product List - Reject"
                              name="vehicle1"
                              value="Product List - Delete"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Product List - Reject"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Product List - Reject")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product List - Reject"
                            ></label>
                          </div>
                        </td>
                      </tr>
                      {/* <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}>
                            Product Assembly
                          </td>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Assembly - View"
                              name="vehicle1"
                              value="Assembly - View"
                              checked={Assembly}
                              onChange={() =>
                                handleCheckboxChange("Assembly - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Assembly - View"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={AssemblyDisable}
                              type="checkbox"
                              id="Assembly - Add"
                              name="vehicle1"
                              value="Assembly - Add"
                              checked={AssemblyAdd}
                              onChange={() =>
                                handleCheckboxChange("Assembly - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Assembly - Add"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={AssemblyDisable}
                              type="checkbox"
                              id="Assembly - Edit"
                              name="vehicle1"
                              value="Assembly - Edit"
                              checked={AssemblyEdit}
                              onChange={() =>
                                handleCheckboxChange("Assembly - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Assembly - Edit"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={AssemblyDisable}
                              type="checkbox"
                              id="Assembly - Delete"
                              name="vehicle1"
                              value="Assembly - Delete"
                              checked={AssemblyDelete}
                              onChange={() =>
                                handleCheckboxChange("Assembly - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Assembly - Delete"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Assembly - Aprroval"
                              name="vehicle1"
                              value="Assembly - Aprroval"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Assembly - Aprroval"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Assembly - Aprroval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Assembly - Aprroval"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Assembly - Reject"
                              name="vehicle1"
                              value="Assembly - Reject"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Assembly - Reject"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Assembly - Reject")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Assembly - Reject"></label>
                          </div>
                        </td>


                      </tr> */}
                      {/* <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}>
                            Spare Parts
                          </td>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Spare Part - View"
                              name="vehicle1"
                              value="Spare Part - View"
                              checked={SpareParts}
                              onChange={() =>
                                handleCheckboxChange("Spare Part - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Spare Part - View"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={SparePartsDisable}
                              type="checkbox"
                              id="Spare Part - Add"
                              name="vehicle1"
                              value="Spare Part - Add"
                              checked={SparePartsAdd}
                              onChange={() =>
                                handleCheckboxChange("Spare Part - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Spare Part - Add"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={SparePartsDisable}
                              type="checkbox"
                              id="Spare Part - Edit"
                              name="vehicle1"
                              value="Spare Part - Edit"
                              checked={SparePartsEdit}
                              onChange={() =>
                                handleCheckboxChange("Spare Part - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Spare Part - Edit"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={SparePartsDisable}
                              type="checkbox"
                              id="Spare Part - Delete"
                              name="vehicle1"
                              value="Spare Part - Delete"
                              checked={SparePartsDelete}
                              onChange={() =>
                                handleCheckboxChange("Spare Part - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Spare Part - Delete"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Spare Part - Aprroval"
                              name="vehicle1"
                              value="Spare Part - Aprroval"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Spare Part - Aprroval"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Spare Part - Aprroval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Spare Part - Aprroval"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Spare Part - Reject"
                              name="vehicle1"
                              value="Spare Part - Reject"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Spare Part - DeleRejectte"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Spare Part - Reject")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Spare Part - Reject"></label>
                          </div>
                        </td>

                      </tr> */}
                      {/* <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}>
                            Sub Parts
                          </td>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Sub-Part - View"
                              name="vehicle1"
                              value="Sub-Part  - View"
                              checked={SubParts}
                              onChange={() =>
                                handleCheckboxChange("Sub-Part - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Sub-Part - View"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={SubPartsDisable}
                              type="checkbox"
                              id="Sub-Part - Add"
                              name="vehicle1"
                              value="Sub-Part - Add"
                              checked={SubPartsAdd}
                              onChange={() =>
                                handleCheckboxChange("Sub-Part - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Sub-Part - Add"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={SubPartsDisable}
                              type="checkbox"
                              id="Sub-Part - Edit"
                              name="vehicle1"
                              value="Sub-Part - Edit"
                              checked={SubPartsEdit}
                              onChange={() =>
                                handleCheckboxChange("Sub-Part - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Sub-Part - Edit"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={SubPartsDisable}
                              type="checkbox"
                              id="Sub-Part - Delete"
                              name="vehicle1"
                              value="Sub-Part  - Delete"
                              checked={SubPartsDelete}
                              onChange={() =>
                                handleCheckboxChange("Sub-Part - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Sub-Part - Delete"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Sub-Part - Aprroval"
                              name="vehicle1"
                              value="Sub-Part  - Aprroval"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Sub-Part - Aprroval"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Sub-Part - Aprroval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Sub-Part - Aprroval"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Sub-Part - Reject"
                              name="vehicle1"
                              value="Sub-Part  - Reject"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Sub-Part - Reject"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Sub-Part - Reject")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Sub-Part - Reject"></label>
                          </div>
                        </td>


                      </tr> */}
                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}
                          >
                            Product Categories
                          </td>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Product Categories - View"
                              name="vehicle1"
                              value="Product Categories - View"
                              checked={ProductCategories}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Product Categories - View"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product Categories - View"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={ProductCategoriesDisable}
                              type="checkbox"
                              id="Product Categories - Add"
                              name="vehicle1"
                              value="Product Categories - Add"
                              checked={ProductCategoriesAdd}
                              onChange={() =>
                                handleCheckboxChange("Product Categories - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product Categories - Add"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={ProductCategoriesDisable}
                              type="checkbox"
                              id="Product Categories - Edit"
                              name="vehicle1"
                              value="Product Categories - Edit"
                              checked={ProductCategoriesEdit}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Product Categories - Edit"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product Categories - Edit"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={ProductCategoriesDisable}
                              type="checkbox"
                              id="Product Categories - Delete"
                              name="vehicle1"
                              value="Product Categories - Delete"
                              checked={ProductCategoriesDelete}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Product Categories - Delete"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product Categories - Delete"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Product Categories - Aprroval"
                              name="vehicle1"
                              value="Product Categories - Aprroval"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Product Categories - Aprroval"
                              )}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Product Categories - Aprroval"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product Categories - Aprroval"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Product Categories - Reject"
                              name="vehicle1"
                              value="Product Categories - Reject"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Product Categories - Reject"
                              )}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Product Categories - Reject"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product Categories - Reject"
                            ></label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}
                          >
                            Product Manufacturer
                          </td>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Product Manufacturer - View"
                              name="vehicle1"
                              value="Product Manufacturer - View"
                              checked={ProductManufacturer}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Product Manufacturer - View"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product Manufacturer - View"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={ProductManufacturerDisable}
                              type="checkbox"
                              id="Product Manufacturer - Add"
                              name="vehicle1"
                              value="Product Manufacturer - Add"
                              checked={ProductManufacturerAdd}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Product Manufacturer - Add"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product Manufacturer - Add"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={ProductManufacturerDisable}
                              type="checkbox"
                              id="Product Manufacturer - Edit"
                              name="vehicle1"
                              value="Product Manufacturer - Edit"
                              checked={ProductManufacturerEdit}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Product Manufacturer - Edit"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product Manufacturer - Edit"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={ProductManufacturerDisable}
                              type="checkbox"
                              id="Product Manufacturer - Delete"
                              name="vehicle1"
                              value="Product Manufacturer - Delete"
                              checked={ProductManufacturerDelete}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Product Manufacturer - Delete"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product Manufacturer - Delete"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Product Manufacturer - Aprroval"
                              name="vehicle1"
                              value="Product Manufacturer - Aprroval"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value ===
                                  "Product Manufacturer - Aprroval"
                              )}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Product Manufacturer - Aprroval"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product Manufacturer - Aprroval"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Product Manufacturer - Reject"
                              name="vehicle1"
                              value="Product Manufacturer - Reject"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Product Manufacturer - Reject"
                              )}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Product Manufacturer - Reject"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product Manufacturer - Reject"
                            ></label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}
                          >
                            Bin Location
                          </td>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Bin Location - View"
                              name="vehicle1"
                              value="Bin Location - View"
                              checked={BinLocation}
                              onChange={() =>
                                handleCheckboxChange("Bin Location - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Bin Location - View"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={BinLocationDisable}
                              type="checkbox"
                              id="Bin Location - Add"
                              name="vehicle1"
                              value="Bin Location - Add"
                              checked={BinLocationAdd}
                              onChange={() =>
                                handleCheckboxChange("Bin Location - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Bin Location - Add"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={BinLocationDisable}
                              type="checkbox"
                              id="Bin Location - Edit"
                              name="vehicle1"
                              value="Bin Location - Edit"
                              checked={BinLocationEdit}
                              onChange={() =>
                                handleCheckboxChange("Bin Location - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Bin Location - Edit"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={BinLocationDisable}
                              type="checkbox"
                              id="Bin Location - Delete"
                              name="vehicle1"
                              value="Bin Location - Delete"
                              checked={BinLocationDelete}
                              onChange={() =>
                                handleCheckboxChange("Bin Location - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Bin Location - Delete"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Bin Location - Aprroval"
                              name="vehicle1"
                              value="Bin Location - Aprroval"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Bin Location - Aprroval"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Bin Location - Aprroval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Bin Location - Aprroval"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Bin Location - Reject"
                              name="vehicle1"
                              value="Bin Location - Reject"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Bin Location - Reject"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Bin Location - Reject")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Bin Location - Reject"
                            ></label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}
                          >
                            Cost Centre
                          </td>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Cost Centre - View"
                              name="vehicle1"
                              value="Cost Centre - View"
                              checked={CostCentre}
                              onChange={() =>
                                handleCheckboxChange("Cost Centre - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Cost Centre - View"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={CostCentreDisable}
                              type="checkbox"
                              id="Cost Centre - Add"
                              name="vehicle1"
                              value="Cost Centre - Add"
                              checked={CostCentreAdd}
                              onChange={() =>
                                handleCheckboxChange("Cost Centre - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Cost Centre - Add"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={CostCentreDisable}
                              type="checkbox"
                              id="Cost Centre - Edit"
                              name="vehicle1"
                              value="Cost Centre - Edit"
                              checked={CostCentreEdit}
                              onChange={() =>
                                handleCheckboxChange("Cost Centre - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Cost Centre - Edit"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={CostCentreDisable}
                              type="checkbox"
                              id="Cost Centre - Delete"
                              name="vehicle1"
                              value="Cost Centre - Delete"
                              checked={CostCentreDelete}
                              onChange={() =>
                                handleCheckboxChange("Cost Centre - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Cost Centre - Delete"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Cost Centre - Aprroval"
                              name="vehicle1"
                              value="Cost Centre - Aprroval"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Cost Centre - Aprroval"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Cost Centre - Aprroval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Cost Centre - Aprroval"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Cost Centre - Reject"
                              name="vehicle1"
                              value="Cost Centre - Reject"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Cost Centre - Reject"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Cost Centre - Reject")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Cost Centre - Reject"
                            ></label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}
                          >
                            Supplier
                          </td>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Supplier - View"
                              name="vehicle1"
                              value="Supplier - View"
                              checked={Supplier}
                              onChange={() =>
                                handleCheckboxChange("Supplier - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Supplier - View"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={SupplierDisable}
                              type="checkbox"
                              id="Supplier - Add"
                              name="vehicle1"
                              value="Supplier - Add"
                              checked={SupplierAdd}
                              onChange={() =>
                                handleCheckboxChange("Supplier - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Supplier - Add"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={SupplierDisable}
                              type="checkbox"
                              id="Supplier - Edit"
                              name="vehicle1"
                              value="Supplier - Edit"
                              checked={SupplierEdit}
                              onChange={() =>
                                handleCheckboxChange("Supplier - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Supplier - Edit"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={SupplierDisable}
                              type="checkbox"
                              id="Supplier - Delete"
                              name="vehicle1"
                              value="Supplier - Delete"
                              checked={SupplierDelete}
                              onChange={() =>
                                handleCheckboxChange("Supplier - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Supplier - Delete"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Supplier - Aprroval"
                              name="vehicle1"
                              value="Supplier - Aprroval"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Supplier - Aprroval"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Supplier - Aprroval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Supplier - Aprroval"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Supplier - Reject"
                              name="vehicle1"
                              value="Supplier - Reject"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Supplier - Reject"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Supplier - Reject")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Supplier - Reject"
                            ></label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}
                          >
                            Warehouse
                          </td>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Warehouses - View"
                              name="vehicle1"
                              value="Warehouses - View"
                              checked={Warehouses}
                              onChange={() =>
                                handleCheckboxChange("Warehouses - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Warehouses - View"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={WarehousesDisable}
                              type="checkbox"
                              id="Warehouses - Add"
                              name="vehicle1"
                              value="Warehouses - Add"
                              checked={WarehousesAdd}
                              onChange={() =>
                                handleCheckboxChange("Warehouses - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Warehouses - Add"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={WarehousesDisable}
                              type="checkbox"
                              id="Warehouses - Edit"
                              name="vehicle1"
                              value="Warehouses - Edit"
                              checked={WarehousesEdit}
                              onChange={() =>
                                handleCheckboxChange("Warehouses - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Warehouses - Edit"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={WarehousesDisable}
                              type="checkbox"
                              id="Warehouses - Delete"
                              name="vehicle1"
                              value="Warehouses - Delete"
                              checked={WarehousesDelete}
                              onChange={() =>
                                handleCheckboxChange("Warehouses - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Warehouses - Delete"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Warehouses - Aprroval"
                              name="vehicle1"
                              value="Warehouses - Aprroval"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Warehouses - Aprroval"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Warehouses - Aprroval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Warehouses - Aprroval"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Warehouses - Reject"
                              name="vehicle1"
                              value="Warehouses - Reject"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Warehouses - Reject"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Warehouses - Reject")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Warehouses - Reject"
                            ></label>
                          </div>
                        </td>
                      </tr>{" "}
                      {/*Warehouses*/}
                      <td>
                        <h3 className="role-head">Inventory</h3>
                      </td>
                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}
                          >
                            Inventory Access
                          </td>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Inventory - View"
                              name="vehicle1"
                              value="Inventory - View"
                              checked={Inventory}
                              onChange={() =>
                                handleCheckboxChange("Inventory - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Inventory - View"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={InventoryDisable}
                              type="checkbox"
                              id="Inventory - Add"
                              name="vehicle1"
                              value="Inventory - Add"
                              checked={InventoryAdd}
                              onChange={() =>
                                handleCheckboxChange("Inventory - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Inventory - Add"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={InventoryDisable}
                              type="checkbox"
                              id="Inventory - Edit"
                              name="vehicle1"
                              value="Inventory - Edit"
                              checked={InventoryEdit}
                              onChange={() =>
                                handleCheckboxChange("Inventory - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Inventory - Edit"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Inventory - Delete"
                              name="vehicle1"
                              value="Inventory - Delete"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Inventory - Delete"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Inventory - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Inventory - Delete"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={InventoryDisable}
                              type="checkbox"
                              id="Inventory - Approval"
                              name="vehicle1"
                              value="Inventory - Approval"
                              checked={InventoryApproval}
                              onChange={() =>
                                handleCheckboxChange("Inventory - Approval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Inventory - Approval"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={InventoryDisable}
                              type="checkbox"
                              id="Inventory - Reject"
                              name="vehicle1"
                              value="Inventory - Reject"
                              checked={InventoryReject}
                              onChange={() =>
                                handleCheckboxChange("Inventory - Reject")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Inventory - Reject"
                            ></label>
                          </div>
                        </td>
                      </tr>
                      <td>
                        <h3 className="role-head">Purchase Order Interface</h3>
                      </td>
                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}
                          >
                            Purchase Request
                          </td>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="PR - View"
                              name="vehicle1"
                              value="PR - View"
                              checked={PurchaseRequest}
                              onChange={() => handleCheckboxChange("PR - View")}
                            />
                            <label className="p-3" htmlFor="PR - View"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={PurchaseRequestDisable}
                              type="checkbox"
                              id="PR - Add"
                              name="vehicle1"
                              value="PR - Add"
                              checked={PurchaseRequestAdd}
                              onChange={() => handleCheckboxChange("PR - Add")}
                            />
                            <label className="p-3" htmlFor="PR - Add"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={PurchaseRequestDisable}
                              type="checkbox"
                              id="PR - Edit"
                              name="vehicle1"
                              value="PR - Edit"
                              checked={PurchaseRequestEdit}
                              onChange={() => handleCheckboxChange("PR - Edit")}
                            />
                            <label className="p-3" htmlFor="PR - Edit"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="PR - Delete"
                              name="vehicle1"
                              value="PR - Delete"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "PR - Delete"
                              )}
                              onChange={() =>
                                handleCheckboxChange("PR - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="PR - Delete"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={PurchaseRequestDisable}
                              type="checkbox"
                              id="PR - Approval"
                              name="vehicle1"
                              value="PR - Approval"
                              checked={PurchaseRequestApproval}
                              onChange={() =>
                                handleCheckboxChange("PR - Approval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="PR - Approval"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={PurchaseRequestDisable}
                              type="checkbox"
                              id="PR - Reject"
                              name="vehicle1"
                              value="PR - Reject"
                              checked={PurchaseRequestReject}
                              onChange={() =>
                                handleCheckboxChange("PR - Reject")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="PR - Reject"
                            ></label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}
                          >
                            Purchase Order
                          </td>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="PO - View"
                              name="vehicle1"
                              value="PO - View"
                              checked={PurchaseOrder}
                              onChange={() => handleCheckboxChange("PO - View")}
                            />
                            <label className="p-3" htmlFor="PO - View"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="PO - Add"
                              name="vehicle1"
                              value="PO - Add"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "PO - Add"
                              )}
                              onChange={() => handleCheckboxChange("PO - Add")}
                            />
                            <label className="p-3" htmlFor="PO - Add"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="PO - Edit"
                              name="vehicle1"
                              value="PO - Edit"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "PO - Edit"
                              )}
                              onChange={() => handleCheckboxChange("PO - Edit")}
                            />
                            <label className="p-3" htmlFor="PO - Edit"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="PO - Delete"
                              name="vehicle1"
                              value="PO - Delete"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "PO - Delete"
                              )}
                              onChange={() =>
                                handleCheckboxChange("PO - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="PO - Delete"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={PurchaseOrderDisable}
                              type="checkbox"
                              id="PO - Approval"
                              name="vehicle1"
                              value="PO - Approval"
                              checked={PurchaseOrderApproval}
                              onChange={() =>
                                handleCheckboxChange("PO - Approval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="PO - Approval"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={PurchaseOrderDisable}
                              type="checkbox"
                              id="PO - Reject"
                              name="vehicle1"
                              value="PO - Reject"
                              checked={PurchaseOrderReject}
                              onChange={() =>
                                handleCheckboxChange("PO - Reject")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="PO - Reject"
                            ></label>
                          </div>
                        </td>
                      </tr>
                      <td>
                        <h3 className="role-head">Warehouse</h3>
                      </td>
                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}
                          >
                            Receiving
                          </td>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Receiving - View"
                              name="vehicle1"
                              value="Receiving - View"
                              checked={Receiving}
                              onChange={() =>
                                handleCheckboxChange("Receiving - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Receiving - View"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Receiving - Add"
                              name="vehicle1"
                              value="Receiving - Add"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Receiving - Add"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Receiving - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Receiving - Add"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Receiving - Edit"
                              name="vehicle1"
                              value="Receiving - Edit"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Receiving - Edit"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Receiving - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Receiving - Edit"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Receiving - Delete"
                              name="vehicle1"
                              value="Receiving - Delete"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Receiving - Delete"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Receiving - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Receiving - Delete"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={ReceivingDisable}
                              type="checkbox"
                              id="Receiving - Approval"
                              name="vehicle1"
                              value="Receiving - Approval"
                              checked={ReceivingApproval}
                              onChange={() =>
                                handleCheckboxChange("Receiving - Approval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Receiving - Approval"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={ReceivingDisable}
                              type="checkbox"
                              id="Receiving - Reject"
                              name="vehicle1"
                              value="Receiving - Reject"
                              checked={ReceivingReject}
                              onChange={() =>
                                handleCheckboxChange("Receiving - Reject")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Receiving - Reject"
                            ></label>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}
                          >
                            Stock Transfer
                          </td>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Stock Management - View"
                              name="vehicle1"
                              value="Stock Management - View"
                              checked={StockTransfer}
                              onChange={() =>
                                handleCheckboxChange("Stock Management - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Stock Management - View"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={StockTransferDisable}
                              type="checkbox"
                              id="Stock Management - Add"
                              name="vehicle1"
                              value="Stock Management - Add"
                              checked={StockTransferAdd}
                              onChange={() =>
                                handleCheckboxChange("Stock Management - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Stock Management - Add"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Stock Management - Edit"
                              name="vehicle1"
                              value="Stock Management - Edit"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Stock Management - Edit"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Stock Management - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Stock Management - Edit"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Stock Management - Delete"
                              name="vehicle1"
                              value="Stock Management - Delete"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Stock Management - Delete"
                              )}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Stock Management - Delete"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Stock Management - Delete"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={StockTransferDisable}
                              type="checkbox"
                              id="Stock Management - Approval"
                              name="vehicle1"
                              value="Stock Management - Approval"
                              checked={StockTransferApproval}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Stock Management - Approval"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Stock Management - Aprroval"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled={StockTransferDisable}
                              type="checkbox"
                              id="Stock Management - Reject"
                              name="vehicle1"
                              value="Stock Management - Reject"
                              checked={StockTransferReject}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Stock Management - Reject"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Stock Management - Reject"
                            ></label>
                          </div>
                        </td>
                      </tr>
                      <td>
                        <h3 className="role-head">Report</h3>
                      </td>
                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}
                          >
                            Generate Report
                          </td>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Report - View"
                              name="vehicle1"
                              value="Report - View"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Report - View"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Report - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Report - View"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Report - Add"
                              name="vehicle1"
                              value="Report - Add"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Report - Add"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Report - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Report - Add"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Report - Edit"
                              name="vehicle1"
                              value="Report - Edit"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Report - Edit"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Report - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Report - Edit"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Report - Delete"
                              name="vehicle1"
                              value="Report - Delete"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Report - Delete"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Report - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Report - Delete"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Report - Approval"
                              name="vehicle1"
                              value="Report - Approval"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Report - Approval"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Report - Approval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Report - Approval"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Report - Reject"
                              name="vehicle1"
                              value="Report - Reject"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Report - Reject"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Report - Reject")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Report - Reject"
                            ></label>
                          </div>
                        </td>
                      </tr>

                      <td>
                        <h3 className="role-head">Accountability Module</h3>
                      </td>
                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}
                          >
                            Accountability
                          </td>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Accountability - View"
                              name="vehicle1"
                              value="Accountability - View"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Accountability - View"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Accountability - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Accountability - View"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Accountability - Add"
                              name="vehicle1"
                              value="Accountability - Add"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Accountability - Add"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Accountability - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Accountability - Add"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Accountability - Edit"
                              name="vehicle1"
                              value="Accountability - Edit"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Accountability - Edit"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Accountability - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Accountability - Edit"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Accountability - Delete"
                              name="vehicle1"
                              value="Accountability - Delete"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Accountability - Delete"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Accountability - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Accountability - Delete"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Accountability - Approval"
                              name="vehicle1"
                              value="Accountability - Approval"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Accountability - Approval"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Accountability - Approval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Accountability - Approval"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Accountability - Reject"
                              name="vehicle1"
                              value="Accountability - Reject"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Accountability - Reject"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Accountability - Reject")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Accountability - Reject"
                            ></label>
                          </div>
                        </td>
                      </tr>

                      <td>
                        <h3 className="role-head">Price Checker Module</h3>
                      </td>
                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}
                          >
                            Price Checker
                          </td>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Price Checker - View"
                              name="vehicle1"
                              value="Price Checker - View"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Price Checker - View"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Price Checker - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Price Checker - View"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Price Checker - Add"
                              name="vehicle1"
                              value="Price Checker - Add"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Price Checker - Add"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Price Checker - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Price Checker - Add"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Price Checker - Edit"
                              name="vehicle1"
                              value="Price Checker - Edit"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Price Checker - Edit"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Price Checker - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Price Checker - Edit"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Price Checker - Delete"
                              name="vehicle1"
                              value="Price Checker - Delete"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Price Checker - Delete"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Price Checker - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Price Checker - Delete"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Price Checker - Approval"
                              name="vehicle1"
                              value="Price Checker - Approval"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Price Checker - Approval"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Price Checker - Approval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Price Checker - Approval"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Price Checker - Reject"
                              name="vehicle1"
                              value="Price Checker - Reject"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Price Checker - Reject"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Price Checker - Reject")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Price Checker - Reject"
                            ></label>
                          </div>
                        </td>
                      </tr>


                      <td>
                        <h3 className="role-head">Activity Module</h3>
                      </td>
                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}
                          >
                            Activity Log
                          </td>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Activity Logs - View"
                              name="vehicle1"
                              value="Activity Logs - View"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Activity Logs - View"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Activity Logs - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Activity Logs - View"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Activity Logs - Add"
                              name="vehicle1"
                              value="Activity Logs - Add"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Activity Logs - Add"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Activity Logs - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Activity Logs - Add"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Activity Logs - Edit"
                              name="vehicle1"
                              value="Activity Logs - Edit"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Activity Logs - Edit"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Activity Logs - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Activity Logs - Edit"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Activity Logs - Delete"
                              name="vehicle1"
                              value="Activity Logs - Delete"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Activity Logs - Delete"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Activity Logs - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Activity Logs - Delete"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Activity Logs - Approval"
                              name="vehicle1"
                              value="Activity Logs - Approval"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Activity Logs - Approval"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Activity Logs - Approval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Activity Logs - Approval"
                            ></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              disabled
                              type="checkbox"
                              id="Activity Logs - Reject"
                              name="vehicle1"
                              value="Activity Logs - Reject"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Activity Logs - Reject"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Activity Logs - Reject")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Activity Logs - Reject"
                            ></label>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="d-flex flex-row mt-4 createRole-btn-container">
                    <Row>
                      <Col>
                        <div>
                          <Link
                            style={{ fontSize: "1.5rem" }}
                            to="/userRole"
                            className=" btn_saveCancel btn btn-danger align-right"
                          >
                            Back
                          </Link>
                        </div>
                      </Col>
                      <Col>
                        <div>
                          <Button
                            style={{ fontSize: "1.5rem" }}
                            type="submit"
                            className="btn_saveCancel"
                            variant="warning"
                            disabled={selectedCheckboxes.length === 0}
                          >
                            Save
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Create_role;
