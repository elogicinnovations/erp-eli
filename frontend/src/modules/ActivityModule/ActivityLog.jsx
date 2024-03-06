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
import { styled } from '@mui/material/styles';
import DatePicker from "react-datepicker";
import * as $ from "jquery";
import { IconButton, TextField, TablePagination, } from '@mui/material';
import usePagination from '@mui/material/usePagination';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import swal from "sweetalert";

const ActivityLog = ({authrztn})  => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [username, setUsername] = useState("");
    const [originalUserActivity, setOriginalUserActivity] = useState([]);
    const [userActivity, setuserActivity] = useState([]);
    const [openRows, setOpenRows] = useState(null);
    const [specificUser, setspecificUser] = useState([]);
    const [masterlistuser, setmasterListuser] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [selecteduser, setselecteduser] = useState("");

    const handleRowToggle = async (masterlist_id) => {
      try {
        const res = await axios.get(BASE_URL + '/activitylog/fetchdropdownData', {
          params: { masterlist_id: masterlist_id },
        });
  
        setspecificUser(res.data);
  
        setOpenRows((prevOpenRow) => (prevOpenRow === masterlist_id ? null : masterlist_id));
      } catch (err) {
        console.error(err);
      }
    };

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

      //masterlist
      useEffect(() => {
        axios
          .get(BASE_URL + "/activitylog/fetchmasterlist")
          .then((response) => {
            setmasterListuser(response.data);
          })
          .catch((error) => {
            console.error("Error fetching user:", error);
          });
      }, []);

      //fetch of user activity
    //   useEffect(() => {
    //     axios
    //       .get(BASE_URL + "/activitylog/getlogged")
    //       .then((res) => {
    //         const data = res.data;
    //         setuserActivity(data);
    //         setOriginalUserActivity(data);
    //       })
    //       .catch((error) => {
    //         console.error("Error fetching logs:", error);
    //       });
    //   }, []);
    const reloadTable = () => {
        const delay = setTimeout(() => {
        axios
          .get(BASE_URL + "/activitylog/getlogged")
          .then((res) => {
                setuserActivity(res.data);
                setOriginalUserActivity(res.data);
            setIsLoading(false);
        })
        .catch((err) => {
          console.log(err)
            setIsLoading(false);
        });
      }, 1000);
    
      return () => clearTimeout(delay);
    };
    
      useEffect(() => {
        reloadTable();
      }, []);

      function formatDate(datetime) {
        const options = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        };
        return new Date(datetime).toLocaleString("en-US", options);
      }

      //search bar
      const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredData = originalUserActivity.filter((data) => {
          const nameMatch = data.masterlist.col_Fname.toLowerCase().includes(searchTerm);
          const dateMatch = formatDate(data.maxCreatedAt).toLowerCase().includes(searchTerm);
    
          return nameMatch || dateMatch;
        });
    
        setuserActivity(filteredData);
      };

      //pagination
      const { items, ...pagination } = usePagination({
        count: Math.ceil(userActivity.length / 5),
      });
    
      const List = styled('ul')({
        listStyle: 'none',
        padding: 0,
        margin: 0,
        display: 'flex',
        float: 'right'
      });

      const handleXCircleClick = () => {
        setStartDate(null);
      };
    
      const handleXClick = () => {
        setEndDate(null);
      };
    
      const handleUserChange = (e) => {
        setselecteduser(e.target.value);
      };

      const handleGoButtonClick = () => {
        if (!startDate || !endDate || !selecteduser) {
          swal({
            icon: "error",
            title: "Oops...",
            text: "Please fill in all filter sections!",
          });
          return;
        }
    
        const filteredData = originalUserActivity.filter((data) => {
          const createdAt = new Date(data.maxCreatedAt);
    
          console.log("startDate:", startDate);
          console.log("endDate:", endDate);
          console.log("createdAt:", createdAt);
    
          const isWithinDateRange =
            (!startDate || createdAt >= startDate.setHours(0, 0, 0, 0)) &&
            (!endDate || createdAt <= endDate.setHours(23, 59, 59, 999));
    
          const isMatchingUser =
            selecteduser === "All User" || data.masterlist.col_Fname === selecteduser;
    
          return isWithinDateRange && isMatchingUser;
        });
    
        setuserActivity(filteredData);
      };
    
      const clearFilters = () => {
        setStartDate(null);
        setEndDate(null);
        setselecteduser("");
    
        reloadTable();
      };
      
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
                                        aria-label="item user"
                                        value={selecteduser}
                                        onChange={handleUserChange}
                                        style={{
                                        height: "40px",
                                        fontSize: "15px",
                                        marginBottom: "15px",
                                        fontFamily: "Poppins, Source Sans Pro",
                                        }}
                                        required
                                        title="User is required"
                                    >
                                        <option value="" disabled selected>
                                            Select User
                                        </option>
                                        <option value="All User">All User</option>
                                        {masterlistuser.map((role) => (
                                            <option>
                                            {role.col_Fname}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <button className="goesButton" 
                                    onClick={handleGoButtonClick}
                                    >
                                        FILTER
                                    </button>
                                    <button className="Filterclear" 
                                    onClick={clearFilters}
                                    >
                                        Clear Filter
                                    </button>

                                    <div className="Buttonmodal-new"></div>
                                </div>
                            </div>
                        </div>
                        <div className="table-containss">
                            <div className="main-of-all-tables">
                                <TextField
                                label="Search"
                                variant="outlined"
                                style={{ marginBottom: '10px', 
                                float: 'right',
                                }}
                                InputLabelProps={{
                                    style: { fontSize: '14px'},
                                }}
                                InputProps={{
                                    style: { fontSize: '14px', width: '250px', height: '50px' },
                                }}
                                onChange={handleSearch}/>
                                <table className="table-hover">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Name</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    {userActivity.length > 0 ? (
                                    <tbody>
                                        {userActivity.map((data, i) => (
                                          <React.Fragment key={i}>
                                            <tr>
                                                <td>
                                                <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={() => handleRowToggle(data.masterlist_id)}>
                                                    {openRows === data.masterlist_id ? (
                                                    <KeyboardArrowUpIcon style={{ fontSize: 25 }}/>
                                                    ) : (
                                                    <KeyboardArrowDownIcon style={{ fontSize: 25 }}/>
                                                    )}
                                                </IconButton>
                                                </td>
                                                <td>{data.masterlist.col_Fname}</td>
                                                <td>{formatDate(data.maxCreatedAt)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: '#F5EFED' }} colSpan="3">
                                                <Collapse in={openRows === data.masterlist_id} timeout="auto" unmountOnExit>
                                                    <div style={{width: '95%'}}>
                                                        <thead style={{borderBottom: '1px solid #CECECE'}}>
                                                        <tr>
                                                            <th style={{backgroundColor: 'inherit', fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>Action Taken</th>
                                                            <th style={{backgroundColor: 'inherit', fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>Date</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                            {specificUser.map((activity, i) => (
                                                            <tr key={i}>
                                                            <td style={{fontSize: '14px', padding: '10px', fontFamily: 'Arial, sans-serif'}}>{activity.action_taken}</td>
                                                            <td style={{fontSize: '14px', padding: '10px', fontFamily: 'Arial, sans-serif'}}>{formatDate(activity.createdAt)}</td>
                                                            </tr>
                                                            ))}
                                                    </tbody>
                                                    </div>
                                                </Collapse>
                                                </td>
                                            </tr>
                                        </React.Fragment>
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
                                <nav>
                                <List>
                                {items.map(({ page, type, selected, ...item }, index) => {
                                    let children = null;
                                    if (type === 'start-ellipsis' || type === 'end-ellipsis') {
                                    children = '…';
                                    } else if (type === 'page') {
                                    children = (
                                        <button
                                        type="button"
                                        style={{
                                            fontWeight: selected ? 'bold' : undefined,
                                            fontSize: '14px',
                                            width: '25px',
                                            background: '#FFA500',
                                            color: '#FFFFFF',
                                            border: 'none',
                                            height: '28px',

                                        }}
                                        {...item}
                                        >
                                        {page}
                                        </button>
                                    );
                                    } else {
                                    children = (
                                        <button type="button" {...item}
                                        style={{fontSize: '14px',
                                        cursor: 'pointer',
                                        color: '#000000',
                                        textTransform: 'capitalize'}}>
                                        {type}
                                        </button>
                                    );
                                    }

                                    return <li key={index}>{children}</li>;
                                })}
                                </List>
                            </nav>
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