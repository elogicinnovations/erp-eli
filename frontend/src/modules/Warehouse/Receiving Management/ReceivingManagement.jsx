import React, { useEffect, useState } from "react";
// import Sidebar from '../../Sidebar/sidebar';
import "../../../assets/global/style.css";
import "../../styles/react-style.css";
import axios from "axios";
import BASE_URL from "../../../assets/global/url";
import swal from "sweetalert";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactLoading from "react-loading";
import NoData from "../../../assets/image/NoData.png";
import NoAccess from "../../../assets/image/NoAccess.png";
import {
  Gear,
  Bell,
  UserCircle,
  CalendarBlank,
  XCircle,
} from "@phosphor-icons/react";
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

function ReceivingManagement({ authrztn }) {
  const navigate = useNavigate();
  const [PurchaseRequest, setPurchaseRequest] = useState([]);
  const [receivingPO, setReceivingPO] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredPR, setFilteredPR] = useState([]);
  const [filteredRR, setFilteredRR] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Data

  const reloadTable = () => {
    const delay = setTimeout(() => {
      axios
        .get(BASE_URL + "/PR/fetchTableToReceive")
        .then((res) => {
          setPurchaseRequest(res.data.prData);
          setReceivingPO(res.data.receiving_PO);
          setFilteredPR(res.data.prData);
          setFilteredRR(res.data.receivingPO);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }, 1000);

    return () => clearTimeout(delay);
  };

  useEffect(() => {
    reloadTable();
  }, []);

  const handleXCircleClick = () => {
    setStartDate(null);
  };

  const handleXClick = () => {
    setEndDate(null);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleGoButtonClick = () => {
    if (!startDate || !endDate || !selectedStatus) {
      swal({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all filter sections!",
      });
      return;
    }

    const filteredData = PurchaseRequest.filter((data) => {
      const createdAt = new Date(data.createdAt);
      // console.log("startDate:", startDate);
      // console.log("endDate:", endDate);
      // console.log("createdAt:", createdAt);

      const isWithinDateRange =
        (!startDate || createdAt >= startDate.setHours(0, 0, 0, 0)) &&
        (!endDate || createdAt <= endDate.setHours(23, 59, 59, 999));

      const isMatchingStatus =
        selectedStatus === "All Status" || data.status === selectedStatus;

      return isWithinDateRange && isMatchingStatus;
    });

    setFilteredPR(filteredData);
  };

  //function when user click the clear filter button
  const clearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setSelectedStatus("");

    reloadTable();
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

  useEffect(() => {
    // Initialize DataTable when role data is available
    if (
      $("#order-listing").length > 0 &&
      PurchaseRequest.length > 0 &&
      receivingPO.length > 0
    ) {
      $("#order-listing").DataTable();
    }
  }, [PurchaseRequest]);

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
          <div className="right-body-contents">
            {/* <div className="settings-search-master">

                <div className="dropdown-and-iconics">
                    <div className="dropdown-side">
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
                        <div className="username">
                          <h3>User Name</h3>
                        </div>
                    </div>
                </div>

                </div> */}
            <div className="Employeetext-button">
              <div className="employee-and-button">
                <div className="emp-text-side">
                  <p>Receiving Management</p>
                </div>
                <div className="button-create-side">
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
                  <Form.Select
                    aria-label="item status"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    style={{
                      height: "40px",
                      fontSize: "15px",
                      marginBottom: "15px",
                      fontFamily: "Poppins, Source Sans Pro",
                    }}
                    required
                    title="Status is required"
                  >
                    <option value="" disabled selected>
                      Select Status
                    </option>
                    <option value="All Status">All Status</option>
                    <option value="For-Approval">For-Approval</option>
                    <option value="For-Rejustify">For-Rejustify</option>
                    <option value="For-Canvassing">For-Canvassing</option>
                    <option value="To-Received">To-Received</option>
                    <option value="Cancelled">Cancelled</option>
                  </Form.Select>
                  <button className="goesButton" onClick={handleGoButtonClick}>
                    FILTER
                  </button>
                  <button className="Filterclear" onClick={clearFilters}>
                    Clear Filter
                  </button>

                  <div className="Buttonmodal-new"></div>
                </div>
              </div>
            </div>
            <div className="table-containss">
              <div className="main-of-all-tables">
                <table className="table-hover" id="order-listing">
                  <thead>
                    <tr>
                      <th className="tableh">PR NO.</th>
                      <th className="tableh">Requestor</th>
                      <th className="tableh">Department</th>
                      <th className="tableh">Status</th>
                      <th className="tableh">PR Approved Date</th>
                      <th className="tableh">Remarks</th>
                    </tr>
                  </thead>
                  {PurchaseRequest.length > 0 || receivingPO > 0 ? (
                    <tbody>
                      {PurchaseRequest.map((data, i) => (
                        <tr key={i}>
                          <td
                            onClick={() =>
                              navigate(`/viewToReceive/${data.id}`)
                            }
                          >
                            {data.pr_num}
                          </td>
                          <td
                            onClick={() =>
                              navigate(`/viewToReceive/${data.id}`)
                            }
                          >
                            {data.masterlist.col_Fname}
                          </td>

                          <td
                            onClick={() =>
                              navigate(`/viewToReceive/${data.id}`)
                            }
                          >
                            {data.masterlist.department.department_name}
                          </td>
                          <td
                            onClick={() =>
                              navigate(`/viewToReceive/${data.id}`)
                            }
                          >
                            {data.status}
                          </td>
                          <td
                            onClick={() =>
                              navigate(`/viewToReceive/${data.id}`)
                            }
                          >
                            {formatDatetime(data.date_approved)}
                          </td>
                          <td
                            onClick={() =>
                              navigate(`/viewToReceive/${data.id}`)
                            }
                          >
                            {data.remarks}
                          </td>
                        </tr>
                      ))}

                      {receivingPO.map((data, i) => (
                        <tr key={i}>
                          <td
                            onClick={() =>
                              data.status === "For Approval" ? (
                                navigate(`/receivingPreview/${data.id}`)
                              ) : data.status === "In-transit" ? (
                                navigate(`/receivingIntransit/${data.id}`)
                              ) : (
                                <></>
                              )
                            }
                          >
                            {data.purchase_req.pr_num}
                          </td>
                          <td
                            onClick={() =>
                              data.status === "For Approval" ? (
                                navigate(`/receivingPreview/${data.id}`)
                              ) : data.status === "In-transit" ? (
                                navigate(`/receivingIntransit/${data.id}`)
                              ) : (
                                <></>
                              )
                            }
                          >
                            {data.purchase_req.masterlist.col_Fname}
                          </td>
                          <td
                            onClick={() =>
                              data.status === "For Approval" ? (
                                navigate(`/receivingPreview/${data.id}`)
                              ) : data.status === "In-transit" ? (
                                navigate(`/receivingIntransit/${data.id}`)
                              ) : (
                                <></>
                              )
                            }
                          >
                            {
                              data.purchase_req.masterlist.department
                                .department_name
                            }
                          </td>

                          <td
                            onClick={() =>
                              data.status === "For Approval" ? (
                                navigate(`/receivingPreview/${data.id}`)
                              ) : data.status === "In-transit" ? (
                                navigate(`/receivingIntransit/${data.id}`)
                              ) : (
                                <></>
                              )
                            }
                          >
                            {data.status}
                          </td>
                          <td
                            onClick={() =>
                              data.status === "For Approval" ? (
                                navigate(`/receivingPreview/${data.id}`)
                              ) : data.status === "In-transit" ? (
                                navigate(`/receivingIntransit/${data.id}`)
                              ) : (
                                <></>
                              )
                            }
                          >
                            {formatDatetime(data.createdAt)}
                          </td>
                          <td
                            onClick={() =>
                              data.status === "For Approval" ? (
                                navigate(`/receivingPreview/${data.id}`)
                              ) : data.status === "In-transit" ? (
                                navigate(`/receivingIntransit/${data.id}`)
                              ) : (
                                <></>
                              )
                            }
                          >
                            N/A
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

export default ReceivingManagement;
