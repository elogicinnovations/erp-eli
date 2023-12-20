import React, { useEffect, useState } from "react";
import Sidebar from "../../../../Sidebar/sidebar";
import "../../../../../assets/global/style.css";
import { Link, useNavigate } from "react-router-dom";
import "../../../../styles/react-style.css";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import BASE_URL from "../../../../../assets/global/url";
import swal from "sweetalert";

import * as $ from "jquery";

function CreateCostCenter() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [select_masterlist, setSelect_Masterlist] = useState([]);
  const [description, setDescription] = useState("");

  const [validated, setValidated] = useState(false);
  const [status, setStatus] = useState("Active");

  // ----------------------------------Start Get  Master List------------------------------//
  const [masterList, setMasteList] = useState([]);
  useEffect(() => {
    axios
      .get(BASE_URL + "/masterList/masterTable")
      .then((response) => {
        setMasteList(response.data);
      })
      .catch((error) => {
        console.error("Error fetching master list:", error);
      });
  }, []);

  const handleFormChangeMasterList = (event) => {
    setSelect_Masterlist(event.target.value);
  };

  // ----------------------------------End Get  Master List------------------------------//

  // ----------------------------------Start Add new Cost center------------------------------//
  const add = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      swal({
        icon: "error",
        title: "Fields are required",
        text: "Please fill the Required text fields",
      });
    } else {
      axios
        .post(BASE_URL + "/costCenter/create", {
          name,
          description,
          select_masterlist,
          status,
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            SuccessInserted(res);
          } else if (res.status === 201) {
            Duplicate_Message();
          } else {
            ErrorInserted();
          }
        });
    }
    setValidated(true); //for validations
  };
  // ----------------------------------End Add new Cost center------------------------------//

  // ----------------------------------Start Search------------------------------//
  React.useEffect(() => {
    $(document).ready(function () {
      $("#order-listing").DataTable();
    });
  }, []);
  // ----------------------------------End Serach------------------------------//

  // ----------------------------------Validation------------------------------//
  const SuccessInserted = (res) => {
    swal({
      title: "Cost Center Add Successful!",
      text: "The Cost Center has been Added Successfully.",
      icon: "success",
      button: "OK",
    }).then(() => {
      navigate("/costCenter");
    });
  };
  const Duplicate_Message = () => {
    swal({
      title: "Cost Center is Already Exist",
      text: "Please Input a New Cost Center ",
      icon: "error",
    });
  };
  const ErrorInserted = () => {
    swal({
      title: "Something went wrong",
      text: "Please Contact our Support",
      icon: "error",
      button: "OK",
    });
  };

  const handleActiveStatus = (e) => {
    if (status === "Active") {
      setStatus("Inactive");
    } else {
      setStatus("Active");
    }
  };
  // ----------------------------------End Validation------------------------------//

  return (
    <div className="main-of-containers">
      {/* <div className="left-of-main-containers">
            <Sidebar/>
        </div> */}
      <div className="right-of-main-containers">
        <div className="right-body-contents-a">
          <Row>
            <Col>
              <h1>Create Cost Center</h1>
            </Col>
            <Col>
              <div className="form-group d-flex flex-row justify-content-center align-items-center">
                <label
                  className="userstatus"
                  style={{ fontSize: 15, marginRight: 10 }}>
                  Active Status
                </label>
                <input
                  type="checkbox"
                  name="cstatus"
                  className="toggle-switch" // Add the custom class
                  onChange={handleActiveStatus}
                  defaultChecked={status}
                />
              </div>
            </Col>
          </Row>
          <div
            className="gen-info"
            style={{
              fontSize: "20px",
              position: "relative",
              paddingTop: "20px",
            }}>
            General Information
            <span
              style={{
                position: "absolute",
                height: "0.5px",
                width: "-webkit-fill-available",
                background: "#FFA500",
                top: "81%",
                left: "18rem",
                transform: "translateY(-50%)",
              }}></span>
          </div>
          <Form noValidate validated={validated} onSubmit={add}>
            <div className="row mt-3">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Cost Center:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    style={{ height: "40px", fontSize: "15px" }}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Assign User:{" "}
                  </Form.Label>
                  <Form.Select
                    aria-label=""
                    onChange={handleFormChangeMasterList}
                    style={{ height: "40px", fontSize: "15px" }}
                    defaultValue="">
                    <option disabled value="">
                      Select User
                    </option>
                    {masterList.map((masterList) => (
                      <option key={masterList.col_id} value={masterList.col_id}>
                        {masterList.col_Fname}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label style={{ fontSize: "20px" }}>
                  Description:{" "}
                </Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter details name"
                  style={{ height: "100px", fontSize: "15px" }}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Form.Group>
            </div>

            <div className="save-cancel">
              <Button
                type="submit"
                className="btn btn-warning"
                size="md"
                style={{ fontSize: "20px", margin: "0px 5px" }}>
                Save
              </Button>
              <Link
                to="/costCenter"
                className="btn btn-secondary btn-md"
                size="md"
                style={{ fontSize: "20px", margin: "0px 5px" }}>
                Close
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default CreateCostCenter;
