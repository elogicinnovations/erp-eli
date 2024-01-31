import React, { useState } from "react";
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

function Create_role() {
  const navigate = useNavigate();
  // Inserting to database checkboxes
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

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
    } else if (desc === "") {
      swal({
        title: "Required Field",
        text: "Description is required",
        icon: "error",
        button: "OK",
      });
    } else {
      try {
        const response = await fetch(
          BASE_URL + `/userRole/createUserrole/${rolename}`,
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
            title: "User Role Add Successful!",
            text: "The User Role has been Added Successfully.",
            icon: "success",
            button: "OK",
          }).then(() => {
            navigate("/userRole");
          });
        } else if (response.status === 202) {
          swal({
            title: "User Role is Already Exist",
            text: "Please Input a New User Role",
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

  // Select Unselect Checkbox

  const handleCheckboxChange = (value) => {
    const rolename = document.getElementsByName("rolename")[0].value;
    const desc = document.getElementsByName("desc")[0].value;
    const authorization = value; // Value from the checkbox

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
  };

  const handleSelectAll = () => {
    // Select all checkboxes
    const allCheckboxValues = [
      "Analytic Dashboard - Add",
      "Analytic Dashboard - Edit",
      "Analytic Dashboard - Delete",
      "Analytic Dashboard - View",
      "Master List - Add",
      "Master List - Edit",
      "Master List - Delete",
      "Master List - View",
      "User Access Role - Add",
      "User Access Role - Edit",
      "User Access Role - Delete",
      "User Access Role - View",
      "Product List - Add",
      "Product List - Edit",
      "Product List - Delete",
      "Product List - View",
      "Assembly - Add",
      "Assembly - Edit",
      "Assembly - Delete",
      "Assembly - View",
      "Spare Part - Add",
      "Spare Part - Edit",
      "Spare Part - Delete",
      "Spare Part - View",
      "Sub-Part - Add",
      "Sub-Part - Edit",
      "Sub-Part - Delete",
      "Sub-Part - View",
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
      "Report - View"
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

  return (
    <div className="main-of-containers">
      <div className="right-of-main-containers">
        <div className="right-body-contentss">
          {/* <div className="settings-search-master">

                  <div className="dropdown-and-iconics">
                      <div className="dropdown-side">
                          <div className="dropdownsss">
                              <select name="" id="">
                                <option value="All">All</option>
                              </select>
                          </div>
                          <div className="searcher-side">
                              <div style={{ position: "relative" }}>
                                <input
                                  type="search"
                                  placeholder="Search"
                                  className="searchInput"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                ></input>
                                <MagnifyingGlass
                                  size={23}
                                  style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "0.9rem",
                                    transform: "translateY(-50%)",
                                    pointerEvents: "none",
                                  }}
                                />
                              </div>
                          </div>

                          <div className="search-buttons">
                            <button>Search</button>
                          </div>
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
                      </div>
                  </div>

                </div> */}

          <div className="Employeetext-button">
            <div className="employee-and-button">
              <div className="emp-text-side">
                <p>Role Profile</p>
              </div>

              <div className="button-create-side">
                <div className="Buttonmodal-new"></div>
              </div>
            </div>
          </div>
          <div className="table-containss">
            <div className="main-of-all-tables">
              <form className="w-100 mt-3" onSubmit={handleSubmit}>
                <Form style={{ marginLeft: "50px" }}>
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
                          required
                        />
                      </Form.Group>
                    </div>
                  </div>
                </Form>

                <div className="d-flex" style={{ marginLeft: "50px" }}>
                  <Button
                    variant="warning"
                    style={{
                      width: "100px",
                      marginRight: "10px",
                      fontSize: "1.5rem",
                    }}
                    onClick={handleSelectAll}>
                    Select All
                  </Button>
                  <Button
                    variant="warning"
                    style={{ width: "100px", fontSize: "1.5rem" }}
                    onClick={handleUnselectAll}>
                    Unselect All
                  </Button>
                </div>

                <div className="w-100 mt-1" style={{ marginLeft: "50px" }}>
                  <table class="table">
                    <thead>
                      <tr>
                        <th style={{ fontSize: 15 }}>Module</th>
                        <th style={{ fontSize: 15 }}>View</th>
                        <th style={{ fontSize: 15 }}>Add</th>
                        <th style={{ fontSize: 15 }}>Edit</th>
                        <th style={{ fontSize: 15 }}>Archive</th>
                        <th style={{ fontSize: 15 }}>Approval</th>
                        <th style={{ fontSize: 15 }}>Rejustify / Reject</th>
                      </tr>
                    </thead>
                    <tbody>


                      {/* --------------------------------------BREAK ------------------------------*/}

                      <td>
                        <h3 className="role-head">Administrator</h3>
                      </td>
                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}>
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
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Master List - View"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Master List - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Master List - View"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Master List - Add"
                              name="vehicle1"
                              value="Master List - Add"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Master List - Add"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Master List - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Master List - Add"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Master List - Edit"
                              name="vehicle1"
                              value="Master List - Edit"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Master List - Edit"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Master List - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Master List - Edit"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Master List - Delete"
                              name="vehicle1"
                              value="Master List - Delete"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Master List - Delete"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Master List - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Master List - Delete"></label>
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
                                (item) => item.value === "Master List - Aprroval"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Master List - Aprroval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Master List - Aprroval"></label>
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
                              htmlFor="Master List - Reject"></label>
                          </div>
                        </td>


                      </tr>

                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}>
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
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "User Access Role - View"
                              )}
                              onChange={() =>
                                handleCheckboxChange("User Access Role - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="User Access Role - View"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="User Access Role - Add"
                              name="vehicle1"
                              value="User Access Role - Add"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "User Access Role - Add"
                              )}
                              onChange={() =>
                                handleCheckboxChange("User Access Role - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="User Access Role - Add"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input

                              type="checkbox"
                              id="User Access Role - Edit"
                              name="vehicle1"
                              value="User Access Role - Edit"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "User Access Role - Edit"
                              )}
                              onChange={() =>
                                handleCheckboxChange("User Access Role - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="User Access Role - Edit"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input

                              type="checkbox"
                              id="User Access Role - Delete"
                              name="vehicle1"
                              value="User Access Role - Delete"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "User Access Role - Delete"
                              )}
                              onChange={() =>
                                handleCheckboxChange(
                                  "User Access Role - Delete"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="User Access Role - Delete"></label>
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
                              htmlFor="User Access Role - Aprroval"></label>
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
                              htmlFor="User Access Role - Reject"></label>
                          </div>
                        </td>


                      </tr>

                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}>
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
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Product List - View"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Product List - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product List - View"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Product List - Add"
                              name="vehicle1"
                              value="Product List - Add"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Product List - Add"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Product List - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product List - Add"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Product List - Edit"
                              name="vehicle1"
                              value="Product List - Edit"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Product List - Edit"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Product List - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product List - Edit"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Product List - Delete"
                              name="vehicle1"
                              value="Product List - Delete"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Product List - Delete"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Product List - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product List - Delete"></label>
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
                                (item) => item.value === "Product List - Aprroval"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Product List - Aprroval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product List - Aprroval"></label>
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
                              htmlFor="Product List - Reject"></label>
                          </div>
                        </td>


                      </tr>

                      <tr>
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
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Assembly - View"
                              )}
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
                              type="checkbox"
                              id="Assembly - Add"
                              name="vehicle1"
                              value="Assembly - Add"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Assembly - Add"
                              )}
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
                              type="checkbox"
                              id="Assembly - Edit"
                              name="vehicle1"
                              value="Assembly - Edit"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Assembly - Edit"
                              )}
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
                              type="checkbox"
                              id="Assembly - Delete"
                              name="vehicle1"
                              value="Assembly - Delete"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Assembly - Delete"
                              )}
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


                      </tr>

                      <tr>
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
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Spare Part - View"
                              )}
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
                              type="checkbox"
                              id="Spare Part - Add"
                              name="vehicle1"
                              value="Spare Part - Add"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Spare Part - Add"
                              )}
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
                              type="checkbox"
                              id="Spare Part - Edit"
                              name="vehicle1"
                              value="Spare Part - Edit"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Spare Part - Edit"
                              )}
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
                              type="checkbox"
                              id="Spare Part - Delete"
                              name="vehicle1"
                              value="Spare Part - Delete"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Spare Part - Delete"
                              )}
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

                      </tr>

                      <tr>
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
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Sub-Part - View"
                              )}
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
                              type="checkbox"
                              id="Sub-Part - Add"
                              name="vehicle1"
                              value="Sub-Part - Add"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Sub-Part - Add"
                              )}
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
                              type="checkbox"
                              id="Sub-Part - Edit"
                              name="vehicle1"
                              value="Sub-Part - Edit"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Sub-Part - Edit"
                              )}
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
                              type="checkbox"
                              id="Sub-Part - Delete"
                              name="vehicle1"
                              value="Sub-Part  - Delete"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Sub-Part - Delete"
                              )}
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


                      </tr>

                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}>
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
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Product Categories - View"
                              )}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Product Categories - View"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product Categories - View"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Product Categories - Add"
                              name="vehicle1"
                              value="Product Categories - Add"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Product Categories - Add"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Product Categories - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product Categories - Add"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Product Categories - Edit"
                              name="vehicle1"
                              value="Product Categories - Edit"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Product Categories - Edit"
                              )}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Product Categories - Edit"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product Categories - Edit"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Product Categories - Delete"
                              name="vehicle1"
                              value="Product Categories - Delete"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Product Categories - Delete"
                              )}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Product Categories - Delete"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product Categories - Delete"></label>
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
                              htmlFor="Product Categories - Aprroval"></label>
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
                              htmlFor="Product Categories - Reject"></label>
                          </div>
                        </td>


                      </tr>

                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}>
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
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Product Manufacturer - View"
                              )}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Product Manufacturer - View"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product Manufacturer - View"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Product Manufacturer - Add"
                              name="vehicle1"
                              value="Product Manufacturer - Add"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Product Manufacturer - Add"
                              )}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Product Manufacturers - Add"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product Manufacturer - Add"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Product Manufacturer - Edit"
                              name="vehicle1"
                              value="Product Manufacturer - Edit"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Product Manufacturer - Edit"
                              )}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Product Manufacturer - Edit"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product Manufacturer - Edit"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Product Manufacturer - Delete"
                              name="vehicle1"
                              value="Product Manufacturer - Delete"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Product Manufacturer - Delete"
                              )}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Product Manufacturer - Delete"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product Manufacturer - Delete"></label>
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
                                  item.value === "Product Manufacturer - Aprroval"
                              )}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Product Manufacturer - Aprroval"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Product Manufacturer - Aprroval"></label>
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
                              htmlFor="Product Manufacturer - Reject"></label>
                          </div>
                        </td>

                      </tr>

                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}>
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
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Bin Location - View"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Bin Location - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Bin Location - View"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Bin Location - Add"
                              name="vehicle1"
                              value="Bin Location - Add"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Bin Location - Add"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Bin Location - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Bin Location - Add"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Bin Location - Edit"
                              name="vehicle1"
                              value="Bin Location - Edit"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Bin Location - Edit"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Bin Location - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Bin Location - Edit"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Bin Location - Delete"
                              name="vehicle1"
                              value="Bin Location - Delete"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Bin Location - Delete"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Bin Location - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Bin Location - Delete"></label>
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
                                (item) => item.value === "Bin Location - Aprroval"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Bin Location - Aprroval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Bin Location - Aprroval"></label>
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
                              htmlFor="Bin Location - Reject"></label>
                          </div>
                        </td>


                      </tr>

                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}>
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
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Cost Centre - View"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Cost Centre - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Cost Centre - View"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Cost Centre - Add"
                              name="vehicle1"
                              value="Cost Centre - Add"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Cost Centre - Add"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Cost Centre - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Cost Centre - Add"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Cost Centre - Edit"
                              name="vehicle1"
                              value="Cost Centre - Edit"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Cost Centre - Edit"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Cost Centre - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Cost Centre - Edit"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Cost Centre - Delete"
                              name="vehicle1"
                              value="Cost Centre - Delete"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Cost Centre - Delete"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Cost Centre - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Cost Centre - Delete"></label>
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
                                (item) => item.value === "Cost Centre - Aprroval"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Cost Centre - Aprroval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Cost Centre - Aprroval"></label>
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
                              htmlFor="Cost Centre - Reject"></label>
                          </div>
                        </td>

                      </tr>

                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}>
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
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Supplier - View"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Supplier - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Supplier - View"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Supplier - Add"
                              name="vehicle1"
                              value="Supplier - Add"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Supplier - Add"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Supplier - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Supplier - Add"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Supplier - Edit"
                              name="vehicle1"
                              value="Supplier - Edit"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Supplier - Edit"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Supplier - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Supplier - Edit"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Supplier - Delete"
                              name="vehicle1"
                              value="Supplier - Delete"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Supplier - Delete"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Supplier - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Supplier - Delete"></label>
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
                              htmlFor="Supplier - Aprroval"></label>
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
                              htmlFor="Supplier - Reject"></label>
                          </div>
                        </td>


                      </tr>

                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}>
                            Warehouses
                          </td>
                        </td>


                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Warehouses - View"
                              name="vehicle1"
                              value="Warehouses - View"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Warehouses - View"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Warehouses - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Warehouses - View"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Warehouses - Add"
                              name="vehicle1"
                              value="Warehouses - Add"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Warehouses - Add"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Warehouses - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Warehouses - Add"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Warehouses - Edit"
                              name="vehicle1"
                              value="Warehouses - Edit"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Warehouses - Edit"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Warehouses - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Warehouses - Edit"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Warehouses - Delete"
                              name="vehicle1"
                              value="Warehouses - Delete"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Warehouses - Delete"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Warehouses - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Warehouses - Delete"></label>
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
                              htmlFor="Warehouses - Aprroval"></label>
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
                              htmlFor="Warehouses - Reject"></label>
                          </div>
                        </td>

                      </tr> {/*Warehouses*/}

                      <td>
                        <h3 className="role-head">Inventory</h3>
                      </td>

                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}>
                            Inventory Access
                          </td>
                        </td>


                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Inventory Type - View"
                              name="vehicle1"
                              value="Inventory Type - View"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Inventory Type - View"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Inventory Type - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Inventory Type - View"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Inventory - Add"
                              name="vehicle1"
                              value="Inventory - Add"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Inventory - Add"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Inventory - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Inventory - Add"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Inventory - Edit"
                              name="vehicle1"
                              value="Inventory - Edit"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Inventory - Edit"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Inventory - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Inventory - Edit">
                            </label>
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
                                (item) =>
                                  item.value === "Inventory - Delete"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Inventory - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Inventory - Delete"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input

                              type="checkbox"
                              id="Inventory - Approval"
                              name="vehicle1"
                              value="Inventory - Approval"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Inventory - Approval"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Inventory - Approval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Inventory - Approval"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input

                              type="checkbox"
                              id="Inventory - Reject"
                              name="vehicle1"
                              value="Inventory - Reject"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Inventory - Reject"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Inventory - Reject")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Inventory - Reject"></label>
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
                            style={{ border: "0px", fontSize: "15px" }}>
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
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "PR - View"
                              )}
                              onChange={() =>
                                handleCheckboxChange("PR - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="PR - View"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="PR - Add"
                              name="vehicle1"
                              value="PR - Add"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "PR - Add"
                              )}
                              onChange={() =>
                                handleCheckboxChange("PR - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="PR - Add"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="PR - Edit"
                              name="vehicle1"
                              value="PR - Edit"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "PR - Edit"
                              )}
                              onChange={() =>
                                handleCheckboxChange("PR - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="PR - Edit"></label>
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
                                (item) =>
                                  item.value === "PR - Delete"
                              )}
                              onChange={() =>
                                handleCheckboxChange("PR - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="PR - Delete"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input

                              type="checkbox"
                              id="PR - Approval"
                              name="vehicle1"
                              value="PR - Approval"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "PR - Approval"
                              )}
                              onChange={() =>
                                handleCheckboxChange("PR - Approval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="PR - Approval"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input

                              type="checkbox"
                              id="PR - Reject"
                              name="vehicle1"
                              value="PR - Reject"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "PR - Reject"
                              )}
                              onChange={() =>
                                handleCheckboxChange("PR - Reject")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="PR - Reject"></label>
                          </div>
                        </td>


                      </tr>

                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}>
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
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "PO - View"
                              )}
                              onChange={() =>
                                handleCheckboxChange("PO - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="PO - View"></label>
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
                              onChange={() =>
                                handleCheckboxChange("PO - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="PO - Add"></label>
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
                              onChange={() =>
                                handleCheckboxChange("PO - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="PO - Edit"></label>
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
                              htmlFor="PO - Delete"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="PO - Approval"
                              name="vehicle1"
                              value="PO - Approval"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "PO - Approval"
                              )}
                              onChange={() =>
                                handleCheckboxChange("PO - Approval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="PO - Approval"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="PO - Reject"
                              name="vehicle1"
                              value="PO - Reject"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "PO - Reject"
                              )}
                              onChange={() =>
                                handleCheckboxChange("PO - Reject")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="PO - Reject"></label>
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
                            style={{ border: "0px", fontSize: "15px" }}>
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
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Receiving - View"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Receiving - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Receiving - View"></label>
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
                              htmlFor="Receiving - Add"></label>
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
                              htmlFor="Receiving - Edit"></label>
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
                              htmlFor="Receiving - Delete"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Receiving - Approval"
                              name="vehicle1"
                              value="Receiving - Approval"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Receiving - Approval"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Receiving - Approval")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Receiving - Approval"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Receiving - Reject"
                              name="vehicle1"
                              value="Receiving - Reject"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Receiving - Reject"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Receiving - Reject")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Receiving - Reject"></label>
                          </div>
                        </td>

                      </tr>

                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}>
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
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Stock Management - View"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Stock Management - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Stock Management - View"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Stock Management - Add"
                              name="vehicle1"
                              value="Stock Management - Add"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Stock Management - Add"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Stock Management - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Stock Management - Add"></label>
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
                              htmlFor="Stock Management - Edit"></label>
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
                              htmlFor="Stock Management - Delete"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Stock Management - Approval"
                              name="vehicle1"
                              value="Stock Management - Approval"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Stock Management - Approval"
                              )}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Stock Management - Approval"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Stock Management - Aprroval"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Stock Management - Reject"
                              name="vehicle1"
                              value="Stock Management - Reject"
                              checked={selectedCheckboxes.some(
                                (item) =>
                                  item.value === "Stock Management - Reject"
                              )}
                              onChange={() =>
                                handleCheckboxChange(
                                  "Stock Management - Reject"
                                )
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Stock Management - Reject"></label>
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
                            style={{ border: "0px", fontSize: "15px" }}>
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
                              htmlFor="Report - View"></label>
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
                              htmlFor="Report - Add"></label>
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
                              htmlFor="Report - Edit"></label>
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
                              htmlFor="Report - Delete"></label>
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
                              htmlFor="Report - Approval"></label>
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
                              htmlFor="Report - Reject"></label>
                          </div>
                        </td>


                      </tr>



                        {/* WAG E DELETE KASI GAGAMITIN PA SA PHASE 2 */}
                      {/* <td>
                        <h3 className="role-head">Activity Module</h3>
                      </td>
                      <tr>
                        <td>
                          <td
                            className="role"
                            style={{ border: "0px", fontSize: "15px" }}>
                            Activity Log
                          </td>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Activity Log - Add"
                              name="vehicle1"
                              value="Activity Log - Add"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Activity Log - Add"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Activity Log - Add")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Activity Log - Add"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Activity Log - Edit"
                              name="vehicle1"
                              value="Activity Log - Edit"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Activity Log - Edit"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Activity Log - Edit")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Activity Log - Edit"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Activity Log - Delete"
                              name="vehicle1"
                              value="Activity Log - Delete"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Activity Log - Delete"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Activity Log - Delete")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Activity Log - Delete"></label>
                          </div>
                        </td>

                        <td>
                          <div className="input-group">
                            <input
                              type="checkbox"
                              id="Activity Log - View"
                              name="vehicle1"
                              value="Activity Log - View"
                              checked={selectedCheckboxes.some(
                                (item) => item.value === "Activity Log - View"
                              )}
                              onChange={() =>
                                handleCheckboxChange("Activity Log - View")
                              }
                            />
                            <label
                              className="p-3"
                              htmlFor="Activity Log - View"></label>
                          </div>
                        </td>
                      </tr> */}


                    </tbody>
                  </table>

                  <div className="d-flex flex-row mt-4">
                    <Row>
                      <Col>
                        <div>
                          <Link
                            style={{ fontSize: "1.5rem" }}
                            to="/userRole"
                            className=" btn_saveCancel btn btn-danger align-right">
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
                            disabled={selectedCheckboxes.length === 0}>
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
