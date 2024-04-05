import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../Sidebar/sidebar";
import "../../assets/global/style.css";
import ReactLoading from "react-loading";
import NoData from "../../assets/image/NoData.png";
import NoAccess from "../../assets/image/NoAccess.png";
import { Link, useParams } from "react-router-dom";
import "../styles/react-style.css";
import Form from "react-bootstrap/Form";
import BASE_URL from "../../assets/global/url";
import axios from "axios";
import { Trash } from "@phosphor-icons/react";
import * as $ from "jquery";

function ViewAssembly({ authrztn }) {
  const { id } = useParams();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const [binLocation, setBinLocation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [uM, setUm] = useState("");
  const [details, setDetails] = useState("");
  const [thresholds, setThresholds] = useState("");

  const [invetoryWarehouse, setInvetoryWarehouse] = useState([]);
  // Get Issuance
  useEffect(() => {
    axios
      .get(BASE_URL + "/inventory/fetchWarehouseInvetory_asm", {
        params: {
          id: id,
        },
      })
      .then((res) => setInvetoryWarehouse(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      // console.log('code' + id)
      axios
        .get(BASE_URL + "/inventory/fetchView_assembly", {
          params: {
            id: id,
          },
        })
        .then((res) => {
          setCode(res.data[0].assembly_code);
          setName(res.data[0].assembly_name);
          setCategory(res.data[0].category.category_name);
          setBinLocation(`${res.data[0].binLocation.bin_subname}_${res.data[0].binLocation.bin_name}`);
          setUm(res.data[0].assembly_unitMeasurement);
          setDetails(res.data[0].assembly_desc);
          setThresholds(res.data[0].threshhold);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }, 1000);

    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    // Initialize DataTable when role data is available
    if ($("#order-listing").length > 0 && invetoryWarehouse.length > 0) {
      $("#order-listing").DataTable();
    }
  }, [invetoryWarehouse]);

  return (
    <div className="main-of-containers">
      {/* <div className="left-of-main-containers">
            <Sidebar/>
        </div> */}
      <div className="right-of-main-containers">
        {isLoading ? (
          <div className="loading-container">
            <ReactLoading className="react-loading" type={"bubbles"} />
            Loading Data...
          </div>
        ) : authrztn.includes("Inventory - View") ? (
          <div className="right-body-contents-a">
            <h1>View Product Information</h1>
            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "20px",
              }}
            >
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
                }}
              ></span>
            </div>

            <div className="row mt-3">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Product Code:{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    value={code}
                    type="text"
                    readOnly
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Item Name:{" "}
                  </Form.Label>

                  <Form.Control
                    required
                    value={name}
                    type="text"
                    readOnly
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Category:{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    value={category}
                    type="text"
                    readOnly
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Bin Location:{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    value={binLocation}
                    type="text"
                    readOnly
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-4">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Unit of Measurment:{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    value={uM}
                    type="text"
                    readOnly
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label style={{ fontSize: "20px" }}>
                  Details Here:{" "}
                </Form.Label>
                <Form.Control
                  as="textarea"
                  value={details}
                  readOnly
                  style={{ height: "100px", fontSize: "15px" }}
                />
              </Form.Group>
            </div>

            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "30px",
              }}
            >
              Notification Thresholds
              <p className="fs-5">Sets your preferred thresholds.</p>
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "65%",
                  left: "21rem",
                  transform: "translateY(-50%)",
                }}
              ></span>
            </div>

            <div className="row mt-3">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Critical Inventory Thresholds:{" "}
                  </Form.Label>
                  <Form.Control
                    required
                    value={thresholds}
                    readOnly
                    type="number"
                    style={{ height: "40px", fontSize: "15px" }}
                  />
                </Form.Group>
              </div>
              <div className="col-6"></div>
            </div>

            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "30px",
              }}
            >
              Product Satellite(s)
              <p className="fs-5">Assigned products to satellite(s)</p>
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "65%",
                  left: "21rem",
                  transform: "translateY(-50%)",
                }}
              ></span>
            </div>

            <div className="table-containss">
              <div className="main-of-all-tables">
                <table id="order-listing" className="hover-table">
                  <thead>
                    <tr>
                      <th className="tableh">Satellite Warehouse</th>
                      <th className="tableh">Quantity</th>
                      <th className="tableh">Unit Price</th>
                      <th className="tableh">Freight Cost </th>
                      <th className="tableh">Duties & Custom Cost </th>
                      <th className="tableh">Total Price</th>   
                    </tr>
                  </thead>
                  {invetoryWarehouse.length > 0 ? (
                    <tbody>
                      {invetoryWarehouse.map((data, i) => (
                        <tr key={i}>
                          <td>{data.warehouse_name}</td>
                          <td>{data.totalQuantity}</td>
                          <td>{data.price}</td>
                          <td>{data.freight_cost}</td>
                          <td>{data.custom_cost}</td>
                          <td>{data.totalPrice}</td>
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

            <div className="save-cancel">
              <Link
                to="/inventory"
                className="btn btn-secondary btn-md"
                size="l"
                style={{ fontSize: "20px", margin: "0px 5px" }}
              >
                Close
              </Link>
            </div>
          </div>
        ) : (
          <div className="no-access">
            <img src={NoAccess} alt="NoAccess" className="no-access-img" />
            <h3>You don't have access to this function.</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewAssembly;
