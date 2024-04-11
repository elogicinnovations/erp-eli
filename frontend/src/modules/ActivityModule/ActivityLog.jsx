import React, { useEffect, useState, useRef } from 'react';
import ReactLoading from 'react-loading';
import "../styles/react-style.css"
import "../../assets/global/style.css"
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import NoData from '../../assets/image/NoData.png';
import NoAccess from '../../assets/image/NoAccess.png';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../assets/global/url';
import { jwtDecode } from 'jwt-decode';
import {
    CalendarBlank,
    XCircle,
    Export,
} from "@phosphor-icons/react";
import { styled } from '@mui/material/styles';
import DatePicker from "react-datepicker";
import * as $ from "jquery";
import { IconButton, TextField, TablePagination } from '@mui/material';
import usePagination from '@mui/material/usePagination';
import Collapse from '@mui/material/Collapse';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import swal from "sweetalert";
import { jsPDF } from "jspdf";
// const jsPDF = require('jspdf');

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
    const [exportOptionsVisible, setExportOptionsVisible] = useState(false);
    const exportOptionsRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const totalPages = Math.ceil(userActivity.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, userActivity.length);
    const currentItems = userActivity.slice(startIndex, endIndex);

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


    
      useEffect(() => {
        const handleClickOutside = (event) => {
          if (exportOptionsRef.current && !exportOptionsRef.current.contains(event.target)) {
            setExportOptionsVisible(false);
          }
        };
    
        if (exportOptionsVisible) {
          document.addEventListener('mousedown', handleClickOutside);
        } else {
          document.removeEventListener('mousedown', handleClickOutside);
        }
    
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [exportOptionsVisible]);
    
      const handleExportButtonClick = () => {
        setExportOptionsVisible(!exportOptionsVisible);
      };
    

      const handleExportCSV = async () => {
        try {
          let res;
          let dataForExport;
      
          if (startDate || endDate || selecteduser) {
            // Filtered export
            res = await axios.get(BASE_URL + '/activitylog/fetchDataForExport');
            dataForExport = res.data.filter(data => {
              const createdAt = new Date(data.createdAt);
              const isWithinDateRange =
                (!startDate || createdAt >= startDate.setHours(0, 0, 0, 0)) &&
                (!endDate || createdAt <= endDate.setHours(23, 59, 59, 999));
              const isMatchingUser =
                !selecteduser || selecteduser === "All User" || data.masterlist.col_Fname === selecteduser;
              return isWithinDateRange && isMatchingUser;
            });
          } else {
            // Export all data
            res = await axios.get(BASE_URL + '/activitylog/fetchDataForExport');
            dataForExport = res.data;
          }
      
          if (dataForExport.length > 0) {
            const headers = ['Name', 'Department', 'Action Taken', 'Date', 'Time'];
            const csvContent =
              "data:text/csv;charset=utf-8," +
              headers.join(',') +
              '\n' +
              dataForExport
                .map(data => {
                  return `${data.masterlist.col_Fname},${data.masterlist.department.department_name},${data.action_taken},${formatDate(data.createdAt)}`
                })
                .join('\n');
      
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "activity_log.csv");
            document.body.appendChild(link);
            link.click();
          } else {
            console.log("No data available for export.");
          }
        } catch (error) {
          console.error("Error exporting CSV:", error);
        }
      };
      

      const handleExportPDF = async () => {
        setIsLoading(true);
        try {
          const doc = new jsPDF();
          let res;
          let dataForExportPDF;
      
          // Check if any filter is applied
          if (startDate || endDate || selecteduser) {
            // Filtered export
            res = await axios.get(BASE_URL + '/activitylog/fetchDataForExport');
            dataForExportPDF = res.data.filter(data => {
              const createdAt = new Date(data.createdAt);
              const isWithinDateRange =
                (!startDate || createdAt >= startDate.setHours(0, 0, 0, 0)) &&
                (!endDate || createdAt <= endDate.setHours(23, 59, 59, 999));
              const isMatchingUser =
                !selecteduser || selecteduser === "All User" || data.masterlist.col_Fname === selecteduser;
              return isWithinDateRange && isMatchingUser;
            });
          } else {
            // Export all data
            res = await axios.get(BASE_URL + '/activitylog/fetchDataForExport');
            dataForExportPDF = res.data;
          }
      
          if (dataForExportPDF.length > 0) {
            const headers = ['Name', 'Department', 'Action Taken', 'Date Action'];
            const data = dataForExportPDF.map(activity => {
              const { col_Fname, department } = activity.masterlist;
              const { action_taken, createdAt } = activity;
              return [col_Fname, department.department_name, action_taken, formatDate(createdAt)];
            });
      
            doc.autoTable({
              head: [headers],
              body: data,
              startY: 10,
              styles: { fontSize: 12, cellPadding: 2 },
              headStyles: { fillColor: [255, 200, 0] },
              columnStyles: { 0: { cellWidth: 47 }, 1: { cellWidth: 47 }, 2: { cellWidth: 47 }, 3: { cellWidth: 47 } }, // Adjust cell widths
              margin: { horizontal: 10 }
            });
      
            doc.save("activity_log.pdf");
            setIsLoading(false);
          } else {
            console.log("No data available for export.");
            setIsLoading(false);
          }
        } catch (err) {
          setIsLoading(false);
          console.error(err);
        }
      };
      
      
    //   const handleExportPDF = async () => {
    //     setIsLoading(true);
    //     try {
    //         const doc = new jsPDF();
    //         const res = await axios.get(BASE_URL + '/activitylog/fetchDataForExport');
    //         const dataForExportPDF = res.data;
    
    //         if (dataForExportPDF.length > 0) {
    //             const headers = ['Name', 'Department', 'Action Taken', 'Date Action'];
    //             const data = dataForExportPDF.map(activity => {
    //                 const { col_Fname, department } = activity.masterlist;
    //                 const { action_taken , createdAt } = activity;
    //                 return [col_Fname, department.department_name, action_taken, formatDate(createdAt)];
    //             });
    
    //             doc.autoTable({
    //               head: [headers],
    //               body: data,
    //               startY: 10,
    //               styles: { fontSize: 12, cellPadding: 2 },
    //               headStyles: { fillColor: [255, 200, 0] },
    //               columnStyles: { 0: { cellWidth: 47 }, 1: { cellWidth: 47 }, 2: { cellWidth: 47 }, 3: { cellWidth: 47 } }, // Adjust cell widths
    //               margin: { horizontal: 10 }
    //           });
    
    //             doc.save("activity_log.pdf");
    //             setIsLoading(false);
    //         }
    //     } catch (err) {
    //         setIsLoading(false);
    //         console.error(err);
    //     }
    // };
    

    //   const handleExportPDF = async () => {
    //     try {
    //         const doc = new jsPDF();
    //         const res = await axios.get(BASE_URL + '/activitylog/fetchDataForExport');
    //         const dataForExportPDF = res.data;
    
    //         if (dataForExportPDF.length > 0) {
    //             const headers = ['Name', 'Department', 'Action Taken', 'Date Action'];
    //             const data = dataForExportPDF.map(activity => {
    //                 const { col_Fname, department } = activity.masterlist;
    //                 const { action_taken , createdAt } = activity;
    //                 return [col_Fname, department.department_name, action_taken, formatDate(createdAt)];
    //             });
    
    //             doc.autoTable({
    //                 head: [headers],
    //                 body: data,
    //                 startY: 10,
    //                 styles: { fontSize: 12, cellPadding: 2 },
    //                 columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 50 }, 2: { cellWidth: 50 }, 3: { cellWidth: 50 } }
    //             });
    
    //             doc.save("activity_log.pdf");
    //         }
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };
    
      
    
      
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
                                    {exportOptionsVisible && (
                                      <div className="export-options" ref={exportOptionsRef}>
                                        <Button variant="outline-success" onClick={handleExportCSV}>
                                          EXCEL
                                        </Button>
                                        <Button variant="outline-danger" onClick={handleExportPDF}>
                                          PDF
                                        </Button>
                                      </div>
                                    )}
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
                              <div className="searchandexport">
                                  <div className="exportfield">
                                    <button className="export" onClick={handleExportButtonClick}>
                                      <Export size={20} weight="bold" /> <span>Export</span>
                                    </button>

                                  </div>
                                  <div className="searchfield">
                                    <TextField
                                      label="Search"
                                      variant="outlined"
                                      style={{
                                        float: 'right',
                                      }}
                                      InputLabelProps={{
                                        style: { fontSize: '14px' },
                                      }}
                                      InputProps={{
                                        style: { fontSize: '14px', width: '250px', height: '50px' },
                                      }}
                                      onChange={handleSearch}
                                    />
                                  </div>
                                </div>
                                
                                <table className="table-hover">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Name</th>
                                            <th>Department</th>
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
                                                <td>{data.masterlist.department.department_name}</td>
                                                <td>{formatDate(data.maxCreatedAt)}</td>
                                            </tr>
                                            <tr>
                                                <td style={{ paddingBottom: 0, paddingTop: 0, backgroundColor: '#F5EFED' }} colSpan="4">
                                                <Collapse in={openRows === data.masterlist_id} timeout="auto" unmountOnExit>
                                                    <div style={{width: '95%'}} id="specificUserTable">
                                                        <thead style={{borderBottom: '1px solid #CECECE'}}>
                                                        <tr>
                                                            <th style={{backgroundColor: 'inherit', fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>Action Taken</th>
                                                            <th style={{backgroundColor: 'inherit', fontFamily: 'Arial, sans-serif', fontWeight: 'bold'}}>Date</th>
                                                        </tr>
                                                        </thead>
                                                        {specificUser.length > 0 ? (
                                                        <tbody>
                                                            {specificUser.map((activity, i) => (
                                                            <tr key={i}>
                                                              <td style={{fontSize: '14px', padding: '10px', fontFamily: 'Arial, sans-serif'}}>{activity.action_taken}</td>
                                                              <td style={{fontSize: '14px', padding: '10px', fontFamily: 'Arial, sans-serif'}}>{formatDate(activity.createdAt)}</td>
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
                                <nav style={{marginTop: '15px'}}>
                                    <ul className="pagination" style={{ float: "right" }}>
                                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                        <button
                                        type="button"
                                        style={{fontSize: '14px',
                                        cursor: 'pointer',
                                        color: '#000000',
                                        textTransform: 'capitalize',
                                      }}
                                        className="page-link" 
                                        onClick={() => setCurrentPage((prevPage) => prevPage - 1)}>Previous</button>
                                      </li>
                                      {[...Array(totalPages).keys()].map((num) => (
                                        <li key={num} className={`page-item ${currentPage === num + 1 ? "active" : ""}`}>
                                          <button 
                                          style={{
                                            fontSize: '14px',
                                            width: '25px',
                                            background: currentPage === num + 1 ? '#FFA500' : 'white', // Set background to white if not clicked
                                            color: currentPage === num + 1 ? '#FFFFFF' : '#000000', 
                                            border: 'none',
                                            height: '28px',
                                          }}
                                          className={`page-link ${currentPage === num + 1 ? "gold-bg" : ""}`} onClick={() => setCurrentPage(num + 1)}>{num + 1}</button>
                                        </li>
                                      ))}
                                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                        <button
                                        style={{fontSize: '14px',
                                        cursor: 'pointer',
                                        color: '#000000',
                                        textTransform: 'capitalize'}}
                                        className="page-link" onClick={() => setCurrentPage((prevPage) => prevPage + 1)}>Next</button>
                                      </li>
                                    </ul>
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