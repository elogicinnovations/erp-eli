import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../Sidebar/sidebar";
import "../../assets/global/style.css";
import ReactLoading from "react-loading";
import NoData from "../../assets/image/NoData.png";
import NoAccess from "../../assets/image/NoAccess.png";
import { Link, useParams } from "react-router-dom";
import "../styles/react-style.css";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import BASE_URL from "../../assets/global/url";
import axios from "axios";
import { PencilSimple } from "@phosphor-icons/react";
import Modal from 'react-bootstrap/Modal';
import * as $ from "jquery";
import { jwtDecode } from "jwt-decode";
import swal from "sweetalert";
function ViewInventory({ authrztn }) {
  const { id } = useParams();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [binLocation, setBinLocation] = useState("");
  const [uM, setUm] = useState("");
  const [details, setDetails] = useState("");
  const [thresholds, setThresholds] = useState("");
  const [invetoryWarehouse, setInvetoryWarehouse] = useState([]);

  const [updateQty, setUpdateQty] = useState("");
  const [inventory_id, setInventory_id] = useState("");
  const [warehouse_names, setWarehouse_names] = useState("");
  const [show, setShow] = useState(false);
  const [validated, setValidated] = useState(false);
  const [userId, setuserId] = useState("");
  const decodeToken = () => {
    var token = localStorage.getItem("accessToken");
    if (typeof token === "string") {
      var decoded = jwtDecode(token);
      setuserId(decoded.id);
    }
  };

  useEffect(() => {
    decodeToken();
    reloadTable()
  }, []);

  const handleClose = () => {
    setShow(false)
    setUpdateQty('')
    setValidated(false)
  };
  const handleShow = (inv_id, warehouseName) => {
    setShow(true)
    setInventory_id(inv_id)
    setWarehouse_names(warehouseName)
  };

    const handleUpdatePrice = async (e) => {
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
        swal({
          title: "Are you sure?",
          text: "The quantity will override for this site",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((confirmed) => {
          if (confirmed) {
            setIsLoading(true)
            axios
            .post(BASE_URL + "/inventory/updateQty", null,{
              params: {
                updateQty,
                inventory_id,
                userId,
                name,
                warehouse_names
              },
            })
          .then(res => {
            if (res.status === 200){
              swal({
                title: "Updated Successfully",
                text: "",
                icon: "success",
                buttons: true,
                dangerMode: true,
              })
              .then(() => {
                reloadTable()
                setIsLoading(false)
                handleClose()
              })
            }else{
              swal({
                title: "Something Went Wrong",
                text: "Please contact your support immediately",
                icon: "success",
                buttons: true,
                dangerMode: true,
              })
              setIsLoading(false)
              handleClose()
            }
          })
          .catch(err => {
            console.log(err)
            setIsLoading(false)
            handleClose()
          });
          }
        })
      }
      setValidated(true); //for validations
    
  };

  const reloadTable = () => {
    axios
    .get(BASE_URL + "/inventory/fetchWarehouseInvetory", {
      params: {
        id: id,
      },
    })
  .then(res => setInvetoryWarehouse(res.data))
  .catch(err => console.log(err));
  }


  useEffect(() => {
    const delay = setTimeout(() => {
      // console.log('code' + id)
      axios
        .get(BASE_URL + "/inventory/fetchView", {
          params: {
            id: id,
          },
        })
        .then((res) => {
          setCode(res.data[0].product_code);
          setName(res.data[0].product_name);
          setCategory(res.data[0].category.category_name);
          setBinLocation(`${res.data[0].binLocation.bin_subname}_${res.data[0].binLocation.bin_name}`);
          setUm(res.data[0].product_unitMeasurement);
          setDetails(res.data[0].product_details);
          setThresholds(res.data[0].product_threshold);
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
    if ($('#order-listing').length > 0 && invetoryWarehouse.length > 0) {
      $('#order-listing').DataTable();
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
                    Unit of Measurement:{" "}
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
              <p className="fs-5">Assigned product to satellite(s)</p>
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
                      <th className="tableh">Edit</th>             
                    </tr>
                  </thead>
                  {invetoryWarehouse.length > 0 ? (  
                    <tbody>
                        {invetoryWarehouse.map((data, i) => (
                          <tr key={i} >
                            <td>{data.warehouse_name}</td>
                            <td>{data.totalQuantity}</td>                          
                            <td>{data.price}</td>
                            <td>{data.freight_cost === null ? "Pending Cost" : data.freight_cost}</td>
                            <td>{data.custom_cost === null ? "Pending Cost" : data.custom_cost}</td>
                            <td>{data.totalPrice}</td>
                            <td>
                              <Button onClick={(e) => handleShow(data.inventory_id, data.warehouse_name)} variant>
                                <PencilSimple size={22} />
                              </Button>
                            </td>
                            
                          </tr>
                        ))}
                    </tbody>
                      ) : (
                    <div className="no-data">
                      <img src={NoData} alt="NoData" className="no-data-img" />
                      <h3>
                        No Data Found
                      </h3>
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

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
<Form noValidate validated={validated} onSubmit={handleUpdatePrice}>
        
        <Modal.Header closeButton>
          <Modal.Title><label className="h2">{`${name} FROM ${warehouse_names}`}</label></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Label className="h3">
            Enter Quantity
          </Form.Label>
          <Form.Control 
            required
            onChange={(e) => setUpdateQty(e.target.value)}
            onKeyDown={(e) => {
              ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
            }} 
          />
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button type="submit" variant="primary">Update</Button>
        </Modal.Footer>

        </Form>
      </Modal>




    </div>
  );
}

export default ViewInventory;
