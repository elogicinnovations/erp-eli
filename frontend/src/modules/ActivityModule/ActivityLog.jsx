import React, { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import "../styles/react-style.css"
import "../../assets/global/style.css"
import Form from "react-bootstrap/Form";
import NoData from '../../assets/image/NoData.png';
import NoAccess from '../../assets/image/NoAccess.png';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../assets/global/url';
import { jwtDecode } from 'jwt-decode';
import {
    CalendarBlank,
    XCircle,
} from "@phosphor-icons/react";
import DatePicker from "react-datepicker";

const ActivityLog = ({authrztn})  => {
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("");

    const decodeToken = () => {
        var token = localStorage.getItem('accessToken');
        if(typeof token === 'string'){
        var decoded = jwtDecode(token);
        setUsername(decoded.id);
        }
      }

      useEffect(() => {
        decodeToken();
      }, [])
    return (
        <div className="main-of-containers">
            <div className="right-of-main-containers">
            {isLoading ? (
                <div className="loading-container">
                    <ReactLoading className="react-loading" type={'bubbles'} />
                    Loading Data...
                </div>
                ) : authrztn.includes("Activity Logs - View") ? (
                    <div className="right-body-contents">
                        <div className="Employeetext-button">
                            <div className="employee-and-button">
                                <div className="emp-text-side">
                                <p>Activity Log</p>
                                </div>

                                <div className="button-create-side">
                                    <div style={{ position: "relative", marginBottom: "15px" }}>
                                        <DatePicker
                                        // selected={startDate}
                                        // onChange={(date) => setStartDate(date)}
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
                                        {/* {startDate && ( */}
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
                                            // onClick={handleXCircleClick}
                                        />
                                        {/* )} */}
                                    </div>

                                    <div style={{ position: "relative", marginBottom: "15px" }}>
                                        <DatePicker
                                        // selected={endDate}
                                        // onChange={(date) => setEndDate(date)}
                                        placeholderText="Choose Date To"
                                        dateFormat="yyyy-MM-dd"
                                        wrapperClassName="custom-datepicker-wrapper"
                                        popperClassName="custom-popper"
                                        style={{ fontFamily: "Poppins, Source Sans Pro" }}
                                        />
                                        <CalendarBlank
                                        size={20}
                                        weight="thin"
                                        // selected={endDate}
                                        // onChange={(date) => setEndDate(date)}
                                        style={{
                                            position: "absolute",
                                            left: "8px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer",
                                        }}
                                        />
                                        {/* {endDate && ( */}
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
                                            // onClick={handleXClick}
                                        />
                                        {/* )} */}
                                    </div>
                                    <Form.Select
                                        aria-label="item user"
                                        // value={selectedStatus}
                                        // onChange={handleStatusChange}
                                        style={{
                                        height: "40px",
                                        fontSize: "15px",
                                        marginBottom: "15px",
                                        fontFamily: "Poppins, Source Sans Pro",
                                        width: "495px",
                                        }}
                                        required
                                        title="User is required"
                                    >
                                        <option value="" disabled selected>
                                            Select User
                                        </option>
                                        <option value="All User">All User</option>
                                    </Form.Select>
                                    <button className="goesButton" 
                                    // onClick={handleGoButtonClick}
                                    >
                                        FILTER
                                    </button>
                                    <button className="Filterclear" 
                                    // onClick={clearFilters}
                                    >
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
                                            <th>Name</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                    </tbody>
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
    )
}

export default ActivityLog;