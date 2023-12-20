import React, { useEffect, useState, useContext } from "react";
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
import { ArrowCircleLeft } from "@phosphor-icons/react";

import * as $ from "jquery";

import { CostContext } from "../../../../../contexts/contexts";

function ViewCostCenter() {
  const { id } = useParams();
  const [costName, setCostname] = useState("");
  const [assignUser, setAssignUser] = useState("");
  const [contact, setContact] = useState("");
  const [description, setDescrption] = useState("");
  const [status, setStatus] = useState("");
  const [productIssue, setproductIssue] = useState([]);

  useEffect(() => {
    axios
      .get(BASE_URL + "/costCenter/initUpdate", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setCostname(res.data[0].name);
        setAssignUser(res.data[0].masterlist.col_username);
        setContact(res.data[0].masterlist.col_phone);
        setDescrption(res.data[0].description);
        setStatus(res.data[0].status);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  useEffect(() => {
    axios
      .get(BASE_URL + "/issued_product/getissued", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setproductIssue(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  const getToggleSwitchClass = () => {
    return status === "Active" ? "toggle-switch active" : "toggle-switch";
  };

  useEffect(() => {
    if ($("#order-listing").length > 0 && productIssue.length > 0) {
      $("#order-listing").DataTable();
    }
  }, [productIssue]);

  return (
    <div className="main-of-containers">
      {/* <div className="left-of-main-containers">
            <Sidebar/>
        </div> */}
      <div className="right-of-main-containers">
        <div className="right-body-contents-a">
          <Row>
            <Col style={{ display: "flex" }}>
              <Link to="/costCenter">
                <ArrowCircleLeft size={50} color="#60646c" weight="fill" />
              </Link>
              <h1>Cost Center</h1>
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
                      checked={status === "Active"}
                      className={getToggleSwitchClass()}
                      readOnly
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
          <Form>
            <div className="row">
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Cost Center:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={costName}
                    style={{ height: "40px", fontSize: "15px" }}
                    readOnly
                  />
                </Form.Group>
              </div>

              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Assign User{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={assignUser}
                    style={{ height: "40px", fontSize: "15px" }}
                    readOnly
                  />
                </Form.Group>
              </div>

              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Contact Number:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={contact}
                    style={{ height: "40px", fontSize: "15px" }}
                    readOnly
                  />
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
                  value={description}
                  style={{ height: "100px", fontSize: "15px" }}
                  readOnly
                />
              </Form.Group>
            </div>
            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "20px",
              }}
              readOnly>
              Issued Products
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "81%",
                  left: "14rem",
                  transform: "translateY(-50%)",
                }}></span>
            </div>

            <div className="table-containss">
              <div className="main-of-all-tables">
                <table id="order-listing">
                  <thead>
                    <tr>
                      <th className="tableh">Issued ID</th>
                      <th className="tableh">Product Code</th>
                      <th className="tableh">Product Name</th>
                      <th className="tableh">Price</th>
                      <th className="tableh">Quantity</th>
                      <th className="tableh">Status</th>
                      <th className="tableh">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productIssue.map((data, i) => (
                      <tr key={i}>
                        <td>{data.issuance_id}</td>
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
                            data.inventory_prd.product_tag_supplier
                              .product_price
                          }
                        </td>
                        <td>{data.quantity}</td>
                        <td>{data.status}</td>
                        <td>{data.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="save-cancel">
              <Link
                to="/costCenter"
                className="btn btn-secondary btn-md"
                size="md"
                style={{ fontSize: "20px", margin: "0px 5px", width: "200px" }}>
                Close
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default ViewCostCenter;
