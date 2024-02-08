import React, { useEffect, useState } from "react";
import Sidebar from "../../Sidebar/sidebar";
import "../../../assets/global/style.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import ReactLoading from "react-loading";
import NoData from "../../../assets/image/NoData.png";
import NoAccess from "../../../assets/image/NoAccess.png";
import "../../styles/react-style.css";
import Form from "react-bootstrap/Form";
import Select from "react-select";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  ArrowCircleLeft,
  Plus,
  Paperclip,
  DotsThreeCircle,
  CalendarBlank,
  PlusCircle,
  Circle,
  ArrowUUpLeft,
} from "@phosphor-icons/react";
import axios from "axios";
import BASE_URL from "../../../assets/global/url";
import swal from "sweetalert";

import * as $ from "jquery";
import { fontSize } from "@mui/system";

function ReceivingManagementPreview({ authrztn }) {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();
  const [prNumber, setPrNumber] = useState();
  const [dateNeeded, setDateNeeded] = useState();
  const [usedFor, setUsedFor] = useState();
  const [remarks, setRemarks] = useState();
  const [status, setStatus] = useState();
  const [dateCreated, setDateCreated] = useState();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  // -------------------- fetch data value --------------------- //
  useEffect(() => {
    const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/PR/viewToReceive", {
          params: {
            id: id,
          },
        })
        .then((res) => {
          setPrNumber(res.data[0].pr_num);
          setDateNeeded(res.data[0].date_needed);
          setUsedFor(res.data[0].used_for);
          setRemarks(res.data[0].remarks);
          setStatus(res.data[0].status);
          setDateCreated(res.data[0].createdAt);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }, 1000);

    return () => clearTimeout(delay);
  }, []);
  // -------------------- end fetch data value --------------------- //

  
const [POarray, setPOarray] = useState([]);
useEffect(() => {
    axios.get(BASE_URL + '/invoice/fetchPOarray',{
      params:{
        id: id
      }
    })
      .then(res => setPOarray(res.data))
      .catch(err => console.log(err));
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



  
  const [products_receive, setProducts_receive] = useState([]);

  // const handleReceived = (po_number) => {
  
  //     setShow(true)
  //     axios
  //       .get(BASE_URL + "/PO_Received/PO_products", {
  //         params: {
  //           pr_id: id,
  //           po_number
  //         },
  //       })
  //       .then((res) => {
  //         setProducts_receive(res.data)
  //         setIsLoading(false);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         setIsLoading(false);
  //       });


  //   // return () => clearTimeout(delay);
  // }

  // console.log(products_receive)

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
        ) : authrztn.includes("Receiving - View") ? (
          <div className="right-body-contents-a">
            <Row>
              <Col>
                <div
                  className="create-head-back"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <Link
                    style={{ fontSize: "1.5rem" }}
                    to="/receivingManagement"
                  >
                    <ArrowCircleLeft size={44} color="#60646c" weight="fill" />
                  </Link>
                  <h1>Receiving Management Preview</h1>
                </div>
              </Col>
            </Row>

            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "20px",
              }}
            >
              Purchase Request Details
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "81%",
                  left: "22.3rem",
                  transform: "translateY(-50%)",
                }}
              ></span>
            </div>
            <div className="receivingbox mt-3">
              <div className="row" style={{ padding: "20px" }}>
                <div className="col-6">
                  <div className="ware">Destination Warehouse</div>
                  <div className="pr-no">
                    PR #: <p1>{prNumber}</p1>
                  </div>
                  <div className="res-warehouse">Agusan Del Sur</div>
                </div>
                <div className="col-4">
                  <div className="created">
                    Created date: <p1>{formatDatetime(dateCreated)}</p1>
                  </div>
                  <div className="created mt-3">
                    Created By: <p1>Jerome De Guzman</p1>
                  </div>
                </div>
                <div className="col-2">
                  <div className="status">
                    <Circle
                      weight="fill"
                      size={17}
                      color="green"
                      style={{ margin: "10px" }}
                    />{" "}
                    {status}
                  </div>
                </div>
              </div>
            </div>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label style={{ fontSize: "20px" }}>Remarks: </Form.Label>
              <Form.Control
                onChange={(e) => setRemarks(e.target.value)}
                as="textarea"
                placeholder="Enter details name"
                value={remarks}
                style={{ height: "100px", fontSize: "15px" }}
              />
            </Form.Group>

            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "20px",
                fontFamily: "Poppins, Source Sans Pro",
              }}
            >
              Purchase Order List
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "81%",
                  left: "20rem",
                  transform: "translateY(-50%)",
                }}
              ></span>
            </div>
            <div className="table-containss">
              <div className="main-of-all-tables">
                {/* {POarray.map((group) => (
                  <div
                    key={group.title}
                    className="border border-warning m-3 mb-4 p-3"
                  >
                    <h3>{`PO Number: ${group.title}`}</h3>
                    {group.items.length > 0 && (
                      <>
                        <h3>{`Supplier: ${group.items[0].suppliers.supplier_code} => ${group.items[0].suppliers.supplier_name}`}</h3>
                      </>
                    )}
                    <button
                      className="btn btn-success fs-4"
                      onClick={handleReceived(group.title)}
                    >
                      Received
                    </button>
                  </div>
                ))} */}

                <Modal 
                  show={show} 
                  onHide={handleClose} 
                  backdrop="static"
                  size="lg"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Purchase Order</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                 

                  </Modal.Body>
                  <Modal.Footer>
                    <Button  
                      className="fs-5 lg" 
                      variant="secondary" 
                      onClick={handleClose}
                      size="md"
                    >
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}
                    size="md">
                      Save Changes
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
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

export default ReceivingManagementPreview;
