import React, { useEffect, useState } from "react";
import axios from "axios";
import BASE_URL from "../../assets/global/url";
import "../../assets/global/style.css";
import { Link } from "react-router-dom";
import "../styles/react-style.css";
import Form from "react-bootstrap/Form";
import subwarehouse from "../../assets/global/subwarehouse";
import swal from "sweetalert";
import Button from "react-bootstrap/Button";

const CreateIssuance = ({ setActiveTab }) => {


  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
  };

  const [fetchProduct, setFetchProduct] = useState([]);
  const [fetchAssembly, setFetchAssembly] = useState([]);
  const [fetchSpare, setFetchSpare] = useState([]);
  const [fetchSubpart, setFetchSubpart] = useState([]);

  const [fromSite, setFromSite] = useState();
  const [issuedTo, setIssuedTo] = useState();
  const [withAccountability, setWithAccountability] = useState();
  const [accountabilityRefcode, setAccountabilityRefcode] = useState();
  const [serialNumber, setSerialNumber] = useState();
  const [jobOrderRefcode, setJobOrderRefcode] = useState();
  const [receivedBy, setReceivedBy] = useState();
  const [transportedBy, setTransportedBy] = useState();
  const [mrs, setMrs] = useState();
  const [remarks, setRemarks] = useState();

  useEffect(() => {
    axios.get(BASE_URL + '/issuance/returnForm', {
      params: {
        id: id
      }
    })
    .then(res => {
        setIssuanceCode(res.data[0].issuance_id);
        setSite(res.data[0].from_site);
        setCostCenter(res.data[0].cost_center.name);
        // setDateReceived(res.data[0].updateAt);
        const createDate = new Date(res.data[0].createdAt);
        setDateCreated(createDate);
        const receiveDate = new Date(res.data[0].updatedAt);
        setDateReceived(receiveDate);


    })
    .catch(err => {
      console.error(err);
      // Handle error state or show an error message to the user
    });
  }, [id]);


  return (
    <div className="main-of-containers">
      {/* <div className="left-of-main-containers">
            <Sidebar/>
        </div> */}
      <div className="right-of-main-containers">
        <div className="right-body-contents-a">
            <h1>Approval Issuance</h1>
            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "20px",
              }}>
              Issuance Info
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "81%",
                  left: "11.5rem",
                  transform: "translateY(-50%)",
                }}></span>
            </div>

            <div className="row mt-3">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>From: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Serial Number..."
                    style={{ height: "40px", fontSize: "15px" }}
                    // onChange={(e) => setSerialNumber(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Issued to:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Serial Number..."
                    style={{ height: "40px", fontSize: "15px" }}
                    // onChange={(e) => setSerialNumber(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-6"></div>
              <div className="col-6">
                <Form.Check
                  type="checkbox"
                  label="With Accountability"
                  style={{ fontSize: "15px" }}
                  onChange={(e) => setWithAccountability(e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Accountability Refcode:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Refcode..."
                    style={{ height: "40px", fontSize: "15px" }}
                    onChange={(e) => setAccountabilityRefcode(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Serial Number:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Serial Number..."
                    style={{ height: "40px", fontSize: "15px" }}
                    onChange={(e) => setSerialNumber(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Job Order Refcode:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Job Order Refcode..."
                    style={{ height: "40px", fontSize: "15px" }}
                    onChange={(e) => setJobOrderRefcode(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Received by:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Serial Number..."
                    style={{ height: "40px", fontSize: "15px" }}
                    // onChange={(e) => setSerialNumber(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-6">
                <Form.Group controlId="exampleForm.ControlInput2">
                  <Form.Label style={{ fontSize: "20px" }}>
                    Transported by:{" "}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Serial Number..."
                    style={{ height: "40px", fontSize: "15px" }}
                    // onChange={(e) => setSerialNumber(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className="col-2">
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label style={{ fontSize: "20px" }}>MRS #: </Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="Input #"
                    style={{ height: "40px", fontSize: "15px" }}
                    onChange={(e) => setMrs(e.target.value)}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label style={{ fontSize: "20px" }}>Remarks: </Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter Remarks"
                  style={{ height: "100px", fontSize: "15px" }}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </Form.Group>
            </div>

            <div
              className="gen-info"
              style={{
                fontSize: "20px",
                position: "relative",
                paddingTop: "30px",
              }}>
              <span
                style={{
                  position: "absolute",
                  height: "0.5px",
                  width: "-webkit-fill-available",
                  background: "#FFA500",
                  top: "85%",
                  left: "0rem",
                  transform: "translateY(-50%)",
                }}></span>
            </div>
            <div className="supplier-table">
              <div className="table-containss">
                <div className="main-of-all-tables">
                  <table>
                    <thead>
                      <tr>
                        <th className="tableh">Product Code</th>
                        <th className="tableh">Product Name</th>
                        <th className="tableh">Quantity</th>
                        <th className="tableh">Desciptions</th>
                      </tr>
                    </thead>
                    <tbody>
                      
                    </tbody>
                  </table>
                </div>



                <div className="save-cancel">
                    <Button
                        type="submit"
                        className="btn btn-success"
                        size="md"
                        style={{ fontSize: "20px", margin: "0px 5px" }}
                    >
                        Approve
                    </Button>
                    <Button
                        type="button"
                        className="btn btn-danger"
                        size="md"
                        style={{ fontSize: "20px", margin: "0px 5px" }}
                    >
                        Reject
                  </Button>

                    <Link
                        to="/inventory"  onClick={() => handleTabClick("issuance")}
                        className="btn btn-secondary btn-md"
                        size="md"
                        style={{ fontSize: "20px", margin: "0px 5px" }}
                    >
                        Close
                    </Link>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default CreateIssuance;
