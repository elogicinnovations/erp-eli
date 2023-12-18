import React, { useEffect, useState } from "react";
import Sidebar from "../../../../Sidebar/sidebar";
import "../../../../../assets/global/style.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../../../styles/react-style.css";
import Form from "react-bootstrap/Form";
import swal from "sweetalert";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import BASE_URL from "../../../../../assets/global/url";
import Button from "react-bootstrap/Button";

function UpdateCostCenter() {
  const [name, setName] = useState("");
  const [select_masterlist, setSelect_Masterlist] = useState([]);
  const [status, setStatus] = useState(false);
  const [contactNumber, setContactNumber] = useState("");
  const [description, setDescription] = useState("");
  const [checkedStatus, setcheckedStatus] = useState();

  const { id } = useParams();
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);

  //Render Cost Center By ID
  useEffect(() => {
    axios
      .get(BASE_URL + "/costCenter/initUpdate", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setName(res.data[0].name);
        setSelect_Masterlist(res.data[0].col_id);
        setContactNumber(res.data[0].masterlist.col_phone);
        setDescription(res.data[0].description);

        // Check if the status is "Active" and set suppStatus accordingly
        if (res.data[0].status === "Active") {
          setcheckedStatus(true);
          setStatus("Active"); // Check the checkbox
        } else if (res.data[0].status === "Inactive") {
          setcheckedStatus(false);
          setStatus("Inactive"); // Uncheck the checkbox
        }
      })
      .catch((err) => console.log(err));
  }, []);

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

  // ----------------------------------Start Handle Submit------------------------------//
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      swal({
        icon: "error",
        title: "Fields are required",
        text: "Please fill the red text fields",
      });
    } else {
      axios
        .put(BASE_URL + "/costCenter/update/", {
          id,
          name,
          description,
          select_masterlist,
          status,
        })
        .then((response) => {
          if (response.status === 200) {
            swal({
              title: "Cost Center Update Successful!",
              text: "The Cost Center has been Updated Successfully.",
              icon: "success",
              button: "OK",
            }).then(() => {
              navigate("/CostCenter");
            });
          } else if (response.status === 201) {
            swal({
              title: "Cost Center is Already Exist",
              text: "Please Input a New Cost Center ",
              icon: "error",
            });
          }
        });
    }

    setValidated(true); //for validations
  };
  // ----------------------------------End Handle Submit------------------------------//
  const handleActiveStatus = (e) => {
    if (status === "Active") {
      setStatus("Inactive");
    } else {
      setStatus("Active");
    }
  };

  return (
    <div className="main-of-containers">
      {/* <div className="left-of-main-containers">
            <Sidebar/>
        </div> */}
      <div className="right-of-main-containers">
        <div className="right-body-contents-a">
          <Row>
            <Col>
              <h1>Update Cost Center</h1>
            </Col>
            <Col>
              <div className="row">
                <div className="col-6">
                  <div className="form-group d-flex flex-row">
                    <label
                      className="userstatus"
                      style={{ fontSize: 15, marginRight: 10 }}>
                      Status
                    </label>
                    <input
                      type="checkbox"
                      name="cstatus"
                      className="toggle-switch"
                      onClick={handleActiveStatus}
                      defaultChecked={checkedStatus}
                    />
                  </div>
                </div>
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
          <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
            <div className="row mt-3">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Cost Center:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter item name"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    style={{ height: "40px", fontSize: "15px" }}
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
                    required
                    style={{ height: "40px", fontSize: "15px" }}
                    value={select_masterlist}>
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
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  style={{ height: "100px", fontSize: "15px" }}
                />
              </Form.Group>
            </div>

            <div className="save-cancel">
              <Button
                type="submit"
                className="btn btn-warning ntn-"
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

export default UpdateCostCenter;
